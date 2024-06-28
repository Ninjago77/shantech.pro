// npm install -D @types/node
enum Cell{
    NONE = -1,
    BLOCK = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3,
    UP = 4,
}

const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

class OriginShiftMaze {
    public matrix: Cell[][];
    public matrixHeight: number;
    public matrixWidth: number;
    public originCellX: number;
    public originCellY: number;
    constructor(public cellHeight: number, public cellWidth: number) {
        this.matrixHeight = cellHeight*2 - 1;
        this.matrixWidth = cellWidth*2 - 1;
        this.originCellX = cellWidth - 1;
        this.originCellY = cellHeight - 1;
        this.matrix = new Array(this.matrixHeight).fill(0).map(() => new Array(this.matrixWidth).fill(0).map(() => Cell.NONE));
        for (var i = 0; i < this.cellHeight; i++) {
            for (var j = 0; j < this.cellWidth; j++) {
                this.matrix[OriginShiftMaze.cellCoordinateToSize(i)][OriginShiftMaze.cellCoordinateToSize(j)] = Cell.BLOCK;
            }
        }
        for (var i = 0; i < this.cellHeight; i++) {
            for (var j = 0; j < this.matrixWidth; j++) {
                if (this.matrix[OriginShiftMaze.cellCoordinateToSize(i)][j] !== Cell.BLOCK) {
                    this.matrix[OriginShiftMaze.cellCoordinateToSize(i)][j] = Cell.RIGHT;
                }
            }
        }
        for (var i = 0; i < this.matrixHeight; i++) {
            if (this.matrix[i][this.matrixWidth-1] !== Cell.BLOCK) {
                this.matrix[i][this.matrixWidth-1] = Cell.DOWN;
            }
        }
    }
    
    static cellCoordinateToSize(pos: number) {
        return pos*2; 
    }
    static sizeCoordinateToCell(pos: number) {
        return pos/2; 
    }
}

function drawMaze(ctx:CanvasRenderingContext2D) {
    const distance = 30;
    const size = 10;
    var mazeObj = new OriginShiftMaze(5,5); // new Maze(5,5);
    for (var i = 0; i < mazeObj.matrixHeight; i++) {
        for (var j = 0; j < mazeObj.matrixWidth; j++) {
            let k = mazeObj.matrix[i][j];
            ctx.beginPath();
            switch (k) {
                case Cell.BLOCK:
                    ctx.fillStyle = "black";
                    ctx.rect(distance*j, distance*i, size, size);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case Cell.DOWN:
                    ctx.fillStyle = "blue";
                    ctx.moveTo(distance*j, distance*i);
                    ctx.lineTo(distance*j+size, distance*i);
                    ctx.lineTo(distance*j+(size/2), distance*i+size);
                    ctx.lineTo(distance*j, distance*i);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case Cell.LEFT:
                    ctx.fillStyle = "green";
                    ctx.moveTo(distance*j+size, distance*i);
                    ctx.lineTo(distance*j+size, distance*i+size);
                    ctx.lineTo(distance*j, distance*i+(size/2));
                    ctx.lineTo(distance*j+size, distance*i);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case Cell.RIGHT:
                    ctx.fillStyle = "yellow";
                    ctx.moveTo(distance*j, distance*i);
                    ctx.lineTo(distance*j, distance*i+size);
                    ctx.lineTo(distance*j+size, distance*i+(size/2));
                    ctx.lineTo(distance*j, distance*i);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case Cell.UP:
                    ctx.fillStyle = "red";
                    ctx.moveTo(distance*j, distance*i);
                    ctx.lineTo(distance*j+size, distance*i);
                    ctx.lineTo(distance*j+(size/2), distance*i+size);
                    ctx.lineTo(distance*j, distance*i);
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

function draw() {
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        drawMaze(
            ctx,
        );

    }
}
draw();
window.addEventListener('resize', draw);