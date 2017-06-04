var Resource = function(Game, type, x, y){
    this.game = Game;
    this.tileID = type.id;
    this.label = type.name;
    this.x = x;
    this.y = y;
	console.log(this)
    this.state = {
        _current: 0,
        ALIVE: 0,
        DEAD: 1,
    }
    Resource.superclass.constructor.call(this);
};
extend(Resource, Entity);


