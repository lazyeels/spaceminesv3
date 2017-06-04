var Food = function(Game, x, y, origin){
    this.game = Game;
    this.sim = this.game.sim;
    this.tileID = 6;
    this.name = "food"
    this.x = x||1;
    this.y = y||1;
    this.width = 32;
    this.height = 32;
    this.ore = 135 || 1;
    this.cost = 1000//this.sim.ore_price * this.ore;
    this.people = 0;
    this.capacity = 1000;
    this.total_food = 0;
    this.power = 2;
    Food.superclass.constructor.call(this, this.tileID);
};
extend(Food, Entity);

Food.prototype.Init = function(){
    this.game.sim.power -= this.power;
};

Food.prototype.Select = function(){
    this.game.state._current = this.game.state.MENU;
    var html = '';
    html += '<div class="menu title">Info</div>';
    html += '<div id="comments" class="menu title"><span>Food Store</span> (level <span id="levelnum">'+this.level+'</span>)</div>';
    html += '<ul id="inventory" class="menu title">';
    html += '<li><img src="./img/food.png" class="icon_small" /><span id="foodstored">'+this.total_food+'</span>/<span id="foodtotal">'+this.capacity+'</span></li>';
    html += '</ul>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
    html += '<div  class="right-side" onClick=Game.world.Set("LEVELUP") onMouseDown=Game.PlayAudio("menu_click")><span class="button">Upgrade</span></div>';
    this.game.player.mouse.clicked = false;
    $('#message').html(html);
    $('#message').show();
};

