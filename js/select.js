var Mod = function(Game){
    this.game = Game;
    this.mouse = utils.captureMouse(this.game.canvas);
    this.touch = utils.captureTouch(this.game.canvas);
    this.cursor_color = "yellow";
    
};

Mod.prototype.Init = function(){
    var html = '';
    $('#content').html(html);
    $('#content').show();
    
};

Mod.prototype.isEmpty = function(x, y){
    if(this.game.level.tilemap[x][y] == undefined){
        return true;
    } else {
        return false;
    }
};

Mod.prototype.update = function(dt, xScroll, yScroll){
//    console.log("updating controls")
    if(this.touch && this.touch.clicked){
        var tilemap = this.game.level.tilemap;
        var tile = utils.getMapCoords(this.touch, tilemap, xScroll, yScroll, 32, 32);
        if(!this.isEmpty(tile.x, tile.y)){
            this.Select(tile.x, tile.y, xScroll, yScroll);
        }
        this.mouse.clicked = false;
        this.touch.clicked = false;
    }
    if(this.mouse && this.mouse.clicked){
        var tilemap = this.game.level.tilemap;
        var tile = utils.getMapCoords(this.mouse, tilemap, xScroll, yScroll, 32, 32);
        if(!this.isEmpty(tile.x, tile.y)){
            this.Select(tile.x, tile.y, xScroll, yScroll);
        }
        this.mouse.clicked = false;
    }
  //  $('#debug').html('input: (' + this.mouse.x + ',' +  + this.mouse.y + ',' +  + this.mouse.clicked + ')' + ', (' + this.touch.x + ',' +  + this.touch.y + ',' +  + this.touch.clicked + ")");

};

Mod.prototype.LevelUp = function(dt, startX, startY, xScroll, yScroll){
    this.cursor_color = "orange";
    if(this.game.player.tileID > 0){
        this.game.level.tilemap[startX][startY].LevelUp(dt);
    }
};

Mod.prototype.Select = function(startX, startY, xScroll, yScroll){
    this.cursor_color = "red";
    this.game.level.tilemap[startX][startY].Select();
};


Mod.prototype.draw = function(dt, context){
    if(this.game.player.tileID > 0){
        context.strokeStyle = this.cursor_color;
        context.lineWidth = 2;
        context.strokeRect(Math.floor(this.mouse.x/32)*32, Math.floor(this.mouse.y/32)*32, 32, 32);
    }
};

Mod.prototype.onMouseDown = function(params){
    $('#content').hide();
};

Mod.prototype.onMouseUp = function(params){

};


Mod.prototype.OnEnter = function(params){
  //  $('#content').show();
  //  this.Init();
};

Mod.prototype.OnExit = function(params){
    $('#content').hide();
};

Mod.prototype.keydown = function(e){

};

Mod.prototype.close = function(e){
    $('#content').hide();
    this.game.player.tileID = 0;
};


Mod.prototype.keyup = function(e){
    
};
