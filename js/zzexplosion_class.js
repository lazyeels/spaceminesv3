function Explosion(x, y, radius){
    this.size = 3 + Math.random() * 6;
    this.source = utils.getRandomAngle( x + (this.size/2), y + (this.size/2), 4);
    this.target = utils.getRandomAngle(x, y, radius*2);
    this.isAlive = true;
    this.speed = 0.05;
};


Explosion.prototype.update = function(dt){
    if(this.isAlive){
        for(var i=0; i < Game.worlds.length; i++){
            var asteroid = Game.worlds[i];
            var dx = (asteroid.x - this.source.x);
            var dy = (asteroid.y - this.source.y);
            var dist = Math.sqrt(dx * dx + dy * dy);  
            if(dist < 10){
                this.color = 'blue'
  //             this.isAlive = false;
            } else {
                this.color = 'white'
            }
        }
        var dx = (this.target.x - this.source.x);
        var dy = (this.target.y - this.source.y);
        var dist = Math.sqrt(dx * dx + dy * dy); 
        this.source.x += dx * (this.speed * dt);
        this.source.y += dy * (this.speed * dt);
        if(dist <= 1){
            this.isAlive = false;
        }
        if(this.source.x <= 0 || this.source.y <= 0 || this.source.x >= Game.canvas.width || this.source.y >= Game.canvas.height){
            this.isAlive = false;
        }
    }
};


Explosion.prototype.draw = function(dt, context, xScroll, yScroll) {
    if(this.isAlive && Game.state.mName=='Universe'){
        context.fillStyle = this.color;      
        context.fillRect(this.source.x, this.source.y, this.size, this.size);
    }
};
