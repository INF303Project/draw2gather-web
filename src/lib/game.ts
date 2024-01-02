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
            payload: value ? JSON.stringify({ value }) : undefined,
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
    private readonly socket: WebSocket = new WebSocket(`wss://${API_URL}/game`);

    constructor() {
        player.set("");
        state.set("waiting");
        owner.set("");
        currentPlayer.set("");
        players.set([]);
        guesses.set([]);
        chat.set([]);
        words.set([]);
        word.set("");
        answered.set(false);
        utility.set(undefined);
        boardColor.set(DEFAULT_DRAW_COLOR);
        pencilWidth.set(DEFAULT_LINE_WIDTH);
        eraserWidth.set(DEFAULT_ERASER_WIDTH);
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
                const board = Board.getInstance();
                const game = payload.value as GamePayload;
                this.setPlayer(game.player);
                this.setState(game.state);
                this.setPlayers(new Map(Object.entries(game.players)));
                this.setOwner(game.owner);
                this.setCurrentPlayer(game.currentPlayer);
                game.commands.forEach((msg) => {
                    const payload = msg.payload ? JSON.parse(msg.payload) as Payload : {} as Payload;
                    if (msg.action == Action.Guess) {
                        console.log(payload.value);
                        this.addGuess(payload.value);
                    } else {
                        this.handleBoardAction(msg.action, payload.value);
                    }
                })
                if (game.state == "drawing") {
                    board.show();
                }
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
            case Action.FreeDraw:
            case Action.Erase:
            case Action.LineDraw:
            case Action.RectDraw:
            case Action.RectFill:
            case Action.CircleDraw:
            case Action.CircleFill:
            case Action.ChangeColor:
            case Action.ChangePencilSize:
            case Action.ChangeEraserSize:
            case Action.ClearBoard:
                this.handleBoardAction(message.action, payload.value);
                break;
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
                this.reset();
                this.setCurrentPlayer("");
                this.clearScores();
                this.setState("waiting");
                break;
            case Action.Starting: {
                this.reset();
                const player = payload.value as string;
                this.setCurrentPlayer(player);
                this.setState("starting");
                break;
            }
            case Action.Picking:
                this.setState("picking");
                break;
            case Action.Drawing: {
                const board = Board.getInstance();
                board.clearBack();
                board.show();
                if (this.player == this.currentPlayer) {
                    utility.set(new FreeDraw());
                }
                this.setState("drawing");
                break;
            }
            case Action.Ending: {
                this.reset();
                this.setState("ending");
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

    private reset = (): void => {
        const board = Board.getInstance();
        board.hide();
        board.changeColor(DEFAULT_DRAW_COLOR);
        board.changeLineWidth(DEFAULT_LINE_WIDTH);
        board.changeEraserWidth(DEFAULT_ERASER_WIDTH);
        utility.set(undefined);
        words.set([]);
        word.set("");
        answered.set(false);
        this.clearGuesses();
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
        players.set(this.sortedPlayers());
    }

    private removePlayer = (id: string): void => {
        this.players.delete(id);
        players.set(this.sortedPlayers());
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

    private handleBoardAction = (action: Action, value: any) => {
        const board = Board.getInstance();
        switch (action) {
            case Action.FreeDraw:
                board.freeDrawBuffered(value);
                break;
            case Action.Erase:
                board.eraseBuffered(value);
                break;
            case Action.LineDraw:
                board.drawLineBack(value.start, value.end);
                break;
            case Action.RectDraw:
                board.drawRectBack(value.start, value.end);
                break;
            case Action.RectFill:
                board.fillRectBack(value.start, value.end);
                break;
            case Action.CircleDraw:
                board.drawCircleBack(value.start, value.end);
                break;
            case Action.CircleFill:
                board.fillCircleBack(value.start, value.end);
                break;
            case Action.ChangeColor:
                board.changeColor(value);
                break;
            case Action.ChangePencilSize:
                board.changeLineWidth(value);
                break;
            case Action.ChangeEraserSize:
                board.changeEraserWidth(value);
                break;
            case Action.ClearBoard:
                board.clearBack();
                break;
        }
    }

    public clearBoard = () => {
        const board = Board.getInstance();
        board.clearBack();
        this.sendMessage(Action.ClearBoard);
    }

    public changeColor = (color: string): void => {
        const board = Board.getInstance();
        board.changeColor(color);
        this.sendMessage(Action.ChangeColor, color);
    }

    public changeLineWidth = (width: number): void => {
        const board = Board.getInstance();
        board.changeLineWidth(width);
        this.sendMessage(Action.ChangePencilSize, width);
    }

    public changeEraserWidth = (width: number): void => {
        const board = Board.getInstance();
        board.changeEraserWidth(width);
        this.sendMessage(Action.ChangeEraserSize, width);
    }

    public saveImage = (): void => {
        const board = Board.getInstance();
        board.saveImage();
    }
}
