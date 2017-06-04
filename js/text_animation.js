var TextAnimation = function(Game){
    this.game = Game;
    this.queue = [];
};

TextAnimation.prototype.Add = function(id, val, x, y, img){    
    var label = {
        id: id,
        img : img || undefined,
        text: val,
        x: x * this.game.world.level.tile.width + (this.game.world.level.tile.width/2),
        y: y * (this.game.world.level.tile.height),
        _origY: y * (this.game.world.level.tile.height)        
    }
    this.queue.push(label);
};

TextAnimation.prototype.update = function(dt){
    for (var i = 0; i < this.queue.length; i++){
        if(this.queue[i].y > 50){
            this.queue[i].y -= 2;
        } else if(this.queue[i].y <= 50){
            this.queue.splice(i, 1);
        }
    }
};

TextAnimation.prototype.draw = function(dt, context){
    context.save();
    context.shadowColor = "rgba(0,0,0,0.6)";
    context.shadowOffsetX = -2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 2;

    context.fillStyle = "white";
    for (var i = 0; i < this.queue.length; i++){
        if(this.queue[i].id == Game.world.id){ 
            context.fillText(this.queue[i].text, this.queue[i].x, this.queue[i].y); 
            if(this.queue[i].img){
                context.drawImage(this.queue[i].img, 0, 0, this.queue[i].img.width, this.queue[i].img.height, this.queue[i].x, this.queue[i].y, 16, 16); 
            }
        }
    }
    context.restore();
};


