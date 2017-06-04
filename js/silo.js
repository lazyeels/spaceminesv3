var Silo = function(Game, x, y, origin){
    this.game = Game;
    this.sim = this.game.sim;
    this.tileID = 13;
    this.name = "Silo"
    this.x = x||1;
    this.y = y||1;
    this.width = 32;
    this.height = 32;
    this.ore = 135 || 1;
    this.cost = 2500//this.sim.ore_price * this.ore;
    this.people = 0;
    this.capacity = 10;
    this.power = 5;
    this.supply = 1;
    this.available = true;
    Silo.superclass.constructor.call(this, this.tileID);
};
extend(Silo, Entity);

Silo.prototype.Init = function(){
    this.game.sim.power -= this.power;
};

Silo.prototype.Select = function(){
    this.game.state._current = this.game.state.MENU;
    var html = '';
    html += '<div id="comments" class="menu title"><span>Silo</span> (level <span id="levelnum">'+this.level+'</span>)</div>';
    html += '<ul id="inventory" class="menu title">';
    html += '<li>Satellites <span id="Silo-prod"></span></li>';
    html += '</ul>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
    html += '<div  class="right-side" onClick=Game.drawLaunchMenu(); onMouseDown=Game.PlayAudio("menu_click")><span class="button">Launch</span></div>';
    this.game.player.mouse.clicked = false;
    $('#message').html(html);
    $('#message').show();
    Game.world.launch_site = {x: this.x * 32, y: this.y * 32};
};


Silo.prototype.update = function(dt, xScroll, yScroll){    
    if(this.state._current != this.state.BUILT && this.state._current != this.state.RESEARCHING){
        this.Build(dt);
    }
    if(this.state._current == this.state.RESEARCHING){
        this.LevelUp(dt);
    }
    if(this.game.state._current == this.game.state.DEFAULT){
        this.select = false;
    }
    $('#Silo-prod').html(this.supply);
};
