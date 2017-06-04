var TitleScreen = function(Game){
    this.game = Game;
    this.x = 0;
    this.y = 0;
    this.speed = 1;
    this.canvas = this.game.canvas;
    this.starfield = new Starfield(this);
   
    this.credits = [];
    this.pointer = 0;
    this.prompt_start = {text: "", x: this.canvas.width, y: this.canvas.height, speed: 2,};
    this.init();
    $('#canvas').css('top', 0);
};

TitleScreen.prototype.init = function(){
    var offset = 60;
    var origin_y = (this.canvas.height);
    this.game.PlayAudio("musictrack");

    this.back = this.game.asset_manager.cache['menu'];
    
    this.credits.push({text: "Welcome to SpaceMines K2013...", x: this.canvas.width, y: origin_y + 1 * offset, textSize: 0, color: 'rgba(255,255,255, 1)', speed: 2, angle: 60,});
    this.credits.push({text: "Coding & 3D modeling: Lazyeels", x: this.canvas.width, y: origin_y + 4 * offset, textSize: 0, color: 'rgba(255,255,255,1)', speed: 2, angle: 60,});
    this.credits.push({text: "Music: 'Dark Future' by Deceased Superior Technician", x: this.canvas.width, y: origin_y + 8 * offset, textSize: 0, color: 'rgba(255,255,255,1)', speed: 2, angle: 60,});
    this.credits.push({text: "Concept adapted from 'Space Games' (1982) and inspired by K240 (Amiga release)...", x: this.canvas.width, y: origin_y + 11 * offset, textSize: 0, color: 'rgba(255,255,255,1)', speed: 2, angle: 60,});
    this.credits.push({text: "SpaceMines came about as a result of the October Challenge (2013)...", x: this.canvas.width, y: origin_y + 11 * offset, textSize: 0, color: 'rgba(255,255,255,1)', speed: 2, angle: 60,});
    this.credits.push({text: "SpaceMines didn't become the final game I wanted it to be, but I'll be putting more work in to it as the weeks roll on...", x: this.canvas.width, y: origin_y + 11 * offset, textSize: 0, color: 'rgba(255,255,255,1)', speed: 2, angle: 60,});
    this.credits.push({text: "...and on...", x: this.canvas.width, y: origin_y + 11 * offset, textSize: 0, color: 'rgba(255,255,255,1)', speed: 4, angle: 60,});

    this.credits.push({text: "I love beer, so if you love SpaceMines and want to see more, perhaps you can donate to my beer fund?", x: this.canvas.width, y: origin_y + 11 * offset, textSize: 0, color: 'rgba(255,255,255,1)', speed: 2, angle: 60,});

    this.title = this.game.asset_manager.cache['title'];

    var html = '<div id="title">';
    html += '<ul id="menu-items" class="menu title">';
    html += '<li class="large red awesome" id="newgame" onClick=Game.state._current=Game.state.Change("Asteroid")>New Game</li>';
   // html += '<li class="large red awesome" id="newgame" onClick="Game.state._current=Game.state.GAME">Load</li>';
   // html += '<li class="large red awesome" id="newgame" onClick="Game.state._current=Game.state.GAME">Credits</li>';
    html += '</ul>';
    html += '</div>';

    $('#titlemenu').html(html);
    var width = (window.innerWidth/2);
    var left_position = ((this.canvas.width/2) - 75);
   
    $('#titlemenu').css('width', width + 'px');
    $('#titlemenu').css('top', this.canvas.height/2+20+'px').css('left', left_position+'px');
    $('#titlemenu').css('margin', '0 auto');
    $('#newgame').css('margin', '0 auto');
};

TitleScreen.prototype.update = function(dt){
    var angle = 0,
    range = 50;
}; 

TitleScreen.prototype.draw = function(dt, context){
    context.font = 'bold 14px Orbitron, sans-serif';
    // Present the images
    context.drawImage(this.back, 0, 0, this.back.width, this.back.height, 0, 0, this.canvas.width, this.canvas.height);
    context.drawImage(this.title, 0,0, this.title.width, this.title.height, this.canvas.width/2 - ((this.title.width/2) * 0.7), this.canvas.height/2 - ((this.title.height/2) * 0.7), this.title.width * 0.7, this.title.height * 0.7);

    context.save();
    var credit = this.credits[this.pointer];  
    var offsetX = context.measureText(credit.text).width;
      
    if (credit.x + offsetX < 0){
        this.credits[this.pointer].x = this.canvas.width //this.canvas.width + 250;
        if(this.pointer == this.credits.length){
            this.pointer = 0;
        } else {
            this.pointer += 1; 
        }
    } else {
        credit.x -= credit.speed;
    }

    context.shadowColor = "rgba(0,0,0,0.6)";
    context.shadowOffsetX = -2;
    context.shadowOffsetY = 2;
    context.shadowBlur = 2;
    context.fillStyle = credit.color;  
    context.fillText(credit.text, credit.x, this.canvas.height - 20);
    // Draw Game start message and title
    context.fillStyle = '#ffdd00';
    context.font = 'bold 60px Orbitron, sans-serif';
    context.restore();
}; 

TitleScreen.prototype.OnEnter = function(params){
    $('#stats').hide();
    $('#panel').hide();
    $('#alerts').hide();
    $('#message').hide();
    $('#donate').css('top', this.canvas.height + 'px');
};

TitleScreen.prototype.OnExit = function(params){
    this.game.PauseAudio('musictrack');
    $('#titlemenu').hide();
};
