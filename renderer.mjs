"use strict";
export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export function fillRect(ctx, position, size, style) {
    ctx.fillStyle = style;
    ctx.fillRect(position.x, position.y, size.x, size.y);
}
export function fillLine(ctx, startPos, endPos, thickness, style) {
    ctx.strokeStyle = style;
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(endPos.x, endPos.y);
    ctx.lineWidth = thickness;
    ctx.stroke();
}
export function createCanvas(parent, className, width, height) {
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
export function createLoop(ctx, updateFunction) {
    let prev_timestamp = null;
    function frame(timestamp) {
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
