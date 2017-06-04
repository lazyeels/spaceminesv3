var AssetManager = function(Game) {
    this.game = Game;
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = {};
    this.downloadQueue = [];
};

AssetManager.prototype.queueDownload = function(directory_list) {
    this.downloadQueue = directory_list;
};

AssetManager.prototype.downloadAll = function(downloadCallback) {
    if (this.downloadQueue.length === 0) {
        this.game.initialised = true;
    }
    var that = this;
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var path = this.downloadQueue[i].split('.');
        var filetype = path[1];
        var file, root;
        if(filetype === 'png' || filetype === 'jpg' || filetype === 'jpeg' || filetype === 'gif'){
            root = 'img/'; 
            file = new Image();
        }
        if(filetype === 'mp3' || filetype === 'ogg'){
            file = new Audio();
            root = 'snd/'; 
        }
        var filename = path[0];
        file.addEventListener("load", function() {
            that.successCount += 1;
            if (that.isDone()) {
                this.game.initialised = true;
            }
        }, false);
        file.addEventListener("error", function() {
            that.errorCount += 1;
            if (that.isDone()) {
                this.game.initialised = true;
            }
        }, false);
        file.src = root + filename + '.' + filetype;
        this.cache[filename] = file;
//        console.log(path, filename, filetype)
    }
};

AssetManager.prototype.isDone = function() {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
};

