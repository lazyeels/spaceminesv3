var Galaxy = function(Game){
    this.game = Game;
    this.worlds = this.game.worlds;
    this.current = 0;
    this.selected = {};    
    Game.worlds[this.current].Init();
    Game.world = this.worlds[this.current];
    $('#id').html(Game.world.name);

};

Galaxy.prototype.update = function(dt, xScroll, yScroll){

};

Galaxy.prototype.prev = function(){
    if(this.current == 0){
        this.current = this.worlds.length-1;
    } else {    
        this.current-=1;
    }
    console.log(this.current)
    Game.world = Game.worlds[this.current];
    $('#id').html(Game.world.name);
    $('#message').hide();
};

Galaxy.prototype.next = function(){
    if(this.current == this.worlds.length-1){
        this.current = 0;
    } else {  
        this.current += 1;
    }
    Game.world = Game.worlds[this.current];
    $('#id').html(Game.world.name);
    $('#message').hide();
};

Galaxy.prototype.Select = function(startX, startY, xScroll, yScroll){

};


Galaxy.prototype.draw = function(dt, context){
    Game.worlds[Game.world.id].draw(dt, context);
};

Galaxy.prototype.keydown = function(event){
    //console.log(event.keyCode, "Galaxy", this.worlds[this.current].name, this.current);
    switch (event.keyCode) {
       case this.prev: //down
            this.current -=1; 
            Game.world = Game.worlds[this.current];
            break;
       case this.next: //down
            this.current +=1; 
            Game.world = Game.worlds[this.current];
            break;
    }
};

Galaxy.prototype.keyup = function(event){

};

Galaxy.prototype.onMouseDown = function(params){

};

Galaxy.prototype.onMouseUp = function(params){

};

Galaxy.prototype.OnEnter = function(params){
    $('#message').html('');
    $('#stats').show();
    $('#panel').show();
    $('#alerts').show();
    $('#buildtool').show();
    $('#world-nav').html('<a class="button" onClick="Game.state.mCurrentState.prev()">Prev</a> <a class="button" onClick="Game.state.mCurrentState.next()">Next</a>');
    $('#world-nav').show();
    $('#id').html(Game.world.name);
//    $('#message').css('left', '0 auto');
//    $('#message').css('margin', '0 auto');
};

Galaxy.prototype.OnExit = function(params){
    this.game.state._current = this.game.state.DEFAULT;
    $('#message').hide();
    $('#stats').hide();
    $('#panel').hide();
    $('#alerts').hide();
};

Galaxy.prototype.keydown = function(e){

};

Galaxy.prototype.close = function(e){
    $('#message').hide();
};


Galaxy.prototype.keyup = function(e){
    
};

Galaxy.prototype.Set = function(e){

};

