"use client";

import { useCallback, useMemo, useState } from "react";
import {
  generatePuzzle,
  createGameSnapshot,
  resetToPuzzle,
  applyMove,
  getCellStatus,
  getValidMoves,
  isGameWon,
  type Board,
  type CellValue,
  type Difficulty,
  type CellPosition,
  type GameSnapshot,
  type Puzzle,
} from "@/lib/sudoku";

export function useSudokuGame() {
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const [selected, setSelected] = useState<CellPosition | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const loadPuzzle = useCallback((puzzle: Puzzle) => {
    setSnapshot(createGameSnapshot(puzzle));
    setSelected(null);
    setMistakes(0);
    setIsWon(false);
    setShowWinModal(false);
    setGameKey((k) => k + 1);
  }, []);

  const startNewGame = useCallback((difficulty: Difficulty = "medium") => {
    loadPuzzle(generatePuzzle(difficulty));
  }, [loadPuzzle]);

  const restartGame = useCallback(() => {
    if (!snapshot) return;
    setSnapshot((prev) =>
      prev ? { ...prev, current: resetToPuzzle(prev) } : prev
    );
    setSelected(null);
    setMistakes(0);
    setIsWon(false);
    setShowWinModal(false);
    setGameKey((k) => k + 1);
  }, [snapshot]);

  const selectCell = useCallback((row: number, col: number) => {
    setSelected({ row, col });
  }, []);

  const setCellValue = useCallback(
    (value: CellValue) => {
      if (!snapshot || !selected || isWon) return;

      const result = applyMove(snapshot, selected, value);
      if (!result.accepted) return;

      setSnapshot((prev) =>
        prev ? { ...prev, current: result.board } : prev
      );

      if (result.isMistake) {
        setMistakes((m) => m + 1);
      }

      if (result.isWon) {
        setIsWon(true);
        setShowWinModal(true);
      }
    },
    [snapshot, selected, isWon]
  );

  const clearCell = useCallback(() => {
    setCellValue(0);
  }, [setCellValue]);

  const dismissWinModal = useCallback(() => {
    setShowWinModal(false);
  }, []);

  const getStatus = useCallback(
    (row: number, col: number) => {
      if (!snapshot) return "empty" as const;
      return getCellStatus(
        snapshot.current,
        snapshot.solution,
        snapshot.given,
        row,
        col
      );
    },
    [snapshot]
  );

  const validMoves = useMemo((): CellValue[] => {
    if (!snapshot || !selected) return [];
    if (snapshot.given[selected.row][selected.col]) return [];
    return getValidMoves(snapshot.current, selected.row, selected.col);
  }, [snapshot, selected]);

  const selectedValue = useMemo(() => {
    if (!snapshot || !selected) return null;
    const val = snapshot.current[selected.row][selected.col];
    return val !== 0 ? val : null;
  }, [snapshot, selected]);

  const difficulty = snapshot?.difficulty ?? "medium";
  const current = snapshot?.current ?? createEmptyBoard();
  const given = snapshot?.given ?? createGivenMask();
  const puzzle = snapshot?.puzzle ?? createEmptyBoard();

  const isComplete = useMemo(
    () => (snapshot ? isGameWon(snapshot.current, snapshot.solution) : false),
    [snapshot]
  );

  const hasStarted = useMemo(
    () => puzzle.some((row) => row.some((c) => c !== 0)),
    [puzzle]
  );

  return {
    difficulty,
    puzzle,
    current,
    given,
    selected,
    selectedValue,
    validMoves,
    mistakes,
    isWon,
    showWinModal,
    isComplete,
    hasStarted,
    gameKey,
    loadPuzzle,
    startNewGame,
    restartGame,
    selectCell,
    setCellValue,
    clearCell,
    dismissWinModal,
    getCellStatus: getStatus,
  };
}

function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(0) as CellValue[]);
}

function createGivenMask(): boolean[][] {
  return Array.from({ length: 9 }, () => Array(9).fill(false));
}
