"use strict";

function Drawer(canvas, cellSize, image){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.field = null;
    this.cellSize = cellSize || 16;
    this.image = image;
    this.sprites = {
        base: new Sprite(image, 0,0,16,16),
        unknown: new Sprite(image, 16,0,16,16),
        mine: new Sprite(image, 32,0,16,16),
        redmine: new Sprite(image, 48,0,16,16),
        flag: new Sprite(image, 0,16,16,16),
        maybe: new Sprite(image, 16,16, 16,16)
    };
}

Drawer.prototype = {
    numberColours: ["white","blue", "green", "red", "darkblue", "darkred","darkcyan","purple","black"],
    draw: function(field){
        this.canvas.width = this.cellSize*field.getWidth();
        this.canvas.height = this.cellSize*field.getHeight();
//         this.ctx.fillstyle = "black";
        var fontSize = (this.cellSize)|0;
        this.ctx.font = fontSize + "px sans serif";
        for (var x=0; x<field.getWidth(); ++x){
            for (var y=0; y<field.getHeight(); ++y){
                this.drawCell(field.getDrawCell(x,y),x*this.cellSize,y*this.cellSize);
            }
        }
    },
    drawCell: function(cell, x, y){
        this.drawSprite("base", x,y);
        if (cell.bomb && cell.known){
            this.drawSprite("redmine", x,y);
        } else if (cell.count){
            this.ctx.fillStyle = this.numberColours[cell.count];
            this.ctx.fillText(cell.count, x+this.cellSize/4|0, y+this.cellSize*0.9|0);
        }
        if(!cell.known){
            this.drawSprite("unknown", x,y);
            if (cell.bomb){
                this.drawSprite("mine", x,y);
            }
        }
        if (cell.flagged){
            this.drawSprite(cell.flagged>0 ? "flag" : "maybe", x,y);
        }
    },
    drawSprite: function(name, x, y){
        this.sprites[name].draw(this.ctx, x,y, this.cellSize, this.cellSize);
    }
}
        