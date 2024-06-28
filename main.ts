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
                if (this.matrix[OriginShiftMaze.cellCoordinateToSize(i)][j] != Cell.BLOCK) {
                    this.matrix[OriginShiftMaze.cellCoordinateToSize(i)][j] = Cell.RIGHT;
                }
            }
        }
        for (var i = 0; i < this.matrixHeight; i++) {
            if (this.matrix[i][this.matrixWidth-1] != Cell.BLOCK) {
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

    originSizeX() {
        return OriginShiftMaze.cellCoordinateToSize(this.originCellX);
    }
    originSizeY() {
        return OriginShiftMaze.cellCoordinateToSize(this.originCellY);
    }

    updateFromNewOrigin() {
        if (this.originCellX != 0) {
            if (this.matrix[this.originSizeY()][this.originSizeX()-1] != Cell.RIGHT) {
                this.matrix[this.originSizeY()][this.originSizeX()-1] = Cell.RIGHT;
            }
        }
        if (this.originCellY != 0) {
            if (this.matrix[this.originSizeY()-1][this.originSizeX()] != Cell.DOWN) {
                this.matrix[this.originSizeY()-1][this.originSizeX()] = Cell.DOWN;
            }
        }
        if (this.originCellX != this.cellWidth-1) {
            if (this.matrix[this.originSizeY()][this.originSizeX()+1] != Cell.LEFT) {
                this.matrix[this.originSizeY()][this.originSizeX()+1] = Cell.LEFT;
            }
        }
        if (this.originCellY != this.cellHeight-1) {
            if (this.matrix[this.originSizeY()+1][this.originSizeX()] != Cell.UP) {
                this.matrix[this.originSizeY()+1][this.originSizeX()] = Cell.UP;
            }
        }
    }
}

function drawMaze(ctx:CanvasRenderingContext2D) {
    const distance = 30;
    const size = 10;
    const offsetX = 50;
    const offsetY = 50;
    var mazeObj = new OriginShiftMaze(5,5); // new Maze(5,5);
    for (var i = 0; i < mazeObj.matrixHeight; i++) {
        for (var j = 0; j < mazeObj.matrixWidth; j++) {
            let k = mazeObj.matrix[i][j];
            ctx.beginPath();
            switch (k) {
                case Cell.BLOCK:
                    ctx.fillStyle = (i == mazeObj.originSizeY() && j == mazeObj.originSizeX())
                        ? "red" : "black";
                    ctx.rect((distance*j)+offsetX, (distance*i)+offsetY, size, size);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case Cell.DOWN:
                    ctx.fillStyle = "blue";
                    ctx.moveTo((distance*j)+offsetX, (distance*i)+offsetY);
                    ctx.lineTo((distance*j+size)+offsetX, (distance*i)+offsetY);
                    ctx.lineTo((distance*j+(size/2))+offsetX, (distance*i+size)+offsetY);
                    ctx.lineTo((distance*j)+offsetX, (distance*i)+offsetY);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case Cell.LEFT:
                    ctx.fillStyle = "green";
                    ctx.moveTo((distance*j+size)+offsetX, (distance*i)+offsetY);
                    ctx.lineTo((distance*j+size)+offsetX, (distance*i+size)+offsetY);
                    ctx.lineTo((distance*j)+offsetX, (distance*i+(size/2))+offsetY);
                    ctx.lineTo((distance*j+size)+offsetX, (distance*i)+offsetY);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case Cell.RIGHT:
                    ctx.fillStyle = "yellow";
                    ctx.moveTo((distance*j)+offsetX, (distance*i)+offsetY);
                    ctx.lineTo((distance*j)+offsetX, (distance*i+size)+offsetY);
                    ctx.lineTo((distance*j+size)+offsetX, (distance*i+(size/2))+offsetY);
                    ctx.lineTo((distance*j)+offsetX, (distance*i)+offsetY);
                    ctx.fill();
                    ctx.closePath();
                    break;
                case Cell.UP:
                    ctx.fillStyle = "orange";
                    ctx.moveTo((distance*j)+offsetX, (distance*i)+offsetY);
                    ctx.lineTo((distance*j+size)+offsetX, (distance*i)+offsetY);
                    ctx.lineTo((distance*j+(size/2))+offsetX, (distance*i+size)+offsetY);
                    ctx.lineTo((distance*j)+offsetX, (distance*i)+offsetY);
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