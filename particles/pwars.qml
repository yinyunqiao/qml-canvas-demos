import QtQuick 2.0
import "pwars-qml.js" as PWARS


Canvas {
  id:canvas
  width:360
  height:600
  threadRendering:false
  renderTarget : Canvas.FramebufferObject

  Component.onCompleted: {
    PWARS.canvas = canvas;
    PWARS.ctx = canvas.getContext('2d');
  }

  onPainted : requestPaint()
  onPaint: {
    PWARS.run();
  }

  MouseArea {
    anchors.fill:parent
    onPressed :{
       PWARS.start.x = mouse.x;
       PWARS.start.y = mouse.y;
       PWARS.down = true;
    }
    onReleased : PWARS.down = false;
    onDoubleClicked: {PWARS.colored = !PWARS.colored;}
    onPositionChanged:{
       var mx = mouse.x,
       my = mouse.y;
       if(!PWARS.down || mx == PWARS.start.x && my == PWARS.start.y) return;
       var ai = (Math.floor(mx/PWARS.CELLSIZE) +
                 Math.floor(my/PWARS.CELLSIZE)*Math.floor(PWARS.WIDTH/PWARS.CELLSIZE))*2;
       PWARS.flow[ai] += (mx-PWARS.start.x)*0.4;
       PWARS.flow[ai+1] += (my-PWARS.start.y)*0.4;
       PWARS.start.x = mx;
       PWARS.start.y = my;
    }
  }
}