"use strict";
import * as renderer from "./renderer.mjs";
const WIDTH = 640;
const HEIGHT = 480;
// Initialized on main
let snowflake = undefined;
class Snowflake {
    constructor() {
        this.branchCount = 3;
        this.branchLength = 100;
        this.branchThickness = 5;
        this.branchHue = 0;
        this.branchAngle = 2 * Math.PI / this.branchCount;
        this.deepness = 3;
        this.changeFactor = 0.5;
        this.hueChangeFactor = 0.5;
    }
    setBranchCount(x) {
        this.branchCount = x;
        this.branchAngle = 2 * Math.PI / this.branchCount;
    }
    setBranchLength(x) { this.branchLength = x; }
    setBranchThickness(x) { this.branchThickness = x; }
    setBranchHue(x) { this.branchHue = x; }
    setDeepness(x) { this.deepness = x; }
    setChangeFactor(x) { this.changeFactor = x; }
    setHueChangeFactor(x) { this.hueChangeFactor = x; }
    getBranchCount() { return this.branchCount; }
    getBranchLength() { return this.branchLength; }
    getBranchThickness() { return this.branchThickness; }
    getBranchHue() { return this.branchHue; }
    getDeepness() { return this.deepness; }
    getChangeFactor() { return this.changeFactor; }
    getHueChangeFactor() { return this.hueChangeFactor; }
    draw(ctx, position, deepness = this.deepness, branchLength = this.branchLength, branchThickness = this.branchThickness, branchHue = this.branchHue) {
        if (deepness <= 0)
            return;
        for (let i = 0; i < this.branchCount; ++i) {
            const endPos = new renderer.Vector2(position.x + Math.cos(i * this.branchAngle) * branchLength, position.y + Math.sin(i * this.branchAngle) * branchLength);
            renderer.fillLine(ctx, position, endPos, branchThickness, `hsl(${branchHue}, 100%, 50%)`);
            this.draw(ctx, endPos, deepness - 1, branchLength * this.changeFactor, branchThickness * this.changeFactor, (branchHue + this.hueChangeFactor * this.hueChangeFactor * 360) % 360);
        }
    }
}
function update(ctx, dt) {
    if (snowflake === undefined) {
        throw "Global snowflake not initialized";
    }
    renderer.fillRect(ctx, new renderer.Vector2(0, 0), new renderer.Vector2(WIDTH, HEIGHT), "#181818");
    snowflake.draw(ctx, new renderer.Vector2(WIDTH / 2, HEIGHT / 2));
}
function createSlider(name, min, max, value, callback) {
    const sliderContainer = document.createElement("p");
    sliderContainer.innerHTML = name;
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = `${min}`;
    slider.max = `${max}`;
    slider.value = `${value}`;
    slider.oninput = function () {
        callback(Number(this.value));
    };
    sliderContainer.appendChild(slider);
    return sliderContainer;
}
function createCounter(name, min, value, callback) {
    const counterContainer = document.createElement("p");
    counterContainer.innerHTML = name;
    const counter = document.createElement("input");
    counter.type = "number";
    counter.min = `${min}`;
    counter.value = `${value}`;
    counter.oninput = function () {
        callback(Number(this.value));
    };
    counterContainer.appendChild(counter);
    return counterContainer;
}
function createUI(parent, ctx) {
    if (snowflake === undefined) {
        throw "Global snowflake not initialized";
    }
    const title = document.createElement("h1");
    title.innerHTML = "Snowflake parameters:";
    parent.appendChild(title);
    const warning = document.createElement("p");
    warning.innerHTML = `⚠️ WARNING: The snowflake is drawn <b>recursively</b>. This means that the more detail you add to the snowflake, the slower it gets to render. Use these parameters with caution!`;
    parent.appendChild(warning);
    parent.appendChild(createCounter("Branch count: ", 3, snowflake.getBranchCount(), (x) => {
        snowflake === null || snowflake === void 0 ? void 0 : snowflake.setBranchCount(x);
    }));
    parent.appendChild(createCounter("Branch length: ", 1, snowflake.getBranchLength(), (x) => {
        snowflake === null || snowflake === void 0 ? void 0 : snowflake.setBranchLength(x);
    }));
    parent.appendChild(createCounter("Branch thickness: ", 1, snowflake.getBranchThickness(), (x) => {
        snowflake === null || snowflake === void 0 ? void 0 : snowflake.setBranchThickness(x);
    }));
    parent.appendChild(createSlider("Branch hue: ", 0, 360, snowflake.getBranchHue(), (x) => {
        snowflake === null || snowflake === void 0 ? void 0 : snowflake.setBranchHue(x);
    }));
    parent.appendChild(createCounter("Deepness: ", 1, snowflake.getDeepness(), (x) => {
        snowflake === null || snowflake === void 0 ? void 0 : snowflake.setDeepness(x);
    }));
    parent.appendChild(createSlider("Change factor: ", 0, 100, snowflake.getChangeFactor() * 100, (x) => {
        snowflake === null || snowflake === void 0 ? void 0 : snowflake.setChangeFactor(x / 100);
    }));
    parent.appendChild(createSlider("Hue change factor: ", 0, 100, snowflake.getHueChangeFactor() * 100, (x) => {
        snowflake === null || snowflake === void 0 ? void 0 : snowflake.setHueChangeFactor(x / 100);
    }));
    const downloadButton = document.createElement("button");
    downloadButton.innerHTML = "Download";
    downloadButton.onclick = () => {
        const link = document.createElement('a');
        link.download = 'snowflake.png';
        link.href = ctx.canvas.toDataURL();
        link.click();
    };
    parent.appendChild(downloadButton);
}
function main() {
    snowflake = new Snowflake();
    const body = document.getElementById("body");
    if (body === null) {
        throw "Could not find element with ID `body`";
    }
    const title = document.createElement("h1");
    title.innerHTML = "Snowflake generator!";
    body.appendChild(title);
    const ctx = renderer.createCanvas(body, "snowflake-canvas", WIDTH, HEIGHT);
    createUI(body, ctx);
    renderer.createLoop(ctx, update);
}
main();
