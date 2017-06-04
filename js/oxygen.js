var Oxygen = function(Game, x, y, origin){
    this.game = Game;
    this.sim = this.game.sim;
    this.tileID = 11;
    this.name = "Oxygen"
    this.x = x||1;
    this.y = y||1;
    this.width = 32;
    this.height = 32;
    this.ore = 135 || 1;
    this.cost = 1200//this.sim.ore_price * this.ore;
    this.people = 0;
    this.capacity = 100;
    this.supply = 300;
    this.power = 5;
    this.available = true;
    Oxygen.superclass.constructor.call(this, this.tileID);
};
extend(Oxygen, Entity);

Oxygen.prototype.Init = function(){
    this.game.sim.power -= this.power;
    this.game.sim.oxygen_supply += this.supply;
    Game.animation_queue.Add(this.game.id, '+' + this.supply, this.x, this.y);
};

Oxygen.prototype.Select = function(){
    this.game.state._current = this.game.state.MENU;
    var html = '';
    html += '<div id="comments" class="menu title"><span>Oxygen</span> (level <span id="levelnum">'+this.level+'</span>)</div>';
    html += '<ul id="inventory" class="menu title">';
    html += '<li>Oxygen <span id="oxygen-prod">'+this.supply+'</span>KG</li>';
    html += '</ul>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
    html += '<div  class="right-side" onClick=Game.world.Set("LEVELUP") onMouseDown=Game.PlayAudio("menu_click")><span class="button">Upgrade</span></div>';
    this.game.player.mouse.clicked = false;
    $('#message').html(html);
    $('#message').show();
};


Oxygen.prototype.update = function(dt, xScroll, yScroll){    
    if(this.state._current != this.state.BUILT && this.state._current != this.state.RESEARCHING){
        this.Build(dt);
    }
    if(this.state._current == this.state.RESEARCHING){
        this.LevelUp(dt);
    }
    if(this.game.state._current == this.game.state.DEFAULT){
        this.select = false;
    }
    if(this.game.timepassed <= 0){
        $('#oxygen-prod').html(this.supply);
    }
};
