function Starfield(Game){
    this.game = Game;
    this.canvas = this.game.canvas;
    this.particles = []; 
    this.zIndex = 0;
    this.asteroid = new Image();
    this.asteroid.src = 'img/asteroids.png';
    this.createParticles();   
};

Starfield.prototype.update = function(dt){
//    this.createParticles(); 
//    this.updateParticles(); 
//    this.killParticles(); 
} 
Starfield.prototype.draw = function(dt, context){ 
    context.save();
    context.fillStyle="white";
    for(var i=0; i<this.particles.length; i++) { 
        var part = this.particles[i];
        context.fillRect(part.x, part.y, part.radius, part.radius);
    } 
    context.restore();
};

Starfield.prototype.createParticles = function() { 
    //add particle if fewer than 100 
   for(var i=0; i < 100; i++) { 
        this.particles.push({ 
                x: Math.random() * this.canvas.width, //between 0 and canvas width 
                y: Math.random() * this.canvas.height, 
                opacity: Math.random()/1,
                speed: 1 + Math.random() * 2, 
                radius: 1+Math.random(),
                color: '', 
                sourceX: Math.floor(1 * Math.random() * 5) * 64, 
                angle: Math.PI/ 1 + Math.random() * 4,
        }); 
    } 
};

Starfield.prototype.updateParticles = function() { 
    for(var i in this.particles) { 
        var part = this.particles[i]; 
        part.x -= part.speed; 
    } 
}; 

Starfield.prototype.killParticles = function() { 
    for(var i in this.particles) { 
        var part = this.particles[i]; 
        if(part.x <= -this.canvas.width + 100) { 
            part.x = this.canvas.width + 50; 
        } 
    } 
}; 

