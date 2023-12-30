export interface Game {
    id: string,
    visibility: boolean,
    language: string,
    target_score: number,
    max_players: number,
    current_players: string[],
}

export interface WordSet {
    name: string,
    language: string,
    words: string[],
}
