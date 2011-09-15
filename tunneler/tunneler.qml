import QtQuick 2.0
import "tunneler.js" as Tunneler


Canvas {
  id:canvas
  width:1900
  height:1100
  threadRendering:false
  renderTarget:Canvas.FramebufferObject
  property bool autoRun:false
  Timer {running:true; repeat:true; interval:Tunneler.drawRate; onTriggered: requestPaint()}
  Component.onCompleted: Tunneler.init(canvas, 33);
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
      onPressed: {Tunneler.mousePressed = true;}
      onReleased: Tunneler.mousePressed = false;
  }
}