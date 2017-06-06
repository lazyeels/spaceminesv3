/**
 * Normalize the browser animation API across implementations. This requests
 * the browser to schedule a repaint of the window for the next animation frame.
 * Checks for cross-browser support, and, failing to find it, falls back to setTimeout.
 * @param {function}    callback  Function to call when it's time to update your animation for the next repaint.
 * @param {HTMLElement} element   Optional parameter specifying the element that visually bounds the entire animation.
 * @return {number} Animation frame request.
 */
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
                                  window.mozRequestAnimationFrame ||
                                  window.msRequestAnimationFrame ||
                                  window.oRequestAnimationFrame ||
                                  function (callback) {
                                    return window.setTimeout(callback, 1000/30);
                                  });
}

/**
 * ERRATA: 'cancelRequestAnimationFrame' renamed to 'cancelAnimationFrame' to reflect an update to the W3C Animation-Timing Spec.
 *
 * Cancels an animation frame request.
 * Checks for cross-browser support, falls back to clearTimeout.
 * @param {number}  Animation frame request.
 */
if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
                                 window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
                                 window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
                                 window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
                                 window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
                                 window.clearTimeout);
}

/* Object that contains our utility functions.
 * Attached to the window object which acts as the global namespace.
 */
window.utils = {};

/**
 * Keeps track of the current mouse position, relative to an element.
 * @param {HTMLElement} element
 * @return {object} Contains properties: x, y, event
 */
utils.captureMouse = function (element) {
    var mouse = {x: 0, y: 0, clicked: false, radius: 5};
    element.addEventListener('mousemove', 
	function (event) {
            var x, y;
            if (event.pageX || event.pageY) {
                x = event.pageX;
                y = event.pageY;
            } else {
                x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
            }
            x -= element.offsetLeft;
            y -= element.offsetTop;
            mouse.x = x;
            mouse.y = y;
        }, false);
    element.addEventListener('mousedown', 
	function (event) {
            event.preventDefault();
            mouse.clicked = true;
        }, false);
    element.addEventListener('mouseup', 
	function (event) {
            mouse.clicked = false;
        }, false);

    element.addEventListener('dblclick', 
	function (event) {
            event.preventDefault();
            mouse.dblclicked = true;
        }, false);

    element.addEventListener('onmousewheel',
        function (event){
            var wheel = event.wheelDelta/120;//n or -n
            var zoom = Math.pow(1 + Math.abs(wheel)/2 , wheel > 0 ? 1 : -1);
            mouse.zoom = zoom;
            console.log(zoom)
        }, false);

    return mouse;
};

/**
 * Keeps track of the current (first) touch position, relative to an element.
 * @param {HTMLElement} element
 * @return {object} Contains properties: x, y, isPressed, event
 */
window.utils.captureTouch = function (element) {
  var touch = {x: null, y: null, clicked: false, event: null},
      body_scrollLeft = document.body.scrollLeft,
      element_scrollLeft = document.documentElement.scrollLeft,
      body_scrollTop = document.body.scrollTop,
      element_scrollTop = document.documentElement.scrollTop,
      offsetLeft = element.offsetLeft,
      offsetTop = element.offsetTop;

  element.addEventListener('touchstart', function (event) {
    touch.clicked = true;
    touch.event = event;
  }, false);

  element.addEventListener('touchend', function (event) {
    touch.clicked = false;
    touch.x = null;
    touch.y = null;
    touch.event = event;
  }, false);
  
  element.addEventListener('touchmove', function (event) {
    var x, y,
        touch_event = event.touches[0]; //first touch
    
    if (touch_event.pageX || touch_event.pageY) {
      x = touch_event.pageX;
      y = touch_event.pageY;
    } else {
      x = touch_event.clientX + body_scrollLeft + element_scrollLeft;
      y = touch_event.clientY + body_scrollTop + element_scrollTop;
    }
    x -= offsetLeft;
    y -= offsetTop;
    
    touch.x = x;
    touch.y = y;
    touch.event = event;
  }, false);
  
  return touch;
};

utils.localStorage = function() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
};


/**
 * Returns a color in the format: '#RRGGBB', or as a hex number if specified.
 * @param {number|string} color
 * @param {boolean=}      toNumber=false  Return color as a hex number.
 * @return {string|number}
 */
window.utils.parseColor = function (color, toNumber) {
  if (toNumber === true) {
    if (typeof color === 'number') {
      return (color | 0); //chop off decimal
    }
    if (typeof color === 'string' && color[0] === '#') {
      color = color.slice(1);
    }
    return window.parseInt(color, 16);
  } else {
    if (typeof color === 'number') {
      color = '#' + ('00000' + (color | 0).toString(16)).substr(-6); //pad
    }
    return color;
  }
};

/**
 * Converts a color to the RGB string format: 'rgb(r,g,b)' or 'rgba(r,g,b,a)'
 * @param {number|string} color
 * @param {number}        alpha
 * @return {string}
 */
window.utils.colorToRGB = function (color, alpha) {
  //number in octal format or string prefixed with #
  if (typeof color === 'string' && color[0] === '#') {
    color = window.parseInt(color.slice(1), 16);
  }
  alpha = (alpha === undefined) ? 1 : alpha;
  //parse hex values
  var r = color >> 16 & 0xff,
      g = color >> 8 & 0xff,
      b = color & 0xff,
      a = (alpha < 0) ? 0 : ((alpha > 1) ? 1 : alpha);
  //only use 'rgba' if needed
  if (a === 1) {
    return "rgb("+ r +","+ g +","+ b +")";
  } else {
    return "rgba("+ r +","+ g +","+ b +","+ a +")";
  }
};

/**
 * Determine if a rectangle contains the coordinates (x,y) within it's boundaries.
 * @param {object}  rect  Object with properties: x, y, width, height.
 * @param {number}  x     Coordinate position x.
 * @param {number}  y     Coordinate position y.
 * @return {boolean}
 */
utils.containsPoint = function (rect, x, y) {
  return !(x < rect.x ||
           x > rect.x + rect.width ||
           y < rect.y ||
           y > rect.y + rect.height);
};

/**
 * Determine if two rectangles overlap.
 * @param {object}  rectA Object with properties: x, y, width, height.
 * @param {object}  rectB Object with properties: x, y, width, height.
 * @return {boolean}
 */
utils.intersects = function (rectA, rectB) {
  return !(rectA.x + rectA.width < rectB.x ||
           rectB.x + rectB.width < rectA.x ||
           rectA.y + rectA.height < rectB.y ||
           rectB.y + rectB.height < rectA.y);
};

// Animation - calculate FPS
utils.elapsedTime = function(lastTime) {
    var d = new Date();
    return d.getMilliseconds();
};

utils.GetEmptyArray = function(width, height){
    var map = [];
    var tmp = [];
    for(row = 0; row < height; row++){
        var tmp = [];
        for(col = 0; col < width; col++){
            tmp.push();
        }
        map.push(tmp);
    }
    return map;
};

utils.distanceFrom = function(objectA, objectB, xScroll, yScroll){
    var dx = (objectB.x + xScroll) - objectA.x;
    var dy = (objectB.y + yScroll) - objectA.y;
    dist = Math.sqrt(dx * dx + dy * dy);
    return {dx: dx, dy: dy, dist:dist};    
};

utils.checkCollision = function(objectA, objectB, xScroll, yScroll){
    if(objectB.radius){
        objectB.width = objectB.radius;
        objectB.height = objectB.radius;
    }
    if(objectA.x > objectB.x && objectA.x < objectB.x + objectB.width){
        if(objectA.y > objectB.y && objectA.y < objectB.y + objectB.height){
	    return true;
        }  
    }
};

utils.MouseToTile = function(mouse, tileWidth, tileHeight, xScroll, yScroll){
    var tile = {}
    var col = Math.floor((mouse.x + xScroll)/tileWidth);
    var row = Math.floor((mouse.y + yScroll)/tileHeight);
    tile.x = col;
    tile.y = row;
    return tile;
};

utils.RandomNumber = function(range){
    var len = range.length;
    var pick = Math.floor(Math.random() * len);
    return range[pick];
};

utils.ScreenToTile = function(x, y, tileWidth, tileHeight, xScroll, yScroll){
    return {
        x: Math.abs(Math.floor((x-xScroll)/tileWidth)),
        y: Math.abs(Math.floor((y-yScroll)/tileHeight)),
    }
};

utils.TileToScreen = function(x, y, tileWidth, tileHeight, xScroll, yScroll){
    return {
        x: Math.floor((x-xScroll) * tileWidth),
        y: Math.floor((y-yScroll) * tileHeight),
    }
};

utils.distanceFrom = function(objectA, objectB, xScroll, yScroll){
    var dx = (objectB.x - xScroll) - objectA.x;
    var dy = (objectB.y - yScroll) - objectA.y;
    dist = Math.sqrt(dx * dx + dy * dy);
    return {dx: dx, dy: dy, dist:dist};    
};

utils.toNumber = function(data){
    try{
        return parseInt(data);
    } catch(err) {
        return child.textContent;
    }
};

utils.randomChoice = function(object, type){
    var entities = [];
    for(var i=0; i < object.length; i++){
       if(object[i].constructor.name == type){
           entities.push(object[i]);
       }
    }
    var num_entities = entities.length;
    var choice = Math.floor(num_entities * Math.random() + 0);
    return entities[choice];
};

utils.getRandomDirection = function(x, y, radius){
    var angle = Math.random()*Math.PI*2;
    return {x: x+Math.floor(Math.cos(angle)*radius), y: y+Math.floor(Math.sin(angle)*radius)};
};


utils.getTile = function(object, tilemap, xScroll, yScroll, width, height){
    var x = object.x,
        y = object.y;
    var tileX = Math.floor((x/width) + (xScroll)/width),
        tileY = Math.floor((y/height) + (yScroll)/height);
    if(tilemap[tileY] && tilemap[tileY][tileX]){
        return tilemap[tileY][tileX];
    } else {
        return 0;
    }
};

utils.getMapCoords = function(object, tilemap, xScroll, yScroll, width, height){
    var x = object.x,
        y = object.y;
    var tileX = Math.floor((x/width) + (xScroll)/width),
        tileY = Math.floor((y/height) + (yScroll)/height);
        return {x: tileX, y: tileY};
};


utils.getTileType = function(tileID, tiletype){
    return tiletype[tileID];
};

utils.circleCollision = function(firstBall, secondBall){
    if (firstBall.x + firstBall.radius + secondBall.radius > secondBall.x && firstBall.x < secondBall.x + firstBall.radius + secondBall.radius && firstBall.y + firstBall.radius + secondBall.radius > secondBall.y 
&& firstBall.y < secondBall.y + firstBall.radius + secondBall.radius){
        //AABBs are overlapping
        return utils.getOverlap(firstBall, secondBall);
    } else {
        return false;
    }
};

utils.getOverlap = function(firstBall, secondBall){
    var dx = (secondBall.x - firstBall.x);
    var dy = (secondBall.y - firstBall.x);
    var distance = Math.sqrt(dy * dy + dx * dx); 
    if (distance < firstBall.radius + secondBall.radius){
        return {distance: Math.floor(distance), dx: dx, dy: dy};
    } else {
        return false;
    }
};

utils.getRandomAngle = function(x, y, radius){
    var angle = Math.random() * Math.PI * 2;
    var x = x + Math.floor(Math.cos(angle) * radius);
    var y = y + Math.floor(Math.sin(angle) * radius);
    return {x: x, y: y};
};
