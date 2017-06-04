var Universe = function(Game){
    this.game = Game;
    this.starfield = new Starfield(this.game);
    this.state = {
        _current: 0,
        VIEW: 0,
        SELECT: 1,
        LAUNCH: 2
    }

    this.tile = {
        width: 32,
        height: 32
    }
    this.width = Math.floor(this.game.canvas.width/this.tile.width);
    this.height = Math.floor(this.game.canvas.height/this.tile.height);
 
    this.Init(this.width, this.height);
};

Universe.prototype.Init = function(width, height){
    this.tilemap = utils.GetEmptyArray(width, height);
    this.spawnAsteroids();
};

Universe.prototype.spawnAsteroids = function(){
    Game.inventory = {};
    var num_asteroids = Math.floor(5 + Math.random() * this.width);
    var home = 0;
    for(var i = 0; i < num_asteroids; i++){
        var x = Math.floor((this.width * 0.2) + Math.random() * (this.width * 0.6));
        var y = Math.floor((this.height * 0.2) + Math.random() * (this.height * 0.6));
        var asteroid = new World(this.game)
        asteroid.name = "Asteroid" + i;
        asteroid.id = i;
        asteroid.coords = {x: x, y: y};
        asteroid.x = asteroid.coords.x * 32;
        asteroid.y = asteroid.coords.y * 32;
        asteroid.starsize = 4 + Math.random() * 8;
        asteroid.evacuate_flag = false;
        asteroid.Init();
        asteroid.sim.store = 0;
        this.game.worlds.push(asteroid);
        this.tilemap[y][x] = {id: 1, index: i, asteroid: asteroid, discovered: asteroid.discovered};
    } 
};


Universe.prototype.update = function(dt, xScroll, yScroll){
    for (var i = 0; i < this.game.worlds.length; i++){
        this.game.GetCoords(this.game.mouse, this.game.worlds[i]);
    }
};

Universe.prototype.Select = function(startX, startY, xScroll, yScroll){

};


Universe.prototype.draw = function(dt, context, xScroll, yScroll) {
    context.fillStyle = "rgba(255,255,255,0.2)";
    context.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    this.startRow = 0;
    this.startCol = 0;
    this.rowCount = this.height;
    this.colCount = this.width;
    for (var row = this.startRow; row < this.rowCount; row++) {
        for (var col = this.startCol; col < this.colCount; col++) {
            // Draw Layers
            if(this.tilemap[row] && this.tilemap[row][col]){
                var tile = this.tilemap[row][col];
                if(tile.asteroid.destroyed!=true){
                    // Draw gravity field
                    if(tile.asteroid.discovered){
                        context.fillStyle = "rgba(0,0,0,1)";
                        context.beginPath();
                        context.arc(
                            tile.asteroid.x+8, 
                            tile.asteroid.y+8, 
                            tile.asteroid.gravity, 
                            0, 
                            Math.PI*2, 
                            true
                        );
                        context.closePath();
                        context.fill();
                    }
                    if(Game.debug){
                        context.strokeStyle = "rgba(255,0,0,1)";
                        context.beginPath();
                        context.arc(
                            tile.asteroid.x+8, 
                            tile.asteroid.y+8, 
                            tile.asteroid.gravity, 
                            0, 
                            Math.PI*2, 
                            true
                        );
                        context.closePath();
                        context.fill();
                    }
                } else {
                    context.strokeStyle = "rgba(255,255,255,1)";
                    context.beginPath();
                    context.arc(
                        tile.asteroid.x+8, 
                        tile.asteroid.y+8, 
                        tile.asteroid.gravity, 
                        0, 
                        Math.PI*2, 
                        true
                    );
                    context.closePath();
                    context.fill();
                }
            }
        }
    }

    this.starfield.draw(dt, context);

    for (var row = this.startRow; row < this.rowCount; row++) {
        for (var col = this.startCol; col < this.colCount; col++) {
            // Draw Layers
            if(this.tilemap[row] && this.tilemap[row][col]){
                var tile = this.tilemap[row][col];
                if(tile.asteroid.destroyed == false){
                    if(tile.asteroid.id == Game.world.id){
                        context.fillStyle = "rgba(255, 255, 0, 1)";
                        context.fillRect(tile.asteroid.x, tile.asteroid.y, this.tile.width*0.5, this.tile.height*0.5);
                    }else 
                    if(tile.asteroid.discovered && tile.id != Game.world.id){
                        context.fillStyle = "rgba(255, 0, 0, 1)";
                        context.fillRect(tile.asteroid.x, tile.asteroid.y, this.tile.width*0.5, this.tile.height*0.5);
                    } 
                    if(tile.asteroid.discovered && tile.asteroid.colonised){
                        context.fillStyle = "green";
                        context.beginPath();
                        context.arc(tile.asteroid.x + 8, tile.asteroid.y + 8, 4, 0, Math.PI*2, true);
                        context.closePath();
                        context.fill();
                    }

                    if(tile.asteroid.discovered && Math.floor(this.game.mouse.x/32) == Math.floor(tile.asteroid.x/32) && Math.floor(this.game.mouse.y/32) == Math.floor(tile.asteroid.y/32)){
                        context.fillStyle = "rgba(0, 255, 0, 1)";
                        context.fillText(tile.asteroid.name, Game.mouse.x, Game.mouse.y);
                    }
                    if(tile.asteroid.meteor_shower && tile.asteroid.discovered && !tile.asteroid.descovered){
                        context.fillStyle = "rgba(255, 155, 0, 1)";
                        context.fillRect(tile.asteroid.x, tile.asteroid.y, this.tile.width*0.5, this.tile.height*0.5);
                    } 
                    if(Game.debug && !tile.asteroid.discovered && tile.id != Game.world.id){
                        context.strokeStyle = "rgba(255, 0, 0, 1)";
                        context.strokeRect(tile.asteroid.x, tile.asteroid.y, this.tile.width*0.5, this.tile.height*0.5);
                    } 
                    if(Game.debug && tile.asteroid.collision_buddy){
                        context.fillStyle = "rgba(255, 0, 0, 0.8)";
                        context.fillText(tile.asteroid.collision_buddy.name, tile.asteroid.x+16, tile.asteroid.y+14);
                        context.fillText(tile.asteroid.collision_buddy.trajectory.distance, tile.asteroid.x+96, tile.asteroid.y+10);
                    }
                } else {
                    if(Game.debug){
                        //context.fillStyle = "rgba(0, 255, 0, 1)";
                        //context.fillRect(tile.asteroid.x, tile.asteroid.y, this.tile.width*0.5, this.tile.height*0.5);
                    }
                    context.save();
                    context.fillStyle = "rgba(255,255,255,1)";
                    context.beginPath();
                    context.arc(
                        tile.asteroid.x+8, 
                        tile.asteroid.y+8, 
                        tile.asteroid.starsize, 
                        0, 
                        Math.PI*2, 
                        true
                    );
                    context.closePath();
                    context.fill();
                    context.shadowColor = '#ffffff';
                    context.shadowBlur = 10;
                    context.shadowOffsetX = 0;
                    context.shadowOffsetY = 0;
                    context.restore();
                }    
//                context.fillStyle = "rgba(255, 255, 255, 0.8)";
//                context.fillText(tile.asteroid.name, tile.asteroid.x+16, tile.asteroid.y);
            }
        }
    }
    this.game.ship.draw(dt, context);
};

Universe.prototype.keydown = function(event){

};

Universe.prototype.keyup = function(event){

};

Universe.prototype.onMouseDown = function(params){

};

Universe.prototype.onMouseUp = function(params){

};

Universe.prototype.OnEnter = function(params){
    this.state._current = this.state[params.state] || 0;
    $('#buildtool').hide();
    $('#world-nav').hide();
    $('#stats').show();
    $('#panel').show();
    $('#alerts').show();
    $('#donate').hide();
    this.game.PlayAudio('universe', true);
    //console.log(this.state._current);
};

Universe.prototype.OnExit = function(params){
    this.game.state._current = this.game.state.DEFAULT;
    $('#message').hide();
    $('#stats').hide();
    $('#panel').hide();
    $('#alerts').hide();
    this.game.PauseAudio('universe');
};

Universe.prototype.close = function(e){
    $('#message').hide();
};

Universe.prototype.keydown = function(e){

};

Universe.prototype.keyup = function(e){
    
};

Universe.prototype.Set = function(e){

};

