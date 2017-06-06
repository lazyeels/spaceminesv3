var Cursor = function(Game){
    this.game = Game;
    this.building = undefined;
    this.color = "white";
};

Cursor.prototype.update = function(dt){
    this.width = 32;
    this.height = 32;

    if (this.game.touch && this.game.touch.x !=null){
        this.x = Math.floor(this.game.touch.x/this.width);
        this.y = Math.floor(this.game.touch.y/this.height);
    } else {
        this.x = Math.floor(this.game.mouse.x/this.width);
        this.y = Math.floor(this.game.mouse.y/this.height);
    }
};

Cursor.prototype.draw = function(dt, context){
    if(this.game.state._current != this.game.state.SHIP && this.game.state._current != this.game.state.MENU){
        if(this.building){ 
            if(this.building.origin_tile){
                this.x = this.building.origin_tile.x;
                this.y = this.building.origin_tile.y;
            } 
            this.width *= this.building.dimx;
            this.height *= this.building.dimy; 
            this.color = "red";
        } else {
            this.width = 32;
            this.height = 32;
            this.color = "white";
        }
//        if(this.game.player.tileID == "hq"){
//            this.width *= this.building.dimx;
//            this.height *= this.building.dimy; 
//        }

        context.lineWidth = 2;
        context.strokeStyle = this.color;
        context.strokeRect(this.x*this.game.level.tile.width, this.y*this.game.level.tile.width, this.width, this.height);
    }
};

