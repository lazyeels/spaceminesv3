var StateMachine = function(){
    this.mStates = {};
    this.mCurrentState = undefined;
};

var IState = function(){}; 

var EmptyState = function(obj){
    for(var i in obj){
        this[i] = obj[i];
    }
};

StateMachine.prototype.Init = function(params){
    this.mCurrentState.Init(params);
};


StateMachine.prototype.update = function(dt, xScroll, yScroll){
    this.mCurrentState.update(dt, xScroll, yScroll);
};

StateMachine.prototype.close = function(params){
    this.mCurrentState.close(params);
};

 
StateMachine.prototype.keydown = function(e){
    this.mCurrentState.keydown(e);
};

StateMachine.prototype.keyup = function(e){
    this.mCurrentState.keyup(e);
};

 
StateMachine.prototype.draw = function(dt, context, xScroll, yScroll){
    this.mCurrentState.draw(dt, context, xScroll, yScroll);
};


StateMachine.prototype.getState = function(){
    return this.mName;
};

StateMachine.prototype.Set = function(element){
    this.mCurrentState.Set(element);
};

StateMachine.prototype.onMouseDown = function(e){
    this.mCurrentState.onMouseDown(e);
};

StateMachine.prototype.onMouseUp = function(e){
    this.mCurrentState.onMouseUp(e);
};


StateMachine.prototype.Change = function(stateName, params){
    this.mName = stateName;
    if(this.mCurrentState && this.mCurrentState.OnExit){
        this.mCurrentState.OnExit(params);
    }  
    this.mCurrentState = this.mStates[stateName];
    if(this.mCurrentState && this.mCurrentState.OnEnter){
        this.mCurrentState.OnEnter(params);
    }
};
 
StateMachine.prototype.Add = function(name, state){
    this.mStates[name] = state;
    this.mName = name;
//    console.log('Added state', this.mStates, name, state);
};

EmptyState.prototype.Init = function(params){

};


EmptyState.prototype.update = function(dt, xScroll, yScroll){
   // Nothing to update in the empty state.
};
 
EmptyState.prototype.draw = function(dt, context, xScroll, yScroll){
    // Nothing to render in the empty state
};
 
EmptyState.prototype.OnEnter = function(){
    // No action to take when the state is entered
};
 
EmptyState.prototype.OnExit = function(){
    // No action to take when the state is exited
};

EmptyState.prototype.keydown = function(e){
};

EmptyState.prototype.keyup = function(e){
};

EmptyState.prototype.onMouseDown = function(e){

};

EmptyState.prototype.onMouseUp = function(e){

};

EmptyState.prototype.Set = function(element){
};

EmptyState.prototype.close = function(params){
};

