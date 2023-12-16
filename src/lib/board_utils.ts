import { DEFAULT_DRAW_COLOR, DEFAULT_ERASER_WIDTH, DEFAULT_LINE_WIDTH, boardColor, pencilWidth, eraserWidth, guesses, messages } from "./stores";

interface Point {
    x: number;
    y: number;
}

export enum Action {
    FreeDraw,
    Erase,
    LineDraw,
    RectDraw,
    RectFill,
    CircleDraw,
    CircleFill,
    ChangeColor,
    ChangePencilSize,
    ChangeEraserSize,
    ClearBoard,
    Guess,
    Chat,
}

export type Utility =
    "FreeDraw"
    | "Eraser"
    | "LineDraw"
    | "RectDraw"
    | "RectFill"
    | "CircleDraw"
    | "CircleFill"
    | "ColorPicker"
    | undefined;

class Board {
    private readonly frontCanvas: HTMLCanvasElement = document.querySelector("#front")!;
    private readonly backCanvas: HTMLCanvasElement = document.querySelector("#back")!;
    private readonly frontCtx: CanvasRenderingContext2D = this.frontCanvas.getContext('2d')!;
    private readonly backCtx: CanvasRenderingContext2D = this.backCanvas.getContext('2d')!;
    private drawColor: string = DEFAULT_DRAW_COLOR;
    private lineWidth: number = DEFAULT_LINE_WIDTH;
    private eraserWidth: number = DEFAULT_ERASER_WIDTH;
    readonly socket: WebSocket = new WebSocket("ws://192.168.0.10:8080/game");

    private static instance: Board;

    private constructor() {
        this.frontCtx.lineWidth = this.lineWidth;
        this.frontCtx.strokeStyle = this.drawColor;
        this.frontCtx.fillStyle = this.drawColor;
        this.frontCtx.lineCap = "round";
        this.frontCtx.lineJoin = "round";

        this.backCtx.lineWidth = this.lineWidth;
        this.backCtx.strokeStyle = this.drawColor;
        this.backCtx.fillStyle = this.drawColor;
        this.backCtx.lineCap = "round";
        this.backCtx.lineJoin = "round";

        this.socket.onmessage = this.messageHandler;
    }

    public static getInstance = (): Board => {
        if (!Board.instance) {
            Board.instance = new Board();
        }
        return Board.instance;
    }

    private messageHandler = (e: MessageEvent): void => {
        const msg = JSON.parse(e.data);
        const action = JSON.parse(msg.payload);
        switch (msg.action) {
            case Action.FreeDraw:
                this.freeDrawBuffered(action.points);
                break;
            case Action.Erase:
                this.eraseBuffered(action.points);
                break;
            case Action.LineDraw:
                this.drawLineBack(action.start, action.end);
                break;
            case Action.RectDraw:
                this.drawRectBack(action.start, action.end);
                break;
            case Action.RectFill:
                this.fillRectBack(action.start, action.end);
                break;
            case Action.CircleDraw:
                this.drawCircleBack(action.start, action.end);
                break;
            case Action.CircleFill:
                this.fillCircleBack(action.start, action.end);
                break;
            case Action.ChangeColor:
                this.changeColor(action.value);
                break;
            case Action.ChangePencilSize:
                this.changeLineWidth(action.value);
                break;
            case Action.ChangeEraserSize:
                this.changeEraserWidth(action.value);
                break;
            case Action.ClearBoard:
                this.clearBack();
                break;
            case Action.Guess:
                guesses.update((guesses) => {
                    return [...guesses, { name: "user", message: action.value }];
                });
                break;
            case Action.Chat:
                messages.update((messages) => {
                    return [...messages, { name: "user", message: action.value }];
                });
                break;
            default:
                console.error("not allowed");
                break;
        }
    }

    public getMousePosition = (event: MouseEvent): Point => {
        const rect = this.frontCanvas.getBoundingClientRect();
        const x = Math.round((event.clientX - rect.left) / (rect.right - rect.left) * this.frontCanvas.width);
        const y = Math.round((event.clientY - rect.top) / (rect.bottom - rect.top) * this.frontCanvas.height);
        return { x, y };
    }

    public getTouchPosition = (event: TouchEvent): Point => {
        const rect = this.frontCanvas.getBoundingClientRect();
        const x = Math.round((event.changedTouches[0].clientX - rect.left) / (rect.right - rect.left) * this.frontCanvas.width);
        const y = Math.round((event.changedTouches[0].clientY - rect.top) / (rect.bottom - rect.top) * this.frontCanvas.height);
        return { x, y };
    }

    public showEraser = (point: Point): void => {
        const style = this.frontCtx.strokeStyle;
        const width = this.frontCtx.lineWidth;
        this.frontCtx.strokeStyle = "black";
        this.frontCtx.lineWidth = 1;
        this.clearFront();
        this.frontCtx.strokeRect(point.x - this.eraserWidth / 2, point.y - this.eraserWidth / 2,
            this.eraserWidth, this.eraserWidth);
        this.frontCtx.strokeStyle = style;
        this.frontCtx.lineWidth = width;
    }

    public setPencil = (point: Point): void => {
        this.backCtx.beginPath();
        this.backCtx.moveTo(point.x, point.y);
    }

    public freeDraw = (point: Point): void => {
        this.backCtx.lineTo(point.x, point.y);
        this.backCtx.stroke();
    }

    public freeDrawBuffered = (points: number[]): void => {
        this.backCtx.beginPath();
        for (let i = 0; i < points.length / 2; i++) {
            if (i == 0) {
                this.backCtx.moveTo(points[2 * i], points[2 * i + 1]);
                this.backCtx.lineTo(points[2 * i], points[2 * i + 1]);
            } else {
                this.backCtx.lineTo(points[2 * i], points[2 * i + 1]);
            }
            this.backCtx.stroke();
        }
    }

    public erase = (point: Point): void => {
        this.backCtx.clearRect(point.x - this.eraserWidth / 2, point.y - this.eraserWidth / 2,
            this.eraserWidth, this.eraserWidth);
    }

    public eraseBuffered = (points: number[]): void => {
        for (let i = 0; i < points.length / 2; i++) {
            this.backCtx.clearRect(points[2 * i] - this.eraserWidth / 2, points[2 * i + 1] - this.eraserWidth / 2,
                this.eraserWidth, this.eraserWidth);
        }
    }

    public drawLineFront = (start: Point, end: Point): void => {
        this.frontCtx.beginPath();
        this.frontCtx.moveTo(start.x, start.y);
        this.frontCtx.lineTo(end.x, end.y);
        this.frontCtx.stroke();
    }

    public drawLineBack = (start: Point, end: Point): void => {
        this.backCtx.beginPath();
        this.backCtx.moveTo(start.x, start.y);
        this.backCtx.lineTo(end.x, end.y);
        this.backCtx.stroke();
    }

    public drawRectFront = (start: Point, end: Point): void => {
        this.frontCtx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    }

    public drawRectBack = (start: Point, end: Point): void => {
        this.backCtx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    }

    public fillRectFront = (start: Point, end: Point): void => {
        this.frontCtx.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
    }

    public fillRectBack = (start: Point, end: Point): void => {
        this.backCtx.fillRect(start.x, start.y, end.x - start.x, end.y - start.y);
    }

    public drawCircleFront = (start: Point, end: Point): void => {
        this.frontCtx.beginPath();
        this.frontCtx.arc(start.x, start.y, Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2), 0, 2 * Math.PI);
        this.frontCtx.stroke();
    }

    public drawCircleBack = (start: Point, end: Point): void => {
        this.backCtx.beginPath();
        this.backCtx.arc(start.x, start.y, Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2), 0, 2 * Math.PI);
        this.backCtx.stroke();
    }

    public fillCircleFront = (start: Point, end: Point): void => {
        this.frontCtx.beginPath();
        this.frontCtx.arc(start.x, start.y, Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2), 0, 2 * Math.PI);
        this.frontCtx.fill();
    }

    public fillCircleBack = (start: Point, end: Point): void => {
        this.backCtx.beginPath();
        this.backCtx.arc(start.x, start.y, Math.sqrt((end.x - start.x) ** 2 + (end.y - start.y) ** 2), 0, 2 * Math.PI);
        this.backCtx.fill();
    }

    public changeColor = (color: string): void => {
        this.drawColor = color;
        this.frontCtx.strokeStyle = color;
        this.frontCtx.fillStyle = color;
        this.backCtx.strokeStyle = color;
        this.backCtx.fillStyle = color;
        boardColor.set(color);
    }

    public changeLineWidth = (width: number): void => {
        this.lineWidth = width;
        this.frontCtx.lineWidth = width;
        this.backCtx.lineWidth = width;
        pencilWidth.set(width);
    }

    public changeEraserWidth = (width: number): void => {
        this.eraserWidth = width;
        eraserWidth.set(width);
    }

    public clearFront = (): void => {
        this.frontCtx.clearRect(0, 0, this.frontCanvas.width, this.frontCanvas.height);
    }

    public clearBack = (): void => {
        this.backCtx.clearRect(0, 0, this.backCanvas.width, this.backCanvas.height);
    }

    public saveImage = (): void => {
        let link = document.createElement('a');
        link.href = this.backCanvas.toDataURL("image/png");
        link.download = `canvas`;
        link.click();
        link.remove();
    }

    public getColor = (point: Point): string => {
        const data = this.backCtx.getImageData(point.x, point.y, 1, 1).data;
        if (data[3] == 0) {
            return this.drawColor;
        }
        return `#${data[0].toString(16).padStart(2, '0')}${data[1].toString(16).padStart(2, '0')}${data[2].toString(16).padStart(2, '0')}`
    }
}

export abstract class BoardUtility {
    protected readonly board: Board = Board.getInstance();
    protected startPoint: Point = { x: 0, y: 0 };
    protected isActive: boolean = false;
    protected buffer: number[] = [];
    public type: Utility;

    public sendMessage = (action: Action, payload: any): void => {
        this.board.socket.send(JSON.stringify({
            action: action,
            payload: JSON.stringify(payload),
        }));
    }

    public changePencilSize = (e: Event): void => {
        const value = Number((e.target as HTMLInputElement).value);
        this.board.changeLineWidth(value);
        this.sendMessage(Action.ChangePencilSize, { value });
    }

    public changeEraserSize = (e: Event): void => {
        const value = Number((e.target as HTMLInputElement).value);
        this.board.changeEraserWidth(value);
        this.sendMessage(Action.ChangeEraserSize, { value });
    }

    public changeColor = (e: Event): void => {
        const value = (e.target as HTMLInputElement).value;
        this.board.changeColor(value);
        this.sendMessage(Action.ChangeColor, { value });
    }

    public clear = (): void => {
        this.board.clearBack();
        this.sendMessage(Action.ClearBoard, {});
    }

    public save = (): void => {
        this.board.saveImage();
    }

    abstract onMouseDown(e: MouseEvent): void;
    abstract onMouseMove(e: MouseEvent): void;
    abstract onMouseUp(e: MouseEvent): void;

    abstract onTouchStart(e: TouchEvent): void;
    abstract onTouchMove(e: TouchEvent): void;
    abstract onTouchEnd(e: TouchEvent): void;

    onMouseLeave = (e: MouseEvent): void => { }
    onTouchCancel = (e: TouchEvent): void => { }
}

export class FreeDraw extends BoardUtility {
    private static instance: FreeDraw;
    private timer: number | undefined;

    private constructor() {
        super();
        this.type = "FreeDraw";
    }

    public static getInstance = (): FreeDraw => {
        if (!FreeDraw.instance) {
            FreeDraw.instance = new FreeDraw();
        }
        return FreeDraw.instance;
    }

    private timeout = (): void => {
        if (this.buffer.length > 0) {
            this.sendMessage(Action.FreeDraw, { points: this.buffer });
            this.buffer = [];
        }
    }

    onMouseDown = (e: MouseEvent): void => {
        const point = this.board.getMousePosition(e);
        this.isActive = true;
        this.board.setPencil(point);
        this.board.freeDraw(point);
        this.buffer.push(point.x, point.y);
        this.timer = setInterval(this.timeout, 1000);
    }

    onMouseMove = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.freeDraw(point);

            this.buffer.push(point.x, point.y);
            if (this.buffer.length == 32) {
                clearInterval(this.timer);
                this.timer = setInterval(this.timeout, 1000);

                this.sendMessage(Action.FreeDraw, { points: this.buffer });
                this.buffer = [this.buffer.at(-2)!, this.buffer.at(-1)!];
            }
        }
    }

    onMouseUp = (e: MouseEvent): void => {
        clearInterval(this.timer);
        this.isActive = false;
        if (this.buffer.length > 0) {
            this.sendMessage(Action.FreeDraw, { points: this.buffer });
            this.buffer = [];
        }
    }

    onTouchStart = (e: TouchEvent): void => {
        const point = this.board.getTouchPosition(e);
        this.isActive = true;
        this.board.setPencil(point);
        this.board.freeDraw(point);
        this.buffer.push(point.x, point.y);
        this.timer = setInterval(this.timeout, 1000);
    }

    onTouchMove = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.freeDraw(point);

            this.buffer.push(point.x, point.y);
            if (this.buffer.length == 32) {
                clearInterval(this.timer);
                this.timer = setInterval(this.timeout, 1000);

                this.sendMessage(Action.FreeDraw, { points: this.buffer });
                this.buffer = [this.buffer.at(-2)!, this.buffer.at(-1)!];
            }
        }
    }

    onTouchEnd = (e: TouchEvent): void => {
        clearInterval(this.timer);
        this.isActive = false;
        if (this.buffer.length > 0) {
            this.sendMessage(Action.FreeDraw, { points: this.buffer });
            this.buffer = [];
        }
    }
}

export class Eraser extends BoardUtility {
    private static instance: Eraser;
    private timer: number | undefined;

    private constructor() {
        super();
        this.type = "Eraser";
    }

    public static getInstance = (): Eraser => {
        if (!Eraser.instance) {
            Eraser.instance = new Eraser();
        }
        return Eraser.instance;
    }

    private timeout = (): void => {
        if (this.buffer.length > 0) {
            this.sendMessage(Action.Erase, { points: this.buffer });
            this.buffer = [];
        }
    }

    onMouseDown = (e: MouseEvent): void => {
        const point = this.board.getMousePosition(e);
        this.isActive = true;
        this.board.erase(point);
        this.buffer.push(point.x, point.y);
        this.timer = setInterval(this.timeout, 1000);
    }

    onMouseMove = (e: MouseEvent): void => {
        const point = this.board.getMousePosition(e);
        this.board.showEraser(point);
        if (this.isActive) {
            this.board.erase(point);

            this.buffer.push(point.x, point.y);
            if (this.buffer.length == 32) {
                clearInterval(this.timer);
                this.timer = setInterval(this.timeout, 1000);

                this.sendMessage(Action.Erase, { points: this.buffer });
                this.buffer = [];
            }
        }
    }

    onMouseUp = (e: MouseEvent): void => {
        clearInterval(this.timer);
        this.isActive = false;
        if (this.buffer.length > 0) {
            this.sendMessage(Action.Erase, { points: this.buffer });
            this.buffer = [];
        }
    }

    onMouseLeave = (e: MouseEvent): void => {
        this.board.clearFront();
    }

    onTouchStart = (e: TouchEvent): void => {
        const point = this.board.getTouchPosition(e);
        this.isActive = true;
        this.board.erase(point);
        this.buffer.push(point.x, point.y);
        this.timer = setInterval(this.timeout, 1000);
    }

    onTouchMove = (e: TouchEvent): void => {
        const point = this.board.getTouchPosition(e);
        this.board.showEraser(point);
        if (this.isActive) {
            this.board.erase(point);

            this.buffer.push(point.x, point.y);
            if (this.buffer.length == 32) {
                clearInterval(this.timer);
                this.timer = setInterval(this.timeout, 1000);

                this.sendMessage(Action.Erase, { points: this.buffer });
                this.buffer = [];
            }
        }
    }

    onTouchEnd = (e: TouchEvent): void => {
        this.board.clearFront();
        clearInterval(this.timer);
        this.isActive = false;
        if (this.buffer.length > 0) {
            this.sendMessage(Action.Erase, { points: this.buffer });
            this.buffer = [];
        }
    }
}

export class LineDraw extends BoardUtility {
    private static instance: LineDraw;

    private constructor() {
        super();
        this.type = "LineDraw";
    }

    public static getInstance = (): LineDraw => {
        if (!LineDraw.instance) {
            LineDraw.instance = new LineDraw();
        }
        return LineDraw.instance;
    }

    onMouseDown = (e: MouseEvent): void => {
        this.startPoint = this.board.getMousePosition(e);
        this.isActive = true;
    }

    onMouseMove = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.clearFront();
            this.board.drawLineFront(this.startPoint, point);
        }
    }

    onMouseUp = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.clearFront();
            this.board.drawLineBack(this.startPoint, point);
            this.sendMessage(Action.LineDraw, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }

    onTouchStart = (e: TouchEvent): void => {
        this.startPoint = this.board.getTouchPosition(e);
        this.isActive = true;
    }

    onTouchMove = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.clearFront();
            this.board.drawLineFront(this.startPoint, point);
        }
    }

    onTouchEnd = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.clearFront();
            this.board.drawLineBack(this.startPoint, point);
            this.sendMessage(Action.LineDraw, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }
}

export class RectDraw extends BoardUtility {
    private static instance: RectDraw;

    private constructor() {
        super();
        this.type = "RectDraw";
    }

    public static getInstance = (): RectDraw => {
        if (!RectDraw.instance) {
            RectDraw.instance = new RectDraw();
        }
        return RectDraw.instance;
    }

    onMouseDown = (e: MouseEvent): void => {
        this.startPoint = this.board.getMousePosition(e);
        this.isActive = true;
    }

    onMouseMove = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.clearFront();
            this.board.drawRectFront(this.startPoint, point);
        }
    }

    onMouseUp = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.clearFront();
            this.board.drawRectBack(this.startPoint, point);
            this.sendMessage(Action.RectDraw, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }

    onTouchStart = (e: TouchEvent): void => {
        this.startPoint = this.board.getTouchPosition(e);
        this.isActive = true;
    }

    onTouchMove = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.clearFront();
            this.board.drawRectFront(this.startPoint, point);
        }
    }

    onTouchEnd = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.clearFront();
            this.board.drawRectBack(this.startPoint, point);
            this.sendMessage(Action.RectDraw, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }
}

export class RectFill extends BoardUtility {
    private static instance: RectFill;

    private constructor() {
        super();
        this.type = "RectFill";
    }

    public static getInstance = (): RectFill => {
        if (!RectFill.instance) {
            RectFill.instance = new RectFill();
        }
        return RectFill.instance;
    }

    onMouseDown = (e: MouseEvent): void => {
        this.startPoint = this.board.getMousePosition(e);
        this.isActive = true;
    }

    onMouseMove = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.clearFront();
            this.board.fillRectFront(this.startPoint, point);
        }
    }

    onMouseUp = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.clearFront();
            this.board.fillRectBack(this.startPoint, point);
            this.sendMessage(Action.RectFill, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }

    onTouchStart = (e: TouchEvent): void => {
        this.startPoint = this.board.getTouchPosition(e);
        this.isActive = true;
    }

    onTouchMove = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.clearFront();
            this.board.fillRectFront(this.startPoint, point);
        }
    }

    onTouchEnd = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.clearFront();
            this.board.fillRectBack(this.startPoint, point);
            this.sendMessage(Action.RectFill, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }
}

export class CircleDraw extends BoardUtility {
    private static instance: CircleDraw;

    private constructor() {
        super();
        this.type = "CircleDraw";
    }

    public static getInstance(): CircleDraw {
        if (!CircleDraw.instance) {
            CircleDraw.instance = new CircleDraw();
        }
        return CircleDraw.instance;
    }

    onMouseDown = (e: MouseEvent): void => {
        this.isActive = true;
        this.startPoint = this.board.getMousePosition(e);
    }

    onMouseMove = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.clearFront();
            this.board.drawCircleFront(this.startPoint, point);
        }
    }

    onMouseUp = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.clearFront();
            this.board.drawCircleBack(this.startPoint, point);
            this.sendMessage(Action.CircleDraw, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }

    onTouchStart = (e: TouchEvent): void => {
        this.isActive = true;
        this.startPoint = this.board.getTouchPosition(e);
    }

    onTouchMove = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.clearFront();
            this.board.drawCircleFront(this.startPoint, point);
        }
    }

    onTouchEnd = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.clearFront();
            this.board.drawCircleBack(this.startPoint, point);
            this.sendMessage(Action.CircleDraw, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }
}

export class CircleFill extends BoardUtility {
    private static instance: CircleFill;

    private constructor() {
        super();
        this.type = "CircleFill";
    }

    public static getInstance(): CircleFill {
        if (!CircleFill.instance) {
            CircleFill.instance = new CircleFill();
        }
        return CircleFill.instance;
    }

    onMouseDown = (e: MouseEvent): void => {
        this.isActive = true;
        this.startPoint = this.board.getMousePosition(e);
    }

    onMouseMove = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.clearFront();
            this.board.fillCircleFront(this.startPoint, point);
        }
    }

    onMouseUp = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.clearFront();
            this.board.fillCircleBack(this.startPoint, point);
            this.sendMessage(Action.CircleFill, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }

    onTouchStart = (e: TouchEvent): void => {
        this.isActive = true;
        this.startPoint = this.board.getTouchPosition(e);
    }

    onTouchMove = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.clearFront();
            this.board.fillCircleFront(this.startPoint, point);
        }
    }

    onTouchEnd = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.clearFront();
            this.board.fillCircleBack(this.startPoint, point);
            this.sendMessage(Action.CircleFill, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }
}

export class ColorPicker extends BoardUtility {
    private static instance: ColorPicker;

    private constructor() {
        super();
        this.type = "ColorPicker";
    }

    public static getInstance(): ColorPicker {
        if (!ColorPicker.instance) {
            ColorPicker.instance = new ColorPicker();
        }
        return ColorPicker.instance;
    }

    onMouseDown = (e: MouseEvent): void => {
        const point = this.board.getMousePosition(e);
        const color = this.board.getColor(point);
        this.board.changeColor(color);
        this.sendMessage(Action.ChangeColor, { value: color })
    }

    onMouseMove = (e: MouseEvent): void => {

    }

    onMouseUp = (e: MouseEvent): void => {

    }

    onTouchStart = (e: TouchEvent): void => {
        const point = this.board.getTouchPosition(e);
        const color = this.board.getColor(point);
        this.board.changeColor(color);
        this.sendMessage(Action.ChangeColor, { value: color })
    }

    onTouchMove = (e: TouchEvent): void => {

    }

    onTouchEnd = (e: TouchEvent): void => {

    }
}
