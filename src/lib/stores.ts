import type { BoardUtility } from "$lib/board_utils";
import { writable } from "svelte/store";

export type Message = {
    name: string;
    message: string;
}

export type Player = {
    name: string;
    score: number;
}


export const DEFAULT_DRAW_COLOR = "#000000";
export const DEFAULT_LINE_WIDTH = 4;
export const DEFAULT_ERASER_WIDTH = 15;

export const boardUtility = writable<BoardUtility>();

export const boardColor = writable(DEFAULT_DRAW_COLOR);
export const pencilWidth = writable(DEFAULT_LINE_WIDTH);
export const eraserWidth = writable(DEFAULT_ERASER_WIDTH);

export const players = writable<Player[]>([]);
export const guesses = writable<Message[]>([]);
export const messages = writable<Message[]>([]);
