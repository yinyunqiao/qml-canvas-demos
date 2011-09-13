var WIDTH = 360, // px
    HEIGHT = 600,
    NPARTICLES = 10000,
    CELLSIZE = 20,
    CELLSIZE2 = CELLSIZE/2,
    canvas = null,
    colored = false;

var ctx = null,
    particles = new Array(NPARTICLES*4),
    flow = new Array(WIDTH*HEIGHT/CELLSIZE/CELLSIZE*2),
    CELLS_X = WIDTH/20,
    floor = Math.floor,
    colors = new Array(NPARTICLES);

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

for(var i = 0; i < colors.length;i++){
    colors[i] = Qt.rgba(Math.random(), Math.random(), Math.random(), Math.random() * 0.5 + 0.5);
}

var start = {x:0,y:0}, down = false;

function run() {
    var x, y, vx, vy, vd=0.95, ax, ay, ai, ad=0.95, ar=0.004,
        w1 = WIDTH-1;
    ctx.fillStyle = Qt.rgba(0, 0, 0, 0.6);//'rgba(0, 0, 0, 0.6)';
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalCompositeOperation = 'lighter';
    
    ctx.fillStyle = Qt.rgba(0.33, 0.33, 0.33, 0.8);
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
        if (colored)
          ctx.fillStyle = colors[i/4];
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
}