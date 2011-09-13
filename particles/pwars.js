if(!window.Float32Array){
    window.Float32Array = Array;
}

var WIDTH = 800, // px
    HEIGHT = 600,
    NPARTICLES = 10000,
    CELLSIZE = 20,
    CELLSIZE2 = CELLSIZE/2,
    canvas = document.getElementById('c'),
    screenRatio = 1.0;

if(navigator.userAgent.match(/iPad/i)){
    WIDTH = 320;
    HEIGHT = 240;
    NPARTICLES /= 5;
    screenRatio = WIDTH/640;
    canvas.style.width = '640px';
    canvas.style.height = '480px';
    document.getElementById('d').style.width = canvas.style.width;
    document.getElementById('d').style['margin-top'] = '30px';
    document.getElementById('h').style.display = 'none';
}
else if(navigator.userAgent.match(/iPhone|iPod|Android/i)){
    WIDTH = 320;
    HEIGHT = 200;
    NPARTICLES /= 5;
    screenRatio = WIDTH/window.innerWidth;
    canvas.style.width = '100%';
    canvas.style.height = innerHeight + 'px';
    document.getElementById('d').style.width = canvas.style.width;
    document.getElementById('d').style.border = 0;
    document.getElementById('h').style.display = 'none';
    document.getElementById('header').style.display = 'none';
    // WOW it's that hard to get fullscreen on android
    if(navigator.userAgent.match(/Android/i)){
        canvas.style.height = '1000px';
        setTimeout(function(){
            window.scrollTo(0, window.innerHeight);
            setTimeout(function(){
                canvas.style.height = document.documentElement.clientHeight + 'px';
            },1);
        },100);
    }
}



var ctx = canvas.getContext('2d'),
    particles = new Float32Array(NPARTICLES*4),
    flow = new Float32Array(WIDTH*HEIGHT/CELLSIZE/CELLSIZE*2),
    CELLS_X = WIDTH/20,
    floor = Math.floor;

function Particle(x, y){
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
}

for(var i = 0; i < particles.length;){
    particles[i++] = Math.random()*WIDTH;
    particles[i++] = Math.random()*HEIGHT;
    particles[i++] = 0;
    particles[i++] = 0;
}
for(var i = 0; i < flow.length;i++){
    flow[i] = 0;
}

var start = {x:0,y:0}, down = false;
canvas.onmousedown = function(e){
    start.x = (e.clientX-canvas.offsetLeft)*screenRatio;
    start.y = e.clientY-canvas.offsetTop*screenRatio;
    down = true;
}
canvas.ontouchstart = function(e){
    canvas.onmousedown(e.touches[0]);
    return false;
}
canvas.onmouseup = canvas.ontouchend = function(){
    down = false;
}
canvas.ontouchmove = function(e){
    canvas.onmousemove(e.touches[0]);
}

canvas.onmousemove = function(e){
    var mx = (e.clientX-canvas.offsetLeft)*screenRatio,
        my = (e.clientY-canvas.offsetTop)*screenRatio;
    if(!down || mx == start.x && my == start.y) return;
    var ai = (floor(mx/CELLSIZE) +
        floor(my/CELLSIZE)*floor(WIDTH/CELLSIZE))*2;
    flow[ai] += (mx-start.x)*0.4;
    flow[ai+1] += (my-start.y)*0.4;
    start.x = mx;
    start.y = my;
};

setInterval(function(){
    var x, y, vx, vy, vd=0.95, ax, ay, ai, ad=0.95, ar=0.004,
        w1 = WIDTH-1;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'rgba(100, 100, 255, 0.8)';
    ctx.globalCompositeOperation = 'lighter';
    for(var i = 0, l = particles.length; i < l;i+=4){
        x = particles[i]
        y = particles[i+1];
        vx = particles[i+2];
        vy = particles[i+3];
        ai = (~~(x/CELLSIZE)+~~(y/CELLSIZE)*CELLS_X)*2;
        ax = flow[ai];
        ay = flow[ai+1];

        ax = (ax+vx*ar)*ad;
        ay = (ay+vy*ar)*ad;
        vx = (vx+ax)*vd;
        vy = (vy+ay)*vd;
        x += vx;
        y += vy;
        ctx.fillRect(~~x, ~~y, 2, 2);

        if(x < 0){
            vx *= -1;
            x = 0;
        }
        else if(x > w1){
            x = w1;
            vx *= -1;
        }

        if(y < 0){
            vy *= -1;
            y = 0;
        }
        else if(y > HEIGHT){
            y = HEIGHT-1;
            vy *= -1;
        }

        particles[i] = x;
        particles[i+1] = y;
        particles[i+2] = vx;
        particles[i+3] = vy;
        flow[ai] = ax;
        flow[ai+1] = ay;
    }
}, 33);

function FPSCounter(ctx) {
    this.t = new Date().getTime()/1000.0;
    this.n = 0;
    this.fps = 0.0;
    this.draw = function() {
        this.n ++;
        if(this.n == 10) {
            this.n = 0;
            t = new Date().getTime()/1000.0;
            this.fps = Math.round(100/(t-this.t))/10;
            this.t = t;
        }
        ctx.fillStyle = 'white';
        ctx.fillText('FPS: ' + this.fps, 1, 15);
    }
}
var fps = new FPSCounter(ctx);

canvas.width = WIDTH;
canvas.height = HEIGHT;
