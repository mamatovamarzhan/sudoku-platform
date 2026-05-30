"use client";

import { useCallback, useEffect, useState } from "react";
import { useSudokuGame } from "@/hooks/useSudokuGame";
import { useTimer } from "@/hooks/useTimer";
import { DIFFICULTY_LABELS, type Board } from "@/lib/sudoku";
import type { CellValue, Puzzle } from "@/lib/sudoku";
import { Button } from "@/components/ui/Button";
import { GameHeader } from "./GameHeader";
import { SudokuBoard } from "./SudokuBoard";
import { NumberPad } from "./NumberPad";
import { WinModal } from "./WinModal";
import { AICoach } from "./AICoach";

interface SudokuGameProps {
  initialPuzzle?: Puzzle;
  mode?: "classic" | "daily";
  dailyLabel?: string;
}

type Notes = Record<string, Set<number>>;

interface HistoryEntry {
  board: Board;
  notes: Notes;
}

const MAX_HINTS = 3;

export function SudokuGame({
  initialPuzzle,
  mode = "classic",
  dailyLabel,
}: SudokuGameProps) {
  const {
    difficulty,
    current,
    given,
    solution,
    selected,
    mistakes,
    isWon,
    showWinModal,
    validMoves,
    hasStarted,
    gameKey,
    loadPuzzle,
    startNewGame,
    restartGame,
    selectCell,
    setCellValue,
    clearCell,
    clearBoard,
    restoreCurrentBoard,
    dismissWinModal,
    getCellStatus,
  } = useSudokuGame();

  const timerActive = hasStarted && !isWon;
  const { formatted, reset: resetTimer, pause } = useTimer(timerActive);
  const isDaily = mode === "daily";

  const [showAICoach, setShowAICoach] = useState(false);

  // Notes mode
  const [notesMode, setNotesMode] = useState(false);
  const [notes, setNotes] = useState<Notes>({});

  // Undo history
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Hints
  const [hintsLeft, setHintsLeft] = useState(MAX_HINTS);

  // Save to history before each move
  const saveHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-49), // keep max 50 states
      {
        board: current.map((row) => [...row]),
        notes: Object.fromEntries(
          Object.entries(notes).map(([k, v]) => [k, new Set(v)])
        ),
      },
    ]);
  }, [current, notes]);

  // Undo
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    restoreCurrentBoard(prev.board);
    setNotes(
      Object.fromEntries(
        Object.entries(prev.notes).map(([k, v]) => [k, new Set(v)])
      )
    );
  }, [history, restoreCurrentBoard]);

  const handleClearBoard = useCallback(() => {
    saveHistory();
    clearBoard();
    setNotes({});
  }, [saveHistory, clearBoard]);

  // Notes input
  const handleNotesInput = useCallback(
    (value: CellValue) => {
      if (!selected) return;
      if (given[selected.row][selected.col]) return;
      const key = `${selected.row}-${selected.col}`;
      setNotes((prev) => {
        const existing = new Set(prev[key] ?? []);
        if (existing.has(value)) {
          existing.delete(value);
        } else {
          existing.add(value);
        }
        return { ...prev, [key]: existing };
      });
    },
    [selected, given]
  );

  // Hint
  const handleHint = useCallback(() => {
    if (!selected || hintsLeft <= 0 || isWon) return;
    if (given[selected.row][selected.col]) return;
    if (!solution) return;
    const correct = solution[selected.row][selected.col];
    if (!correct) return;
    saveHistory();
    const accepted = setCellValue(correct as CellValue);
    if (!accepted) return;
    const key = `${selected.row}-${selected.col}`;
    setNotes((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setHintsLeft((h) => h - 1);
  }, [selected, hintsLeft, isWon, given, solution, saveHistory, setCellValue]);

  // Wrapped setCellValue that saves history and clears notes
  const handleInput = useCallback(
    (value: CellValue) => {
      if (notesMode) {
        handleNotesInput(value);
        return;
      }
      if (selected) {
        saveHistory();
        const key = `${selected.row}-${selected.col}`;
        setNotes((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
        setCellValue(value);
      }
    },
    [notesMode, handleNotesInput, saveHistory, selected, setCellValue]
  );

  // Wrapped clearCell
  const handleClear = useCallback(() => {
    saveHistory();
    if (selected) {
      const key = `${selected.row}-${selected.col}`;
      setNotes((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
    clearCell();
  }, [saveHistory, selected, clearCell]);

  // Reset on new game
  useEffect(() => {
    setNotes({});
    setHistory([]);
    setHintsLeft(MAX_HINTS);
    setNotesMode(false);
  }, [gameKey]);

  useEffect(() => {
    if (initialPuzzle) {
      loadPuzzle(initialPuzzle);
    } else {
      startNewGame("medium");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    resetTimer();
  }, [gameKey, resetTimer]);

  useEffect(() => {
    if (isWon) pause();
  }, [isWon, pause]);

  const handleNewGame = useCallback(() => {
    if (isDaily && initialPuzzle) {
      loadPuzzle(initialPuzzle);
    } else {
      startNewGame(difficulty);
    }
  }, [isDaily, initialPuzzle, loadPuzzle, startNewGame, difficulty]);

  const handleDifficultyChange = useCallback(
    (d: typeof difficulty) => {
      startNewGame(d);
    },
    [startNewGame]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selected || isWon) return;
      const key = e.key;
      if (key >= "1" && key <= "9") {
        handleInput(parseInt(key, 10) as CellValue);
      } else if (key === "Backspace" || key === "Delete" || key === "0") {
        handleClear();
      } else if (key === "ArrowUp" && selected.row > 0) {
        selectCell(selected.row - 1, selected.col);
      } else if (key === "ArrowDown" && selected.row < 8) {
        selectCell(selected.row + 1, selected.col);
      } else if (key === "ArrowLeft" && selected.col > 0) {
        selectCell(selected.row, selected.col - 1);
      } else if (key === "ArrowRight" && selected.col < 8) {
        selectCell(selected.row, selected.col + 1);
      } else if (key === "z" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleUndo();
      } else if (key === "n" || key === "N") {
        setNotesMode((m) => !m);
      }
    },
    [selected, isWon, handleInput, handleClear, selectCell, handleUndo]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
            onNewGame={handleNewGame}
            onRestart={restartGame}
            gameActive={hasStarted && !isWon}
            onToggleAICoach={() => setShowAICoach(true)}
            showAICoach={showAICoach}
            title={isDaily ? "Daily Challenge" : "SudoLogic"}
            subtitle={isDaily ? dailyLabel ?? "Today's puzzle" : "Classic mode"}
            lockDifficulty={isDaily}
          />

          <div className="flex flex-col items-center gap-6 sm:gap-8">
            <SudokuBoard
              board={current}
              given={given}
              selected={selected}
              notes={notes}
              getCellStatus={getCellStatus}
              onSelect={selectCell}
            />

            <div className="w-full flex gap-3">
              <Button variant="secondary" size="md" onClick={handleUndo} className="flex-1">
                Undo
              </Button>
              <Button
                variant={notesMode ? "primary" : "secondary"}
                size="md"
                onClick={() => setNotesMode((m) => !m)}
                className="flex-1"
              >
                Notes
              </Button>
              <Button variant="secondary" size="md" onClick={handleHint} disabled={hintsLeft <= 0} className="flex-1">
                Hint ({hintsLeft})
              </Button>
            </div>

            <NumberPad
              onInput={handleInput}
              onClear={handleClear}
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
        difficulty={isDaily ? "Daily" : DIFFICULTY_LABELS[difficulty]}
        onNewGame={handleNewGame}
        onClose={dismissWinModal}
      />

      <AICoach
        isOpen={showAICoach}
        onClose={() => setShowAICoach(false)}
        board={current}
        selected={selected}
        solution={solution}
        given={given}
      />
    </div>
  );
}