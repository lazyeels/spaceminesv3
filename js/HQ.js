var HQ = function(Game, x, y, origin){
    this.game = Game;
    this.sim = this.game.sim;
    this.tileID = 7;
    this.name = "HQ"
    this.x = x||0;
    this.y = y||0;
    this.width = 32;
    this.height = 32;
    this.ore = 400 || 1;
    this.cost = 5000//this.sim.ore_price * this.ore;
    this.people = 0;
    this.ore_per_day = Math.floor(80 + Math.random() * 40);
    this.origin_tile = origin;
    this.large_building = true;
    this.power = 0;
    this.available = true;

    HQ.superclass.constructor.call(this, this.tileID, 2, 2);
};
extend(HQ, Entity);

HQ.prototype.Init = function(){
    this.game.sim.power -= this.power;
    Game.world.colonised = true;
    Game.world.HQ_established = true;
    Game.PlayAudio('PoweringUp');
};


HQ.prototype.update = function(dt, xScroll, yScroll){    
    if(this.state._current != this.state.BUILT && this.state._current != this.state.RESEARCHING){
        this.Build(dt);
    }
    if(this.state._current == this.state.RESEARCHING){
        this.LevelUp(dt);
    }
    if(this.game.time){

    }
    if(this.select){ 
        $('#unemployed').html(this.game.sim.workers);
    }
};

HQ.prototype.Select = function(){
    this.game.state._current = this.game.state.MENU;
    var html = '';
    html += '<div class="menu title">HQ</div>';
    html += '<table id="sale" class="menu" width=100%>';
    html += '<tr><td class="large red awesome" onClick="Game.world.drawColonyInfo()" onMouseOver=Game.drawAlert("Colony Stats")>Info</td>';   
    html += '<td class="large red awesome" onClick="Game.world.drawSellMenu()" onMouseOver=Game.drawAlert("Sell_ore.")>Ore</td>';   
//    html += '<td class="large red awesome" onClick="Game.world.drawBuyMenu()" onMouseOver=Game.drawAlert("Buy_goods.") >Shop</td></tr>';
    html += '</table>';
    html += '<table id="HQ-main-window" class="menu title" width=100%>';
    html += '</table>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
    $('#message').html(html);
    $('#message').show();
    this.game.mouse.clicked = false;
    Game.world.drawColonyInfo();
};
