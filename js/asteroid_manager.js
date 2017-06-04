var AsteroidManager = function(Game){
    this.game = Game;
    this.worlds = this.game.worlds;
    this.current = 0;
    this.selected = {};    
    Game.worlds[this.current].Init();
    Game.world = this.worlds[this.current];
    this.game.worlds[this.current].discovered = true;
    this.game.worlds[this.current].sim.store = 15000;
    $('#id').html(Game.world.name);
    this.timer = 0;
};

AsteroidManager.prototype.update = function(dt, xScroll, yScroll){
};

AsteroidManager.prototype.prev = function(){
    if(this.current == 0){
        this.current = this.worlds.length-1;
    } else {    
        this.current-=1;
    }
    if(Game.worlds[this.current].discovered){
        Game.world = Game.worlds[this.current];
    }
    $('#id').html(Game.world.name);
    $('#message').hide();
};

AsteroidManager.prototype.next = function(){
    if(this.current == this.worlds.length-1){
        this.current = 0;
    } else {  
        this.current += 1;
    }
    if(Game.worlds[this.current].discovered){
        Game.world = Game.worlds[this.current];
    }

    $('#id').html(Game.world.name);
    $('#message').hide();
};

AsteroidManager.prototype.Select = function(startX, startY, xScroll, yScroll){

};


AsteroidManager.prototype.draw = function(dt, context){
    Game.worlds[Game.world.id].draw(dt, context);
};

AsteroidManager.prototype.keydown = function(event){
    //console.log(event.keyCode, "AsteroidManager", this.worlds[this.current].name, this.current);
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

AsteroidManager.prototype.keyup = function(event){

};

AsteroidManager.prototype.onMouseDown = function(params){

};

AsteroidManager.prototype.onMouseUp = function(params){

};

AsteroidManager.prototype.OnEnter = function(params){
    $('#message').html('');
    $('#stats').show();
    $('#panel').show();
    $('#alerts').show();
    $('#buildtool').show();
  //  $('#world-nav').html('<a class="button" onClick="Game.state.mCurrentState.prev()">Prev</a> <a class="button" onClick="Game.state.mCurrentState.next()">Next</a>');
    $('#world-nav').show();
    $('#id').html(Game.world.name);
    $('#donate').hide();
    this.game.PlayAudio('asteroid', true);

//    $('#message').css('left', '0 auto');
//    $('#message').css('margin', '0 auto');
};

AsteroidManager.prototype.OnExit = function(params){
    this.game.world.state._current = this.game.world.state.DEFAULT;
    $('#message').hide();
    $('#stats').hide();
    $('#panel').hide();
    $('#alerts').hide();
    this.game.PauseAudio('asteroid');
};

AsteroidManager.prototype.keydown = function(e){

};

AsteroidManager.prototype.close = function(e){
    $('#message').hide();
};


AsteroidManager.prototype.keyup = function(e){
    
};

AsteroidManager.prototype.Set = function(e){

};

