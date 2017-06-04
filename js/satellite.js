var Satellite = function(Game){
    this.game = Game;
    this.img = Game.asset_manager.cache['rocket'];
    this.universe_speed = 1/100;
    this.angleX = 0;
    this.angleY = 0;
    this.range = 0.1;
    this.speed = 0.1; 
    this.isAlive = true;
    this.leaveflag = false;

    this.timepassed = 0;
    this.journeytime = 0;

    this.destination = 0;
    this.location = 0;
    this.id = 0;
    this.universeX = 0;
    this.universeY = 0;

    this.state = {
        _current: 0,
        DESELECTED: 0,
        SELECTED: 1
    }
    this.Init();
};

Satellite.prototype.Init = function(){
    this.x = Game.world.launch_site.x;
    this.y = Game.world.launch_site.y;
    this.leftorbit = false;
    this.destination = 0;
    this.location = Game.world.id;
    this.universeX = Game.world.x;
    this.universeY = Game.world.y;
    this.targetX = this.game.target.x * 32;
    this.targetY = this.game.target.y * 32;
    this.id = 0;
    this.total = 0;
//    console.log(this.x, this.y, Game.world.name);
};

Satellite.prototype.update = function(dt){
    if(this.leftorbit){
        var dest = undefined, dist = undefined;
        // update Satellite location
        var dx = (this.targetX - this.universeX);
        var dy = (this.targetY - this.universeY);
        dist = Math.sqrt(dx * dx + dy * dy); 
        this.universeX += dx * (this.universe_speed)// * dt);
        this.universeY += dy * (this.universe_speed)// * dt);
        if(dist <= 1){
            this.isAlive = false;
        }
        // Check discovery of asteroids
        for(var i=0; i < Game.worlds.length; i++){
            var asteroid = Game.worlds[i];
            var dx = (asteroid.coords.x - Math.floor(this.universeX/32));
            var dy = (asteroid.coords.y - Math.floor(this.universeY/32));
            var sat_dist = Math.sqrt(dx * dx + dy * dy);
            if(sat_dist <= 1 && dx >= 0 && dy >= 0 && Game.worlds[i].discovered==false && Game.worlds[i].destroyed==false){
                Game.worlds[i].discovered = true;
                Game.PlayAudio('asteroid_discovered');
                Game.drawAlert('Your Satellite discovered a new asteroid - ' + Game.worlds[i].name);
            }     
        }
    } else {        
        this.y -= 1;
        if(!this.leftorbit && this.y + this.img.height <= 0){
            this.leftorbit = true;
            this.y = Game.world.launch_site.y;
        }
    }
};

Satellite.prototype.draw = function(dt, context){
    if(Game.state.mName == 'Asteroid' && this.location == Game.world.id && !this.leftorbit){
        // Draw
        context.drawImage(
            this.img, 
            0,
            0,
            this.img.width, 
            this.img.height, 
            this.x, 
            this.y, 
            this.img.width,
            this.img.height
        );
    }
    if(Game.state.mName == 'Universe' && this.leftorbit){
        // Draw
        context.fillStyle = 'rgba(255, 255, 0, 1)';  
        context.strokeStyle = 'rgba(255, 255, 0, 1)';  
        context.lineWidth = 2;
        context.fillRect(
            this.universeX, 
            this.universeY, 
            4,
            4
        );
    }
};
