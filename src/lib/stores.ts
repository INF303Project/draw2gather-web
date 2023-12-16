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

// dummy player list
const player_list = [
    { name: "alp", score: 0 },
    { name: "eren", score: 10 },
    { name: "ünal", score: 20 },
    { name: "sena", score: 30 },
    { name: "zeynep", score: 40 },
    { name: "anıl", score: 50 },
    { name: "batuhan", score: 60 },
    { name: "alper", score: 100 },
    { name: "alp", score: 0 },
    { name: "eren", score: 10 },
    { name: "ünal", score: 20 },
    { name: "sena", score: 30 },
    { name: "zeynep", score: 40 },
    { name: "anıl", score: 50 },
    { name: "batuhan", score: 60 },
    { name: "alper", score: 100 },
    { name: "alp", score: 0 },
    { name: "eren", score: 10 },
    { name: "ünal", score: 20 },
    { name: "sena", score: 30 },
    { name: "zeynep", score: 40 },
    { name: "anıl", score: 50 },
    { name: "batuhan", score: 60 },
    { name: "alper", score: 100 },
]

// dummy answer list
const answer_list = [
    { name: "alp", message: "alp" },
    { name: "eren", message: "eren" },
    { name: "ünal", message: "ünal" },
    { name: "sena", message: "sena" },
    { name: "zeynep", message: "zeynep" },
    { name: "anıl", message: "anıl" },
    { name: "batuhan", message: "batuhan" },
    { name: "alper", message: "alper" },
    { name: "alp", message: "alp" },
    { name: "eren", message: "eren" },
    { name: "ünal", message: "ünal" },
    { name: "sena", message: "sena" },
    { name: "zeynep", message: "zeynep" },
    { name: "anıl", message: "anıl" },
    { name: "batuhan", message: "batuhan" },
    { name: "alper", message: "alper" },
    { name: "alp", message: "alp" },
    { name: "eren", message: "eren" },
    { name: "ünal", message: "ünal" },
    { name: "sena", message: "sena" },
    { name: "zeynep", message: "zeynep" },
    { name: "anıl", message: "anıl" },
    { name: "batuhan", message: "batuhan" },
    { name: "alper", message: "alper" },
]

// dummy message list
const message_list = [
    { name: "alp", message: "alp" },
    { name: "eren", message: "eren" },
    { name: "ünal", message: "ünal" },
    { name: "sena", message: "sena" },
    { name: "zeynep", message: "zeynep" },
    { name: "anıl", message: "anıl" },
    { name: "batuhan", message: "batuhan" },
    { name: "alper", message: "alper" },
    { name: "alp", message: "alp" },
    { name: "eren", message: "eren" },
    { name: "ünal", message: "ünal" },
    { name: "sena", message: "sena" },
    { name: "zeynep", message: "zeynep" },
    { name: "anıl", message: "anıl" },
    { name: "batuhan", message: "batuhan" },
    { name: "alper", message: "alper" },
    { name: "alp", message: "alp" },
    { name: "eren", message: "eren" },
    { name: "ünal", message: "ünal" },
    { name: "sena", message: "sena" },
    { name: "zeynep", message: "zeynep" },
    { name: "anıl", message: "anıl" },
    { name: "batuhan", message: "batuhan" },
    { name: "alper", message: "alper" },
]

export const DEFAULT_DRAW_COLOR = "#000000";
export const DEFAULT_LINE_WIDTH = 4;
export const DEFAULT_ERASER_WIDTH = 15;

export const boardUtility = writable<BoardUtility>();

export const boardColor = writable(DEFAULT_DRAW_COLOR);
export const pencilWidth = writable(DEFAULT_LINE_WIDTH);
export const eraserWidth = writable(DEFAULT_ERASER_WIDTH);

export const players = writable<Player[]>(player_list);
export const guesses = writable<Message[]>(answer_list);
export const messages = writable<Message[]>(message_list);
