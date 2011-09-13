import QtQuick 2.0
import "tunneler.js" as Tunneler


Canvas {
  id:canvas
  width:360
  height:600
  threadRendering:false
  property bool autoRun:false
  //Timer {running:true; repeat:false; interval:Tunneler.drawRate; onTriggered: requestPaint()}
  Component.onCompleted: Tunneler.init(canvas, 33);
  onPainted : requestPaint()
  onPaint: {
      if (autoRun) {
          Tunneler.mouseX = Math.random() * canvas.width;
          Tunneler.mouseY = Math.random() * canvas.height;
          Tunneler.mousePressed = true;
      }
      Tunneler.drawInternal();
  }

  MouseArea {
      anchors.fill:parent
      onPositionChanged: {
          Tunneler.mouseX = mouse.x;
          Tunneler.mouseY = mouse.y;

      }
      onPressed: {Tunneler.mousePressed = true;requestPaint();}
      onReleased: Tunneler.mousePressed = false;
  }
}
