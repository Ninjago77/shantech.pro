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

    draw(ctx:CanvasRenderingContext2D, unitSize:number=50, unitDist:number=50, offsetX:number=500, offsetY:number=100,  wallWidth:number=5, mazeOnly:boolean=false) {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                let k = this.matrix[i][j];
                ctx.beginPath();
                switch (k) {
                    case MazeNode.NONE:
                        ctx.fillStyle = (i == this.originY && j == this.originX)
                            ? "red" : (mazeOnly ? "white" : "black");
                        ctx.rect((unitDist*j)+offsetX, (unitDist*i)+offsetY, unitSize, unitSize);
                        ctx.fill();
                        ctx.closePath();
                        break;
                    case MazeNode.DOWN:
                        ctx.fillStyle = (mazeOnly ? "grey" :"blue");
                        if (mazeOnly) {
                            ctx.rect((unitDist*j)+offsetX, (unitDist*i)+offsetY, wallWidth, unitSize);
                            ctx.fill();
                            ctx.rect((unitDist*j-wallWidth+unitSize)+offsetX, (unitDist*i)+offsetY, wallWidth, unitSize);
                            ctx.fill();
                        } else {
                            ctx.moveTo((unitDist*j)+offsetX, (unitDist*i)+offsetY);
                            ctx.lineTo((unitDist*j+unitSize)+offsetX, (unitDist*i)+offsetY);
                            ctx.lineTo((unitDist*j+(unitSize/2))+offsetX, (unitDist*i+unitSize)+offsetY);
                            ctx.lineTo((unitDist*j)+offsetX, (unitDist*i)+offsetY);
                            ctx.fill();
                        }
                        ctx.closePath();
                        break;
                    case MazeNode.LEFT:
                        ctx.fillStyle = (mazeOnly ? "grey" :"green");
                        if (mazeOnly) {
                            ctx.rect((unitDist*j)+offsetX, (unitDist*i)+offsetY, unitSize, wallWidth);
                            ctx.fill();
                            ctx.rect((unitDist*j)+offsetX, (unitDist*i-wallWidth+unitSize)+offsetY, unitSize, wallWidth); 
                            ctx.fill();
                        } else {
                            ctx.moveTo((unitDist*j+unitSize)+offsetX, (unitDist*i)+offsetY);
                            ctx.lineTo((unitDist*j+unitSize)+offsetX, (unitDist*i+unitSize)+offsetY);
                            ctx.lineTo((unitDist*j)+offsetX, (unitDist*i+(unitSize/2))+offsetY);
                            ctx.lineTo((unitDist*j+unitSize)+offsetX, (unitDist*i)+offsetY);
                            ctx.fill();
                        }
                        ctx.closePath();
                        break;
                    case MazeNode.RIGHT:
                        ctx.fillStyle = (mazeOnly ? "grey" :"yellow");
                        if (mazeOnly) {
                            ctx.rect((unitDist*j)+offsetX, (unitDist*i)+offsetY, unitSize, wallWidth);
                            ctx.fill();
                            ctx.rect((unitDist*j)+offsetX, (unitDist*i-wallWidth+unitSize)+offsetY, unitSize, wallWidth); 
                            ctx.fill();
                        } else {
                            ctx.moveTo((unitDist*j)+offsetX, (unitDist*i)+offsetY);
                            ctx.lineTo((unitDist*j)+offsetX, (unitDist*i+unitSize)+offsetY);
                            ctx.lineTo((unitDist*j+unitSize)+offsetX, (unitDist*i+(unitSize/2))+offsetY);
                            ctx.lineTo((unitDist*j)+offsetX, (unitDist*i)+offsetY);
                            ctx.fill();
                        }
                        ctx.closePath();
                        break;
                    case MazeNode.UP:
                        ctx.fillStyle = (mazeOnly ? "grey" :"orange");
                        if (mazeOnly) {
                            ctx.rect((unitDist*j)+offsetX, (unitDist*i)+offsetY, wallWidth, unitSize);
                            ctx.fill();
                            ctx.rect((unitDist*j-wallWidth+unitSize)+offsetX, (unitDist*i)+offsetY, wallWidth, unitSize);
                            ctx.fill();
                        } else {
                            ctx.moveTo((unitDist*j)+offsetX, (unitDist*i+unitSize)+offsetY);
                            ctx.lineTo((unitDist*j+unitSize)+offsetX, (unitDist*i+unitSize)+offsetY);
                            ctx.lineTo((unitDist*j+(unitSize/2))+offsetX, (unitDist*i)+offsetY);
                            ctx.lineTo((unitDist*j)+offsetX, (unitDist*i+unitSize)+offsetY);
                            ctx.fill();
                        }
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
function drawMaze(mazeObj: OriginShiftMaze,ctx:CanvasRenderingContext2D) {
    mazeObj.draw(ctx);
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

        drawMaze(
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