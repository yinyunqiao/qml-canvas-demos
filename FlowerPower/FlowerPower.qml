import QtQuick 2.0
import "FlowerPower.js" as FlowerPower
Item {
  id:container
  width:1024
  height:768
  Timer {
      repeat: true; running: true;
      interval: FlowerPower.Garden.options.growSpeed;
      onTriggered: canvas.requestPaint();
  }
  Canvas {
      id:canvas
      anchors.fill:parent
      smooth:true
      renderTarget:Canvas.FramebufferObject
      threadRendering:false

      onPaint:FlowerPower.garden.render();

      Component.onCompleted: {
          FlowerPower.setupGargen(canvas);
      }

      MouseArea {
          anchors.fill:parent
          onDoubleClicked: {
              FlowerPower.garden.clear();
          }

          onPositionChanged: {
              var x =mouse.x - 80;
              var y = mouse.y - 80;
              var l = FlowerPower.actualPos.set(x, y).subtract(FlowerPower.lastPos).length();
              if (FlowerPower.mousePressed && l > (FlowerPower.Garden.options.bloomRadius.max)) {
                  FlowerPower.garden.createRandomBloom(x, y);
                  FlowerPower.lastPos.set(x, y);
              }
          }

          onPressed: {
              var x = mouse.x;
              var y = mouse.y;
              FlowerPower.mousePressed = true;
              FlowerPower.garden.createRandomBloom(x, y);
          }

          onReleased: {
              FlowerPower.mousePressed = false;
          }
      }
  }
}
