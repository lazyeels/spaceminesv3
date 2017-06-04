var Particle = function(){
    this.size = 3 + Math.random() * 6;
    this.source = utils.getRandomAngle(this.x + (this.size/2), this.y + (this.size/2), 4);
    this.target = utils.getRandomAngle(this.x, this.y, this.radius*2);
    this.isAlive = true;
    this.speed = 0.05;
};

Particle.prototype.update = function(dt){
    this.color = 'white'
    if(this.isAlive){
        // Check collision with asteroids
        for(var i=0; i < Game.worlds.length; i++){
            var asteroid = Game.worlds[i];
            var dx = (asteroid.x - this.source.x);
            var dy = (asteroid.y - this.source.y);
            var asteroid_dist = Math.sqrt(dx * dx + dy * dy);  
            if(asteroid_dist <= 10 && this.id != asteroid.id){
                asteroid.meteor_shower = true;     
                this.color = 'blue';
                Game.cooldown_timer = 0;
   //             this.isAlive = false;
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


Particle.prototype.draw = function(dt, context, xScroll, yScroll) {
    if(this.isAlive && Game.state.mName=='Universe'){
        context.fillStyle = this.color;      
        context.beginPath();
        context.arc(
            this.source.x, 
            this.source.y, 
            this.size*0.5, 
            0, 
            Math.PI*2, 
            true
        );
        context.closePath();
        context.fill();
    }
};
