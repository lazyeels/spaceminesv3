var Inventory = function(Game){
    this.game = Game;
};

Inventory.prototype.Init = function(){
    var html = '';
    html += '<div id="inventory" onMouseDown="Game.menu_click.play()">Inventory';
    html += '<img src="img/ESA.jpg" />';
    html += '<ul>';
    html += '<li class="large awesome" onClick=Game.state.onMouseDown("sellMine") onMouseDown="Game.menu_click.play()"><img src="./img/mine.png" width=24px height=24px /> '+this.game.sim.mine_total+' <img src="./img/money.png" width=16px height=16px /><span id="mineprice">'+this.game.sim.mine_price+'</span><input class="slider" id="sellmines" name="sellmines" type="range" min="0" max="'+this.game.sim.mine_total+'" step="1" value="0" /><span id="num_mines"></span></li>';
    html += '<li class="large awesome" onClick=Game.state.onMouseDown("sellOre") onMouseDown="Game.menu_click.play()"><img src="./img/ore.png" width=24px height=24px /> <img src="./img/money.png" width=16px height=16px /><span id="oreprice">'+this.game.sim.ore_price+'</span><input class="slider" id="sellore" name="sellore" type="range" min="0" max="1" step="1" value="0" /><span id="num_ore"></span></li>';
    html += '</ul>';
    html += '<div  class="right-side" onClick=Game.state.close() onMouseDown="Game.menu_click.play()"><span class="button">Close</span></div>';
    html += '</div>';
    $('#content').html(html);
    $('#num_mines').html(this.game.sim.total_mine);
};

Inventory.prototype.update = function(dt){

};

Inventory.prototype.close = function(params){
    $('#content').hide();
};


Inventory.prototype.draw = function(dt, context){

};

Inventory.prototype.onMouseDown = function(params){
    console.log(params)
};

Inventory.prototype.onMouseUp = function(params){

};

Inventory.prototype.OnEnter = function(params){
    $('#content').show();
    this.Init();
};

Inventory.prototype.OnExit = function(params){
    $('#content').hide();
};

Inventory.prototype.keydown = function(e){

};

Inventory.prototype.keyup = function(e){
    
};
