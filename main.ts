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

}

function drawMaze(mazeObj: OriginShiftMaze,ctx:CanvasRenderingContext2D) {
    const distance = 50;
    const size = 50;
    const wallWidth = 5;
    const offsetX = 500;
    const offsetY = 100;
    const mazeOnly = false;
    for (var i = 0; i < mazeObj.height; i++) {
        for (var j = 0; j < mazeObj.width; j++) {
            let k = mazeObj.matrix[i][j];
            ctx.beginPath();
            switch (k) {
                case MazeNode.NONE:
                    ctx.fillStyle = (i == mazeObj.originY && j == mazeObj.originX)
                        ? "red" : (mazeOnly ? "white" : "black");
                    ctx.rect((distance*j)+offsetX, (distance*i)+offsetY, size, size);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case MazeNode.DOWN:
                    ctx.fillStyle = (mazeOnly ? "grey" :"blue");
                    if (mazeOnly) {
                        ctx.rect((distance*j)+offsetX, (distance*i)+offsetY, wallWidth, size);
                        ctx.fill();
                        ctx.rect((distance*j-wallWidth+size)+offsetX, (distance*i)+offsetY, wallWidth, size);
                        ctx.fill();
                    } else {
                        ctx.moveTo((distance*j)+offsetX, (distance*i)+offsetY);
                        ctx.lineTo((distance*j+size)+offsetX, (distance*i)+offsetY);
                        ctx.lineTo((distance*j+(size/2))+offsetX, (distance*i+size)+offsetY);
                        ctx.lineTo((distance*j)+offsetX, (distance*i)+offsetY);
                        ctx.fill();
                    }
                    ctx.closePath();
                    break;
                case MazeNode.LEFT:
                    ctx.fillStyle = (mazeOnly ? "grey" :"green");
                    if (mazeOnly) {
                        ctx.rect((distance*j)+offsetX, (distance*i)+offsetY, size, wallWidth);
                        ctx.fill();
                        ctx.rect((distance*j)+offsetX, (distance*i-wallWidth+size)+offsetY, size, wallWidth); 
                        ctx.fill();
                    } else {
                        ctx.moveTo((distance*j+size)+offsetX, (distance*i)+offsetY);
                        ctx.lineTo((distance*j+size)+offsetX, (distance*i+size)+offsetY);
                        ctx.lineTo((distance*j)+offsetX, (distance*i+(size/2))+offsetY);
                        ctx.lineTo((distance*j+size)+offsetX, (distance*i)+offsetY);
                        ctx.fill();
                    }
                    ctx.closePath();
                    break;
                case MazeNode.RIGHT:
                    ctx.fillStyle = (mazeOnly ? "grey" :"yellow");
                    if (mazeOnly) {
                        ctx.rect((distance*j)+offsetX, (distance*i)+offsetY, size, wallWidth);
                        ctx.fill();
                        ctx.rect((distance*j)+offsetX, (distance*i-wallWidth+size)+offsetY, size, wallWidth); 
                        ctx.fill();
                    } else {
                        ctx.moveTo((distance*j)+offsetX, (distance*i)+offsetY);
                        ctx.lineTo((distance*j)+offsetX, (distance*i+size)+offsetY);
                        ctx.lineTo((distance*j+size)+offsetX, (distance*i+(size/2))+offsetY);
                        ctx.lineTo((distance*j)+offsetX, (distance*i)+offsetY);
                        ctx.fill();
                    }
                    ctx.closePath();
                    break;
                case MazeNode.UP:
                    ctx.fillStyle = (mazeOnly ? "grey" :"orange");
                    if (mazeOnly) {
                        ctx.rect((distance*j)+offsetX, (distance*i)+offsetY, wallWidth, size);
                        ctx.fill();
                        ctx.rect((distance*j-wallWidth+size)+offsetX, (distance*i)+offsetY, wallWidth, size);
                        ctx.fill();
                    } else {
                        ctx.moveTo((distance*j)+offsetX, (distance*i+size)+offsetY);
                        ctx.lineTo((distance*j+size)+offsetX, (distance*i+size)+offsetY);
                        ctx.lineTo((distance*j+(size/2))+offsetX, (distance*i)+offsetY);
                        ctx.lineTo((distance*j)+offsetX, (distance*i+size)+offsetY);
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

var mazeObj = new OriginShiftMaze(5,5); // new Maze(5,5);


function resizeCanvas() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let m = mazeObj.stepTimesCalculate();
let n = 0;
function draw() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas.getContext) {
        let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (n < m) {
            mazeObj.step();
            n++;
        }
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