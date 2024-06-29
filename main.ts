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

class OriginShiftMaze {
    public matrix: MazeNode[][];
    public originX: number;
    public originY: number;
    constructor(public height: number, public width: number) {
        this.originX = this.width - 1;
        this.originY = this.height - 1;
        this.matrix = new Array(this.height).fill(0).map(() => new Array(this.width).fill(0).map(() => MazeNode.NONE));
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.matrix[i][j] = MazeNode.RIGHT;
            }
        }
        for (var i = 0; i < this.height; i++) {
            this.matrix[i][this.width-1] = MazeNode.DOWN;
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

    drawPath(ctx:CanvasRenderingContext2D, unitSize:number=50, unitDist:number=50, offsetX:number=500, offsetY:number=100) {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                let k = this.matrix[i][j];
                ctx.beginPath();
                switch (k) {
                    case MazeNode.NONE:
                        ctx.fillStyle = (i == this.originY && j == this.originX)
                            ? "red" : "black";
                        ctx.rect((unitDist*j)+offsetX, (unitDist*i)+offsetY, unitSize, unitSize);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    case MazeNode.DOWN:
                        ctx.fillStyle = ("blue");
                        ctx.moveTo((unitDist*j)+offsetX, (unitDist*i)+offsetY);
                        ctx.lineTo((unitDist*j+unitSize)+offsetX, (unitDist*i)+offsetY);
                        ctx.lineTo((unitDist*j+(unitSize/2))+offsetX, (unitDist*i+unitSize)+offsetY);
                        ctx.lineTo((unitDist*j)+offsetX, (unitDist*i)+offsetY);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    case MazeNode.LEFT:
                        ctx.fillStyle = ("green");
                        ctx.moveTo((unitDist*j+unitSize)+offsetX, (unitDist*i)+offsetY);
                        ctx.lineTo((unitDist*j+unitSize)+offsetX, (unitDist*i+unitSize)+offsetY);
                        ctx.lineTo((unitDist*j)+offsetX, (unitDist*i+(unitSize/2))+offsetY);
                        ctx.lineTo((unitDist*j+unitSize)+offsetX, (unitDist*i)+offsetY);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    case MazeNode.RIGHT:
                        ctx.fillStyle = ("yellow");
                        ctx.moveTo((unitDist*j)+offsetX, (unitDist*i)+offsetY);
                        ctx.lineTo((unitDist*j)+offsetX, (unitDist*i+unitSize)+offsetY);
                        ctx.lineTo((unitDist*j+unitSize)+offsetX, (unitDist*i+(unitSize/2))+offsetY);
                        ctx.lineTo((unitDist*j)+offsetX, (unitDist*i)+offsetY);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    case MazeNode.UP:
                        ctx.fillStyle = ("orange");
                        ctx.moveTo((unitDist*j)+offsetX, (unitDist*i+unitSize)+offsetY);
                        ctx.lineTo((unitDist*j+unitSize)+offsetX, (unitDist*i+unitSize)+offsetY);
                        ctx.lineTo((unitDist*j+(unitSize/2))+offsetX, (unitDist*i)+offsetY);
                        ctx.lineTo((unitDist*j)+offsetX, (unitDist*i+unitSize)+offsetY);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    default:
                        ctx.fillStyle = "white";
                        ctx.fill();
                        ctx.closePath();
                        break;
                }
    
            }
        }
    }
    drawMaze(ctx:CanvasRenderingContext2D, unitSize:number=50, offsetX:number=500, offsetY:number=100, wallWidth:number=5) {
        ctx.beginPath();
        ctx.fillStyle = ("white");
        ctx.rect(offsetX-wallWidth, offsetY-wallWidth, (unitSize*this.width-1)+wallWidth, (unitSize*this.height-1)+wallWidth);
        ctx.fill();
        ctx.closePath();
        let emptyUnitSize = unitSize - (wallWidth * 2);
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                let k = this.matrix[i][j];
                ctx.beginPath();
                ctx.fillStyle = ("black");
                ctx.rect((unitSize*j+wallWidth)+offsetX, (unitSize*i+wallWidth)+offsetY, emptyUnitSize, emptyUnitSize);
                ctx.fill();
                switch (k) {
                    case MazeNode.NONE:
                        ctx.fillStyle = "red";
                        ctx.rect((unitSize*j)+offsetX, (unitSize*i)+offsetY, unitSize, unitSize);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    case MazeNode.DOWN:
                        ctx.rect((unitSize*j+wallWidth)+offsetX, (unitSize*i-wallWidth+unitSize)+offsetY, emptyUnitSize, wallWidth+emptyUnitSize);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    case MazeNode.LEFT:
                        ctx.rect((unitSize*j+wallWidth-unitSize)+offsetX, (unitSize*i+wallWidth)+offsetY, wallWidth+emptyUnitSize, emptyUnitSize);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    case MazeNode.RIGHT:
                        ctx.rect((unitSize*j-wallWidth+unitSize)+offsetX, (unitSize*i+wallWidth)+offsetY, wallWidth+emptyUnitSize, emptyUnitSize);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    case MazeNode.UP:
                        ctx.rect((unitSize*j+wallWidth)+offsetX, (unitSize*i+wallWidth-unitSize)+offsetY, emptyUnitSize, wallWidth+emptyUnitSize);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    default:
                        ctx.fillStyle = "white";
                        ctx.fill();
                        ctx.closePath();
                        break;
                }
    
            }
        }
    }

}

var mazeObj = new OriginShiftMaze(5,5); // new Maze(5,5);
let m = mazeObj.stepTimesCalculate();
let n = 0;
function drawMazeGame(mazeObj: OriginShiftMaze,ctx:CanvasRenderingContext2D) {
    mazeObj.drawMaze(ctx);
    mazeObj.drawPath(ctx);
    if (n < m) {
        mazeObj.step();
        n++;
    }
}

function resizeCanvas() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    // canvas.addEventListener('click', (event) => mazeObj.randomNewOrigin());
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
addEventListeners();
draw();