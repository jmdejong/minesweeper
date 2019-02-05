"use strict";


function MineSweeper(){
    
    
    this.cellSize = 25;
    this.output = new Output(this.cellSize);
    
    this.output.restartButton.addEventListener("click", this.start.bind(this));
    
    var canvas = document.getElementById("canvas");
    canvas.addEventListener("contextmenu", function(e){e.preventDefault();});
    canvas.addEventListener("mousedown", this.click.bind(this));
    
    this.start();
}

MineSweeper.prototype = {
    start: function(){
        this.field = new Field(this.output.fieldWidth.value|0,this.output.fieldHeight.value|0,this.output.numberOfMines.value|0);
        this.isPlaying = true;
        this.draw();
        this.output.setTitle("MINE SWEEPER");
        this.output.setBgColour("white");
        this.output.setCounter(this.field.minesLeft());
        
    },
    click: function(e){
        if (!this.isPlaying){
            return;
        }
        var x = e.offsetX/this.cellSize|0;
        var y = e.offsetY/this.cellSize|0;
        if (!e.button){
            this.field.sweep(x,y);
            if (!this.field.isAlive()){
                this.boom();
            } else if (this.field.hasWon()){
                this.win();
            }
        } else {
            this.field.flag(x,y);
            this.output.setCounter(this.field.minesLeft());
        }
        this.draw();
    },
    boom: function(){
        this.isPlaying = false;
        this.draw();
        this.output.setTitle("BOOOOM!!!");
        this.output.setBgColour("red");
    },
    win: function(){
        this.isPlaying = false;
        this.draw();
        this.output.setTitle("YOU WON!");
        this.output.setBgColour("lime");
    },
    
    draw: function(){
        this.output.drawer.draw(this.field);
    },
//     setTitle: function(text){
//         
//         while (this.titleField.firstChild){
//             this.titleField.removeChild(this.titleField.firstChild);
//         }
//         var textNode = document.createTextNode(text);
//         this.titleField.appendChild(textNode);
//     },
//     setBgColour: function(colour){
//         this.area.style.backgroundColor = colour;
//     }
}



function Output(cellSize){
    
    this.cellSize = cellSize;
    var canvas = document.getElementById("canvas");
    var image = document.getElementById("spritetiles");
    
    this.titleField = document.getElementById("title");
    this.area = document.getElementById("minesweeper-area");
    
    this.restartButton = document.getElementById("restart");
    this.counter = document.getElementById("minecounter");
    
    this.drawer = new Drawer(canvas, this.cellSize, image);
    
    this.fieldWidth = document.getElementById("fieldwidth");
    this.fieldHeight = document.getElementById("fieldheight");
    this.numberOfMines = document.getElementById("numberofmines");
}

Output.prototype = {
    setTitle: function(text){
        this._setText(this.titleField, text);
    },
    setCounter: function(text){
        this._setText(this.counter, text);
    },
    setBgColour: function(colour){
        this.area.style.backgroundColor = colour;
    },
    _setText: function(element, text){
        while (element.firstChild){
            element.removeChild(element.firstChild);
        }
        var textNode = document.createTextNode(text);
        element.appendChild(textNode);
    }
};
        





function main(){
    new MineSweeper();
}

window.addEventListener('load', main);