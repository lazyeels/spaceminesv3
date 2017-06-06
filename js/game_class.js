// Game Objects
function Game(fps){
    this.debug = false;
    this.initialised = false;
    this.canvas = document.getElementById('canvas'); 
    this.context = this.canvas.getContext('2d'); 
    this.screenOffsetY = 100;

    this.ua = navigator.userAgent.toLowerCase();    
    this.android = this.ua.indexOf('android') > -1 ? true : false;
    this.ios = ( this.ua.indexOf('iphone') > -1 || this.ua.indexOf('ipad') > -1  ) ? true : false;

    this.touch = utils.captureTouch(this.canvas);
    if(this.android || this.ios){
        this.canvas.width = document.body.clientWidth;

        this.mouse = utils.captureTouch(this.canvas);
    } else {
        this.canvas.width = 720;
        this.mouse = utils.captureMouse(this.canvas);
    }
//    this.canvas.height = document.body.clientHeight;
    this.view = {
        _current: 1,
        UNIVERSE: 0,
        ASTEROID: 1,
    }

    this.state = new StateMachine();

    this.time = 0; 
    this.timepassed = 0;
    this.worlds = [];
    this.background_sounds = [];
    var assets = [
        'ore.png',
        'user.png',
        'mine.png',
        'power.png',
        'food.png',
        'money.png',
        'ship.png', 
        'menu.jpg',
        'title.png',
        'rocket.png',
        'musictrack.mp3',
        'menu_click.mp3',
        'universe.mp3', 
        'asteroid.mp3',
        'incidental1.mp3',
        'incidental2.mp3',
        'shipleave.mp3',
        'asteroid_discovered.mp3',
        'PoweringUp.mp3', 
    ];

    this.asset_manager = new AssetManager(this);
    this.asset_manager.queueDownload(assets);
    this.asset_manager.downloadAll();
//    if(this.asset_manager.successCount == assets.length){
        // Initialise Game

//    }
    this.Init(60);
};

Game.prototype.PlayAudio = function(file, loop){
    if(this.canplayaudio && this.asset_manager.cache[file]){
        this.asset_manager.cache[file].play();
    }
    if(loop){
        this.asset_manager.cache[file].addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    }
};

Game.prototype.PauseAudio = function(file){
    if(this.canplayaudio && this.asset_manager.cache[file]){
        this.asset_manager.cache[file].pause();
    }
};

Game.prototype.drawMenu = function(content){
    $('#message').html(content);
    $('#message').show();
};


Game.prototype.Init = function(fps){
    this.fps = fps || 25;
    this.timeSinceLastFrame = new Date().getTime();
    this.timeBetweenFrames = 1/fps;
    this.inventory = {};
    this.initialised = false;
    this.ore_img = this.asset_manager.cache['ore'];
    this.people_img = this.asset_manager.cache['user'];
    this.power_img = this.asset_manager.cache['power'];
    this.food_img = this.asset_manager.cache['food'];

    // Music and SFX
    try {
        this.musictrack = this.asset_manager.cache['music'];
        this.menu_click = this.asset_manager.cache['menu_click'];
        var back1 = this.asset_manager.cache['incidental1'];
        var back2 = this.asset_manager.cache['incidental1'];
        this.shipleave = this.asset_manager.cache['shipleave'];
        this.background_sounds = [back1, back2];
        this.canplayaudio = true;
    } catch (err){
        console.log('No audio tag');
        this.canplayaudio = false;
    }

    this.animation_queue = new TextAnimation(this);

    // Reset score
    this.score = 0;
    this.hour = 0;
    this.day = 0;
    this.year = 0;
    this.cooldown_timer = 0;
    this.html = '<span class="space_text"><img src="' + this.asset_manager.cache['money'].src + '" width=24px height=24px /><span id="profit">0</span></span>';
    this.html += '<span class="space_text"><img src="' + this.asset_manager.cache['ore'].src + '" width=24px height=24px /><span id="store">0</span></span>';
    this.html += '<span class="space_text"><img src="' + this.asset_manager.cache['food'].src + '" width=24px height=24px /><span id="food_supply">0</span></span>';
    this.html += '<span class="space_text"><img src="' + this.asset_manager.cache['user'].src + '" width=24px height=24px /><span id="population">0</span></span>';
    this.html += '<span class="space_text"><img src="' + this.asset_manager.cache['power'].src + '" width=24px height=24px /><span id="power-supply">0</span></span>';
    this.html += '<span class="space_text"><span id="hub-satisfaction"><img src="./img/happy.png" width=28px height=28px /></span></span>';
    this.html += '<span class="space_text" id="id" style="float: right;"></span>';
    $('#stats').html(this.html);
    $('#message').css('top', '10px');
    $('#panel').css('top', this.canvas.height - 50);
    $('#alerts').css('top', this.canvas.height+2).css('width', this.canvas.width+10);
    $('#message').css('width', this.canvas.width * 0.8 +'px');
    $('#message').css('margin-left', '40px');
    $('#panel').css('width', this.canvas.width);
    $('#stats').css('width', this.canvas.width-23);
    $('#alerts').css('width', this.canvas.width);

    this.state.Add("Titlescreen", new EmptyState(new TitleScreen(this)));
    this.state.Add("Universe", new EmptyState(new Universe(this)));
    this.state.Add("Asteroid", new EmptyState(new AsteroidManager(this)));
    this.state.Change("Titlescreen");

    this.ship = new Ship(this);
    this.ship.Init();
    this.ship.coords = this.worlds[0].coords;
    this.ship.universeX = this.worlds[0].coords.x*32;
    this.ship.universeY = this.worlds[0].coords.y*32;
    this.satellites = [];
    this.messages = [];
    this.game_objects = [];
    var self = this;
    self.canvas.addEventListener('touchstart', function(e){
        e.preventDefault()
        var touchobj = e.changedTouches[0] // reference first touch point (ie: first finger)
        self.mouse.x = parseInt(touchobj.clientX);
        self.mouse.y = parseInt(touchobj.clientY);
        self.mouse.clicked = true;

    }, false)
 
    self.canvas.addEventListener('touchend', function(e){
        e.preventDefault()
        var touchobj = e.changedTouches[0] // reference first touch point for this event
        self.mouse.x = parseInt(touchobj.clientX);
        self.mouse.y = parseInt(touchobj.clientY);
        self.mouse.clicked = false;
        self.messages.push(self.worlds[id].name + ': (' + self.mouse.x + ',' +  + self.mouse.y + ',' +  + self.mouse.clicked + ")");
    }, false)

    this.initialised = true;
};

Game.prototype.Get = function(id){
    //console.log(this.worlds[id], id)
    for (var i = 0; i < this.worlds.length; i++) {
        if(this.worlds[i].id == id){
            return this.worlds[i];
        }
    }
};


Game.prototype.addMessage = function(id, text){
    this.messages.push(this.worlds[id].name + ': ' + text);

};

Game.prototype.ProcessMessages = function(){
    if(this.messages.length == []){
        this.drawAlert("Nothing to report.");
    } else {
        for (var i = 0; i < this.messages.length; i++) {
            this.drawAlert(this.messages[i]);
            if(this.time){
                this.messages.splice(i, 1);
            }
        }
    }
};

Game.prototype.close = function(e){
    var window = e.parentNode.getAttribute('id');
    $('#'+window).hide();
    this.world.state._current = this.world.state.DEFAULT;
    this.world.close(e);
    this.mouse.clicked = false;
};

Game.prototype.toggleView = function(){
    if(this.view._current == this.view.ASTEROID){
        this.view._current = this.view.UNIVERSE
        this.state.Change("Universe", {state: 'VIEW'});
    } else
    if(this.view._current == this.view.UNIVERSE){
        this.view._current = this.view.ASTEROID;
        this.state.Change("Asteroid");
    }
};

Game.prototype.drawAlert = function(message){
    var html = '<span id="mymessage" class="title">'+message.replace(new RegExp("_", 'g'), " ")+'</span>';
    $('#alert_text').html(html);
    $('#alert_text').show();
};

Game.prototype.Evac = function(){
    this.ship.cargo['ore'].load = this.world.sim.store;
    this.ship.cargo['cash'] = this.world.sim.M;
    this.world.sim.store = 0;
    this.world.sim.M = 0;
};


Game.prototype.keydown = function (event) {
    if(this.initialised){
        this.state.keydown(event);
    }
};

Game.prototype.keyup = function (event) {
    if(this.initialised){
        this.state.keyup(event);
    }
};

Game.prototype.GetCoords = function(pointer, entity){
    var x = Math.floor(pointer.x / 32);
    var y = Math.floor(pointer.y / 32);
    this.target = {x: x, y: y};
    if(pointer.clicked && this.state.mName == 'Universe'){
        if(x == Math.floor(entity.x/32) && y == Math.floor(entity.y/32)){
            // View asteroid
            if(this.state.mCurrentState.state._current != this.state.mCurrentState.state.SELECT){
                this.world = entity;
                pointer.clicked = false; 
                this.view._current = this.view.ASTEROID;
                this.state.Change('Asteroid');
                Game.world = this.world;
                this.world.state._current = this.world.state.DEFAULT;
            } else
            // Select asteroid for ship destination
            if(this.state.mCurrentState.state._current == this.state.mCurrentState.state.SELECT){
                if(this.ship.state._current == this.ship.state.SELECTED){
                    this.ship.destination = entity.id;
                    pointer.clicked = false; 
                    this.drawAlert("Destination set for " + entity.name);
                    $('#ship-destination').html("Dispatch to " + entity.name);
                    this.state.Change('Asteroid');
                    this.view._current = this.view.ASTEROID;
                    this.ship.leaveflag = true;
                    this.ship.state._current = this.ship.state.DESELECTED;
                    this.world.state._current = this.world.state.DEFAULT;
                } 
            }
        } else
        // Select region for satellite destination
        if(this.state.mCurrentState.state._current == this.state.mCurrentState.state.LAUNCH){
           this.view._current = this.view.ASTEROID;
           this.world.state._current = this.world.state.DEFAULT;
           this.state.Change('Asteroid');
           var sat = new Satellite(this);
           this.satellites.push(sat); 
           pointer.clicked = false;
        }
    }
};

Game.prototype.drawLaunchMenu = function(){
    Game.state.Change('Universe', {state: 'LAUNCH'});
};


Game.prototype.onMouseDown = function(e){
    if(this.initialised){
        this.state.onMouseDown(e);
    }
};

Game.prototype.onMouseUp = function(e){
    if(this.initialised){
        this.state.onMouseUp(e);
    }
};

Game.prototype.onTouchDown = function(e){
    if(this.initialised){
        this.state.onTouchDown(e);
    }
};

Game.prototype.onTouchUp = function(e){
    if(this.initialised){
        this.state.onTouchUp(e);
    }
};

Game.prototype.Resize = function(){
    var screen_height = window.innerHeight;
    var screen_width = window.innerWidth;
    var width = screen_width;
    var height = screen_height;
    if(screen_height > screen_width){
        this.ratio = this.canvas.height/this.canvas.width;
        height = this.ratio * screen_width;
    }else{
        this.ratio = this.canvas.width/this.canvas.height;
        var width = screen_height * this.ratio;
    }
};

Game.prototype.Timer = function(dt){
    if(this.timepassed >= 2){
        this.timepassed = 0;
        return true;
    } else {
        this.timepassed += dt;
        return false;
    }
};

Game.prototype.Collisions = function(asteroidA, i){
    for (var j = i; j < this.worlds.length; j++){
        var asteroidB = this.worlds[j];
        if(this.day >= 5 && asteroidA.id != asteroidB.id && asteroidA.id != 0){ 
            asteroidA_AABB = {
                x: asteroidA.coords.x * 32, 
                y: asteroidA.coords.y * 32,  
                radius: asteroidA.gravity
            };
            asteroidB_AABB = {
                x: asteroidB.coords.x * 32, 
                y: asteroidB.coords.y * 32,  
                radius: asteroidB.gravity
            };
            var dx = (asteroidB.x - asteroidA.x);
            var dy = (asteroidB.y - asteroidA.y);
            var dist = Math.sqrt(dx * dx + dy * dy);
            if(this.state.mName == 'Asteroid' && asteroidA.colonised && !asteroidA.evacuate_flag && dist < 40){
                $('#evac').show();
                asteroidA.evacuate_flag = true; 
            } 
            if(dist <= 20){
                asteroidA.destroyed = true;
                asteroidB.destroyed = true;
                var html = '';
                if(asteroidA.destroyed && asteroidA.colonised){
                    html += '<table id="disaster" class="menu title"><tr><td>Warning</td></tr>';
                    html += '<tr>';
                    html += '<td>' + asteroidA.name + ' collided with ' + asteroidB.name + ', both were destroyed along with your colony!</td>';
                } else
                if(asteroidA.discovered && asteroidB.discovered){
                    html += '<table id="disaster" class="menu title"><tr><td>Warning</td></tr>';
                    html += '<tr>';
                    html += '<td>' + asteroidA.name + ' collided with ' + asteroidB.name + ', both were destroyed' + '</td>';
                } else
                if(asteroidA.discovered  && !asteroidB.discovered){
                    html += '<table id="disaster" class="menu title"><tr><td>Warning</td></tr>';
                    html += '<tr>';
                    html += '<td>' + asteroidA.name + ' collided with an unknown NEO (near earth object) and was destroyed.' + '</td>';
                } else
                if(!asteroidA.discovered && asteroidB.discovered){
                    html += '<table id="disaster" class="menu title"><tr><td>Warning</td></tr>';
                    html += '<tr>';
                    html += '<td>' + asteroidB.name + ' collided with an unknown NEO (near earth object) and was destroyed.' + '</td>';
                } 
                if(html!=''){
                    html += '</tr>';  
                    html += '</table>'; 
                    html += '<span class="right-side" onClick=Game.close(this) onMouseDown=Game.PlayAudio("menu_click")><span class="button">Close</span>';
                    this.drawMenu(html);
                }
                // Add explosions
                for(var i = 0; i < 5 + Math.random() * 10; i++){ 
                    var radial_explosion = new Explosion(asteroidA);
                    this.game_objects.push(radial_explosion);
                    radial_explosion = new Explosion(asteroidB);
                    this.game_objects.push(radial_explosion);
                } 
            } else {
                var collision = utils.circleCollision(asteroidA_AABB, asteroidB_AABB);
                if(collision.distance){
                    // If not discovered, make it discovered
                    if(asteroidA.discovered && asteroidB.discovered!=true){ 
                        asteroidB.discovered = true;
                    }
                    if(asteroidA.radius > asteroidB.radius){
                        asteroidA.x += dx * Game.dt;
                        asteroidA.y += dy * Game.dt;
                        if(asteroidB.id != 0){
                            asteroidA.collision_buddy = {name: asteroidB.name, trajectory: {distance: Math.floor(dist)	}};
                        }
                       //asteroidA.collision_buddy = asteroidB.name;
                    }
                }
            }
        }
    }
};


Game.prototype.update = function(){
    if(this.initialised){
        // Calculate the time since the last frame
        var thisFrame = new Date().getTime();
        this.dt = (thisFrame - this.timeSinceLastFrame)/1000;
        this.timeSinceLastFrame = thisFrame;
        this.time = this.Timer(this.dt);

        for (var i = 0; i < this.game_objects.length; i++) {
            if(this.game_objects[i].isAlive){
                this.game_objects[i].update(this.dt);
            } else {
                this.game_objects.splice(i, 1);
            }
        }
        for(var i = 0; i < this.worlds.length; i++){
            if(!this.worlds[i].destroyed){
                if(this.time){
                    this.Collisions(this.worlds[i], i);
                }
                this.worlds[i].update(this.dt);
            }

            if(this.worlds[i].meteor_shower){
                this.cooldown_timer += 1;
            }
            if(this.cooldown_timer >= 10){

                this.worlds[i].meteor_shower = false;
            }
        }

        this.animation_queue.update(this.dt);

        if(this.time){
            if(this.day == 360){
                this.day = 0;
                this.year += 1;
                var sound = this.background_sounds[Math.floor(Math.random() * this.background_sounds.length)];
                this.PlayAudio(sound);
            } else {
                this.day += 1;
            }
            $('#clock').html(this.day + ':' + this.year);
        }

        this.state.update(this.dt)

        if(this.ship){
            this.ship.update(this.dt);
        }

        this.ProcessMessages();
    }

    for(var i=0; i < this.satellites.length; i++){
        this.satellites[i].update(this.dt);
        if(this.satellites[i].isAlive == false){
            this.satellites.splice(i,1); 
        }
    }
    $('#debug').html('input: (' + this.mouse.x + ',' +  + this.mouse.y + ',' +  + this.mouse.clicked + ')' + ', (' + this.touch.x + ',' +  + this.touch.y + ',' +  + this.touch.clicked + ")");

}; 

Game.prototype.draw = function(timer){
    if(this.initialised){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.state.draw(this.dt, this.context);
        for(var i=0; i < this.satellites.length; i++){
            this.satellites[i].draw(this.dt, this.context);
        }
        for (var i = 0; i < this.game_objects.length; i++) {
            if(this.game_objects[i].isAlive){
                this.game_objects[i].draw(this.dt, this.context, 0, 0);
            }
        }
    }
};

Game.prototype.onOpened = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/games/' + location.href.split('games/')[1] + '/opened');
    xhr.send();
};

Game.prototype.onMessage = function(message) {
    var json = JSON.parse(message.data);
//    document.querySelector('.sidebar .player1').innerHTML = 'Player 1: ' + json.player1;
//    document.querySelector('.sidebar .player2').innerHTML = 'Player 2: ' + json.player2;
//    if (json.player1 && json.player2) {
//        game.state = 'ingame';
//    }

//    if (my_nickname === json.player1) {
//        team = 'red';
//    } else {
//        team = 'blue';
//    }

//    if (game.initialized) {
//        game.updateState(json.state);
//    } else {
//        game.initState(json.state);
//    }
}

Game.prototype.GameOver = function(){
    var html = ""
    this.drawMenu(html);
};
