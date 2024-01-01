import { writable } from "svelte/store";
import type { State, Game, Player, MessagePayload } from "$lib/game";
import { DEFAULT_DRAW_COLOR, DEFAULT_ERASER_WIDTH, DEFAULT_LINE_WIDTH } from "$lib/board";
import type { Utility } from "./utility";

export const loading = writable(false);
export const game = writable<Game | undefined>();

export const player = writable("");
export const state = writable<State>("waiting");
export const owner = writable("");
export const currentPlayer = writable("");

export const players = writable<Player[]>([]);
export const guesses = writable<MessagePayload[]>([]);
export const chat = writable<MessagePayload[]>([]);

export const words = writable<string[]>([]);
export const word = writable("");
export const answered = writable(false);

export const utility = writable<Utility | undefined>();
export const boardColor = writable(DEFAULT_DRAW_COLOR);
export const pencilWidth = writable(DEFAULT_LINE_WIDTH);
export const eraserWidth = writable(DEFAULT_ERASER_WIDTH);
