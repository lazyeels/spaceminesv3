function Player(World, tileset){
    // Init
    this.game = World;
    this.tileset = tileset;
    this.mouse = World.mouse;
    this.touch = utils.captureTouch(this.game.canvas);
    console.log(this.touch)
    this.pauseKey = 80;  //Pause button 'p'
    this.state = new StateMachine();
    this.tileID = 0;
};

Player.prototype.Init = function(){
    this.state.Add("Build", new EmptyState(new Build(this.game)));
    this.state.Change("Build");
};

// Update Method
Player.prototype.update = function(dt, xScroll, yScroll){
    if(this.state){
        this.state.update(dt, xScroll, yScroll);

    }
};

Player.prototype.keydown = function(event) {
    console.log(event)
    switch (event.keyCode) {
       case this.pauseKey: //down
            this.pausegame = true;
            break;
    }
};

Player.prototype.keyup = function(event) {
    switch (event.keyCode) {
       case this.pauseKey: //down
            this.pausegame = true;
            break;
    }
};

Player.prototype.onMouseDown = function(e){
    this.game.state._current = this.game.state.DEFAULT;
    this.tileID = e;
    this.state.onMouseDown(e);
    this.mouse.clicked = false;


};

Player.prototype.draw = function(dt, context, xScroll, yScroll){
    if(this.state){
        this.state.draw(dt, context, xScroll, yScroll);
    }
};
