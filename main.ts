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

    drawPath(ctx: CanvasRenderingContext2D, unitSize: number = 30, unitDist: number = 50, offsetX: number = 50, offsetY: number = 100) {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                let k = this.matrix[i][j];
                let x = offsetX + (j * unitDist) + ((unitDist-unitSize)/2);
                let y = offsetY + (i * unitDist) + ((unitDist-unitSize)/2);
                
                ctx.beginPath();
                switch (k) {
                    case MazeNode.NONE:
                        ctx.fillStyle = (i == this.originY && j == this.originX) ? "red" : "black";
                        ctx.rect(x, y, unitSize, unitSize);
                        ctx.fill();
                        break;
                    case MazeNode.DOWN:
                        ctx.fillStyle = "blue";
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + unitSize, y);
                        ctx.lineTo(x + unitSize / 2, y + unitSize);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case MazeNode.LEFT:
                        ctx.fillStyle = "green";
                        ctx.moveTo(x + unitSize, y);
                        ctx.lineTo(x + unitSize, y + unitSize);
                        ctx.lineTo(x, y + unitSize / 2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case MazeNode.RIGHT:
                        ctx.fillStyle = "yellow";
                        ctx.moveTo(x, y);
                        ctx.lineTo(x, y + unitSize);
                        ctx.lineTo(x + unitSize, y + unitSize / 2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                    case MazeNode.UP:
                        ctx.fillStyle = "orange";
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

    static coordinateRect(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        ctx.rect(x1,y1,x2-x1,y2-y1);
    }

    static dimensionCalculate(height: number, width: number, unitDist: number) : object {
        return {
            "height": height*unitDist,
            "width": width*unitDist,
        };
    }
    autoStep() {
        setInterval(() => {
            this.step();
        }, 250);
    }

    centerOffsetCalculate(maxHeight: number, maxWidth: number, unitDist:number=50):object {
        return {
            "offsetX": (maxWidth/2) - ((this.width*unitDist)/2),
            "offsetY": (maxHeight/2) - ((this.height*unitDist)/2),
        }; 
    }

    
    drawMaze(ctx: CanvasRenderingContext2D, unitSize: number = 50, offsetX: number = 50, offsetY: number = 100, wall: number = 5) {
        // ctx.lineWidth = wall;
        ctx.fillStyle = 'black';
        
        
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                let x = offsetX + j * unitSize;
                let y = offsetY + i * unitSize;
                let cell = this.matrix[i][j];
    
                ctx.beginPath();
                // Draw the top wall
                if ((i == 0 || this.matrix[i - 1][j] != MazeNode.DOWN) && (cell != MazeNode.UP)) {
                    OriginShiftMaze.coordinateRect(
                        ctx,
                        x - wall, y - wall,
                        x + unitSize + wall, y + wall
                    );
                }
                // Draw the left wall
                if ((j == 0 || this.matrix[i][j - 1] != MazeNode.RIGHT) && (cell != MazeNode.LEFT)) {
                    OriginShiftMaze.coordinateRect(
                        ctx,
                        x - wall, y - wall,
                        x + wall, y + unitSize + wall
                    );
                }
                // Draw the bottom wall
                if ((i == this.height - 1 || this.matrix[i + 1][j] != MazeNode.UP) && (cell != MazeNode.DOWN)) {
                    OriginShiftMaze.coordinateRect(
                        ctx,
                        x - wall, y + unitSize - wall,
                        x + unitSize + wall, y + unitSize + wall
                    );
                }
                // Draw the right wall
                if ((j == this.width - 1 || this.matrix[i][j + 1] != MazeNode.LEFT) && (cell != MazeNode.RIGHT)) {
                    OriginShiftMaze.coordinateRect(
                        ctx,
                        x + unitSize - wall, y - wall,
                        x + unitSize + wall, y + unitSize + wall
                    );
                }
                console.log(j,i, this.matrix[i][j]);
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

var mazeObj = new OriginShiftMaze(5,5); // new Maze(5,5);
var offset = mazeObj.centerOffsetCalculate(window.innerHeight, window.innerWidth, 50);
mazeObj.autoStep();
// let m = mazeObj.stepTimesCalculate();
// let n = 0;
function drawMazeGame(mazeObj: OriginShiftMaze,ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    mazeObj.drawMaze(ctx, 50, offset["offsetX"], offset["offsetY"], 5);
    mazeObj.drawPath(ctx, 30 , 50, offset["offsetX"], offset["offsetY"]);
    // if (n < m) {
    //     mazeObj.step();
    //     n++;
    // }
}

function resizeCanvas() {
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    offset = mazeObj.centerOffsetCalculate(canvas.height, canvas.width, 50)
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
    canvas.addEventListener('click', (event) => mazeObj.step());
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
addEventListeners();
draw();