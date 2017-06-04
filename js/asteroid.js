function Asteroid(Game){
    this.game = Game;
    var width = Math.floor(this.game.canvas.width/32);
    var height = Math.floor(this.game.canvas.height/32);
    this.starfield = new Starfield(this.game);
    this.ground_img = new Image();
    this.ground_img.src = 'img/ground.png';

    this.background = new Image();
    this.background.src = "img/rock_texture.jpg";
    this.Init(width, height);
};

Asteroid.prototype.Init = function(width, height){
    this.tilemap = utils.GetEmptyArray(width, height);
    this.tile = {
     	width: 32,
    	height: 32
    }

    this.grid = {
	    width: width,
	    height: height
    }

    this.scroll = {
	    x: 0,
	    y: 0
    }  
    this.size = 0;
    this.current = 0;
    this.moves = ['right', 'up', 'left', 'down'];
    this.limit = 8;
    this.Generate();
};

Asteroid.prototype.Generate = function(){
    var initialsize = 0.1 + Math.random()*0.36;
    var midX = 1+Math.floor(this.tilemap.length * 0.33)
    var midY = 1+Math.floor(this.tilemap.length * 0.33)
    for(var y = midY; y <= midY + Math.floor(this.tilemap.length * initialsize); y++){
        for(var x = midX; x <= midX + Math.floor(this.tilemap.length * initialsize); x++){
            this.tilemap[x][y] = 0;
        }
    }  
    this.cursor = {x: midX + Math.floor(midX*0.5), y: midY + Math.floor(midY*0.5)}
  //  console.log(midX, midY, initialsize, this.tilemap.length, this.cursor)  

    var threshold = 0.8;
    this.walkIsland('placeTile', threshold);
    threshold = 0.5;
    this.limit = 8;
    for(var i = 0; i < 35; i++){ 
        threshold = 0.6//1-(i*0.1); 
        this.walkIsland('Smooth', threshold);
    }
    this.Subdivide(this.tilemap);
};
Asteroid.prototype.Move = function(direction){
    switch(direction){
        case 'left':
            this.cursor.x -= 1;
            break
        case 'right':
            this.cursor.x += 1;
            break
        case 'up':
            this.cursor.y -= 1;
            break
        case 'down':
            this.cursor.y += 1;
            break
    }
};

Asteroid.prototype.placeTile = function(threshold){
    if(this.tileID == undefined && Math.random() >= threshold){
        this.tilemap[this.cursor.x][this.cursor.y] = 0;   
    }
};

Asteroid.prototype.update = function(dt, context, xScroll, yScroll){    
};

Asteroid.prototype.walkIsland = function(callback, threshold){
    if(this.size < this.limit){
        for(var dir = 0; dir < this.moves.length; dir++){
            if(dir % 2 == 0){
                this.size +=1     
            }
            for(var i=0; i < this.size; i++){ 
                var move = this.moves[dir];
                this.Move(move);
                this.tileID = this.tilemap[this.cursor.x][this.cursor.y];    
                this[callback](threshold); 
            }
        }
    }
};

Asteroid.prototype.Smooth = function(threshold){
    this.tileID = this.tilemap[this.cursor.x][this.cursor.y];
    var top, bottom, left, right;
    try{
        top = this.tilemap[this.cursor.x][this.cursor.y-1];
        bottom = this.tilemap[this.cursor.x][this.cursor.y+1];
        left = this.tilemap[this.cursor.x-1][this.cursor.y];
        right = this.tilemap[this.cursor.x+1][this.cursor.y];
    } catch(err){
    }
        var total = 0;
        var adj_tiles = [top, bottom, left, right];
        var proportion = this.getPercentage(adj_tiles);
        this.placeTile(threshold);

};

Asteroid.prototype.Subdivide = function(array){
    var qrt_1 = utils.GetEmptyArray(Math.floor(this.grid.width*0.5), Math.floor(this.grid.height*0.5));
    //console.log(Math.floor(this.grid.width*0.5), Math.floor(this.grid.height*0.5))
    for (var y = 0; y <= this.grid.height; y++){
        for (var x = 0; x <= this.grid.width; x++){
            if(x <= this.grid.width*0.5 && y <= this.grid.height*0.5){
                //console.log(x, y, this.tilemap[x][y])
                //if(this.tilemap[x] && this.tilemap[x][y]){
                //    qrt_1[x][y] = this.tilemap[x][y];
                //}
            } 
        }
    }
    //console.log(qrt_1)
};



Asteroid.prototype.getPercentage = function(array){
    var total = 0;
    for (var i=0; i < array.length; i++){ 
        var count = array[i]; 
        if(count!=undefined){
            total += count;
        }
    } 
    
    return total/array.length;
};

Asteroid.prototype.draw = function(dt, context, xScroll, yScroll) {
    context.fillStyle = "gray";
    var tilePositionX, tilePositionY;
    for (var col = 0; col < this.grid.width; col++) {
        for (var row = 0; row < this.grid.height; row++) {
            if(this.tilemap[row][col]==0){
                var tilePositionX = (row - col) * this.tile.height;
//                tilePositionX += (this.game.canvas.width / 2) - (this.tile.width / 2);
//                var tilePositionY = (row + col) * (this.tile.height / 2);
//                tilePositionY += 100 - (this.tile.height / 2);
//                context.drawImage(this.ground_img, 
//                    tilePositionX, 
//                    tilePositionY
//                );
                tilePositionX = (this.tile.width * col);
  	            tilePositionY = (this.tile.height * row);
                context.drawImage(this.background, tilePositionX, tilePositionY, 32, 32);//, tilePositionX, tilePositionY, 32, 32);
            }
        }
    }
};
