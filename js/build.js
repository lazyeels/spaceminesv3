var BuildingPortion = function(buildingTypeId, x, y, width, height) {
    this.buildingTypeId = buildingTypeId;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

var Build = function(Game){
    this.game = Game;
    this.selected = {};    
    this.level = this.game.level;
    this.mouse = this.game.mouse//utils.captureMouse(this.game.canvas);
    this.touch = utils.captureTouch(this.game.canvas);
};

Build.prototype.Menu = function(){
    var html = '';
    html += '<div class="menu title">Build <span id="menu_info"></span></div>';
    html += '<table id="build-inventory" style="vertical-align: middle;" width=100% class="menu title">';
    html += '<tr class="title"><td>Type</td><td>Cost</td><td>Ore</td></tr>';
    for(var choice in this.game.building_type){
        if(this.game.building_type[choice].available){ 
            html += '<tr onMousemove = Game.world.drawInfo("'+choice+'") onClick=Game.world.onMouseDown("'+choice+'") onMouseDown=Game.PlayAudio("menu_click")>';
            html += '<td class="small red awesome"><img src="./img/'+choice+'.png" width=24px height=24px />'; 
            html += '<span> ' + this.game.building_type[choice].name + '</span></td>';

            html += '<td class="small red awesome"><img src="./img/money.png" width=16px height=16px /> <span id="minebuyprice">' + this.game.building_type[choice].cost + '</span></td>';
            html += '<td class="small red awesome"><img src="./img/ore.png" width=24px height=24px /> ' + this.game.building_type[choice].ore + '</td>';
            html += '</tr>';    
        }
    }
    html += '</table>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
    $('#message').html(html);
    $('#message').show();
};

Build.prototype.isEmpty = function(x, y){
    // check for user in menu
    var row = this.level.startRow; 
    var col = this.level.startCol; 
    for (var i = 1; i <= 1; i++) {
        for (var j = 1; j <= 1; j++) {
            if(this.level.tilemap[x][y] != undefined) {
                return false;
            }
        }
    }
    return true;
};

Build.prototype.update = function(dt, xScroll, yScroll){
    if(this.mouse && this.game.state._current != this.game.state.SHIP && this.game.state._current != this.game.state.MENU){
//        var tile = Game.world.level.getTileCoords(this.game.mouse);
        var tile = utils.getMapCoords(this.mouse, this.level.tilemap, xScroll, yScroll, 32, 32);
        this.building = this.level.tilemap[tile.x][tile.y]; 
        if(this.building && this.game.state.mName == 'Asteroid'){
            Game.drawAlert(this.building.name); 
        }
        if(this.mouse.clicked && this.isEmpty(tile.x, tile.y)){
            this.Build(tile.x, tile.y, xScroll, yScroll);
            Game.state._current = Game.state.DEFAULT;
            this.mouse.clicked = false;

        }
        this.game.cursor.building = this.building;

        this.Select(tile.x, tile.y, xScroll, yScroll);

        if(this.level.resource_map[tile.x] && this.level.resource_map[tile.x][tile.y] == undefined){
            this.game.cursor.color = "red";
        }
    }

    if(this.touch && this.game.state._current != this.game.state.SHIP && this.game.state._current != this.game.state.MENU){
//        var tile = Game.world.level.getTileCoords(this.game.mouse);
        var tile = utils.getMapCoords(this.touch, this.level.tilemap, xScroll, yScroll, 32, 32);
        this.building = this.level.tilemap[tile.x][tile.y]; 
        if(this.building && this.game.state.mName == 'Asteroid'){
            Game.drawAlert(this.building.name); 
        }
        if(this.touch.clicked == true && this.isEmpty(tile.x, tile.y)){
            this.Build(tile.x, tile.y, xScroll, yScroll);
            Game.state._current = Game.state.DEFAULT;
            this.touch.clicked = false;

        }
        this.game.cursor.building = this.building;

        this.Select(tile.x, tile.y, xScroll, yScroll);

        if(this.level.resource_map[tile.x] && this.level.resource_map[tile.x][tile.y] == undefined){
            this.game.cursor.color = "red";
        }
    }

};

Build.prototype.Build = function(startX, startY, xScroll, yScroll){
    if(this.game.player.tileID != 0 && Game.world.id == this.game.id){// && this.game.level.resource_map[startX][startY]==tileID){
         this.building = this.game.getBuilding(this.game.player.tileID, startX, startY);
//         localStorage.world = JSON.stringify(this.game.level.tilemap);
//         console.log(localStorage.world) 
         var canBuy = false;
         if(this.game.sim.M - this.building.cost >= 0){
             if(this.game.HQ_established && this.building instanceof HQ){
                 Game.addMessage(Game.world.id, "You don't need two HQ buildings...");                  
                 canBuy = false;
             } else {
                 canBuy = true; 
             }
         } else {
             Game.addMessage(Game.world.id, "You don't have enough funds, sell some ore...");
         }
         if(this.game.sim.store <= 0){
             canBuy = false;
             Game.addMessage(Game.world.id, "You have no ore, transport some or build a mine...");                  
         }  
         // Check if there is enough power to support the building
         var asteroid_tile = this.level.resource_map[this.building.y][this.building.x];
         if(asteroid_tile == undefined){return false}
         var hasPower = this.checkPower(this.building);
         if(!hasPower){
             Game.addMessage(Game.world.id, "You need a power source, build a Solar array.");
         } 
         if(!Game.world.colonised && !(this.building instanceof HQ)){
             Game.addMessage(Game.world.id, "Build a HQ first...");
         } else if(!Game.world.colonised && this.building instanceof HQ){
             Game.world.colonised = true;
         }
         if(canBuy && hasPower && Game.world.colonised && Game.state.mName != 'Universe'){ 
             Game.addMessage(Game.world.id, "Building " + this.building.name + " (level " + (this.building.level) + ").");
             this.game.Buy(this.building);
             // place large building
             if(this.building.large_building){
                 if(this.isEmpty(startX+1, startY) && this.isEmpty(startX, startY+1) && this.isEmpty(startX+1, startY+1)){
                     this.level.tilemap[startX][startY] = this.building; // Needed here to ensure nothing is built if a square is occupied.
                     this.level.tilemap[this.building.x+1][this.building.y] = this.game.getBuilding(this.game.player.tileID, startX+1, startY);
                     this.level.tilemap[this.building.x][this.building.y+1] = this.game.getBuilding(this.game.player.tileID, startX, startY+1);
                     this.level.tilemap[this.building.x+1][this.building.y+1] = this.game.getBuilding(this.game.player.tileID, startX+1, startY+1);
                     // Reference original building
                     this.level.tilemap[this.building.x+1][this.building.y].origin_tile = this.building;
                     this.level.tilemap[this.building.x][this.building.y+1].origin_tile = this.building;
                     this.level.tilemap[this.building.x+1][this.building.y+1].origin_tile = this.building;
                 }
             } else {
                 // place small building  
                 this.level.tilemap[startX][startY] = this.building;
             }
             this.tileID = this.building.tileID;
        }
    }
};


Build.prototype.LevelUp = function(dt){
    var building = this.level.tilemap[this.selected.x][this.selected.y];
    building.state._current = building.state.RESEARCHING;
    Game.messages.push("Researching " + building.name + " (level " + (building.level + 1) + ").");
};

Build.prototype.isBuilt = function(startX, startY, xScroll, yScroll){
    var building = this.level.tilemap[startX][startY];
    if(building && !(building instanceof BuildingPortion) && building.state && building.state._current == building.state.BUILT){
        return true;
    } else {
        return false;
    }
};

Build.prototype.Select = function(startX, startY, xScroll, yScroll){
    this.game.cursor.color = "yellow";
    if(this.isBuilt(startX, startY, xScroll, yScroll) && (this.mouse.clicked || this.touch.clicked)){
        this.building.select = true;
        this.selected.x = startX;
        this.selected.y = startY;
        this.building.Select();
        this.mouse.clicked = false;
        this.touch.clicked = false;
    }
};

Build.prototype.draw = function(dt, context){

};

Build.prototype.onMouseDown = function(params){
    this.game.state._current = this.game.state.DEFAULT;
    $('#message').hide();
};

Build.prototype.onMouseUp = function(params){

};

Build.prototype.OnEnter = function(params){
    $('#stats').show();
    $('#panel').show();
    $('#alerts').show();
    $('#message').html('');

    this.Menu();
};

Build.prototype.OnExit = function(params){
    this.game.state._current = this.game.state.DEFAULT;
    $('#message').hide();
};

Build.prototype.keydown = function(e){

};

Build.prototype.close = function(e){
    $('#message').hide();
    this.tileID = 0;
};


Build.prototype.keyup = function(e){
    
};

Build.prototype.Set = function(e){
    switch(e) {
       case 'LEVELUP': //down
           this.LevelUp(this.game.game.dt);
//           this.close();
           break;
    }
};

Build.prototype.checkPower = function(building){
    if(building.name == 'Solar'){
        return true;
    } else
    if(this.game.sim.power - building.power < 0){
        return false;
    }
    return true;
};
