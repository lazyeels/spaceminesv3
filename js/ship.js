var Ship = function(Game){
    this.game = Game;
    this.ship = Game.asset_manager.cache['ship'];
    this.universe_speed = 2;
    this.angleX = 0;
    this.angleY = 0;
    this.range = 0.1;
    this.speed = 0.1; 
    this.mineload = 0;
    this.oreload = 0;
    this.minemax = 10;
    this.oremax = 10000;
    this.minemaxreached = false;
    this.oremaxreached = false;
    this.leaveflag = false;
    this.timepassed = 0;
    this.journeytime = 0;
    this.destination = 0;
    this.location = 0;
    this.id = 0;
    this.x = this.xStart;
    this.y = this.yStart;
    this.universeX = 0;
    this.universeY = 0;
    this.state = {
        _current: 0,
        DESELECTED: 0,
        SELECTED: 1
    }
};

Ship.prototype.Init = function(){
    this.xStart = (this.game.canvas.width - 180);
    this.yStart = (this.game.canvas.height - 120);
    this.x = this.xStart;
    this.y = this.yStart;
    this.mineload = 0;
    this.oreload = 0;
    this.minemaxreached = false;
    this.oremaxreached = false;
    this.leaveflag = false;
    this.destination = 0;
    this.location = 0;
    this.id = 0;
    this.total_sale = 0;
    this.supply = {};
    this.supply.cash = this.game.world.sim.M;
    this.supply.ore = {total: this.game.world.sim.store, bought: 0, cost: 0};//{total: Game.world.sim.store, bought: 0, cost: Game.world.sim.ore_price};
    this.supply.food = {total: this.game.world.sim.food_supply, bought: 0, cost: 0};//{total: Math.floor(1000 + Math.random() * 80), bought: 0, cost: Game.world.sim.food_price};
    this.cargo = {
        'ore': {'capacity': 10000, 'load': 0},
    };
    this.idle();
};

Ship.prototype.idle = function(){
    this.x += Math.sin(this.angleX)*this.range;
    this.angleX += this.speed;
    this.y += Math.cos(this.angleY)*this.range;
    this.angleY += this.speed;
};

Ship.prototype.leavePort = function(dt){
    this.x -= 1;
    if(this.x + this.ship.width <= 0){
        this.leftorbit = true;
        this.leaveflag = false; 
    }
};



Ship.prototype.setDestination = function(worldid){
    $('#ship-dispatch').html('<span class="button">Dispatch to ' + Game.worlds[worldid].name + '</span>');
};


Ship.prototype.update = function(dt){
    var dx = this.game.mouse.x - (this.x + this.ship.width/2);
    var dy = this.game.mouse.y - (this.y + this.ship.height/2);
    dist = Math.sqrt(dx * dx + dy * dy);
    if(dist <= 80){
        if(Game.world.state._current != Game.world.state.MENU){
            Game.addMessage(this.location, "Transporter");
        }
    } else {
        Game.world.state._current = Game.world.state.DEFAULT;
    }
    if(Game.world.state._current = Game.world.state.MENU && this.game.state.mName != 'Universe' && this.game.mouse.clicked && dist <= 80){
        this.loadship();
        this.game.mouse.clicked = false;
        this.state._current = this.state.SELECTED;
        Game.world.state._current = Game.world.state.MENU;
    }
    this.Move(dt);
};

Ship.prototype.Move = function(dt){
    if(this.leftorbit){// && this.game.time){
        var dest = undefined, dist = undefined;
        // update ship location
        if(this.location != this.destination && this.x <= 0){
            dest = this.game.Get(this.destination);
            var dx = (dest.coords.x * 32) - (this.universeX);
            var dy = (dest.coords.y * 32) - (this.universeY);
            dist = Math.sqrt(dx * dx + dy * dy);
            this.universeX += dx * (this.universe_speed * dt);
            this.universeY += dy * (this.universe_speed * dt);
            if(dist <= 1){
                this.location = this.destination;
                this.x = this.game.canvas.width// + this.game.ship.width;  
            }
            this.state._current = this.state.DESELECTED;     
        }    
        Game.world.state._current = Game.world.state.DEFAULT;
        if(this.x > this.xStart){
            this.x -= 1; 
        } else if(this.x == this.xStart){
            this.leftorbit = false;
            this.leaveflag = false;
            this.x = this.xStart;
            this.state._current = this.state.DESELECTED;
      //      this.Init(); 
      //      this.idle();
        }
    } else if(this.leaveflag){
        this.leavePort() 
    } else {
        this.universeX = Game.worlds[this.location].x;
        this.universeY = Game.worlds[this.location].y;

        this.idle();
    }
};

Ship.prototype.loadship = function(){
    //console.log(Game.worlds[0].name, this.destination)
    if(Game.world.id == this.location){
        if(!this.leaveflag){
            this.html = '<div class="menu title">Transporter</div>';
            this.html += '<ul id="sale" class="menu">';
            this.html += '<table id="ship-main-window">';
            this.html += '</table>'
            this.html += '</ul>';
            this.html += '<span class="right-side" onClick=Game.world.close() onMouseDown=Game.PlayAudio("menu_click")><span class="button">Close</span></span>';
            this.html += '<span class="right-side" id="unload-cargo-button"></span>';

            this.html += '<span class="right-side" onClick="Game.ship.drawDispatchMenu()" onMouseOver=Game.addMessage(Game.ship.location, "Set_ship_destination.")><span id="ship-destination" class="button">Set Destination</span></span>';
            Game.drawMenu(this.html);
        }
        var buttonhtml = "";
        if(this.cargo['ore'].load > 0){
            buttonhtml += '<span class="right-side" onClick="Game.ship.UnloadCargo()" onMouseOver=Game.addMessage(Game.ship.location, "Unloaded_cargo.")><span class="button">Unload</span></span>';
            $('#unload-cargo-button').html(buttonhtml);
        } else {
            $('#unload-cargo-button').html("");
        }
    }
    this.drawSellMenu();
};

Ship.prototype.loadCargo = function(type){
    this.cargo[type].load += this.supply[type].bought;
    Game.world.sim.store -= this.supply[type].bought;
    this.game.animation_queue.Add('+' + this.supply[type].bought, this.x/this.game.world.level.tile.width, this.y/this.game.world.level.tile.height, Game.ore_img);
    this.supply[type].bought = 0;
    $('#'+type+'saletotal').html(this.supply[type].bought);
    var buttonhtml = "";
    if(this.cargo['ore'].load > 0){
        buttonhtml += '<span class="right-side" onClick="Game.ship.UnloadCargo()" onMouseOver=Game.addMessage(Game.ship.location, "Unloaded_cargo.")><span class="button">Unload</span></span>';
        $('#unload-cargo-button').html(buttonhtml);
    } else {
        $('#unload-cargo-button').html("");
    }
};

Ship.prototype.UnloadCargo = function(){
    if(this.cargo['ore'].load > 0){
        Game.world.sim.store += this.cargo['ore'].load;
        this.game.animation_queue.Add('-' + this.cargo['ore'].load, this.x/this.game.world.level.tile.width, this.y/this.game.world.level.tile.height, Game.ore_img);
        this.cargo['ore'].load = 0;
    }
    if(this.cargo['cash'] > 0){
        Game.world.sim.M += this.cargo['cash'];
        this.cargo['cash'] = 0;
    }
};

Ship.prototype.drawDispatchMenu = function(){
    this.state._current = this.state.SELECTED;
    Game.state.Change('Universe', {state: 'SELECT'});
};


Ship.prototype.drawSellMenu = function(){
    this.supply.ore.total = this.game.world.sim.store;
    this.supply.food.total = this.game.world.sim.food_supply;
    html = '<table>';
    html += '<tr>';
    if(Game.world.sim.store <= 0){
        html += '<td class="title">You have no ore to sell!</td>';
    } else {
        html += '<td class="fixedcolumn" onMousemove=Game.drawAlert("Sell_ore.") ><img src="./img/ore.png" width=24px height=24px /></td><td><span id="totalore" class="title">' + Game.world.sim.store +'</span></td>';
        html += '<td id="moreore" class="smallbutton title" onClick=Game.ship.Load("ore")>+</td>';
        html += '<td id="lessore" class="smallbutton title" onClick=Game.ship.Unload("ore")>-</td>';
        html += '<td id="oresaletotal" class="title">' + this.supply['ore'].bought + '</td>';
        html += '<td id="load-ship" style="text-align: right;" onClick=Game.ship.loadCargo("ore") ><span style="float: right;" class="large blue awesome ">Load Ore</span></td>';
    }
    html += '</tr>';
    html += '<tr>';
    html += '</tr>';
    html += '</table>';
    $('#ship-main-window').html(html);
};

Ship.prototype.draw = function(dt, context){
    if(Game.state.mName == 'Asteroid' && this.location == Game.world.id){
        if(this.x >= -this.ship.width && this.x <= this.game.canvas.width + this.ship.width){
            // Draw
            context.drawImage(
                this.ship, 
                0,
                0,
                this.ship.width, 
                this.ship.height, 
                this.x, 
                this.y, 
                this.ship.width,
                this.ship.height
            );
        }
    }
    if(Game.state.mName == 'Universe'){
        // Draw
        context.fillStyle = 'rgba(155, 255, 255, 1)';  
        context.strokeStyle = 'rgba(255, 255, 255, 1)';  
        context.lineWidth = 2;
        context.fillRect(
            (this.universeX) + 8, 
            (this.universeY) - 8, 
            4,
            4
        );
        context.strokeRect(
            (this.universeX) + 6, 
            (this.universeY) - 10, 
            8,
            8
        ); 
    }
};

Ship.prototype.Load = function(type){
    var quantity = 100;
    if(this.supply[type].total - quantity <= this.supply[type].total){
        this.supply[type].total -= quantity;
        this.supply[type].bought += quantity;
        $('#'+type+'saletotal').html(this.supply[type].bought);
        $('#total'+type).html(this.supply[type].total);
        $('#salecost').html(this.total_sale);
    }
    $('#oreprofit').html((this.supply['ore'].bought * this.supply['ore'].cost));
};

Ship.prototype.Unload = function(type){
    var quantity = 100;
    if(this.supply[type].bought > 0){
        this.supply[type].total += quantity;
        this.supply[type].bought -= quantity;
        $('#'+type+'saletotal').html(this.supply[type].bought);
        $('#total'+type).html(this.supply[type].total);
        $('#salecost').html(this.total_sale);
    }
    $('#oreprofit').html((this.supply['ore'].bought * this.supply['ore'].cost));
};
