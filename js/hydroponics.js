var Hydroponics = function(Game, x, y, origin){
    this.game = Game;
    this.sim = this.game.sim;
    this.tileID = 10;
    this.name = "Hydroponics"
    this.x = x||1;
    this.y = y||1;
    this.width = 32;
    this.height = 32;
    this.ore = 135 || 1;
    this.cost = 900//this.sim.ore_price * this.ore;
    this.people = 0;
    this.capacity = 1000;
    this.total_food = 0;
    this.supply = 300;
    this.power = 7;
    this.available = true;
    Hydroponics.superclass.constructor.call(this, this.tileID);
};
extend(Hydroponics, Entity);

Hydroponics.prototype.Init = function(){
    this.game.sim.power -= this.power;
    Game.animation_queue.Add(this.game.id, '+' + this.supply, this.x, this.y, Game.food_img);
    Game.world.sim.food_supply += this.supply
};


Hydroponics.prototype.Select = function(){
    this.game.state._current = this.game.state.MENU;
    var html = '';
    html += '<div id="comments" class="menu title"><span>Hydroponics</span> (level <span id="levelnum">'+this.level+'</span>)</div>';
    html += '<ul id="inventory" class="menu title">';
    html += '<li><img src="./img/food.png" class="icon_small" /><span id="food-prod"></span></li>';
    html += '</ul>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
    html += '<div  class="right-side" onClick=Game.world.Set("LEVELUP") onMouseDown=Game.PlayAudio("menu_click")><span class="button">Upgrade</span></div>';
    this.game.player.mouse.clicked = false;
    $('#message').html(html);
    $('#message').show();
};


Hydroponics.prototype.update = function(dt, xScroll, yScroll){    
    if(this.state._current != this.state.BUILT && this.state._current != this.state.RESEARCHING){
        this.Build(dt);
    }
    if(this.state._current == this.state.RESEARCHING){
        this.LevelUp(dt);
    }
    if(this.game.state._current == this.game.state.DEFAULT){
        this.select = false;
    }

    if(this.game.timer){
        this.supply = parseInt((1 + Math.random() * 20).toFixed(2));
        this.game.sim.food_supply += this.supply;
        this.total_food = this.supply;
        $('#food-prod').html(parseInt(this.supply));
    }

    var retrievedObject = localStorage.getItem(this.name+"_"+this.x + "-" + this.y);
};
