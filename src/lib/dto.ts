import type { Game, WordSet } from "$lib/models";

export interface CreateUserReq {
    name: string,
}

export interface CreateUserResp {
    name: string,
}

export interface GetUserResp {
    name: string,
    game_id: string | undefined,
    user_id: string | undefined,
}

export interface CreateGameReq {
    language: string,
    word_set: string,
    max_players: number,
    target_score: number,
    visibility: boolean,
}

export interface CreateGameResp {
    id: string,
}

export interface GetGameResp {
    total: number,
    limit: number,
    offset: number,
    games: Game[],
}

export interface JoinGameReq {
    game_id: string,
}

export interface CreateWordSetReq {
    name: string,
    language: string,
    words: string[],
}

export interface GetWordSetsResp {
    total: number,
    word_sets: WordSet[],
}
