import QtQuick 2.0
import "tree.js" as Tree
Canvas {
  id:canvas
  width:600
  height:360
  //renderTarget:Canvas.Image
  //threadRendering:false
  Component.onCompleted :{
    var ctx = canvas.getContext('2d');
    Tree.tree.init(ctx);

    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width, canvas.height);
  } 

  onPaint: {
    var stretch_factor = 600/canvas.height;
    for (var i = 0; i < 3; i++) {
      new Tree.Branch(new Tree.Vector(canvas.width/2 + Math.random(-10, 10), canvas.height)
                    , new Tree.Vector(Math.random(-1, 1), -3/stretch_factor)
                    , 15 / stretch_factor
                    , Qt.rgba(Math.random(), Math.random(), Math.random(), 0.3)//Tree.Branch.randomrgba(30, 255, 0.6)
                    , Tree.tree);
    }
    Tree.tree.render();
  } 
  Timer {
    id:timer
    repeat:true
    interval:100
    running:true
    onTriggered:canvas.requestPaint();
  }
}