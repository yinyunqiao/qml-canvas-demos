import QtQuick 2.0
import "tree.js" as Tree
Canvas {
  id:canvas
  width:2000
  height:1500
  renderTarget:Canvas.Image
  threadRendering:true
  Component.onCompleted :{
    var ctx = canvas.getContext('2d');
    Tree.tree.init(ctx);

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
    var stretch_factor = 600/canvas.height;
    for (var i = 0; i < 5; i++) {
      new Tree.Branch(new Tree.Vector(canvas.width/2 - 100 + 50 * i, canvas.height)
                    , new Tree.Vector(Math.random(-1, 1), -3/stretch_factor)
                    , 15 / stretch_factor
                    , Qt.rgba(Math.random(), Math.random(), Math.random(), 0.3)//Tree.Branch.randomrgba(30, 255, 0.6)
                    , Tree.tree);
    }
  } 

  onPaint: {
    context.fillStyle="black";
    context.fillRect(0,0,canvas.width, canvas.height);
    Tree.tree.render();
    //context.putImageData(context.getImageData(0, 0, canvas.width, canvas.height).filter(Canvas.GrayScale), 0, 0);
  } 
  Timer {
    id:timer
    repeat:true
    interval:33
    running:true
    onTriggered: {canvas.requestPaint(); }
  }
}
