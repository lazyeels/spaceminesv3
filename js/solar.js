var Solar = function(Game, x, y, origin){
    this.game = Game;
    this.sim = this.game.sim;
    this.tileID = 12;
    this.name = "Solar"
    this.x = x||1;
    this.y = y||1;
    this.width = 32;
    this.height = 32;
    this.ore = 135 || 1;
    this.cost = this.sim.ore_price * this.ore;
    this.people = 0;
    this.capacity = 100;
    this.power = 1;
    this.supply = 75;
    this.available = true;
    Solar.superclass.constructor.call(this, this.tileID);
};
extend(Solar, Entity);

Solar.prototype.Init = function(){
    this.game.sim.power += this.supply;
    Game.animation_queue.Add(this.game.id, '+' + this.supply, this.x, this.y, Game.power_img);
    this.game.sim.power -= this.power;

};

Solar.prototype.Select = function(){
    this.game.state._current = this.game.state.MENU;
    var html = '';
    html += '<div id="comments" class="menu title"><span>Solar</span> (level <span id="levelnum">'+this.level+'</span>)</div>';
    html += '<ul id="inventory" class="menu title">';
    html += '<li>Solar <span id="solar-prod"></span> MegaWatts</li>';
    html += '</ul>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
    html += '<div  class="right-side" onClick=Game.world.Set("LEVELUP") onMouseDown=Game.PlayAudio("menu_click")><span class="button">Upgrade</span></div>';
    this.game.player.mouse.clicked = false;
    $('#message').html(html);
    $('#message').show();
};


Solar.prototype.update = function(dt, xScroll, yScroll){    
    if(this.state._current != this.state.BUILT && this.state._current != this.state.RESEARCHING){
        this.Build(dt);

//        $('#solar-prod').html(parseInt(this.supply.toFixed(2)));
    }
    if(this.state._current == this.state.RESEARCHING){
        this.LevelUp(dt);
    }
    if(this.game.state._current == this.game.state.DEFAULT){
        this.select = false;
    }
  //  if(this.game.time){
  //      this.sim.power += this.supply;
  //  }

    $('#solar-prod').html(this.supply.toFixed(2));
};
