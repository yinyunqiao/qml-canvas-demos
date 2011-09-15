import QtQuick 2.0
import "tree.js" as Tree
Canvas {
  id:canvas
  width:1000
  height:800
  renderTarget:Canvas.Image
  threadRendering:false
  Component.onCompleted :reset();
  function reset() {
    var ctx = canvas.getContext('2d');
    ctx.reset();
    ctx.fillStyle=Qt.rgba(0, 0, 0, 1);
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    Tree.trees = [];
    newTree(ctx);
    requestPaint();
  }
  function newTree(ctx) {
    var t = new Tree.Tree();
    t.init(ctx);
    Tree.trees[Tree.trees.length] = t;
    var stretch_factor = 600/canvas.height;
    new Tree.Branch(new Tree.Vector(Math.random() * canvas.width/2 + canvas.width/4, canvas.height)
                  , new Tree.Vector(Math.random(-1, 1), -3/stretch_factor)
                  , 15 / stretch_factor
                  , Qt.rgba(Math.random(), Math.random(), Math.random(), 0.3)
                  , t);
  }

  onPaint: {
    for (var i = 0; i < Tree.trees.length; i++)
      if (!Tree.trees[i].finished())
         Tree.trees[i].render();
  }
  onPainted: { 
    for (var i = 0; i < Tree.trees.length; i++)
       if (!Tree.trees[i].finished())
          requestPaint();
  }
  MouseArea {
    anchors.fill:parent
    onClicked: {newTree(canvas.getContext('2d')); requestPaint();}
    onDoubleClicked : { reset(); canvas.requestPaint();}
  }
}