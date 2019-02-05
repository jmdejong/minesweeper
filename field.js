
"use strict";


function Field(width, height, mines){
    this.width = width;
    this.height = height;
    this.mines = mines;
    
    this.discovered = 0;
    this.flags = 0;
    
    var cells = [];
    for (var i=0; i<width*height; ++i){
        cells[i] = {bomb: i<mines, known: false, flagged: 0};
    }
    
    this.field = [];
    for (i=0; i<width*height; i++){
        var place = (Math.random()*cells.length)|0
        this.field[i] = cells[place];
        cells.splice(place,1);
//         this.field.splice(Math.random()*(this.field.length+1)|0, 0, cell);
    }
//     console.log(this.field);
    this.alive = true;
}

Field.prototype = {
    
    sweep: function(x, y){
        if (this.isAlive() && this.isValid(x,y)){
            var cell = this._get(x,y);
            if (cell.flagged == 1 || cell.known){
                return false;
            }
            cell.known = true;
            cell.flagged = 0;
            if (!this.countBombs(x, y)){
                for (var i=-1; i<=1; i++){
                    for (var j=-1; j<=1; j++){
                        this.sweep(x+i,y+j)
                    }
                }
            }
            if (cell.bomb){
                this.alive = false;
            } else {
                ++this.discovered;
            }
        }
    },
    
    flag: function(x, y){
        if (this.isAlive() && this.isValid(x, y)){
            var cell = this._get(x,y);
            if (cell.known){
                return;
            }
            cell.flagged = ((cell.flagged + 2) % 3) - 1;
            this.flags += cell.flagged;
        }
    },
    
    _get: function(x, y){
        if (!this.isValid(x,y)){
            return null;
        }
        return this.field[x + y*this.width];
    },
    
    isValid: function(x,y){
        return x>=0 && y>=0 && x<this.width && y<this.height;
    },
    isBomb: function(x,y){
        if (!this.isValid(x,y)){
            return false;
        }
        return this._get(x, y).bomb;
    },
    countBombs: function(x, y){
        var bombs = 0;
        for (var i=-1; i<=1; i++){
            for (var j=-1; j<=1; j++){
                bombs += this.isBomb(x+i, y+j) ?1:0;
            }
        }
        return bombs
    },
    
    getWidth: function(){
        return this.width;
    },
    getHeight: function(){
        return this.height;
    },
    
    getDrawCell: function(x, y){
        if (!this.isValid(x,y)){
            return null;
        }
        var cell = this._get(x,y);
        return {
            known: cell.known,
            bomb: (cell.known || !this.isAlive()) ? cell.bomb : null,
            flagged: cell.flagged,
            count: cell.known ? this.countBombs(x, y) : null
        };
    },
    isAlive: function(){
        return this.alive;
    },
    hasWon: function(){
        return this.discovered + this.mines >= this.width * this.height;
    },
    minesLeft: function(){
        return this.mines - this.flags;
    }
}


