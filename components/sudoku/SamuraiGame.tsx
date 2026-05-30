"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTimer } from "@/hooks/useTimer";
import {
  cloneSamuraiBoard,
  createEmptySamuraiBoard,
  DIFFICULTY_LABELS,
  generateSamuraiPuzzle,
  getSamuraiCellStatus,
  getSamuraiValidMoves,
  isSamuraiCellActive,
  isSamuraiSolved,
  isValidSamuraiPlacement,
  SAMURAI_SIZE,
  type CellPosition,
  type CellValue,
  type Difficulty,
  type SamuraiBoard as SamuraiBoardData,
  type SamuraiPuzzle,
} from "@/lib/sudoku";
import { Button } from "@/components/ui/Button";
import { GameHeader } from "./GameHeader";
import { NumberPad } from "./NumberPad";
import { SamuraiBoard } from "./SamuraiBoard";
import { WinModal } from "./WinModal";

interface SamuraiSnapshot {
  puzzle: SamuraiBoardData;
  solution: SamuraiBoardData;
  current: SamuraiBoardData;
  given: boolean[][];
  difficulty: Difficulty;
}

const MAX_HINTS = 3;

export function SamuraiGame() {
  const [snapshot, setSnapshot] = useState<SamuraiSnapshot | null>(null);
  const [selected, setSelected] = useState<CellPosition | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [history, setHistory] = useState<SamuraiBoardData[]>([]);
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState<Record<string, CellValue[]>>({});
  const [hintsLeft, setHintsLeft] = useState(MAX_HINTS);

  const timerActive = Boolean(snapshot) && !isWon;
  const { formatted, reset: resetTimer, pause } = useTimer(timerActive);

  const loadPuzzle = useCallback((puzzle: SamuraiPuzzle) => {
    setSnapshot({
      puzzle: cloneSamuraiBoard(puzzle.puzzle),
      solution: cloneSamuraiBoard(puzzle.solution),
      current: cloneSamuraiBoard(puzzle.puzzle),
      given: puzzle.puzzle.map((row) => row.map((cell) => cell !== null && cell !== 0)),
      difficulty: puzzle.difficulty,
    });
    setSelected(null);
    setMistakes(0);
    setIsWon(false);
    setShowWinModal(false);
    setHistory([]);
    setNotes({});
    setHintsLeft(MAX_HINTS);
    setGameKey((key) => key + 1);
  }, []);

  const startNewGame = useCallback(
    (difficulty: Difficulty = "medium") => {
      loadPuzzle(generateSamuraiPuzzle(difficulty));
    },
    [loadPuzzle]
  );

  useEffect(() => {
    startNewGame("medium");
  }, [startNewGame]);

  useEffect(() => {
    resetTimer();
  }, [gameKey, resetTimer]);

  useEffect(() => {
    if (isWon) pause();
  }, [isWon, pause]);

  const difficulty = snapshot?.difficulty ?? "medium";
  const current = snapshot?.current ?? createEmptySamuraiBoard();
  const given =
    snapshot?.given ??
    Array.from({ length: SAMURAI_SIZE }, () =>
      Array.from({ length: SAMURAI_SIZE }, () => false)
    );

  const commitBoard = useCallback(
    (nextBoard: SamuraiBoardData, countMistake: boolean) => {
      if (!snapshot) return;

      setHistory((previous) => [...previous, cloneSamuraiBoard(snapshot.current)]);
      setSnapshot((previous) =>
        previous ? { ...previous, current: nextBoard } : previous
      );
      setNotes((previous) => {
        if (!selected) return previous;
        const next = { ...previous };
        delete next[`${selected.row}-${selected.col}`];
        return next;
      });

      if (countMistake) {
        setMistakes((value) => value + 1);
      }

      if (!countMistake && isSamuraiSolved(nextBoard, snapshot.solution)) {
        setIsWon(true);
        setShowWinModal(true);
      }
    },
    [selected, snapshot]
  );

  const toggleNote = useCallback((value: CellValue) => {
    if (!selected || value === 0) return;
    const key = `${selected.row}-${selected.col}`;
    setNotes((previous) => {
      const existing = previous[key] ?? [];
      const nextNotes = existing.includes(value)
        ? existing.filter((note) => note !== value)
        : [...existing, value].sort();
      const next = { ...previous };
      if (nextNotes.length === 0) {
        delete next[key];
      } else {
        next[key] = nextNotes;
      }
      return next;
    });
  }, [selected]);

  const setCellValue = useCallback(
    (value: CellValue) => {
      if (!snapshot || !selected || isWon) return;
      if (!isSamuraiCellActive(selected.row, selected.col)) return;
      if (snapshot.given[selected.row][selected.col]) return;

      if (notesMode && value !== 0) {
        toggleNote(value);
        return;
      }

      const nextBoard = cloneSamuraiBoard(snapshot.current);
      if (value === 0) {
        nextBoard[selected.row][selected.col] = 0;
        commitBoard(nextBoard, false);
        return;
      }

      if (!isValidSamuraiPlacement(snapshot.current, selected.row, selected.col, value)) {
        return;
      }

      nextBoard[selected.row][selected.col] = value;
      commitBoard(nextBoard, snapshot.solution[selected.row][selected.col] !== value);
    },
    [commitBoard, isWon, notesMode, selected, snapshot, toggleNote]
  );

  const clearCell = useCallback(() => {
    setCellValue(0);
  }, [setCellValue]);

  const restartGame = useCallback(() => {
    if (!snapshot) return;
    setSnapshot((previous) =>
      previous ? { ...previous, current: cloneSamuraiBoard(previous.puzzle) } : previous
    );
    setSelected(null);
    setMistakes(0);
    setIsWon(false);
    setShowWinModal(false);
    setHistory([]);
    setNotes({});
    setHintsLeft(MAX_HINTS);
    setGameKey((key) => key + 1);
  }, [snapshot]);

  const undoMove = useCallback(() => {
    setHistory((previous) => {
      const last = previous.at(-1);
      if (!last) return previous;
      setSnapshot((currentSnapshot) =>
        currentSnapshot
          ? { ...currentSnapshot, current: cloneSamuraiBoard(last) }
          : currentSnapshot
      );
      setIsWon(false);
      setShowWinModal(false);
      return previous.slice(0, -1);
    });
  }, []);

  const useHint = useCallback(() => {
    if (!snapshot || hintsLeft === 0 || isWon) return;

    const target =
      selected &&
      !snapshot.given[selected.row][selected.col] &&
      snapshot.current[selected.row][selected.col] !==
        snapshot.solution[selected.row][selected.col]
        ? selected
        : findFirstHintCell(snapshot);

    if (!target) return;

    const hintValue = snapshot.solution[target.row][target.col];
    if (hintValue === null) return;

    const nextBoard = cloneSamuraiBoard(snapshot.current);
    nextBoard[target.row][target.col] = hintValue;
    setSelected(target);
    setHintsLeft((value) => value - 1);
    commitBoard(nextBoard, false);
  }, [commitBoard, hintsLeft, isWon, selected, snapshot]);

  const handleDifficultyChange = useCallback(
    (nextDifficulty: Difficulty) => {
      startNewGame(nextDifficulty);
    },
    [startNewGame]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!selected || isWon) return;

      const key = event.key;
      if (key >= "1" && key <= "9") {
        setCellValue(parseInt(key, 10) as CellValue);
      } else if (key === "Backspace" || key === "Delete" || key === "0") {
        clearCell();
      } else if (key === "ArrowUp") {
        setSelected(findNextActiveCell(selected, -1, 0) ?? selected);
      } else if (key === "ArrowDown") {
        setSelected(findNextActiveCell(selected, 1, 0) ?? selected);
      } else if (key === "ArrowLeft") {
        setSelected(findNextActiveCell(selected, 0, -1) ?? selected);
      } else if (key === "ArrowRight") {
        setSelected(findNextActiveCell(selected, 0, 1) ?? selected);
      }
    },
    [clearCell, isWon, selected, setCellValue]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const validMoves = useMemo(() => {
    if (!snapshot || !selected || snapshot.given[selected.row][selected.col]) {
      return [];
    }
    return getSamuraiValidMoves(snapshot.current, selected.row, selected.col);
  }, [selected, snapshot]);

  const getStatus = useCallback(
    (row: number, col: number) => {
      if (!snapshot) return "empty" as const;
      return getSamuraiCellStatus(
        snapshot.current,
        snapshot.solution,
        snapshot.given,
        row,
        col
      );
    },
    [snapshot]
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative glass-card-lg p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-gradient-premium">
        <div className="absolute inset-0 rounded-3xl bg-card-overlay pointer-events-none" aria-hidden />

        <div className="relative z-[1] space-y-6 sm:space-y-8">
          <GameHeader
            time={formatted}
            mistakes={mistakes}
            difficulty={difficulty}
            isPaused={!timerActive}
            onDifficultyChange={handleDifficultyChange}
            onNewGame={() => startNewGame(difficulty)}
            onRestart={restartGame}
            gameActive={false}
            title="Samurai Sudoku"
            subtitle="Five linked grids in one overlapping challenge"
          />

          <VariantControls
            canUndo={history.length > 0}
            notesMode={notesMode}
            hintsLeft={hintsLeft}
            onUndo={undoMove}
            onToggleNotes={() => setNotesMode((value) => !value)}
            onHint={useHint}
          />

          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <SamuraiBoard
              board={current}
              given={given}
              selected={selected}
              notes={notes}
              getCellStatus={getStatus}
              onSelect={(row, col) => setSelected({ row, col })}
            />

            <div className="w-full max-w-xl">
              <NumberPad
                onInput={setCellValue}
                onClear={clearCell}
                validMoves={
                  selected && !given[selected.row][selected.col] ? validMoves : undefined
                }
                disabled={!selected || isWon || (selected && given[selected.row][selected.col])}
              />
            </div>
          </div>
        </div>
      </div>

      <WinModal
        isOpen={showWinModal}
        time={formatted}
        mistakes={mistakes}
        difficulty={DIFFICULTY_LABELS[difficulty]}
        onNewGame={() => startNewGame(difficulty)}
        onClose={() => setShowWinModal(false)}
      />
    </div>
  );
}

function VariantControls({
  canUndo,
  notesMode,
  hintsLeft,
  onUndo,
  onToggleNotes,
  onHint,
}: {
  canUndo: boolean;
  notesMode: boolean;
  hintsLeft: number;
  onUndo: () => void;
  onToggleNotes: () => void;
  onHint: () => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Button variant="secondary" size="sm" onClick={onUndo} disabled={!canUndo}>
        Undo
      </Button>
      <Button
        variant={notesMode ? "primary" : "secondary"}
        size="sm"
        onClick={onToggleNotes}
        aria-pressed={notesMode}
      >
        Notes
      </Button>
      <Button variant="secondary" size="sm" onClick={onHint} disabled={hintsLeft === 0}>
        Hint ({hintsLeft})
      </Button>
    </div>
  );
}

function findFirstHintCell(snapshot: SamuraiSnapshot): CellPosition | null {
  for (let row = 0; row < SAMURAI_SIZE; row++) {
    for (let col = 0; col < SAMURAI_SIZE; col++) {
      if (
        isSamuraiCellActive(row, col) &&
        !snapshot.given[row][col] &&
        snapshot.current[row][col] !== snapshot.solution[row][col]
      ) {
        return { row, col };
      }
    }
  }
  return null;
}

function findNextActiveCell(
  selected: CellPosition,
  rowDelta: number,
  colDelta: number
): CellPosition | null {
  let row = selected.row + rowDelta;
  let col = selected.col + colDelta;

  while (row >= 0 && row < SAMURAI_SIZE && col >= 0 && col < SAMURAI_SIZE) {
    if (isSamuraiCellActive(row, col)) return { row, col };
    row += rowDelta;
    col += colDelta;
  }

  return null;
}
