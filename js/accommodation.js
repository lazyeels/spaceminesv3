var Home = function(Game, x, y, origin){
    this.game = Game;
    this.sim = this.game.sim;
    this.tileID = 5;
    this.name = "home";
    this.x = x||0;
    this.y = y||0;
    this.width = 32;
    this.height = 32;
    this.ore = 270 || 1;
    this.cost = 1000//this.sim.ore_price * this.ore;
    this.people = 30;
    this.capacity = 30;
    this.power = 3;
    this.available = true;
    Home.superclass.constructor.call(this, this.tileID);
};

extend(Home, Entity);

Home.prototype.Init = function(){
    Game.animation_queue.Add(this.game.id, '+' + this.people, this.x, this.y, Game.people_img);
    this.game.sim.P += this.people;
    this.game.sim.power -= this.power;
};

Home.prototype.update = function(dt){
    if(this.state._current != this.state.BUILT && this.state._current != this.state.RESEARCHING){
        this.Build(dt);
    }
    if(this.state._current == this.state.RESEARCHING){
        this.LevelUp(dt);
    }
    if(this.game.state._current == this.game.state.DEFAULT){
        this.select = false;
    }
};

Home.prototype.Select = function(){
    this.game.state._current = this.game.state.MENU;
    var html = '';
    html += '<div id="" class="menu title"><span>Accommodation</span> (level <span id="levelnum">'+this.level+'</span>)</div>';
    html += '<ul id="inventory" class="menu title">';
    html += '<li><img src="./img/user.png" class="icon_small" /><span id="tenants">'+this.people+'</span><span>/'+this.capacity+'</span></li>';
    html += '</ul>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown="Game.menu_click.play()"><span class="button" >Close</span></span>';
    html += '<div  class="right-side" onClick=Game.world.Set("LEVELUP") onMouseDown="Game.menu_click.play()"><span class="button">Upgrade</span></div>';
    this.game.player.mouse.clicked = false;
    $('#message').html(html);
    $('#message').show();
};

