// npm install -D @types/node
enum MazeNode{
    NONE = -1,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3,
    UP = 4,
}

// const wallColor = "dimgrey";
// const originColor = "forestgreen";
// const nodeColor = "darkgreen";
// const pathColor = "green";
// const BGColor = "black";
// const stepDelay = 0;

const wallColor = "#464854";
const fakeOriginColor = "#6fabb0";
const originColor = "#2f28fa";
const nodeColor = "#485e46";
const pathColor = "#70b064";
const BGColor = "#1c1c24";
const hoverColor = "#54548a";
const stepDelay = 0;



var globalStartX:number = 1;
var globalStartY:number = 1;
var globalEndX:number = 0;
var globalEndY:number = 0;

var cursorX:number = -1;
var cursorY:number = -1;

// When both multipliers are the same, the quality looks amazing!!!
const iconMultiplier = 3;
const resolutionGraphicsMultiplier = 3;

const globalUnit = 50*iconMultiplier;
const globalWall = 5*iconMultiplier;
const globalPath = 15*iconMultiplier;
const globalRoute = 25*iconMultiplier;

const globalDebugColors = false;

// const globalUnit = 35;
// const globalWall = 3;
// const globalPath = 5;
// const globalRoute = 15;

const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

    // Helper function to compare two objects
function areCoordinatesEqual(a: { x: number, y: number }, b: { x: number, y: number }): boolean {
    return a.x === b.x && a.y === b.y;
}

function removeCommonCoordinates(e: { x: number, y: number }[], f: { x: number, y: number }[]): [{ x: number, y: number }[], { x: number, y: number }[]] {
    // Remove items from e that are in f
    const newE = e.filter(eItem => !f.some(fItem => areCoordinatesEqual(eItem, fItem)));
    
    // Remove items from f that are in e
    const newF = f.filter(fItem => !e.some(eItem => areCoordinatesEqual(fItem, eItem)));
    
    return [newE, newF];
}

function isCoordinateInList(target: { x: number, y: number }, arr: { x: number, y: number }[]): boolean {
    // Check if any object in the array matches the target object
    return arr.some(item => areCoordinatesEqual(item, target));
}

function coordinateRect(ctx: CanvasRenderingContext2D, fillStyle: string | CanvasGradient | CanvasPattern, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    ctx.rect(x1,y1,x2-x1,y2-y1);
    ctx.fill();
    ctx.closePath();
}

function coordinateDirectionUnitTriangle(ctx: CanvasRenderingContext2D, dir: MazeNode, fillStyle: string | CanvasGradient | CanvasPattern, x1: number, y1: number, x2: number, y2: number) {
    ctx.beginPath();
    ctx.fillStyle = fillStyle;
    switch (dir) {
        case MazeNode.DOWN:
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y1);
            ctx.lineTo(x1 + ((x2-x1) / 2), y2);
            break;
        case MazeNode.LEFT:
            ctx.moveTo(x2, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1, y1 + ((y2-y1) / 2));
            break;
        case MazeNode.RIGHT:
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y2);
            ctx.lineTo(x2, y1 + ((y2-y1) / 2));
            break;
        case MazeNode.UP:
            ctx.moveTo(x1, y2);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x1 + ((x2-x1) / 2), y1);
            break;
        default:
            ctx.fillStyle = "white";
            break;
    }
    ctx.closePath();
    ctx.fill();
}

function isUserAgentMobile(str) {
    return /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(str) ||
      /\b(Android|Windows Phone|iPad|iPod)\b/i.test(str)
}
  
function isMobile() {
    if ('maxTouchPoints' in navigator) return navigator.maxTouchPoints > 0;

    if ('matchMedia' in window) return !!matchMedia('(pointer:coarse)').matches;

    if ('orientation' in window) return true;

    return isUserAgentMobile((navigator as Navigator).userAgent);
}
  
class DrawQueueItem {
    constructor(public func: Function, public args: any[]) {}

    execute(){
        this.func.apply(null, this.args);
    }
}

class OriginShiftMaze { // CaptainLuma's Algorithm
    public matrix: MazeNode[][];
    public originX: number;
    public originY: number;
    public living: boolean;
    public drawQueue: DrawQueueItem[];
    constructor(public height: number, public width: number) {
        this.originX = this.width - 1;
        this.originY = this.height - 1;
        this.matrix = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0).map(() => MazeNode.NONE));
        this.living = true;
        this.drawQueue = [];
        // for (var i = 0; i < this.height; i++) {
        //     for (var j = 0; j < this.width; j++) {
        //         this.matrix[i][j] = MazeNode.RIGHT;
        //     }
        // }
        // for (var i = 0; i < this.height; i++) {
        //     this.matrix[i][this.width-1] = MazeNode.DOWN;
        // }
        if (this.height % 2 === 1 && this.width % 2 === 1) {
            this.originX = Math.floor(this.width / 2);
            this.originY = Math.floor(this.height / 2);
        } else {
            let possibleOrigins:object[] = [];
            if (this.width % 2 === 0) {
                possibleOrigins.push({ x: this.width / 2 - 1, y: Math.floor(this.height / 2) });
                possibleOrigins.push({ x: this.width / 2, y: Math.floor(this.height / 2) });
            }
            if (this.height % 2 === 0) {
                possibleOrigins.push({ x: Math.floor(this.width / 2), y: this.height / 2 - 1 });
                possibleOrigins.push({ x: Math.floor(this.width / 2), y: this.height / 2 });
            }
            let selectedOrigin = possibleOrigins[randomInt(0, possibleOrigins.length - 1)];
            this.originX = selectedOrigin["x"];
            this.originY = selectedOrigin["y"];
        }

        this.matrix = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0).map(() => MazeNode.NONE));
        
        // Point all nodes towards the origin
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                if (i < this.originY) {
                    this.matrix[i][j] = MazeNode.DOWN;
                } else if (i > this.originY) {
                    this.matrix[i][j] = MazeNode.UP;
                } else if (j < this.originX) {
                    this.matrix[i][j] = MazeNode.RIGHT;
                } else if (j > this.originX) {
                    this.matrix[i][j] = MazeNode.LEFT;
                } else {
                    this.matrix[i][j] = MazeNode.NONE;
                }
            }
        }
        this.clearOriginDirections();
    }

    clearDrawQueue() {
        this.drawQueue = [];
    }

    executeDrawQueue() {
        for (let i = 0; i < this.drawQueue.length; i++) {
            this.drawQueue[i].execute();
        }
        this.clearDrawQueue();
    }

    addToDrawQueue(func: Function, args: any[]) {
        this.drawQueue.push(new DrawQueueItem(func, args));
    }

    clearOriginDirections() {
        this.matrix[this.originY][this.originX] = MazeNode.NONE;
    }
    changeStateFromNewOrigin(newOriginCellX: number, newOriginCellY: number) {
        if (this.originX-1 == newOriginCellX) {
            this.matrix[this.originY][this.originX] = MazeNode.LEFT;
        }
        if (this.originX+1 == newOriginCellX) {
            this.matrix[this.originY][this.originX] = MazeNode.RIGHT;
        }
        if (this.originY-1 == newOriginCellY) {
            this.matrix[this.originY][this.originX] = MazeNode.UP;
        }
        if (this.originY+1 == newOriginCellY) {
            this.matrix[this.originY][this.originX] = MazeNode.DOWN;
        }
        this.originX = newOriginCellX;
        this.originY = newOriginCellY;
    }

    randomNewOrigin():object {
        let options: object[] = [];
        if (this.originX != 0) {
            options.push({
                x: this.originX - 1,
                y: this.originY,
            });
        }
        if (this.originX != (this.width - 1)) {
            options.push({
                x: this.originX + 1,
                y: this.originY,
            });
        }
        if (this.originY != 0) {
            options.push({
                x: this.originX,
                y: this.originY - 1,
            });
        }
        if (this.originY != (this.height - 1)) {
            options.push({
                x: this.originX,
                y: this.originY + 1,
            });
        }
        let newOrigin = options[randomInt(0, options.length - 1)];
        return newOrigin;
    }

    stepTimesCalculate():number {
        return this.width * this.height *10;
    }

    step() {
        if (!this.living) {return;}
        let newOrigin = this.randomNewOrigin();
        this.changeStateFromNewOrigin(newOrigin['x'], newOrigin['y']);
        this.clearOriginDirections();
    }

    static dimensionCalculate(height: number, width: number, unitDist: number, wall: number) : object {
        return {
            "height": (height*unitDist)+(wall*2),
            "width": (width*unitDist)+(wall*2),
        };
    }

    static reverseDimensionCalculate(height: number, width: number, unitDist: number, wall: number) : object {
        return {
            "height": (height-(wall*2))/unitDist,
            "width": (width-(wall*2))/unitDist,
        };
    }
    autoStep() {
        // throw new Error("Don't use this, at all costs.");
        setInterval(() => {
            this.step();
        }, stepDelay);
    }

    centerOffsetCalculate(maxHeight: number, maxWidth: number, unitDist:number):{offsetX:number, offsetY:number} {
        return {
            "offsetX": (maxWidth/2) - ((this.width*unitDist)/2),
            "offsetY": (maxHeight/2) - ((this.height*unitDist)/2),
        }; 
    }

    mouseOverCellCalculate(x: number, y: number, cHeight: number, cWidth: number, winHeight: number, winWidth: number, wall: number, offset:{offsetX:number, offsetY:number}):{"x":number, "y":number} {
        if (x == -1 && y == -1) {
            return {
                "x":this.width - 1,
                "y":this.height - 1,
            }
        }
        x = (x/winHeight) * cHeight;
        y = (y/winWidth) * cWidth;
        x = x - offset['offsetX'] - wall;
        y = y - offset['offsetY'] - wall;
        cWidth = cWidth + ((0 - offset['offsetX'] - wall) * 2);
        cHeight = cHeight + ((0 - offset['offsetY'] - wall) * 2);
        let rx = Math.floor((x/cWidth)*this.width);
        let ry = Math.floor((y/cHeight)*this.height);
        // console.log(rx, ry);
        return {
            "x":rx < 0 ? 0 :((rx >= this.width) ? this.width - 1 : rx),
            "y":ry < 0 ? 0 :((ry >= this.height) ? this.height - 1 : ry),
        }
    }

    
    drawMaze(ctx: CanvasRenderingContext2D, unitSize: number, offsetX: number, offsetY: number, wall: number = 5) {
        // ctx.lineWidth = wall;
        // ctx.fillStyle = wallColor;
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                let x = offsetX + j * unitSize;
                let y = offsetY + i * unitSize;
                let cell = this.matrix[i][j];
    
                // Draw the top wall
                if ((i == 0 || this.matrix[i - 1][j] != MazeNode.DOWN) && (cell != MazeNode.UP)) {
                    this.addToDrawQueue(coordinateRect,[
                        ctx,
                        wallColor,
                        x - wall, y - wall,
                        x + unitSize + wall, y + wall
                    ]);
                }
                if ((j == 0 || this.matrix[i][j - 1] != MazeNode.RIGHT) && (cell != MazeNode.LEFT)) {
                    this.addToDrawQueue(coordinateRect,[
                        ctx,
                        wallColor,
                        x - wall, y - wall,
                        x + wall, y + unitSize + wall
                    ]);
                }
                if ((i == this.height - 1 || this.matrix[i + 1][j] != MazeNode.UP) && (cell != MazeNode.DOWN)) {
                    this.addToDrawQueue(coordinateRect,[
                        ctx,
                        wallColor,
                        x - wall, y + unitSize - wall,
                        x + unitSize + wall, y + unitSize + wall
                    ]);
                }
                if ((j == this.width - 1 || this.matrix[i][j + 1] != MazeNode.LEFT) && (cell != MazeNode.RIGHT)) {
                    this.addToDrawQueue(coordinateRect,[
                        ctx,
                        wallColor,
                        x + unitSize - wall, y - wall,
                        x + unitSize + wall, y + unitSize + wall
                    ]);
                }
                // console.log(j,i, this.matrix[i][j]);
            }
        }
    }

    drawOrigin(ctx: CanvasRenderingContext2D, unitSize: number, unitDist: number, offsetX: number, offsetY: number, exclusions:{x:number, y:number}[] = [], fakeOriginX: number = this.originX, fakeOriginY: number = this.originY, isfakeOriginColor:boolean = false) {
        if (isCoordinateInList({ x: fakeOriginX, y: fakeOriginY }, exclusions)) {return;}
        let x = offsetX + (fakeOriginX* unitDist) + ((unitDist-unitSize)/2);
        let y = offsetY + (fakeOriginY * unitDist) + ((unitDist-unitSize)/2);
        this.addToDrawQueue(() => {
            ctx.beginPath();
            ctx.fillStyle = (isfakeOriginColor) ? fakeOriginColor : originColor;
            ctx.rect(x, y, unitSize, unitSize);
            ctx.closePath();
            ctx.fill();
        },[]);
    }

    drawPath(ctx: CanvasRenderingContext2D, unitSize: number, unitDist: number, offsetX: number, offsetY: number, debugColors:boolean = false, exclusions:{x:number, y:number}[] = []) {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {

                if (isCoordinateInList({ x: j, y: i }, exclusions)) {
                    continue;
                }

                let k = this.matrix[i][j];
                let x = offsetX + (j * unitDist) + ((unitDist-unitSize)/2);
                let y = offsetY + (i * unitDist) + ((unitDist-unitSize)/2);
                
                let fillStyle: string | CanvasGradient | CanvasPattern = "";
                switch (k) {
                    case MazeNode.DOWN:
                        fillStyle = debugColors ? "navy" : nodeColor;
                        break;
                    case MazeNode.LEFT:
                        fillStyle = debugColors ? "purple" : nodeColor;
                        break;
                    case MazeNode.RIGHT:
                        fillStyle = debugColors ? "teal" : nodeColor;
                        break;
                    case MazeNode.UP:
                        fillStyle = debugColors ? "olive" : nodeColor;
                        break;
                    default:
                        fillStyle = "white";
                        break;
                }

                this.addToDrawQueue(coordinateDirectionUnitTriangle,[ctx, k, fillStyle, x, y, x + unitSize, y + unitSize]);
            }
        }
    }
    drawRoute(ctx: CanvasRenderingContext2D, unitSize: number, unitStartSize: number, unitDist: number, wall: number, offsetX: number, offsetY: number, startX: number = 0, startY: number = 0, endX: number = this.width-1, endY: number = this.height-1):{x:number, y:number}[] {
        this.addToDrawQueue(() => {
            ctx.beginPath();
            ctx.fillStyle = hoverColor;
            ctx.rect(offsetX + (startX * unitDist) + wall, offsetY + (startY * unitDist) + wall, unitStartSize - (wall*2), unitStartSize - (wall*2));
            ctx.fill();
            ctx.closePath();
        },[]);


        this.drawOrigin(ctx, unitSize, unitDist, offsetX, offsetY, [], endX, endY, true); // fake origin

        if ((startX == endX) && (startY == endY)) {
            return [{"x": startX, "y": startY}];
        }

        let startToOrigin:{ x: number, y: number }[] = [];
        let a = {
            x: startX,
            y: startY,
        };
        while (true) {
            if (a["x"] == this.originX && a["y"] == this.originY) {
                break;
            }
            startToOrigin.push({
                "x": a["x"],
                "y": a["y"],
            });
            let af = this.matrix[a["y"]][a["x"]];
            switch (af) {
                case MazeNode.DOWN:
                    a["y"] = a["y"] + 1;
                    break;
                case MazeNode.LEFT:
                    a["x"] = a["x"] - 1;
                    break;
                case MazeNode.RIGHT:
                    a["x"] = a["x"] + 1;
                    break;
                case MazeNode.UP:
                    a["y"] = a["y"] - 1;
                    break;
                default:
                    break;
            }
        }
        let endToOrigin:{ x: number, y: number }[] = [];
        let b = {
            x: endX,
            y: endY,
        };
        while (true) {
            if (b["x"] == this.originX && b["y"] == this.originY) {
                break;
            }
            endToOrigin.push({
                "x": b["x"],
                "y": b["y"],
            });
            let bf = this.matrix[b["y"]][b["x"]];
            switch (bf) {
                case MazeNode.DOWN:
                    b["y"] = b["y"] + 1;
                    break;
                case MazeNode.LEFT:
                    b["x"] = b["x"] - 1;
                    break;
                case MazeNode.RIGHT:
                    b["x"] = b["x"] + 1;
                    break;
                case MazeNode.UP:
                    b["y"] = b["y"] - 1;
                    break;
                default:
                    break;
            }
        }
        let originMaster: { x: number, y: number } | null = null;
        var [startToOrigin2, endToOrigin2] = removeCommonCoordinates(startToOrigin, endToOrigin);
        if (startToOrigin2.length == 0 || endToOrigin2.length == 0) {
            // console.log("es",startToOrigin2, endToOrigin2);
        } else {
            originMaster = this.drawOriginMaster(ctx, unitSize, unitDist, offsetX, offsetY, startToOrigin2[startToOrigin2.length-1], endToOrigin2[endToOrigin2.length-1], startX, startY);
        }


        for (var s = 0; s < startToOrigin2.length; s++) {
            let i = startToOrigin2[s]["y"];
            let j = startToOrigin2[s]["x"];
            let k = this.matrix[i][j];
            let x = offsetX + (j * unitDist) + ((unitDist-unitSize)/2);
            let y = offsetY + (i * unitDist) + ((unitDist-unitSize)/2);

            if (startX == j && startY == i) {
                continue;
            }
            
            this.addToDrawQueue(coordinateDirectionUnitTriangle,[ctx, k,(j == this.originX && i == this.originY) ? originColor :  pathColor, x, y, x + unitSize, y + unitSize]);
        }
        for (var e = 0; e < endToOrigin2.length; e++) {
            let i = endToOrigin2[e]["y"];
            let j = endToOrigin2[e]["x"];
            // let k = this.matrix[i][j];
            let k:MazeNode = MazeNode.NONE; 
            let x = offsetX + (j * unitDist) + ((unitDist-unitSize)/2);
            let y = offsetY + (i * unitDist) + ((unitDist-unitSize)/2);

            if (endX == j && endY == i) {
                continue;
            }
            let n = endToOrigin2[e-1];

            if (j-1 == n["x"]) {
                k = MazeNode.LEFT;
            }
            if (j+1 == n["x"]) {
                k = MazeNode.RIGHT;
            }
            if (i-1 == n["y"]) {
                k = MazeNode.UP;
            }
            if (i+1 == n["y"]) {
                k = MazeNode.DOWN;
            }

            this.addToDrawQueue(coordinateDirectionUnitTriangle,[ctx, k, (j == this.originX && i == this.originY) ? originColor :  pathColor, x, y, x + unitSize, y + unitSize]);
        }

        let k = this.matrix[startY][startX];
        let x = offsetX + (startX * unitDist) + ((unitDist-unitSize)/2);
        let y = offsetY + (startY * unitDist) + ((unitDist-unitSize)/2);
        
        if (startToOrigin2.length == 0) {
            let l = endToOrigin2[endToOrigin2.length-1];
            if (l["x"] == startX-1) {
                k = MazeNode.LEFT;
            }
            if (l["x"] == startX+1) {
                k = MazeNode.RIGHT;
            }
            if (l["y"] == startY-1) {
                k = MazeNode.UP;
            }
            if (l["y"] == startY+1) {
                k = MazeNode.DOWN;
            }
        }        

        this.addToDrawQueue(coordinateDirectionUnitTriangle,[ctx, k, (startX == this.originX && startY == this.originY) ? originColor :  pathColor, x, y, x + unitSize, y + unitSize]);

        let rV = [
            ...startToOrigin2,
            ...endToOrigin2,
            {
                "x": startX,
                "y": startY
            },
            {
                "x": endX,
                "y": endY
            },
        ];
        return originMaster != null ? [...rV, originMaster, ] : [...rV];
    }

    drawOriginMaster(ctx: CanvasRenderingContext2D, unitSize: number, unitDist: number, offsetX: number, offsetY: number, startMaster: { x: number, y: number }, endMaster: { x: number, y: number }, startX: number, startY: number): { x: number, y: number } | null {
        let trueMaster:{ x: number, y: number }|null = null;
        switch (this.matrix[startMaster["y"]][startMaster["x"]]) {
            case MazeNode.DOWN:
                trueMaster = {
                    "x": startMaster["x"],
                    "y": startMaster["y"] + 1,
                }
                break;
            case MazeNode.LEFT:
                trueMaster = {
                    "x": startMaster["x"] - 1,
                    "y": startMaster["y"],
                }
                break;
            case MazeNode.RIGHT:
                trueMaster = {
                    "x": startMaster["x"] + 1,
                    "y": startMaster["y"],
                }
                break;
            case MazeNode.UP:
                trueMaster = {
                    "x": startMaster["x"],
                    "y": startMaster["y"] - 1,
                }
                break;
            default:
                break;
        }
        if (trueMaster != null) {
            if (trueMaster["x"] == startX && trueMaster["y"] == startY) {
                return null;
            }
        }
        let trueMasterDirection:MazeNode|null = null;
        switch (this.matrix[endMaster["y"]][endMaster["x"]]) {
            case MazeNode.DOWN:
                trueMasterDirection = MazeNode.UP;
                break;
            case MazeNode.LEFT:
                trueMasterDirection = MazeNode.RIGHT;
                break;
            case MazeNode.RIGHT:
                trueMasterDirection = MazeNode.LEFT;
                break;
            case MazeNode.UP:
                trueMasterDirection = MazeNode.DOWN;
                break;
            default:
                break;
        }

        if (trueMaster != null && trueMasterDirection != null) {
            // console.log(trueMaster,trueMasterDirection);
            let x = offsetX + (trueMaster.x * unitDist) + ((unitDist-unitSize)/2);
            let y = offsetY + (trueMaster.y * unitDist) + ((unitDist-unitSize)/2);

            this.addToDrawQueue(coordinateDirectionUnitTriangle,[ctx, trueMasterDirection,(trueMaster.x == this.originX && trueMaster.y == this.originY) ? originColor : pathColor, x, y, x + unitSize, y + unitSize]);
        }

        return trueMaster;

    }

}

var mazeObj:OriginShiftMaze;
var offset:{offsetX:number, offsetY:number};
// mazeObj.autoStep();
// let m = mazeObj.stepTimesCalculate();
// let n = 0;
function drawMazeGame(mazeObj: OriginShiftMaze,ctx:CanvasRenderingContext2D) {
    mazeObj.addToDrawQueue(() =>{
        ctx.fillStyle = BGColor;
        ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    },[]);

    mazeObj.drawMaze(ctx, globalUnit, offset["offsetX"], offset["offsetY"], globalWall);
    let exclusions = mazeObj.drawRoute(ctx, globalRoute, globalUnit, globalUnit, globalWall, offset["offsetX"], offset["offsetY"],globalStartX,globalStartY,globalEndX,globalEndY);
    mazeObj.drawPath(ctx, globalPath, globalUnit, offset["offsetX"], offset["offsetY"],globalDebugColors,exclusions);
    mazeObj.drawOrigin(ctx, globalRoute , globalUnit, offset["offsetX"], offset["offsetY"],exclusions);

    mazeObj.executeDrawQueue();
    // if (n < m) {
    //     mazeObj.step();
    //     n++;
    // }
}

function resizeCanvas() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = window.innerWidth*resolutionGraphicsMultiplier;
    canvas.height = window.innerHeight*resolutionGraphicsMultiplier;
    let dimensions = OriginShiftMaze.reverseDimensionCalculate(canvas.height,canvas.width,globalUnit,globalWall);
    mazeObj = new OriginShiftMaze(Math.floor(dimensions["height"]), Math.floor(dimensions["width"]));
    offset = mazeObj.centerOffsetCalculate(canvas.height, canvas.width, globalUnit);
    mazeObj.autoStep();
    // console.log(offset);
}


function draw() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let c = mazeObj.mouseOverCellCalculate(cursorX, cursorY, canvas.height, canvas.width, window.innerHeight, window.innerWidth, globalWall, offset);
        globalStartX = c["x"];
        globalStartY = c["y"];
        drawMazeGame(
            mazeObj,
            ctx,
        );
    }
    requestAnimationFrame(draw);
}

function addEventListeners() {
    // console.log("height,width",mazeObj.height, mazeObj.width);
    window.addEventListener('resize', resizeCanvas);
    if (!isMobile()) {
        document.addEventListener("mousemove" ,(event) => {
            cursorX = event.clientX;
            cursorY = event.clientY;
        })
        let canvas = document.getElementById("canvas") as HTMLCanvasElement;
        window.addEventListener('mousedown', (event) => mazeObj.living = false);
        window.addEventListener('mouseup', (event) => {mazeObj.living = true;});
        window.addEventListener("keyup", (e: KeyboardEvent) => {
            if (e.key == " " || e.code == "Space") {            
                let c = mazeObj.mouseOverCellCalculate(cursorX, cursorY, canvas.height, canvas.width, window.innerHeight, window.innerWidth, globalWall, offset);
                globalEndX = c["x"];
                globalEndY = c["y"];
            }
        });
    } else {
        let content = document.getElementsByClassName("content")[0] as HTMLDivElement;
        content.style.display = "none";
    }
    // window.oncontextmenu = (event) => {
    //     event.preventDefault();
    //     let c = mazeObj.mouseOverCellCalculate(cursorX, cursorY, canvas.height, canvas.width, 5, offset);
    //     globalEndX = c["x"];
    //     globalEndY = c["y"];
    // };
}

resizeCanvas();
// mazeObj = new OriginShiftMaze(5,5); // new Maze(5,5);
addEventListeners();
draw();