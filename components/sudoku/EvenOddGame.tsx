"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTimer } from "@/hooks/useTimer";
import {
  boardsMatch,
  cloneBoard,
  createEmptyBoard,
  DIFFICULTY_LABELS,
  generateEvenOddPuzzle,
  getClassicValidMoves,
  getEvenOddCellStatus,
  isValidPlacement,
  type Board,
  type CellPosition,
  type CellValue,
  type Difficulty,
  type EvenOddPuzzle,
} from "@/lib/sudoku";
import { Button } from "@/components/ui/Button";
import { GameHeader } from "./GameHeader";
import { EvenOddBoard } from "./EvenOddBoard";
import { NumberPad } from "./NumberPad";
import { WinModal } from "./WinModal";
import { AICoach } from "./AICoach";

interface EvenOddSnapshot {
  puzzle: Board;
  solution: Board;
  current: Board;
  given: boolean[][];
  evenMask: boolean[][];
  difficulty: Difficulty;
}

const MAX_HINTS = 3;

export function EvenOddGame() {
  const [snapshot, setSnapshot] = useState<EvenOddSnapshot | null>(null);
  const [selected, setSelected] = useState<CellPosition | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [history, setHistory] = useState<Board[]>([]);
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState<Record<string, CellValue[]>>({});
  const [hintsLeft, setHintsLeft] = useState(MAX_HINTS);

  const timerActive = Boolean(snapshot) && !isWon;
  const { formatted, reset: resetTimer, pause } = useTimer(timerActive);

  const loadPuzzle = useCallback((puzzle: EvenOddPuzzle) => {
    setSnapshot({
      puzzle: cloneBoard(puzzle.puzzle),
      solution: cloneBoard(puzzle.solution),
      current: cloneBoard(puzzle.puzzle),
      given: puzzle.puzzle.map((row) => row.map((cell) => cell !== 0)),
      evenMask: puzzle.evenMask.map((row) => [...row]),
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
      loadPuzzle(generateEvenOddPuzzle(difficulty));
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
  const current = snapshot?.current ?? createEmptyBoard();
  const given = snapshot?.given ?? createEmptyBoard().map((row) => row.map(() => false));
  const evenMask = snapshot?.evenMask ?? createEmptyBoard().map((row) => row.map(() => false));

  const commitBoard = useCallback(
    (nextBoard: Board, countMistake: boolean) => {
      if (!snapshot) return;

      setHistory((previous) => [...previous, cloneBoard(snapshot.current)]);
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

      if (!countMistake && boardsMatch(nextBoard, snapshot.solution)) {
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
      if (snapshot.given[selected.row][selected.col]) return;

      if (notesMode && value !== 0) {
        toggleNote(value);
        return;
      }

      const nextBoard = cloneBoard(snapshot.current);
      if (value === 0) {
        nextBoard[selected.row][selected.col] = 0;
        commitBoard(nextBoard, false);
        return;
      }

      if (!isValidPlacement(snapshot.current, selected.row, selected.col, value)) {
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
      previous ? { ...previous, current: cloneBoard(previous.puzzle) } : previous
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
        currentSnapshot ? { ...currentSnapshot, current: cloneBoard(last) } : currentSnapshot
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
      snapshot.current[selected.row][selected.col] !== snapshot.solution[selected.row][selected.col]
        ? selected
        : findFirstHintCell(snapshot);

    if (!target) return;

    const nextBoard = cloneBoard(snapshot.current);
    nextBoard[target.row][target.col] = snapshot.solution[target.row][target.col];
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
      } else if (key === "ArrowUp" && selected.row > 0) {
        setSelected({ row: selected.row - 1, col: selected.col });
      } else if (key === "ArrowDown" && selected.row < 8) {
        setSelected({ row: selected.row + 1, col: selected.col });
      } else if (key === "ArrowLeft" && selected.col > 0) {
        setSelected({ row: selected.row, col: selected.col - 1 });
      } else if (key === "ArrowRight" && selected.col < 8) {
        setSelected({ row: selected.row, col: selected.col + 1 });
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
    return getClassicValidMoves(snapshot.current, selected.row, selected.col);
  }, [selected, snapshot]);

  const getStatus = useCallback(
    (row: number, col: number) => {
      if (!snapshot) return "empty" as const;
      return getEvenOddCellStatus(
        snapshot.current,
        snapshot.solution,
        snapshot.given,
        snapshot.evenMask,
        row,
        col
      );
    },
    [snapshot]
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative glass-card-lg p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8 bg-gradient-premium">
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
            onToggleAICoach={() => setShowAICoach(true)}
            showAICoach={showAICoach}
            title="Even/Odd Sudoku"
            subtitle="Even cells are shaded; white cells are odd"
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
            <EvenOddBoard
              board={current}
              given={given}
              evenMask={evenMask}
              selected={selected}
              notes={notes}
              getCellStatus={getStatus}
              onSelect={(row, col) => setSelected({ row, col })}
            />

            <NumberPad
              onInput={setCellValue}
              onClear={clearCell}
              validMoves={selected && !given[selected.row][selected.col] ? validMoves : undefined}
              disabled={!selected || isWon || (selected && given[selected.row][selected.col])}
            />
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

      <AICoach
        isOpen={showAICoach}
        onClose={() => setShowAICoach(false)}
        board={current}
        selected={selected}
        solution={snapshot?.solution ?? createEmptyBoard()}
        given={given}
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

function findFirstHintCell(snapshot: EvenOddSnapshot): CellPosition | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (
        !snapshot.given[row][col] &&
        snapshot.current[row][col] !== snapshot.solution[row][col]
      ) {
        return { row, col };
      }
    }
  }
  return null;
}
