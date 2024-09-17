import * as renderer from "./renderer.mjs";

const WIDTH = 640;
const HEIGHT = 480;

// Initialized on main
let snowflake: Snowflake | undefined = undefined;

class Snowflake {
    private branchCount: number = 3;
    private branchLength: number = 100;
    private branchThickness: number = 5;
    private branchHue: number = 0;
    private branchAngle: number = 2*Math.PI/this.branchCount;

    private deepness: number = 3;
    private changeFactor: number = 0.5;
    private hueChangeFactor: number = 0.5;

    setBranchCount(x: number) {
        this.branchCount = x;
        this.branchAngle = 2*Math.PI/this.branchCount;
    }
    setBranchLength(x: number)    { this.branchLength = x; }
    setBranchThickness(x: number) { this.branchThickness = x; }
    setBranchHue(x: number)       { this.branchHue = x; }
    setDeepness(x: number)        { this.deepness = x; }
    setChangeFactor(x: number)    { this.changeFactor = x; }
    setHueChangeFactor(x: number) { this.hueChangeFactor = x; }

    getBranchCount()     { return this.branchCount; }
    getBranchLength()    { return this.branchLength; }
    getBranchThickness() { return this.branchThickness; }
    getBranchHue()       { return this.branchHue; }
    getDeepness()        { return this.deepness; }
    getChangeFactor()    { return this.changeFactor; }
    getHueChangeFactor() { return this.hueChangeFactor; }

    draw(
        ctx: CanvasRenderingContext2D, 
        position: renderer.Vector2,
        deepness: number = this.deepness,
        branchLength: number = this.branchLength,
        branchThickness: number = this.branchThickness,
        branchHue: number = this.branchHue,
    ) {
        if (deepness <= 0) return;
        
        for (let i = 0; i < this.branchCount; ++i) {
            const endPos = new renderer.Vector2(
                position.x + Math.cos(i*this.branchAngle)*branchLength,
                position.y + Math.sin(i*this.branchAngle)*branchLength,
            );

            renderer.fillLine(
                ctx,
                position, endPos, 
                branchThickness, `hsl(${branchHue}, 100%, 50%)`,
            );

            this.draw(
                ctx, endPos,
                deepness - 1,
                branchLength*this.changeFactor,
                branchThickness*this.changeFactor,
                (branchHue + this.hueChangeFactor*this.hueChangeFactor*360)%360,
            );
        }
    }
}

function update(ctx: CanvasRenderingContext2D, dt: number) {
    if (snowflake === undefined) {
        throw "Global snowflake not initialized";
    }

    renderer.fillRect(
        ctx,
        new renderer.Vector2(0, 0), 
        new renderer.Vector2(WIDTH, HEIGHT),
        "#181818",
    );

    snowflake.draw(ctx, new renderer.Vector2(WIDTH / 2, HEIGHT / 2));
}

function createSlider(
    name: string, 
    min: number, 
    max: number, 
    value: number,
    callback: (x: number) => void,
): HTMLParagraphElement {
    const sliderContainer = document.createElement("p");
    sliderContainer.innerHTML = name;

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = `${min}`;
    slider.max = `${max}`;
    slider.value = `${value}`;
    slider.oninput = function() {
        callback(Number((this as HTMLInputElement).value));
    };

    sliderContainer.appendChild(slider);

    return sliderContainer;
}

function createCounter(
    name: string, 
    min: number,
    value: number,
    callback: (x: number) => void,
): HTMLParagraphElement {
    const counterContainer = document.createElement("p");
    counterContainer.innerHTML = name;
    
    const counter = document.createElement("input");
    counter.type = "number";
    counter.min = `${min}`;
    counter.value = `${value}`;
    counter.oninput = function() {
        callback(Number((this as HTMLInputElement).value));
    };

    counterContainer.appendChild(counter);

    return counterContainer;
}

function createUI(parent: HTMLElement, ctx: CanvasRenderingContext2D) {
    if (snowflake === undefined) {
        throw "Global snowflake not initialized";
    }

    const title = document.createElement("h1");
    title.innerHTML = "Snowflake parameters:";
    parent.appendChild(title);

    const warning = document.createElement("p");
    warning.innerHTML = `⚠️ WARNING: The snowflake is drawn <b>recursively</b>. This means that the more detail you add to the snowflake, the slower it gets to render. Use these parameters with caution!`;
    parent.appendChild(warning);

    parent.appendChild(
        createCounter(
            "Branch count: ", 3, 
            snowflake.getBranchCount(),
            (x: number) => {
                snowflake?.setBranchCount(x);
            },
        ),
    );

    parent.appendChild(
        createCounter(
            "Branch length: ", 1, 
            snowflake.getBranchLength(),
            (x: number) => {
                snowflake?.setBranchLength(x);
            },
        ),
    );

    parent.appendChild(
        createCounter(
            "Branch thickness: ", 1, 
            snowflake.getBranchThickness(),
            (x: number) => {
                snowflake?.setBranchThickness(x);
            },
        ),
    );

    parent.appendChild(
        createSlider(
            "Branch hue: ",
            0, 360, snowflake.getBranchHue(),
            (x: number) => {
                snowflake?.setBranchHue(x);
            },
        ),
    );

    parent.appendChild(
        createCounter(
            "Deepness: ", 1,
            snowflake.getDeepness(),
            (x: number) => {
                snowflake?.setDeepness(x);
            },
        ),
    );

    parent.appendChild(
        createSlider(
            "Change factor: ",
            0, 100, snowflake.getChangeFactor()*100,
            (x: number) => {
                snowflake?.setChangeFactor(x/100);
            },
        ),
    );

    parent.appendChild(
        createSlider(
            "Hue change factor: ",
            0, 100, snowflake.getHueChangeFactor()*100,
            (x: number) => {
                snowflake?.setHueChangeFactor(x/100);
            },
        ),
    );

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