/* Class Entity. */
function Entity(tileID, dimx, dimy) {
    this.tileset = new Image();
    this.tileset.src = "img/buildings.png";
    this.radius = 16;
    this.idle = true;
    this.select = false;
    this.level = 1;
    this.health = 100;
    this.build_time = 0;
    this.total_build_time = 2;
    this.dimx = dimx || 1;
    this.dimy = dimy || 1;
    this.research_time = 0;
    this.total_research_time = 3;
    this.state = {
        _current: 0,
        BUILDING: 0,
        FOUNDATION: 1,
        SCAFFOLD: 2,
        RESEARCHING: 3,
        BUILT: tileID,
    }
};

Entity.prototype.Init = function(){
    
};

Entity.prototype.Build = function(dt){
    if(this.build_time >= this.total_build_time){
        this.state._current = this.state.BUILT;
        Game.inventory[this.name] = true;
        this.Init(); 
        localStorage[this.name+"_"+this.x + "-" + this.y] = JSON.stringify({name: this.name, x: this.x, y: this.y, level: this.level, state: this.state._current, people: this.people}); 
        Game.addMessage(Game.world.id, "Building " + this.name + " (level " + (this.level) + ") complete.");
    } else 
    if(this.build_time <= this.total_build_time*0.5){
        this.state._current = this.state.SCAFFOLD;
    } else 
    if(this.build_time > this.total_build_time*0.5 && this.build_time < this.total_build_time){
        this.state._current = this.state.FOUNDATION;
    }
    this.build_time += dt;
    this.tileID = this.state._current;
};

Entity.prototype.LevelUp = function(dt){      
    this.state._current = this.state.RESEARCHING;
    if(this.research_time >= this.total_research_time){
        this.state._current = this.state.BUILT;
        this.level += 1; 
        localStorage[this.name+"_"+this.x + "-" + this.y] = JSON.stringify({name: this.name, x: this.x, y: this.y, level: this.level, state: this.state._current}); 
     //   console.log(localStorage[this.name+"_"+this.x + "-" + this.y])
        Game.addMessage(Game.world.id, "Research complete: " + this.name + " (level " + (this.level) + ").");
        if(this.select){
            $("#levelnum").html(this.level);
        }
        this.research_time = 0;
    } else if(this.research_time <= this.total_research_time*0.5){
    } else if(this.research_time > this.total_research_time*0.5 && this.research_time < this.total_research_time){
    }
    this.research_time += dt;
    this.tileID = this.state._current;
};

Entity.prototype.update = function(dt, xScroll, yScroll){    
    if(this.state._current != this.state.BUILT && this.state._current != this.state.RESEARCHING){
        this.Build(dt);
    }
    if(this.state._current == this.state.RESEARCHING){
        this.LevelUp(dt);
    }
    if(this.game.state._current == this.game.state.DEFAULT){
        this.select = false;
    }

//    this.game.updatePeople(this);

    //if(this.game.time){
    //    this.game.sim.power -= this.power;
   // }
    var retrievedObject = localStorage.getItem(this.name+"_"+this.x + "-" + this.y);
  //  console.log('retrievedObject: ', (retrievedObject));
};




Entity.prototype.draw = function(dt, context, xScroll, yScroll){
    context.save();

    context.translate((this.x * this.width) + xScroll, (this.y * this.height) + yScroll);
    context.drawImage(
        this.tileset,
        this.tileID * this.width, 
        0,
        this.width, 
        this.height,
        0,
        0,
        this.width,
        this.height
    )
    context.restore();
};
