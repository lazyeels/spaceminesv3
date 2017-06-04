var Terrain = function(octaves, num_tiles){
    this.octaves = octaves || 4;
    this.num_tiles = num_tiles || 2;
}

Terrain.prototype.GetEmptyArray = function(width, height){
    var map = [];
    var tmp = [];
    this.width = width;
    this.height = height;
    for(row = 0; row < this.height; row++){
        var tmp = [];
        for(col = 0; col < this.width; col++){
            tmp.push(0.0);
        }
        map.push(tmp);
    }
    return map;
};

Terrain.prototype.GenerateWhiteNoise = function(width, height){
    console.log("White noise", width, height)
    var tmp = this.GetEmptyArray(height, width);
    for (var i = 0; i < this.height; i++){
        for (var j = 0; j < this.width; j++){
            tmp[i][j] = Math.random(1);
        }
    }
    var perlin = this.GeneratePerlinNoise(tmp, this.octaves)
    return this.GetTile(perlin, this.num_tiles);
};

Terrain.prototype.GenerateSmoothNoise = function(baseNoise, octave){
   this.width = baseNoise.length;
   this.height = baseNoise[0].length;
 
   var smoothNoise = this.GetEmptyArray(this.width, this.height);
 
   var samplePeriod = Math.floor(Math.pow(2, octave)); // calculates 2 ^ k
   var sampleFrequency = 1.0 / samplePeriod;
   for (var i = 0; i < this.width; i++){
      //calculate the horizontal sampling indices
      var sample_i0 = Math.floor(i / samplePeriod) * samplePeriod;
      var sample_i1 = Math.floor(sample_i0 + samplePeriod) % this.width; //wrap around
      var horizontal_blend = (i - sample_i0) * sampleFrequency;
 
      for (var j = 0; j < this.height; j++){
         //calculate the vertical sampling indices
         var sample_j0 = Math.floor(j / samplePeriod) * samplePeriod;
         var sample_j1 = Math.floor(sample_j0 + samplePeriod) % this.height; //wrap around
         var vertical_blend = (j - sample_j0) * sampleFrequency;
 
         //blend the top two corners
         var top = this.Interpolate(baseNoise[sample_i0][sample_j0], baseNoise[sample_i1][sample_j0], horizontal_blend);
 
         //blend the bottom two corners
         var bottom = this.Interpolate(baseNoise[sample_i0][sample_j1], baseNoise[sample_i1][sample_j1], horizontal_blend);

         //final blend
         smoothNoise[j][i] = this.Interpolate(top, bottom, vertical_blend);
      }
   }
   return smoothNoise;
};

Terrain.prototype.CreateLevelObjects = function(noise, k){
   var width = noise.length;
   var height = noise[0].length;
   var tilemap = this.GetEmptyArray(this.width, this.height)
   for (var i = 0; i < this.height; i++){
       for (var j = 0; j < this.width; j++){
           n = noise[i][j];
           tilemap[i][j] = Math.floor (n/(1.0/k));
       }
   }
   return tilemap;
}

Terrain.prototype.Interpolate = function(x0, x1, alpha){
   return x0 * (1 - alpha) + alpha * x1;
};

Terrain.prototype.GeneratePerlinNoise = function(baseNoise, octaveCount){
   this.width = baseNoise.length;
   this.height = baseNoise[0].length;
   var smoothNoise = []//new float[octaveCount][][]; //an array of 2D arrays containing
   var persistance = 0.2;
 
   //generate smooth noise
   for (var i = 0; i < octaveCount; i++){
       smoothNoise.push(this.GenerateSmoothNoise(baseNoise, i));
   }
     
    var perlinNoise = this.GetEmptyArray(this.width, this.height);
    var amplitude = 1.0;
    var totalAmplitude = 0.0;
 
    //blend noise together
    for (var octave = octaveCount - 1; octave >= 0; octave--){
       amplitude *= persistance;
       totalAmplitude += amplitude;
       for (var i = 0; i < this.height; i++){
          for (var j = 0; j < this.width; j++){
             perlinNoise[i][j] += smoothNoise[octave][i][j] * amplitude;
          }
       }
    }

   //normalisation
   for (var i = 0; i < this.height; i++){
      for (var j = 0; j < this.width; j++){
         perlinNoise[i][j] /= totalAmplitude;
      }
   }
   return perlinNoise;
};

Terrain.prototype.GetColor = function(gradientStart, gradientEnd, t){
    var u = 1 - t;
    var color = {r: (gradientStart * u + gradientEnd * t), g: (gradientStart * u + gradientEnd * t), b: (gradientStart * u + gradientEnd * t), alpha: 255};
    return color;
};

Terrain.prototype.MapGradient = function(gradientStart, gradientEnd, perlinNoise){
   var width = perlinNoise.length;
   var height = perlinNoise[0].length;
   var image = this.GetEmptyArray(this.width, this.height)
   for (var i = 0; i < this.width; i++){
       for (var j = 0; j < this.height; j++){
           image[j][i] = this.GetColor(gradientStart, gradientEnd, perlinNoise[j][i]);
       }
   }
   return image;
};
	
Terrain.prototype.GetTile = function(perlinNoise, k){
   var width = perlinNoise.length;
   var height = perlinNoise[0].length;
   var tilemap = this.GetEmptyArray(width, height);
   for (var i = 0; i < this.height; i++){
       for (var j = 0; j < this.width; j++){
           n = perlinNoise[i][j];
           tilemap[i][j] = 1 + Math.floor (n/(1.0/k)); //+1 as tile 0 is blank
       }
   }
  // console.log(tilemap, tilemap.length, tilemap[0].length)
   return tilemap;
};

Terrain.prototype.draw = function(context, level){
    // create image data
    var image = context.createImageData(canvas.width, canvas.height);
    // iterate through pixel data (1 pixels consists of 4 ints in the array)
    for(var i = 0; i < image.data.length; i += 4){
        var x = Math.floor( (i / 4) % canvas.width);
        var y = Math.floor( (i / 4) / canvas.width);
        image.data[i] = level[y][x].r * 0.4;
        image.data[i+1] = level[y][x].g * 1;
        image.data[i+2] = level[y][x].b * 0.2;
        image.data[i+3] = level[y][x].alpha;
    }
    // write pixel data to destination context
    context.putImageData(image,0,0);
    return image;
};
