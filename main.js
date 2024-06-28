function draw() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        ctx.beginPath();
        ctx.arc(ctx.canvas.width/2, ctx.canvas.height/2,
                ctx.canvas.height/4,0,2*Math.PI);
        ctx.stroke();
    }
    console.log("helo");
}