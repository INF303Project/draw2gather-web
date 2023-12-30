import { Board } from "$lib/board";
import { Action, publishMessage } from "$lib/game";
import type { Point } from "$lib/game";

export abstract class Utility {
    protected readonly board: Board = Board.getInstance();
    protected startPoint: Point = { x: 0, y: 0 };
    protected isActive: boolean = false;
    protected buffer: number[] = [];

    protected timeout = (): void => {
        if (this.buffer.length > 0) {
            publishMessage(Action.Erase, this.buffer);
            this.buffer = [];
        }
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

export class FreeDraw extends Utility {
    private timer: number | undefined;

    onMouseDown = (e: MouseEvent): void => {
        const point = this.board.getMousePosition(e);
        this.isActive = true;
        this.board.setPencil(point);
        this.board.freeDraw(point);
        this.buffer.push(point.x, point.y);
        this.timer = window.setInterval(this.timeout, 1000);
    }

    onMouseMove = (e: MouseEvent): void => {
        if (this.isActive) {
            const point = this.board.getMousePosition(e);
            this.board.freeDraw(point);

            this.buffer.push(point.x, point.y);
            if (this.buffer.length == 32) {
                window.clearInterval(this.timer);
                this.timer = window.setInterval(this.timeout, 1000);

                publishMessage(Action.FreeDraw, this.buffer);
                this.buffer = [this.buffer.at(-2)!, this.buffer.at(-1)!];
            }
        }
    }

    onMouseUp = (e: MouseEvent): void => {
        window.clearInterval(this.timer);
        this.isActive = false;
        if (this.buffer.length > 0) {
            publishMessage(Action.FreeDraw, this.buffer);
            this.buffer = [];
        }
    }

    onTouchStart = (e: TouchEvent): void => {
        const point = this.board.getTouchPosition(e);
        this.isActive = true;
        this.board.setPencil(point);
        this.board.freeDraw(point);
        this.buffer.push(point.x, point.y);
        this.timer = window.setInterval(this.timeout, 1000);
    }

    onTouchMove = (e: TouchEvent): void => {
        if (this.isActive) {
            const point = this.board.getTouchPosition(e);
            this.board.freeDraw(point);

            this.buffer.push(point.x, point.y);
            if (this.buffer.length == 32) {
                window.clearInterval(this.timer);
                this.timer = window.setInterval(this.timeout, 1000);

                publishMessage(Action.FreeDraw, this.buffer);
                this.buffer = [this.buffer.at(-2)!, this.buffer.at(-1)!];
            }
        }
    }

    onTouchEnd = (e: TouchEvent): void => {
        window.clearInterval(this.timer);
        this.isActive = false;
        if (this.buffer.length > 0) {
            publishMessage(Action.FreeDraw, this.buffer);
            this.buffer = [];
        }
    }
}

export class Eraser extends Utility {
    private timer: number | undefined;

    onMouseDown = (e: MouseEvent): void => {
        const point = this.board.getMousePosition(e);
        this.isActive = true;
        this.board.erase(point);
        this.buffer.push(point.x, point.y);
        this.timer = window.setInterval(this.timeout, 1000);
    }

    onMouseMove = (e: MouseEvent): void => {
        const point = this.board.getMousePosition(e);
        this.board.showEraser(point);
        if (this.isActive) {
            this.board.erase(point);

            this.buffer.push(point.x, point.y);
            if (this.buffer.length == 32) {
                window.clearInterval(this.timer);
                this.timer = window.setInterval(this.timeout, 1000);

                publishMessage(Action.Erase, this.buffer);
                this.buffer = [];
            }
        }
    }

    onMouseUp = (e: MouseEvent): void => {
        window.clearInterval(this.timer);
        this.isActive = false;
        if (this.buffer.length > 0) {
            publishMessage(Action.Erase, this.buffer);
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
        this.timer = window.setInterval(this.timeout, 1000);
    }

    onTouchMove = (e: TouchEvent): void => {
        const point = this.board.getTouchPosition(e);
        this.board.showEraser(point);
        if (this.isActive) {
            this.board.erase(point);

            this.buffer.push(point.x, point.y);
            if (this.buffer.length == 32) {
                window.clearInterval(this.timer);
                this.timer = window.setInterval(this.timeout, 1000);

                publishMessage(Action.Erase, this.buffer);
                this.buffer = [];
            }
        }
    }

    onTouchEnd = (e: TouchEvent): void => {
        this.board.clearFront();
        window.clearInterval(this.timer);
        this.isActive = false;
        if (this.buffer.length > 0) {
            publishMessage(Action.Erase, this.buffer);
            this.buffer = [];
        }
    }
}

export class LineDraw extends Utility {
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
            publishMessage(Action.LineDraw, {
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
            publishMessage(Action.LineDraw, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }
}

export class RectDraw extends Utility {
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
            publishMessage(Action.RectDraw, {
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
            publishMessage(Action.RectDraw, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }
}

export class RectFill extends Utility {
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
            publishMessage(Action.RectFill, {
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
            publishMessage(Action.RectFill, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }
}

export class CircleDraw extends Utility {
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
            publishMessage(Action.CircleDraw, {
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
            publishMessage(Action.CircleDraw, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }
}

export class CircleFill extends Utility {
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
            publishMessage(Action.CircleFill, {
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
            publishMessage(Action.CircleFill, {
                start: this.startPoint,
                end: point,
            });
        }
        this.isActive = false;
    }
}

export class ColorPicker extends Utility {
    onMouseDown = (e: MouseEvent): void => {
        const point = this.board.getMousePosition(e);
        const color = this.board.getColor(point);
        this.board.changeColor(color);
        publishMessage(Action.ChangeColor, color)
    }

    onMouseMove = (e: MouseEvent): void => {

    }

    onMouseUp = (e: MouseEvent): void => {

    }

    onTouchStart = (e: TouchEvent): void => {
        const point = this.board.getTouchPosition(e);
        const color = this.board.getColor(point);
        this.board.changeColor(color);
        publishMessage(Action.ChangeColor, color)
    }

    onTouchMove = (e: TouchEvent): void => {

    }

    onTouchEnd = (e: TouchEvent): void => {

    }
}
