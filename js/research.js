var Research = function(Game, x, y, origin){
    this.game = Game;
    this.sim = this.game.sim;
    this.tileID = 8;
    this.name = "Research Facility"
    this.x = x||0;
    this.y = y||0;
    this.width = 32;
    this.height = 32;
    this.ore = 500 || 1;
    this.cost = 4000//this.sim.ore_price * this.ore;
    this.people = 0;

    this.origin_tile = origin;
    this.large_building = true;
    this.requires_update = true;
    this.power = 7;
    this.available = true;
    Research.superclass.constructor.call(this, this.tileID, 2, 2);
};
extend(Research, Entity);

Research.prototype.Init = function(){
    this.game.sim.power -= this.power;
};


Research.prototype.update = function(dt, xScroll, yScroll){    
    if(this.state._current != this.state.BUILT && this.state._current != this.state.RESEARCHING){
        this.Build(dt);
    }
    if(this.state._current == this.state.RESEARCHING){
        this.LevelUp(dt);
    }

    if(this.select){ 
//        $('#unemployed').html(this.game.sim.workers);
    }
    if(this.game.project[0]){
        var project = this.game.project[0];
        if(project.time >= project.rate){
            projectcompleted = true;
            this.game.updateAssets(project);
            this.game.project.splice(0, 1);
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
};


Research.prototype.Select = function(){
//    this.game.state._current = this.game.state.MENU;
    var first = Object.keys(Game.world.research_items)[0];
    var html = '';
    html += '<div class="menu title">Research Facility</div>';
    html += '<ul id="inventory" class="menu title">';
    html += '<table class="title">';
    html += '<tr><td>Projects:</td><td id="project-title" class="title">'+Game.world.research_items[first].name+'</td><td class="title">Research in progress:</td></tr>';
    html += '<tr>';

    html += '<td>';
    html += '<ul id="projects">';
    for (var item in Game.world.research_items){
        var name = Game.world.research_items[item].name;
        html += '<li class="large blue awesome" id="' + item + '-research" rel="' + item + '-research" onClick=Game.world.showDescription(this)>' + name + '</li>';
    }
    html += '</ul>'
    html += '</td>';
    html += '<td>';
    html += '<table id="project-details" style="width: 200px;">';
    html += '<tr><td class="title right-side"></td></tr>';
    html += '<tr><td class="title right-side">';
    html += '<span><img class="round-border" style="background-color: rgba(0,0,0,0.8);" src="./img/store.png" width=96 height=96 /></span>';
    html += '<tr class="title"><td><img src="./img/money.png" class="icon_small" /><span id="project-cost">'+Game.world.current_research_item.cost+'</span>';
    html += '<img src="./img/ore.png" class="icon_small" /><span id="project-ore">'+Game.world.current_research_item.ore+'</span></td></tr>';
    html += '</td></tr>';
    html += '<tr><td id="project-description" class="title">'+ Game.world.current_research_item.description+'</td></tr>';
    html += '<tr><td class="title"></td></tr>';
    html += '<tr><td class="right-side title" onMouseDown=Game.PlayAudio("menu_click")><span class="button" onClick=Game.world.addtoTimeline("research")>Research</span></td></tr>';
    html += '</table>';
    html += '</td>';

    html += '<td>';
    html += '<table>';
    html += '<tr><td class="title">';

    html += '<ul id="project-queue">';
    html += '</ul>';
    html += '</td></tr>';
    html += '</table>';
    html += '</td>';

    html += '</tr>'
    html += '</table>';
    html += '</ul>';
    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button" >Close</span></span>';
    html += '</table>';
    this.game.mouse.clicked = false;
    Game.drawMenu(html);
};

Research.prototype.draw = function(dt, context, xScroll, yScroll){
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

    if(this.game.project.length > 0 && this.requires_update){
        var html = "";
        for (var i=0; i<this.game.project.length; i++){
            if(this.game.project){
                html += '<li class="menu">' + this.game.project[i].name + '<div class="guage red" style="width: ' + this.game.project[i].percentcomplete + 'px;">' + this.game.project[i].message + '</div></li>';
            }
        }
        $('#project-queue').html(html);
    }
};
