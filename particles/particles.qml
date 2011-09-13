import QtQuick 2.0
import "Mover.js" as Mover
Item {
   width:360
   height:600
   
Canvas {
   id:canvas
   anchors.fill: parent
   //renderTarget:Canvas.FramebufferObject
   renderTarget:Canvas.Image
   threadRendering:true


    Component.onCompleted: {
        Mover.canvasW = canvas.width;
        Mover.canvasH = canvas.height;
        Mover.numMovers = 5000;
        Mover.friction = .96;
	Mover.setup();
        canvas.requestPaint();
    }
    onPaint :Mover.run(context);
    onPainted:canvas.requestPaint();
        

    MouseArea {
         anchors.fill: parent
         hoverEnabled:true
         onPositionChanged : {
                if (mouse.x != 0 || mouse.y != 0) {
		   Mover.isMouseDown = false;
		   Mover.mouseX = mouse.x;
		   Mover.mouseY = mouse.y;
                }
         }
         onPressed : {
		Mover.isMouseDown = true;
         }
         onReleased : {
		Mover.isMouseDown = false;
         }
    }

 }
}