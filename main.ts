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

class Maze {
    public matrix: Cell[][];
    public matrixHeight: number;
    public matrixWidth: number;
    constructor(public cellHeight: number, public cellWidth: number) {
        this.matrixHeight = cellHeight*2 - 1;
        this.matrixWidth = cellWidth*2 - 1;
        this.matrix = new Array(this.matrixHeight).fill(0).map(() => new Array(this.matrixWidth).fill(0).map(() => Cell.NONE));
        for (var i = 0; i < this.cellHeight; i++) {
            for (var j = 0; j < this.cellWidth; j++) {
                this.matrix[Maze.cellCoordinateToSize(i)][Maze.cellCoordinateToSize(j)] = Cell.BLOCK;
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
    var m = new Maze(5,5);
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