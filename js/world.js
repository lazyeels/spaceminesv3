var World = function(Game){
    this.game = Game;    
    this.id = 0;
    this.selected = {};
    this.canvas = this.game.canvas;
    this.mouse = utils.captureMouse(this.canvas);
    this.colonised = false;
    this.HQ_established = false;
    this.state = {
        _current: 1,
        DEFAULT: 0,
        MENU: 1,
        SHIP: 2,
        GAMEOVER: 3
    }

    this.showMapFlag = false;
    this.timepassed = 0;
    this.hour = 0;
    this.day = 0//parseInt(localStorage.day) || 0;
    this.year = 0//parseInt(localStorage.year) || 1;
    this.discovered = false;
    this.destroyed = false;
    this.sim = new Simulation(this.game);
    this.sim.id = this.id;
    this.level = new Level_Class(this);
    this.player = new Player(this);
    this.cursor = new Cursor(this);
    this.project = [];
    this.factory_projects = [];
    this.assets = {};
    this.Init();
};

World.prototype.Init = function(){
//    this.canvas.width = window.innerWidth;
    this.discovered = false;
    this.meteor_shower = false;
    this.building_type = {
        'solar': new Solar(this),	
        'oxygen': new Oxygen(this),
        'hydroponics': new Hydroponics(this),
        'mine': new Mine(this),
        'home': new Home(this),
        'hq': new HQ(this),
        'research': new Research(this),
        'factory': new Factory(this),
        'silo': new Silo(this),
    }

    this.time = 0;    
    this.timepassed = 0;
    this.level.Init(this.canvas.width, this.canvas.height);
    this.player.Init(this.level, this.tileset);
    this.sim.Init();
    this.project = [];
    this.factory_projects = [];
    this.completed_projects = {};
    this.launch_site = {x: 0, y: 0};
    this.research_items = {};
 //   this.research_items['hydroponics'] = {ID: 'hydroponics', name: "Hydroponics Plant", type: 'building', menu: 'building', ore: 300, cost: 0, time: 120, description: 'Produce your own food.'};
    this.research_items['robotworker'] = {ID: 'robotworker', name: "Robot Worker", type: 'mineutil', menu: 'factory', ore: 10, cost: 0, time: 50, description: 'More efficient workers - less prone to sadness and overwork.'};
    this.research_items['satellite'] = {ID: 'satellite', name: "Satellite", type: 'Explorer', menu: 'silo', ore: 30, time: 70, description: 'Explore space and find new asteroids to colonise.  Also acts as an early warning system.'};
    var current = Object.keys(this.research_items)[0]
    this.current_research_item = this.research_items[current];
    this.factory_items = {};
    this.current_factory_item = {};
    this.inventory = {};
    this.window_large = parseInt(window.innerWidth*0.8);
    this.window_small = parseInt(window.innerWidth*0.2);
//    Game.messages.push('Welcome to Space Mines K2013<br><br>First build a HQ to establish your colony...<br>');
    this.supply = {};
    this.supply.ore = {total: 0, bought: 0, cost: this.sim.ore_price};
    this.supply.food = {total: Math.floor(1000 + Math.random() * 80), bought: 0, cost: 10};
    this.gravity = Math.floor(24 + Math.random() * 64);
    this.radius = this.gravity; 
    window.scrollTo(0,1);
};

World.prototype.drawMessage = function(message){
    this.state._current = this.state.MENU;
    var html = '';
    html += '<div class="menu title">Messages</div>';
    html += '<ul class="menu title">';
    html += '<li>'+message+'</li>';
    html += '</ul>';
    html += '</div>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
    $('#message').html(html);
    $('#message').show();
};

World.prototype.drawInfo = function(message){
//    console.log(message)
    var html = '<span class="title">'+message.replace(new RegExp("_", 'g'), " ")+'</span>';
    $('#menu_info').html(html);
    $('#menu_info').show();
};

World.prototype.showDescription = function(element){
    var choice = element.getAttribute('id').split('-');
    var building = choice[1];
    var option = choice[0];
    switch(building){
       case 'factory':
           var item = this.factory_items[option];
           this.current_factory_item = item;
           this.current_factory_item.cost = item.ore * this.sim.ore_price;
           this.current_factory_item.div = '#'+option+'-'+building
           this.current_factory_item.callback = function(){console.log("Calling callback...")};
           $('#construction-title').html(this.current_factory_item.name);
           $('#construction-cost').html(this.current_factory_item.cost);
           $('#construction-ore').html(this.current_factory_item.ore);
           $('#construction-description').html(this.current_factory_item.description);
           break;

       case 'research':
           var item = this.research_items[option];
           this.current_research_item = item;
           this.current_research_item.cost = item.ore * this.sim.ore_price;
           this.current_research_item.div = '#'+option+'-'+building
           this.current_research_item.callback = function(){console.log("Calling callback...")};
           $('#project-title').html(this.current_research_item.name);
           $('#project-cost').html(this.current_research_item.cost);
           $('#project-ore').html(this.current_research_item.ore);
           $('#project-description').html(this.current_research_item.description);
           break;
    }
};

World.prototype.addtoTimeline = function(type){
    switch(type) {
       case 'research':
           var dev = this.current_research_item;
           dev.completed = false; 
           dev.rate = dev.time || 10;
           dev.percentcomplete = 0;
           dev.time = 0;
           dev.message = "Waiting...";
           dev.callback = function(){};

           this.sim.M -= dev.ore * this.sim.ore_price;
           this.sim.store -= dev.ore;
           this.project.push(dev);

           $(this.current_research_item.div).remove();
           delete this.research_items[this.current_research_item.ID];
           var current = Object.keys(this.research_items)[0];
           this.current_research_item = this.research_items[current];       
           break;
       case 'factory':
           var dev = this.current_factory_item;
           dev.completed = false; 
           dev.rate = dev.time || 10;
           dev.percentcomplete = 0;
//           dev.menu = 'stock';
           dev.time = 0;
           dev.message = "Waiting...";
           dev.callback = function(){};

           this.sim.M -= dev.ore * this.sim.ore_price;
           this.sim.store -= dev.ore;
           this.factory_projects.push(dev);
           break;
    }
};

World.prototype.updateAssets = function(project){
    if(this.assets[project.menu] == undefined){
        this.assets[project.menu] = {}     
    }
    if(project.menu == 'building'){
        this.building_type[project.ID].available = true;
    }
    if(this.assets[project.menu][project.ID] == undefined){
       this.assets[project.menu][project.ID] = 1; 
    } else {
        this.assets[project.menu][project.ID] += 1;
    }
    if(project.menu == 'factory'){
        this.factory_items[project.ID] = project;
        this.current_factory_item = project;
    }
};

World.prototype.Buy = function(item){
    if(this.sim.M - item.cost >= 0){
        this.sim.M -= item.cost;
        if(Game.world.sim.store - item.ore >= 0){
            Game.world.sim.store -= item.ore;
            if(item.name=="mine"){
                this.sim.mine_total+=1;
            }
        } else {
            Game.addMessage(this.id, "You don't have enough ore for that!");
            return false;
        }
    } else {
        Game.addMessage(this.id, "You don't have enough money for that!");
        return false;
    }
    return true;
};

World.prototype.getBuilding = function(id, x, y){
    var type = undefined;
    switch(id) {
       case 'mine':
           type = new Mine(this, x, y);
           break;
       case 'food':
           type = new Food(this, x, y);
           break;
       case 'home':
           type = new Home(this, x, y);
           break;
       case 'hq':
           type = new HQ(this, x, y);
           break;
       case 'research':
           type = new Research(this, x, y);
           break;
       case 'factory':
           type = new Factory(this, x, y);
           break;
       case 'hydroponics':
           type = new Hydroponics(this, x, y);
           break;
       case 'oxygen':
           type = new Oxygen(this, x, y);
           break;
       case 'solar':
           type = new Solar(this, x, y);
           break;
       case 'silo':
           type = new Silo(this, x, y);
           break;

    }
    this.cursor.building = type;
    return type;
};


World.prototype.AddEventListener = function(){

};

World.prototype.update = function(dt){
    this.cursor.update(dt);
    if(this.state._current!= this.state.GAMEOVER){
        this.level.update(dt,0,0);
        if(this.game.time){
            this.sim.update();
            this.sim.updateFood();
        }
        
        if(Game.world.name == this.name){
            $('#hub-satisfaction').html(this.sim.satisfaction_icon);
            this.player.update(dt, this.level.scroll.x, this.level.scroll.y);
        }
    }
};

World.prototype.spawnBuilding = function(building){
    var x = Math.floor(2 + Math.random() * 12);
    var y = Math.floor(2 + Math.random() * 12);
    var type = undefined;
//    if(Game.world.name == this.name){

    switch(building) {
       case 'solar':
           type = new Solar(this, x, y);
           break;
       case 'mine': //down
           type = new Mine(this, x, y);
           break;
       case 'food': //down
           type = new Food(this, x, y);
           break;
       case 'home': //down
           type = new Home(this, x, y);
           break;
       case 'hq': //down
           type = new HQ(this, x, y);
           this.level.tilemap[x+1][y] = new HQ(this, x+1, y, type);
           this.level.tilemap[x][y+1] = new HQ(this, x, y+1, type);
           this.level.tilemap[x+1][y+1] = new HQ(this, x+1, y+1, type);
           break;
    }
//    if(this.level.tilemap[x] && this.level.tilemap[x][y]==undefined){
    this.level.tilemap[x][y] = type;
//    }
//    console.log(x, y, this.level.tilemap[x][y]);
//}
};

World.prototype.draw = function(dt, context, xScroll, yScroll){
    this.level.asteroid.starfield.draw(dt, context);
    if(!this.destroyed){
        this.level.draw(dt, context, 0, 0);
        this.cursor.draw(dt, context);
        this.sim.draw(dt, context);
        if(Game.world.name == this.name){
            this.player.draw(dt, context, 0, 0);
        }
        this.game.animation_queue.draw(dt, context);
    } else {
        context.fillStyle = 'white';
        var text = this.name + ' was destroyed...';
        var text_width = context.measureText(text).width; 
        context.fillText(text, (Game.canvas.width/2)-text_width, Game.canvas.height/2);
    }
    if(this.game.ship.location == this.id){
        this.game.ship.universeX = this.x;
        this.game.ship.universeY = this.y;
        this.game.ship.draw(dt, context);
    }
};

World.prototype.OnEnter = function(params){
    $('#buildtool').show();
    $('#world-nav').show();
    this.Init();
};

World.prototype.OnExit = function(params){
    this.game.PauseAudio('asteroid');
};

World.prototype.keydown = function(e){
    this.player.keydown(e);
};

World.prototype.keyup = function(e){
    this.player.keyup(e);
};

World.prototype.onMouseDown = function(e){
    this.player.onMouseDown(e);

};

World.prototype.onMouseUp = function(e){
    this.player.onMouseUp(e);
};

World.prototype.close = function(params){
    this.player.state.close(params);
    this.player.mouse.clicked = false;
    this.state._current = this.state.DEFAULT;
};

World.prototype.Set = function(e){
    switch(e) {
       case 'BUILD': //down
           this.player.state.Change('Build');
           this.player.state.Init();
           this.state._current = this.state.MENU;
           break;
       case 'LEVELUP': //down
           this.player.state.Set('LEVELUP');
           this.state._current = this.state.DEFAULT;           
           break;
    }
};

World.prototype.Save = function(){
    // Put the object into storage
    var level = undefined
    for (var x=0; x<this.level.tilemap.length; x++){
        for (var y=0; y<this.level.tilemap[0].length; y++){
            localStorage.setItem('tilemap_'+x+"-"+y, (this.level.tilemap[x][y]));
        }
    }
};

World.prototype.Load = function(){
    for (var x=0; x<this.level.tilemap.length; x++){
        for (var y=0; y<this.level.tilemap.length; y++){
            var retrievedObject = localStorage.getItem('tilemap_'+x+"-"+y);
            console.log('retrievedObject: ', (retrievedObject));
        }
    }
};

World.prototype.SellMenu = function(){
    this.supply['ore'].total = Game.world.sim.store;
    html = '<table>';
    html += '<tr>';
    html += '<td class="fixedcolumn" onMousemove=Game.addMessage('+this.id+', "Sell_ore.") ><img src="'+Game.asset_manager.cache['ore'].src+'" width=24px height=24px /></td><td><span id="totalore" class="title">' + this.supply['ore'].total +'</span></td>';
    html += '<td id="moreore" class="smallbutton title" onClick=Game.world.increaseSale("ore")>+</td>';
    html += '<td id="lessore" class="smallbutton title" onClick=Game.world.decreaseSale("ore")>-</td>';
    html += '<td id="oresaletotal" class="title">'+this.supply['ore'].bought+'</td>';
    html += '<td id="oreprofit" class="title" >'+this.supply['ore'].bought * this.supply['ore'].cost+'</td>';
    html += '</tr>';
    html += '<br><span style="text-align: right;" onClick=Game.world.Purchase() onMouseDown=Game.PlayAudio("menu_click")><span class="button">Purchase</span></span><br>';
    html += '</table>';
    $('#HQ-main-window').html(html);
};

World.prototype.increaseSale = function(type){
    var quantity = 0;
    switch(type) {
        case 'ore':
            quantity = 100;
            break;
        case 'food':
            quantity = 10;
            break;
        case 'worker': 
            quantity = 1;
            break;
    }
    if(this.supply[type].bought + quantity <= this.supply[type].total + this.supply[type].bought){
        this.supply[type].total -= quantity;
        this.supply[type].bought += quantity;
        $('#'+type+'saletotal').html(this.supply[type].bought);
        $('#total'+type).html(this.supply[type].total);
    }
    $('#'+type+'profit').html(this.supply[type].bought * this.supply[type].cost);
};

World.prototype.decreaseSale = function(type){
    var quantity = 0;
    switch(type) {
        case 'ore':
            quantity = 100;
            break;
        case 'food':
            quantity = 10;
            break;
        case 'worker': 
            quantity = 1;
            break;
    }

    if(this.supply[type].bought - quantity >= 0){
        this.supply[type].total += quantity;
        this.supply[type].bought -= quantity;
        $('#'+type+'saletotal').html(this.supply[type].bought);
        $('#total' + type).html(this.supply[type].total);
    }
    $('#'+type+'profit').html(this.supply[type].bought * this.supply[type].cost);
};

World.prototype.Sell = function(){
    type = 'ore';
    this.sim.M += (this.supply[type].bought * this.supply[type].cost);
    this.sim.store -= this.supply[type].bought;
    this.supply[type].bought = 0;
    $('#'+type+'saletotal').html(this.supply[type].bought);
    $('#'+type+'profit').html(this.supply[type].bought * this.supply[type].cost);
};

World.prototype.Purchase = function(){
    var type = 'food';
    this.sim.M -= this.supply[type].bought * this.supply[type].cost;
    this.sim.food_supply += this.supply[type].bought;
    this.supply[type].bought = 0;
    $('#'+type+'saletotal').html(this.supply[type].bought);
    $('#'+type+'profit').html(this.supply[type].bought * this.supply[type].cost);
};

World.prototype.drawBuyMenu = function(){
    html = '<table>';
    html += '<td class="fixedcolumn" onMousemove=Game.drawAlert("Buy_food.") ><img src="'+Game.asset_manager.cache['food'].src+'" width=24px height=24px /></td><td><span id="totalfood" class="title">'+this.supply.food.total+'</span></td>';
    html += '<td id="morefood" class="smallbutton title" onClick=Game.world.increaseSale("food")>+</td>';
    html += '<td id="lessfood" class="smallbutton title" onClick=Game.world.decreaseSale("food")>-</td>';
    html += '<td id="foodsaletotal" class="title">0</td>';
    html += '<td><img src="'+Game.asset_manager.cache['money'].src+'" /><span id="foodprofit" class="title">0</td><td style="text-align: right;" onClick=Game.world.Purchase() onMouseDown=Game.PlayAudio("menu_click")><span><span class="large blue awesome">Buy</span></td>';
    html += '</tr>';
    html += '</table>';
    $('#HQ-main-window').html(html);
};


World.prototype.drawSellMenu = function(){
    this.supply['ore'].total = Game.world.sim.store;
    html = '<table>';
    html += '<tr>';
    html += '<td class="fixedcolumn" onMousemove=Game.drawAlert("Sell_ore.") ><img src="'+Game.asset_manager.cache['ore'].src+'" width=24px height=24px /></td><td><span id="totalore" class="title">' + Game.world.sim.store +'</span></td>';
    html += '<td id="moreore" class="smallbutton title" onClick=Game.world.increaseSale("ore")>+</td>';
    html += '<td id="lessore" class="smallbutton title" onClick=Game.world.decreaseSale("ore")>-</td>';
    html += '<td id="oresaletotal" class="title">' + this.supply.ore.bought + '</td>';
    html += '<td><img src="'+Game.asset_manager.cache['money'].src+'" /><span id="oreprofit" class="title">0</span></td><td style="text-align: right;" onClick=Game.world.Sell() onMouseDown=Game.PlayAudio("menu_click")><span class="large blue awesome">Sell</span></td>';
    html += '</tr>';
    html += '<tr>';
    html += '</tr>';
    html += '</table>';
    $('#HQ-main-window').html(html);
};

World.prototype.drawColonyInfo = function(){
    html = '<table class="title">';
    html += '<tr><td>Colony Satisfaction: <span id="statisfaction" class="title" >' + parseInt(this.sim.S) + '</span>%</td></tr>';
    html += '<tr><td><img src="'+Game.asset_manager.cache['money'].src+'" class="icon_small" /><span id="purchaseprice">'+this.sim.M+'</span></td><td></td>';
    html += '<td><img src="'+Game.asset_manager.cache['user'].src+'" class="icon_small" /><span id="population">' + this.sim.P+'</span></td></tr>';
    html += '<tr><td><img src="'+Game.asset_manager.cache['ore'].src+'" class="icon_small" /><span id="oreperday">'+this.sim.store+'</span></td><td></td>';
    html += '<td><img src="'+Game.asset_manager.cache['mine'].src+'" class="icon_small" /><span id="minetotal">'+this.sim.mine_total+'</span></tr>';
    html += '<tr><td><img src="'+Game.asset_manager.cache['food'].src+'" class="icon_small" /><span id="oreperday">' + parseInt(this.sim.food_supply) + '</span></td><td></td>';
    html += '<td><img src="'+Game.asset_manager.cache['power'].src+'" class="icon_small" /><span id="energytotal">' + parseInt(this.sim.power) + '</span></tr>';
    html += '</table></div>';
    $('#HQ-main-window').html(html);
};

