function Level_Class(Game){
    this.game = Game;
    this.octaves = 4;
    this.num_tiles = 3;
    this.terrain = new Terrain(this.octaves, this.num_tiles);
    this.asteroid = new Asteroid(this.game);
};

Level_Class.prototype.Init = function(width, height){
    this.width = Math.floor(width/32) + 1;
    this.height = Math.floor(height/32) + 1;
    this.tilemap = utils.GetEmptyArray(this.height, this.width);

    this.resource_map = this.asteroid.tilemap;
//    this.resource_map = utils.GetEmptyArray(this.height, this.width);//this.terrain.GenerateWhiteNoise(width, height);
    this.tile = {
     	width: 32,
    	height: 32
    }

    var self = this;
    this.grid = {
	    width: height, // leave this bit, I know it's weird but it works
	    height: width
    }

    this.scroll = {
	    x: 0,
	    y: 0
    }  
};

Level_Class.prototype.update = function(dt, xScroll, yScroll) {
    for (var row = this.startRow; row < this.rowCount; row++) {
        for (var col = this.startCol; col < this.colCount; col++) {
            if(this.tilemap[row] && this.tilemap[row][col]){
                if(this.tilemap[row][col].update){
                    this.tilemap[row][col].update(dt, xScroll, yScroll);
                }
            }
        }
    }
};


Level_Class.prototype.draw = function(dt, context, xScroll, yScroll) {
    this.startRow = Math.floor(this.scroll.y / this.tile.height);
    this.startCol = Math.floor(this.scroll.x / this.tile.width);
    this.rowCount = this.startRow + Math.floor((this.grid.height+this.tile.height)/this.tile.height)+1;
    this.colCount = this.startCol + Math.floor((this.grid.width+this.tile.width)/this.tile.width)+1;
    var tilePositionX, tilePositionY;
    this.asteroid.draw(dt, context);
    for (var row = this.startRow; row < this.rowCount; row++) {
        for (var col = this.startCol; col < this.colCount; col++) {
            // Draw Layers
            if(this.tilemap[row] && this.tilemap[row][col]){
                if(this.tilemap[row][col].draw){
                    this.tilemap[row][col].draw(dt, context, xScroll, yScroll);  
                }
                var building = this.tilemap[row][col];
            }          
        }
    }
};

Level_Class.prototype.getTileCoords = function(mouse){
    var tempPt = {};
    var gridOffsetY = this.grid.height;
    var gridOffsetX = this.grid.width;
    gridOffsetX += (this.game.canvas.width / 2) - (this.tile.width / 2);
    gridOffsetY += (this.game.screenoffsetY) - (this.tile.height / 2);

    var col = (mouse.y - gridOffsetY) * 2;
    col = ((gridOffsetX + col) - mouse.x) / 2;
    var row = ((mouse.x + col) - this.tile.height) - gridOffsetX;

    tempPt.x = Math.round(row / this.tile.height);
    tempPt.y = Math.round(col / this.tile.height);
    return tempPt;
};
