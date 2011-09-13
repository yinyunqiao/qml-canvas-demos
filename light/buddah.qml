import QtQuick 2.0
import "light-qml.js" as Light


Rectangle {
  id:container
  width:360
  height:600

  Canvas {
    id:canvas
    anchors.fill:parent
    property string image:"buddah.jpg"
    property string normalImage:"buddah_normals.jpg"
    property real clientX:0
    property real clientY:0
    property bool init:false 
    Component.onCompleted: {
       loadImage(image);
       loadImage(normalImage);
       Light.specularity = 3;
       Light.shiny = 20;
    }
   
    onImageLoaded: {
       if (isImageLoaded(image) && isImageLoaded(normalImage)) {
         requestPaint();
       }
    }
    
    MouseArea {
       anchors.fill:parent
       onPositionChanged: {
            canvas.clientX = mouse.x + 50;
            canvas.clientY = mouse.y +50;
            canvas.requestPaint();
       }
    }

    onPaint : {
      if (!canvas.init) {
         Light.normalmap(canvas, canvas.image, canvas.normalImage);
         canvas.init = true;
      } else {
       Light.drawLight(canvas, context, canvas.clientX, canvas.clientY, 100);
     }
    }
  }
}