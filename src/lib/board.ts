import type { Point } from "$lib/game";
import { boardColor, eraserWidth, pencilWidth } from "./stores";

export const DEFAULT_DRAW_COLOR = "#000000";
export const DEFAULT_LINE_WIDTH = 4;
export const DEFAULT_ERASER_WIDTH = 30;

export class Board {
    private readonly board: HTMLDivElement = document.querySelector("#board")!;
    private readonly frontCanvas: HTMLCanvasElement = document.querySelector("#front")!;
    private readonly backCanvas: HTMLCanvasElement = document.querySelector("#back")!;
    private readonly frontCtx: CanvasRenderingContext2D = this.frontCanvas.getContext('2d')!;
    private readonly backCtx: CanvasRenderingContext2D = this.backCanvas.getContext('2d')!;
    private drawColor: string = DEFAULT_DRAW_COLOR;
    private lineWidth: number = DEFAULT_LINE_WIDTH;
    private eraserWidth: number = DEFAULT_ERASER_WIDTH;
    private static instance: Board | undefined = undefined;

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
    }

    public static getInstance = (): Board => {
        if (!Board.instance) {
            Board.instance = new Board();
        }
        return Board.instance;
    }

    public hide = (): void => {
        this.board.classList.add("d-none");
    }

    public show = (): void => {
        this.board.classList.remove("d-none");
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
