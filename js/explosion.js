var Explosion = function(asteroid){
    this.id = asteroid.id;
    this.x = asteroid.x;
    this.y = asteroid.y;
    this.radius = asteroid.gravity;
    Explosion.superclass.constructor.call(this);
};
extend(Explosion, Particle);

Explosion.prototype.Init = function(){

};


