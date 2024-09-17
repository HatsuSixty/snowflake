export class Vector2 {
    x: number;
    y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export function fillRect(
    ctx: CanvasRenderingContext2D, 
    position: Vector2,
    size: Vector2, 
    style: string,
) {
    ctx.fillStyle = style;
    ctx.fillRect(position.x, position.y, size.x, size.y);
}

export function fillLine(
    ctx: CanvasRenderingContext2D, 
    startPos: Vector2, endPos: Vector2, 
    thickness: number, style: string,
) {
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.lineWidth = thickness;
    ctx.stroke();
}

export function createCanvas(
    parent: HTMLElement, 
    className: string,
    width: number, 
    height: number
): CanvasRenderingContext2D {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.className = className;

    parent.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (ctx === null) {
        throw "Canvas 2D context is not available";
    }

    return ctx;
}

export function createLoop(
    ctx: CanvasRenderingContext2D,
    updateFunction: (ctx: CanvasRenderingContext2D, timestamp: number) => void,
) {
    let prev_timestamp: number | null = null;

    function frame(timestamp: number) {
        if (prev_timestamp === null) {
            prev_timestamp = timestamp;
            window.requestAnimationFrame(frame);
            return;
        }

        updateFunction(ctx, timestamp - prev_timestamp);

        prev_timestamp = timestamp;
        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
}