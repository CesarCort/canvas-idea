import { Board, AppConfig } from '@/types';
import { STORAGE_KEYS, DEFAULT_CONFIG } from './constants';

/**
 * Load boards from localStorage
 */
export function loadBoards(): Board[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BOARDS);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading boards:', error);
    return [];
  }
}

/**
 * Save boards to localStorage
 */
export function saveBoards(boards: Board[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
  } catch (error) {
    console.error('Error saving boards:', error);
  }
}

/**
 * Load app configuration from localStorage
 */
export function loadConfig(): AppConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
    if (!stored) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
  } catch (error) {
    console.error('Error loading config:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save app configuration to localStorage
 */
export function saveConfig(config: AppConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

/**
 * Load current board ID from localStorage
 */
export function loadCurrentBoardId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_BOARD_ID);
  } catch (error) {
    console.error('Error loading current board ID:', error);
    return null;
  }
}

/**
 * Save current board ID to localStorage
 */
export function saveCurrentBoardId(boardId: string | null): void {
  try {
    if (boardId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_BOARD_ID, boardId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_BOARD_ID);
    }
  } catch (error) {
    console.error('Error saving current board ID:', error);
  }
}
