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
    var m = new OriginShiftMaze(5,5); // new Maze(5,5);
    console.log(m);
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