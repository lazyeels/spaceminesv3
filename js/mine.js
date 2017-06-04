var Mine = function(Game, x, y, origin){
    this.game = Game;
    this.sim = this.game.sim;
    this.tileID = 4;
    this.name = "mine"
    this.x = x||0;
    this.y = y||0;
    this.width = 32;
    this.height = 32;
    this.ore = 200 || 1;
    this.cost = 1500//this.game.sim.ore_price * this.ore;
    this.people = 0;
    this.capacity = 10;
    this.ore_per_day = Math.floor(80 + Math.random() * 40);
    this.power = 8;
    this.available = true;
    Mine.superclass.constructor.call(this, this.tileID);
};
extend(Mine, Entity);

Mine.prototype.Init = function(){
    this.sim.power -= this.power;
    if(this.sim.P > 0){
        Game.animation_queue.Add(this.game.id, '+' + this.ore_per_day, this.x, this.y, Game.asset_manager.cache['ore']);
    }
};

Mine.prototype.update = function(dt, xScroll, yScroll){
    if(this.state._current != this.state.BUILT && this.state._current != this.state.RESEARCHING){
        this.Build(dt);
    }

    if(this.state._current == this.state.RESEARCHING){
        this.LevelUp(dt);
    }

    if(Game.time && this.sim.P > 0){
        this.ore_per_day = Math.floor(60 + Math.random() * 100);
        this.sim.store += this.ore_per_day; 
        Game.animation_queue.Add(this.game.id, '+' + this.ore_per_day, this.x, this.y, Game.ore_img);
    }

    if(this.game.state._current == this.game.state.DEFAULT){
        this.select = false;
    }
    if(this.select){ 
        $("#workers").html(this.people);
        $("#oreperday").html(this.ore_per_day);
    //    this.checkWorkForce();
    }
};

Mine.prototype.checkWorkForce = function(){

};

Mine.prototype.Select = function(){
    this.game.state._current = this.game.state.MENU;
    var html = '';
    var workforce = '';
    html += '<div class="menu title"><span>'+this.name+'</span> (level <span id="levelnum">'+this.level+'</span>)</div>';
    html += '<ul id="inventory" class="menu title">';
    if(this.game.assets['factory'] && this.game.assets['factory']['robotworker']){
        html += '<table class="title" onMousemove=Game.drawAlert("Change_ratio_of_human_to_robot_workers.")>';
        html += '<tr><td>Workforce:</td></tr>';
        html += '<tr><td>' + workforce + '</td><td><input type="range" name="workratio" min="0" max="'+this.capacity+'" value="0"></td><td>Robot</td></tr>';
        html += '<tr><td>0%</td><td></td><td>10%</td></tr>';
        html += '</table>';
    } else {
        html += '<td>'+workforce+'</td>';
    }
    html += '<td><span></span><img src="./img/ore.png" class="icon_small" /><span id="oreperday">'+this.ore_per_day+'</span></td>';

    html += '</ul>';
    html += '<span class="right-side" onClick=Game.Sell(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Sell Building</span></span>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
//    html += '<div  class="right-side" onClick=Game.world.Upgrade_Menu() onMouseDown=Game.PlayAudio("menu_click")><span class="button">Upgrade</span></div>';
    this.game.mouse.clicked = false;
    $('#message').html(html);
    $('#message').show();
};

