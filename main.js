// npm install -D @types/node
var Direction = /** @class */ (function () {
    function Direction() {
        this.UP = 0;
        this.DOWN = 1;
        this.LEFT = 2;
        this.RIGHT = 3;
    }
    return Direction;
}());
var Cell = /** @class */ (function () {
    function Cell(dir) {
        this.dir = dir;
        this.dir = dir;
    }
    return Cell;
}());
var Maze = /** @class */ (function () {
    function Maze(height, width) {
        this.height = height;
        this.width = width;
        this.matrix = new Array((2 * height) + 1).fill(0).map(function () { return new Array((2 * width) + 1).fill(0).map(function () { return new Cell(null); }); });
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                this.matrix[i][j] = new Cell(null);
            }
        }
    }
    return Maze;
}());
function drawMaze(ctx) {
    var m = new Maze(5, 5);
    console.log(m);
}
function draw() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
        drawMaze(ctx);
    }
}
