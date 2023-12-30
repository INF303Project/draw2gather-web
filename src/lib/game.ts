import { writable } from "svelte/store";
import { API_URL } from "$lib";
import { Board, DEFAULT_DRAW_COLOR, DEFAULT_ERASER_WIDTH, DEFAULT_LINE_WIDTH } from "./board";
import { state, chat, guesses, owner, players, currentPlayer, player, answered, words, word, utility, boardColor, pencilWidth, eraserWidth } from "./stores";
import { FreeDraw } from "./utility";
import { goto } from "$app/navigation";

export type State = "waiting" | "starting" | "picking" | "drawing" | "ending";

export enum Action {
    Greet, // <- GamePayload

    Join, // <- Player
    Quit, // <- string | ->
    Kick, // <- | -> string
    Chat, // <- MessagePayload | -> string

    NewOwner, // <- string

    Start, // ->

    Pick, // <- string[2] | -> string

    FreeDraw, // <- number[] | -> number[]
    Erase, // <- number[] | -> number[]
    LineDraw, // <- PointsPayload | -> PointsPayload
    RectDraw, // <- PointsPayload | -> PointsPayload
    RectFill, // <- PointsPayload | -> PointsPayload
    CircleDraw, // <- PointsPayload | -> PointsPayload
    CircleFill, // <- PointsPayload | -> PointsPayload
    ChangeColor, // <- string | -> string
    ChangePencilSize, // <- number || -> number
    ChangeEraserSize, // <- number || -> number
    ClearBoard, // <- | ->
    Guess, // <- MessagePayload | -> string

    CorrectGuess, // <- string
    UpdateScore, // <- ScorePayload

    Waiting, // <-
    Starting, // <- id
    Picking, // <-
    Drawing, // <-
    Ending, // <- {leader board}
}

export interface Message {
    action: Action,
    payload?: string,
}

export interface Payload {
    value: any;
}

export interface Point {
    x: number,
    y: number,
}

interface PointsPayload {
    start: Point,
    end: Point,
}

export interface MessagePayload {
    player: string,
    message: string,
}

export interface ScorePayload {
    player: string,
    score: number,
}

interface GamePayload {
    state: State,
    player: string,
    owner: string,
    currentPlayer: string,
    players: { [key: string]: Player },
    commands: Message[],
}

export interface Player {
    id: string,
    name: string,
    score: number,
}

export const messageQueue = writable<Message[]>([]);
export const publishMessage = (action: Action, value: any = undefined): void => {
    messageQueue.update((messages) =>
        [...messages, {
            action: action,
            payload: JSON.stringify({ value }),
        }]
    );
}

export class Game {
    private player: string = "";
    private state: State = "waiting";
    private owner: string = "";
    private currentPlayer: string = "";
    private players: Map<string, Player> = new Map<string, Player>();
    private guesses: MessagePayload[] = [];
    private chat: MessagePayload[] = [];
    private readonly socket: WebSocket = new WebSocket(`ws://${API_URL}:8080/game`);

    constructor() {
        messageQueue.subscribe(this.queueHandler);
        this.socket.onmessage = this.messageHandler;
    }

    private queueHandler = (messages: Message[]): void => {
        const message = messages.pop();
        if (message) {
            this.socket.send(JSON.stringify(message));
        }
    }

    private messageHandler = (event: MessageEvent): void => {
        const message = JSON.parse(event.data) as Message;
        const payload = message.payload ? JSON.parse(message.payload) as Payload : {} as Payload;

        switch (message.action) {
            case Action.Greet: {
                const game = payload.value as GamePayload;
                this.setPlayer(game.player);
                this.setState(game.state);
                this.setPlayers(new Map(Object.entries(game.players)));
                this.setOwner(game.owner);
                this.setCurrentPlayer(game.currentPlayer);
                // handle commands
                break;
            }
            case Action.Join: {
                const player = payload.value as Player;
                this.addPlayer(player);
                break;
            }
            case Action.Quit: {
                const player = payload.value as string;
                this.removePlayer(player);
                break;
            }
            case Action.Kick:
                goto("/");
                break;
            case Action.Chat: {
                const msg = payload.value as MessagePayload;
                this.addChat(msg);
                break;
            }
            case Action.NewOwner: {
                const player = payload.value as string;
                this.setOwner(player);
                break;
            }
            case Action.Pick: {
                const picks = payload.value as string[];
                words.set(picks);
                break;
            }
            case Action.FreeDraw: {
                const points = payload.value as number[];
                Board.getInstance().freeDrawBuffered(points);
                break;
            }
            case Action.Erase: {
                const points = payload.value as number[];
                Board.getInstance().eraseBuffered(points);
                break;
            }
            case Action.LineDraw: {
                const points = payload.value as PointsPayload;
                Board.getInstance().drawLineBack(points.start, points.end);
                break;
            }
            case Action.RectDraw: {
                const points = payload.value as PointsPayload;
                Board.getInstance().drawRectBack(points.start, points.end);
                break;
            }
            case Action.RectFill: {
                const points = payload.value as PointsPayload;
                Board.getInstance().fillRectBack(points.start, points.end);
                break;
            }
            case Action.CircleDraw: {
                const points = payload.value as PointsPayload;
                Board.getInstance().drawCircleBack(points.start, points.end);
                break;
            }
            case Action.CircleFill: {
                const points = payload.value as PointsPayload;
                Board.getInstance().fillCircleBack(points.start, points.end);
                break;
            }
            case Action.ChangeColor: {
                const color = payload.value as string;
                Board.getInstance().changeColor(color);
                break;
            }
            case Action.ChangePencilSize: {
                const size = payload.value as number;
                Board.getInstance().changeLineWidth(size);
                break;
            }
            case Action.ChangeEraserSize: {
                const size = payload.value as number;
                Board.getInstance().changeEraserWidth(size);
                break;
            }
            case Action.ClearBoard: {
                Board.getInstance().clearBack();
                break;
            }
            case Action.Guess: {
                const message = payload.value as MessagePayload;
                this.addGuess(message);
                break;
            }
            case Action.CorrectGuess: {
                const player = payload.value as string;
                if (player == this.player) {
                    answered.set(true);
                }
                break;
            }
            case Action.UpdateScore: {
                const msg = payload.value as ScorePayload;
                let player = this.players.get(msg.player)!;
                player.score = msg.score;
                this.players.set(msg.player, player);
                players.set(this.sortedPlayers());
                break;
            }
            case Action.Waiting:
                Board.getInstance().hide();
                utility.set(undefined);
                this.setState("waiting");
                this.setCurrentPlayer("");
                this.clearScores();
                this.clearGuesses();
                words.set([]);
                word.set("");
                answered.set(false);
                break;
            case Action.Starting: {
                Board.getInstance().hide();
                utility.set(undefined);
                const player = payload.value as string;
                this.setState("starting");
                this.setCurrentPlayer(player);
                this.clearGuesses();
                boardColor.set(DEFAULT_DRAW_COLOR);
                pencilWidth.set(DEFAULT_LINE_WIDTH);
                eraserWidth.set(DEFAULT_ERASER_WIDTH);
                words.set([]);
                word.set("");
                answered.set(false);
                break;
            }
            case Action.Picking:
                this.setState("picking");
                break;
            case Action.Drawing:
                this.setState("drawing");
                if (this.player == this.currentPlayer) {
                    utility.set(new FreeDraw());
                }
                Board.getInstance().clearBack();
                Board.getInstance().show();
                break;
            case Action.Ending: {
                // FIXME
                Board.getInstance().hide();
                this.setState("ending");
                this.clearGuesses();
                break;
            }
            default:
                console.error("Invalid action");
                break;
        }
    }

    private sendMessage = (action: Action, value: any = undefined): void => {
        this.socket.send(JSON.stringify({
            action: action,
            payload: JSON.stringify({ value }),
        }));
    }

    private setPlayer = (id: string): void => {
        this.player = id;
        player.set(this.player);
    }

    private setState = (s: State): void => {
        this.state = s;
        state.set(this.state);
    }

    private setOwner = (id: string): void => {
        this.owner = id;
        owner.set(this.owner);
    }

    private setCurrentPlayer = (id: string): void => {
        this.currentPlayer = id;
        currentPlayer.set(this.currentPlayer);
    }

    private sortedPlayers = (): Player[] => {
        return Array.from(this.players.values()).sort((a, b) => b.score - a.score);
    }

    private setPlayers = (p: Map<string, Player>): void => {
        this.players = p;
        players.set(this.sortedPlayers());
    }

    private setGuesses = (g: MessagePayload[]): void => {
        this.guesses = g;
        guesses.set(this.guesses);
    }

    private addPlayer = (p: Player): void => {
        this.players.set(p.id, p);
        players.set(Array.from(this.players.values()));
    }

    private removePlayer = (id: string): void => {
        this.players.delete(id);
        players.set(Array.from(this.players.values()));
    }

    private addGuess(message: MessagePayload): void {
        this.guesses.push(message);
        guesses.set(this.guesses);
    }

    private clearGuesses(): void {
        this.guesses = [];
        guesses.set(this.guesses);
    }

    private addChat(message: MessagePayload): void {
        const msg = {
            player: this.players.get(message.player)?.name,
            message: message.message,
        } as MessagePayload;
        this.chat.push(msg);
        chat.set(this.chat);
    }

    private clearScores(): void {
        this.players.forEach((player) => {
            player.score = 0;
        });
        players.set(Array.from(this.players.values()));
    }

    public clearBoard = () => {
        Board.getInstance().clearBack();
        this.sendMessage(Action.ClearBoard);
    }

    public changeColor = (color: string): void => {
        Board.getInstance().changeColor(color);
        this.sendMessage(Action.ChangeColor, color);
    }

    public changeLineWidth = (width: number): void => {
        Board.getInstance().changeLineWidth(width);
        this.sendMessage(Action.ChangePencilSize, width);
    }

    public changeEraserWidth = (width: number): void => {
        Board.getInstance().changeEraserWidth(width);
        this.sendMessage(Action.ChangeEraserSize, width);
    }

    public saveImage = (): void => {
        Board.getInstance().saveImage();
    }
}
