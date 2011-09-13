// this two functions were promoted to be global
// to make firefoxs jit happy - URGH
function clamp(x, min, max) {
    if(x < min) return min;
    if(x > max) return max-1;
    return x;
}

// this is basically where the magic happens
function drawLight(canvas, ctx, normals, textureData, shiny, specularity, lx, ly, lz) {
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    var i = 0;
    var ni = 0;
    var dx = 0, dy = 0, dz = 0;
    for(var y = 0; y < canvas.height; y++) {
        for(var x = 0; x < canvas.width; x++) {
            // get surface normal
            nx = normals[ni];
            ny = normals[ni+1];
            nz = normals[ni+2];

            // make it a bit faster by only updateing the direction
            // for every other pixel
            if(shiny > 0 || (ni&1) == 0){
                // calculate the light direction vector
                dx = lx - x;
                dy = ly - y;
                dz = lz;

                // normalize it
                magInv = 1.0/Math.sqrt(dx*dx + dy*dy + dz*dz);
                dx *= magInv;
                dy *= magInv;
                dz *= magInv;
            }

            // take the dot product of the direction and the normal
            // to get the amount of specularity
            var dot = dx*nx + dy*ny + dz*nz;
            var spec = Math.pow(dot, 20)*specularity;
            spec += Math.pow(dot, 400)*shiny;
            // spec + ambient
            var intensity = spec + 0.5;

            for(var channel = 0; channel < 3; channel++) {
                data[i+channel] = Math.round(clamp(textureData[i+channel]*intensity, 0, 255));
            }
            i += 4;
            ni += 3;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}


function normalmap(canvasId, texture, normalmap, specularity, shiny) {

    var canvas = document.getElementById(canvasId);
    if(canvas.getContext == undefined) {
        document.write('unsupported browser');
        return;
    }

    var ctx = canvas.getContext('2d');

    var normalData = null;
    var textureData = null;

    function getDataFromImage(img) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, img.width, img.height);
        ctx.drawImage(img, 0 ,0);
        return ctx.getImageData(0, 0, img.width, img.height);
    }

    function loadImage(src, callback) {
        var img = document.createElement('img');
        img.onload = callback;
        img.src = src;
        return img;
    }

    var normals = [];
    var textureData = null;
    var normalsImg = loadImage(normalmap, function() {
        var data = getDataFromImage(normalsImg).data;
        // precalculate the normals
        for(var i = 0; i < canvas.height*canvas.width*4; i+=4) {
            var nx = data[i];
            // flip the y value
            var ny = 255-data[i+1];
            var nz = data[i+2];

            // normalize
            var magInv = 1.0/Math.sqrt(nx*nx + ny*ny + nz*nz);
            nx *= magInv;
            ny *= magInv;
            nz *= magInv;

            normals.push(nx);
            normals.push(ny);
            normals.push(nz);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var textureImg = loadImage(texture, function() {
            textureData = getDataFromImage(textureImg).data;
            main();
        });

    });


    function main() {
        var rect = canvas.getBoundingClientRect();
        canvas.onmousemove = function(e) {
            drawLight(canvas, ctx, normals, textureData, shiny, specularity, e.clientX+50, e.clientY+50, 100);
        }
    }
}
