var Factory = function(Game, x, y, origin){
    this.game = Game;
    this.sim = this.game.sim;
    this.tileID = 9;
    this.name = "Factory Facility"
    this.x = x||0;
    this.y = y||0;
    this.width = 32;
    this.height = 32;
    this.ore = 500 || 1;
    this.cost = 3000//this.sim.ore_price * this.ore;
    this.people = 0;
    this.numberofitems = this.game.factory_projects.length; // used to detect an update to the project queue
    this.origin_tile = origin;
    this.large_building = true;
    this.requires_update = true;
    this.power = 30;
    this.available = true;
    Factory.superclass.constructor.call(this, this.tileID, 2, 2);
};
extend(Factory, Entity);

Factory.prototype.Init = function(){
    this.game.sim.power -= this.power;
};


Factory.prototype.update = function(dt, xScroll, yScroll){    
    if(this.state._current != this.state.BUILT && this.state._current != this.state.RESEARCHING){
        this.Build(dt);
    }
    if(this.state._current == this.state.RESEARCHING){
        this.LevelUp(dt);
    }

    if(this.select){ 
//        $('#unemployed').html(this.game.sim.workers);
    }
    if(this.game.factory_projects[0]){
        var project = this.game.factory_projects[0];
        if(project.time >= project.rate){
            projectcompleted = true;
            this.game.updateAssets(project);             
            this.game.factory_projects.splice(0, 1);
        } else {
            project.time += dt;
            project.percentcomplete = Math.floor((project.time/project.rate)*100);
            if(project.percentcomplete == 0){
               project.message = "Waiting...";
            } 
            if(project.percentcomplete == 100){
                project.message = "Completed.";
            } else {
                project.message = project.percentcomplete + "%";
            }
        }
    }
    //if(this.game.completed_projects.length>0){
    //    console.log(this.game.completed_projects);
    //}
};


Factory.prototype.Select = function(){
    this.game.state._current = this.game.state.MENU;
    var html = '';
    html += '<div class="menu title">Factory Facility</div>';
    html += '<ul id="inventory" class="menu title">';
    html += '<table class="title">';
    if(this.game.assets['factory']){
        html += '<tr><td>Projects:</td><td id="construction-title" class="title">'+this.game.current_factory_item.name+'</td><td class="title">Construction in progress:</td></tr>';
        html += '<tr>';
        html += '<td>';
        html += '<ul id="projects">';

        for (var item in this.game.factory_items){
            var name = this.game.factory_items[item].name;
            html += '<li class="large green awesome" id="' + item + '-factory" rel="' + item + '-research" onClick=Game.world.showDescription(this)>' + name + '</li>';
        } 
        html += '</ul>';
        html += '</td>';

        html += '<td>';
        html += '<table id="construction-details" style="width: 200px;">';
        html += '<tr><td class="title right-side"></td></tr>';
        html += '<tr><td class="title right-side">';
        html += '<span><img class="round-border" style="background-color: rgba(0,0,0,0.8);" src="./img/store.png" width=96 height=96 /></span>';
        html += '<tr class="title"><td><img src="./img/money.png" class="icon_small" /><span id="construction-cost">'+this.game.current_factory_item.cost+'</span>';
        html += '<img src="./img/ore.png" class="icon_small" /><span id="construction-ore">'+this.game.current_factory_item.ore+'</span></td></tr>';
        html += '</td></tr>';
        html += '<tr><td id="construction-description" class="title">'+ this.game.current_factory_item.description+'</td></tr>';
        html += '<tr><td class="title"></td></tr>';
        html += '<tr><td class="right-side title" onMouseDown=Game.PlayAudio("menu_click")><span class="button" onClick=Game.world.addtoTimeline("factory")>Construct</span></td></tr>';
        html += '</table>';
        html += '</td>';
    } else {
        html += '<tr><td>You need to do some research, nothing to build here!</td></tr>';
    }

    html += '<td>';
    html += '<table>';
    html += '<tr><td class="title">';

    html += '<ul id="construction-queue">';
    html += '</ul>';
    html += '</td></tr>';
    html += '</table>';
    html += '</td>';

    html += '</tr>'
    html += '</table>';
    html += '</ul>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
    html += '</table>';
    this.game.player.mouse.clicked = false;
    $('#message').html(html);  
    $('#message').show();
};

Factory.prototype.draw = function(dt, context, xScroll, yScroll){
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

    if(Object.keys(this.game.factory_items).length > this.numberofitems){
        // update menu with new researched items
        this.Select();
        this.numberofitems = Object.keys(this.game.factory_items).length;
    }

    // Update factory building guage
    if(this.game.factory_projects.length > 0 && this.requires_update){
        var html = "";
        for (var i=0; i<this.game.factory_projects.length; i++){
            if(this.game.factory_projects){
                html += '<li class="menu">' + this.game.factory_projects[i].name + '<div class="guage red" style="width: ' + this.game.factory_projects[i].percentcomplete + 'px;">' + this.game.factory_projects[i].message + '</div></li>';
            }
        }
        $('#construction-queue').html(html);
    }
};
