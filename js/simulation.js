var Simulation = function(Game){
    this.game = Game;
    this.id = 0;
};

Simulation.prototype.Init = function(){
    this.S = 100; // Satisfaction level
    this.year = 1; // Year set to 1
    this.mine_total = 0; //Math.floor(5 + Math.random() * 3); // Number of mines
    this.P = 0//Math.floor(40 + Math.random() * 60); // Number of people
    this.M = 518000+Math.floor((180 + Math.random() * 150)) * this.P; // Money
    this.food_supply = Math.floor(80 + Math.random() * 20) * this.P; // Food supply
    this.ore_per_mine = 0//Math.floor(80 + Math.random() * 40); // Ore per mine
    this.mine_price = Math.floor(2000 + Math.random() * 2000); // Buying/Selling price mines
    this.ore_price = Math.floor(7 + Math.random() * 12); // Buying/Selling price ore
    this.food_price = Math.floor(1 + Math.random() * 5);
    this.worker_price = Math.floor(7 + Math.random() * 120);
    this.oxygen_supply = Math.floor(this.P * 0.8) * 7;
    this.power = 0;
    
    this.store = 0; // Amount of ore in storage
    this.mines_to_sell = 0;
    this.mine_to_buy = 0;
    this.gameover = false;
    this.gamewin = false;
    this.ore_cost_of_mine = 100;
    this.leavetotal = 0;
    this.workers =  this.P;
    this.homeless =  this.P;
    this.newWorkers = 0;
    this.world = Game.world;
};

Simulation.prototype.checkGameOver = function(){
    if(this.S < 60){
        Game.addMessage(this.id, "The people are revolting!");
    }
//    if(this.P < 10){
//        Game.addMessage("Not enough people left in the colony!")
//    }
    if(this.year >= 11){
        Game.addMessage(this.id, "You survived your term of office!")
    }
};

Simulation.prototype.randomDisaster = function(){
    var event = Math.random();
    if(event == 0.01){
        this.P = this.P/2;
    }
    if(event == 0.02){
        var previousprice = this.ore_price;
        if(this.ore_price > 1){
            this.ore_price -= Math.floor(this.ore_price*(0.2 + Math.random() * 0.8));
            Game.messages.push('Market Glut!<span> Was '+previousprice+' now '+this.ore_price+' (down '+((this.ore_price/previousprice)*100).toFixed(2)+'%)</span>');
        }
    }
};

Simulation.prototype.update = function(){
    this.checkGameOver();
    if (!this.gameover){
        this.updateEnvironment();
        this.updateMines();
        this.updateSatisfaction();
        this.randomDisaster();
        this.updatePopulation();
        this.updatePower();
    }  
};

Simulation.prototype.updateEnvironment = function(){
    if(this.oxygen_supply/this.P < 10){
        //if(this.game.id == Game.world.id){
            Game.addMessage(this.id, "There's not enough Oxygen per person, build more tanks!");
        //}
    }
};

Simulation.prototype.updatePower = function(){

};

Simulation.prototype.sellOre = function(amount){
    var total = amount || 1;
    this.M += (total * this.ore_price);
};        

Simulation.prototype.loadOre = function(amount){
    var total = amount || 1;
    this.store -= total;
};        


Simulation.prototype.sellMine = function(amount){
    this.M += (this.mines_to_sell * this.mine_price);
    this.mine_total -= this.mines_to_sell;
};

Simulation.prototype.buyMine = function(){
//    this.ore_per_mine += Math.floor(80 + Math.random() * 40);
    this.M -= this.mine_price;
    this.mine_total += 1;
    this.store -= this.ore_cost_of_mine;
};
 
Simulation.prototype.buyFood = function(){
    //this.M -= this.FB;
};

Simulation.prototype.updateFood = function(){
//    if(this.food_supply - (this.P * 0.05) > 0){
//        this.food_supply -= (this.P * 0.05);
//    }
};


Simulation.prototype.updateMines = function(){
    if(this.S >= 90){
        this.ore_per_mine += 1 + Math.random() * 20;
    }
    if(this.S <= 50){
        this.ore_per_mine -= 1 + Math.random() * 20;
    }
};

Simulation.prototype.updateSatisfaction = function(){
    if(parseInt(this.P)/parseInt(this.mine_total) <= 10){
        this.S -= 0.5;
//        if(this.game.id == Game.world.id){
            Game.addMessage(this.id, "You're overworking everyone! ");
//        }
    }
    if(this.food_supply/this.P >= 100){
        if(this.S + 0.2 < 100){
            this.S += .2;
        }
    } else if(this.food_supply/this.P < 10){
        if(Game.world.colonised){
            Game.addMessage(this.id, 'You need more food!');
        } 
        this.S -= .1;
    }

    if(this.S >= 95){
        this.satisfaction_icon = '<img src="./img/happy.png" title="Population satisfaction '+Math.floor(this.S)+'%" width=28px height=28px />';
    } else if(this.S < 89 && this.S > 80){
        this.satisfaction_icon = '<img src="./img/happy-medium.png" title="Population satisfaction '+Math.floor(this.S)+'%" width=28px height=28px />';
    } else if(this.S < 80 && this.S > 70){
        this.satisfaction_icon = '<img src="./img/happy-not.png" title="Population satisfaction '+Math.floor(this.S)+'%" width=28px height=28px />';
    } else if(this.S < 70){
        this.satisfaction_icon = '<img src="./img/happy-angry.png" title="Population satisfaction '+Math.floor(this.S)+'%" width=28px height=28px />';
    }
};

Simulation.prototype.updatePopulation = function(){
//    if(this.S > 80){
//        this.newWorkers = Math.floor(1 + Math.random() * 10);
//    }
};

Simulation.prototype.draw = function(dt, context){
    $('#store').html(this.store);          
    $('#profit').html(this.M);
    $('#mine_total').html(this.mine_total); 
    $('#population').html(Math.floor(this.P));
    $('#food_supply').html(Math.floor(this.food_supply));
    $('#statisfaction').html(parseInt(this.S));
    $('#power-supply').html(parseInt(this.power));
};


