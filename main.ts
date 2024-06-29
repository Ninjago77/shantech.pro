// npm install -D @types/node
enum MazeNode{
    NONE = -1,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3,
    UP = 4,
}

const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

function removeCommonCoordinates(e: { x: number, y: number }[], f: { x: number, y: number }[]): [{ x: number, y: number }[], { x: number, y: number }[]] {
    // Helper function to compare two objects
    function arePointsEqual(a: { x: number, y: number }, b: { x: number, y: number }): boolean {
        return a.x === b.x && a.y === b.y;
    }

    // Remove items from e that are in f
    const newE = e.filter(eItem => !f.some(fItem => arePointsEqual(eItem, fItem)));
    
    // Remove items from f that are in e
    const newF = f.filter(fItem => !e.some(eItem => arePointsEqual(fItem, eItem)));
    
    return [newE, newF];
}

function coordinateRect(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    ctx.rect(x1,y1,x2-x1,y2-y1);
}

class OriginShiftMaze { // CaptainLuma's Algorithm
    public matrix: MazeNode[][];
    public originX: number;
    public originY: number;
    constructor(public height: number, public width: number) {
        this.originX = this.width - 1;
        this.originY = this.height - 1;
        this.matrix = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0).map(() => MazeNode.NONE));
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

    clearOriginDirections() {
        this.matrix[this.originY][this.originX] = MazeNode.NONE;
    }
    updateFromNewOrigin(newOriginCellX: number, newOriginCellY: number) {
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
        let newOrigin = this.randomNewOrigin();
        this.updateFromNewOrigin(newOrigin['x'], newOrigin['y']);
        this.clearOriginDirections();
    }

    static dimensionCalculate(height: number, width: number, unitDist: number=50, wall: number=5) : object {
        return {
            "height": (height*unitDist)+(wall*2),
            "width": (width*unitDist)+(wall*2),
        };
    }

    static reverseDimensionCalculate(height: number, width: number, unitDist: number=50, wall: number=5) : object {
        return {
            "height": (height-(wall*2))/unitDist,
            "width": (width-(wall*2))/unitDist,
        };
    }
    autoStep() {
        // throw new Error("Don't use this, at all costs.");
        setInterval(() => {
            this.step();
        }, 0);
    }

    centerOffsetCalculate(maxHeight: number, maxWidth: number, unitDist:number=50):object {
        return {
            "offsetX": (maxWidth/2) - ((this.width*unitDist)/2),
            "offsetY": (maxHeight/2) - ((this.height*unitDist)/2),
        }; 
    }

    
    drawMaze(ctx: CanvasRenderingContext2D, unitSize: number = 50, offsetX: number = 50, offsetY: number = 100, wall: number = 5) {
        // ctx.lineWidth = wall;
        ctx.fillStyle = 'grey';
        
        
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                let x = offsetX + j * unitSize;
                let y = offsetY + i * unitSize;
                let cell = this.matrix[i][j];
    
                ctx.beginPath();
                // Draw the top wall
                if ((i == 0 || this.matrix[i - 1][j] != MazeNode.DOWN) && (cell != MazeNode.UP)) {
                    coordinateRect(
                        ctx,
                        x - wall, y - wall,
                        x + unitSize + wall, y + wall
                    );
                }
                // Draw the left wall
                if ((j == 0 || this.matrix[i][j - 1] != MazeNode.RIGHT) && (cell != MazeNode.LEFT)) {
                    coordinateRect(
                        ctx,
                        x - wall, y - wall,
                        x + wall, y + unitSize + wall
                    );
                }
                // Draw the bottom wall
                if ((i == this.height - 1 || this.matrix[i + 1][j] != MazeNode.UP) && (cell != MazeNode.DOWN)) {
                    coordinateRect(
                        ctx,
                        x - wall, y + unitSize - wall,
                        x + unitSize + wall, y + unitSize + wall
                    );
                }
                // Draw the right wall
                if ((j == this.width - 1 || this.matrix[i][j + 1] != MazeNode.LEFT) && (cell != MazeNode.RIGHT)) {
                    coordinateRect(
                        ctx,
                        x + unitSize - wall, y - wall,
                        x + unitSize + wall, y + unitSize + wall
                    );
                }
                // console.log(j,i, this.matrix[i][j]);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
    drawPath(ctx: CanvasRenderingContext2D, unitSize: number = 30, unitDist: number = 50, offsetX: number = 50, offsetY: number = 100, debugColors:boolean = false) {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                let k = this.matrix[i][j];
                let x = offsetX + (j * unitDist) + ((unitDist-unitSize)/2);
                let y = offsetY + (i * unitDist) + ((unitDist-unitSize)/2);
                
                ctx.beginPath();
                switch (k) {
                    case MazeNode.NONE:
                        ctx.fillStyle =  "red";
                        ctx.rect(x, y, unitSize, unitSize);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case MazeNode.DOWN:
                        ctx.fillStyle = debugColors ? "navy" : "green";
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + unitSize, y);
                        ctx.lineTo(x + unitSize / 2, y + unitSize);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case MazeNode.LEFT:
                        ctx.fillStyle = debugColors ? "purple" : "green";
                        ctx.moveTo(x + unitSize, y);
                        ctx.lineTo(x + unitSize, y + unitSize);
                        ctx.lineTo(x, y + unitSize / 2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case MazeNode.RIGHT:
                        ctx.fillStyle = debugColors ? "teal" : "green";
                        ctx.moveTo(x, y);
                        ctx.lineTo(x, y + unitSize);
                        ctx.lineTo(x + unitSize, y + unitSize / 2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case MazeNode.UP:
                        ctx.fillStyle = debugColors ? "olive" : "green";
                        ctx.moveTo(x, y + unitSize);
                        ctx.lineTo(x + unitSize, y + unitSize);
                        ctx.lineTo(x + unitSize / 2, y);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    default:
                        ctx.fillStyle = "white";
                        ctx.fill();
                        break;
                }
            }
        }
    }
    drawRoute(ctx: CanvasRenderingContext2D, unitSize: number = 15, unitDist: number = 50, offsetX: number = 50, offsetY: number = 100, startX: number = 0, startY: number = 0, endX: number = 0, endY: number = 0) {
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
        var [startToOrigin2, endToOrigin2] = removeCommonCoordinates(startToOrigin, endToOrigin);

        this.drawOriginMaster(ctx, unitSize, unitDist, offsetX, offsetY, startToOrigin2[-1], endToOrigin2[-1]);

        for (var s = 0; s < startToOrigin2.length; s++) {
            let i = startToOrigin2[s]["y"];
            let j = startToOrigin2[s]["x"];
            let k = this.matrix[i][j];
            let x = offsetX + (j * unitDist) + ((unitDist-unitSize)/2);
            let y = offsetY + (i * unitDist) + ((unitDist-unitSize)/2);
            
            ctx.beginPath();
            switch (k) {
                case MazeNode.DOWN:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + unitSize, y);
                    ctx.lineTo(x + unitSize / 2, y + unitSize);
                    break;
                case MazeNode.LEFT:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x + unitSize, y);
                    ctx.lineTo(x + unitSize, y + unitSize);
                    ctx.lineTo(x, y + unitSize / 2);
                    break;
                case MazeNode.RIGHT:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + unitSize);
                    ctx.lineTo(x + unitSize, y + unitSize / 2);
                    break;
                case MazeNode.UP:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x, y + unitSize);
                    ctx.lineTo(x + unitSize, y + unitSize);
                    ctx.lineTo(x + unitSize / 2, y);
                    break;
                default:
                    ctx.fillStyle = "white";
                    break;
            }
            ctx.closePath();
            ctx.fill();
        }
        for (var e = 0; e < endToOrigin2.length; e++) {
            let i = endToOrigin2[e]["y"];
            let j = endToOrigin2[e]["x"];
            let k = this.matrix[i][j];
            let x = offsetX + (j * unitDist) + ((unitDist-unitSize)/2);
            let y = offsetY + (i * unitDist) + ((unitDist-unitSize)/2);
            
            ctx.beginPath();
            switch (k) {
                case MazeNode.UP:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + unitSize, y);
                    ctx.lineTo(x + unitSize / 2, y + unitSize);
                    break;
                case MazeNode.RIGHT:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x + unitSize, y);
                    ctx.lineTo(x + unitSize, y + unitSize);
                    ctx.lineTo(x, y + unitSize / 2);
                    break;
                case MazeNode.LEFT:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + unitSize);
                    ctx.lineTo(x + unitSize, y + unitSize / 2);
                    break;
                case MazeNode.DOWN:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x, y + unitSize);
                    ctx.lineTo(x + unitSize, y + unitSize);
                    ctx.lineTo(x + unitSize / 2, y);
                    break;
                default:
                    ctx.fillStyle = "white";
                    break;
            }
            ctx.closePath();
            ctx.fill();
        }
    }

    drawOriginMaster(ctx: CanvasRenderingContext2D, unitSize: number = 30, unitDist: number = 50, offsetX: number = 50, offsetY: number = 100, startMaster: { x: number, y: number }, endMaster: { x: number, y: number }) {
        let trueMaster:{ x: number, y: number } = { "x": -1, "y": -1 };
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
        let trueMasterDirection:MazeNode = MazeNode.NONE;
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

        ctx.beginPath();
        if (trueMaster.x != -1 && trueMaster.y != -1 && trueMasterDirection != MazeNode.NONE) {
            let x = offsetX + (trueMaster.x * unitDist) + ((unitDist-unitSize)/2);
            let y = offsetY + (trueMaster.y * unitDist) + ((unitDist-unitSize)/2);
            switch (trueMasterDirection) {
                case MazeNode.DOWN:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + unitSize, y);
                    ctx.lineTo(x + unitSize / 2, y + unitSize);
                    break;
                case MazeNode.LEFT:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x + unitSize, y);
                    ctx.lineTo(x + unitSize, y + unitSize);
                    ctx.lineTo(x, y + unitSize / 2);
                    break;
                case MazeNode.RIGHT:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x, y);
                    ctx.lineTo(x, y + unitSize);
                    ctx.lineTo(x + unitSize, y + unitSize / 2);
                    break;
                case MazeNode.UP:
                    ctx.fillStyle = "lime";
                    ctx.moveTo(x, y + unitSize);
                    ctx.lineTo(x + unitSize, y + unitSize);
                    ctx.lineTo(x + unitSize / 2, y);
                    break;
                default:
                    ctx.fillStyle = "white";
                    break;
            }
        }

    }

}

var mazeObj:OriginShiftMaze;
var offset:object;
// mazeObj.autoStep();
// let m = mazeObj.stepTimesCalculate();
// let n = 0;
function drawMazeGame(mazeObj: OriginShiftMaze,ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);

    mazeObj.drawMaze(ctx, 50, offset["offsetX"], offset["offsetY"], 5);
    mazeObj.drawPath(ctx, 30 , 50, offset["offsetX"], offset["offsetY"],true);
    mazeObj.drawRoute(ctx, 15 , 50, offset["offsetX"], offset["offsetY"],0,0,mazeObj.width-1,mazeObj.height-1,);
    // if (n < m) {
    //     mazeObj.step();
    //     n++;
    // }
}

function resizeCanvas() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let dimensions = OriginShiftMaze.reverseDimensionCalculate(window.innerHeight,window.innerWidth);
    mazeObj = new OriginShiftMaze(Math.floor(dimensions["height"]), Math.floor(dimensions["width"]));
    offset = mazeObj.centerOffsetCalculate(canvas.height, canvas.width);
    // console.log(offset);
}


function draw() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        drawMazeGame(
            mazeObj,
            ctx,
        );
    }
    requestAnimationFrame(draw);
}

function addEventListeners() {
    // mazeObj.autoStep();
    console.log("height,width",mazeObj.height, mazeObj.width);
    window.addEventListener('resize', resizeCanvas);
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.addEventListener('click', (event) => mazeObj.step());
}

resizeCanvas();
// mazeObj = new OriginShiftMaze(5,5); // new Maze(5,5);
addEventListeners();
draw();