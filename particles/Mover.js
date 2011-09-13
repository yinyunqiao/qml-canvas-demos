var movers = new Array(600);
var  pi2 = Math.PI * 2;
var canvasW;
var canvasH;
var numMovers = 1000;
var friction=0.96;
var mouseX;
var mouseY;
var mouseVX;
var mouseVY;
var prevMouseX;
var prevMouseY;
var isMouseDown;


function Mover() {
   this.color = Qt.rgba(Math.random(), Math.random(), Math.random(), 1);
   this.y     = 0;
   this.x     = 0;
   this.vX    = 0;
   this.vY    = 0;
   this.size  = 1;
}
function setup() {
    var arr = new Array(10);
    for ( var i = 0; i<10; i++)
      arr[i] = 0;
    for (var i = 0; i < numMovers; i++){
       var m = new Mover();        
        m.x   = canvasW * 0.5;
        m.y   = canvasH * 0.5;
        m.vX  = Math.cos(i) * Math.random() * 34;
        m.vY  = Math.sin(i) * Math.random() * 34;
        movers[i] = m;
    }
    for (var j = 0; j < numMovers; j++){
        var n = movers[j];
    }

    mouseX = prevMouseX = canvasW * 0.5;
    mouseY = prevMouseY = canvasH * 0.5;
}

function run(ctx) {
    ctx.reset();
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(8,8,12,0)";
    ctx.fillRect( 0 , 0 , canvasW , canvasH );
    ctx.globalCompositeOperation = "lighter";
    
    mouseVX    = mouseX - prevMouseX;
    mouseVY    = mouseY - prevMouseY;
    prevMouseX = mouseX;
    prevMouseY = mouseY;
        
    var toDist   = canvasW * 0.86;
    var stirDist = canvasW * 0.125;
    var blowDist = canvasW * 0.5;
        
    var Mrnd = Math.random;
    var Mabs = Math.abs;
        
    var i = numMovers;
    while ( i-- ){
            var m  = movers[i];
            var x  = m.x;
            var y  = m.y;
            var vX = m.vX;
            var vY = m.vY;
            
            var dX = x - mouseX;
            var dY = y - mouseY; 
            var d  = Math.sqrt( dX * dX + dY * dY );
            if( d == 0 ) d = 0.001;
            dX /= d;
            dY /= d;
            
            if ( isMouseDown ){
                if ( d < blowDist ){
                    var blowAcc = ( 1 - ( d / blowDist ) ) * 14;
                    vX += dX * blowAcc + 0.5 - Mrnd();
                    vY += dY * blowAcc + 0.5 - Mrnd();
                }
            }
            
            if ( d < toDist ){
                var toAcc = ( 1 - ( d / toDist ) ) * canvasW * 0.0014;
                vX -= dX * toAcc;
                vY -= dY * toAcc;            
            }
            
            if ( d < stirDist ){
                var mAcc = ( 1 - ( d / stirDist ) ) * canvasW * 0.00026;
                vX += mouseVX * mAcc;
                vY += mouseVY * mAcc;            
            }
            
            vX *= friction;
            vY *= friction;
            
            var avgVX = Mabs( vX );
            var avgVY = Mabs( vY );
            var avgV  = ( avgVX + avgVY ) * 0.5;
            
            if( avgVX < .1 ) vX *= Mrnd() * 3;
            if( avgVY < .1 ) vY *= Mrnd() * 3;
            
            var sc = avgV * 0.45;
            sc = Math.max( Math.min( sc , 3.5 ) , 0.4 );
            
            var nextX = x + vX;
            var nextY = y + vY;
            
            if ( nextX > canvasW ){
                nextX = canvasW;
                vX *= -1;
            }
            else if ( nextX < 0 ){
                nextX = 0;
                vX *= -1;
            }
            
            if ( nextY > canvasH ){
                nextY = canvasH;
                vY *= -1;
            }
            else if ( nextY < 0 ){
                nextY = 0;
                vY *= -1;
            }
            
            m.vX = vX;
            m.vY = vY;
            m.x  = nextX;
            m.y  = nextY;
            
            ctx.fillStyle =m.color;
            //ctx.beginPath();
            //ctx.arc( nextX , nextY , sc , 0 , pi2 , true );
            //ctx.ellipse( nextX , nextY , sc , sc);
            //ctx.closePath();
            //ctx.fill();        
            ctx.fillRect(nextX, nextY, sc, sc);
        }
}