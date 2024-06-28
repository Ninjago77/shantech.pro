class Direction{
    public UP:number = 0;
    public DOWN:number = 1;
    public LEFT:number = 2;
    public RIGHT:number = 3;
}

class Cell {
    constructor(public dir: Direction | null) {
        this.dir = dir;
    }
}

class Maze {
    public matrix: Cell[][];
    constructor(public height: number, public width: number) {
        this.matrix = new Array((2*height)+1).fill(0).map(() => new Array((2*width)+1).fill(0).map(() => new Cell(null)));
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                this.matrix[i][j] = new Cell(null);
            }
        }
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