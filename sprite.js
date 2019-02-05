"use strict";

function Sprite(image, x,y,w,h){
    this.image = image;
    this.sourceArea = {x:x, y:y, w:w, h:h};
}

Sprite.prototype.draw = function draw(ctx, x,y,w,h){
    ctx.drawImage(
        this.image,
        this.sourceArea.x,
        this.sourceArea.y,
        this.sourceArea.w,
        this.sourceArea.h,
        x,
        y,
        w,
        h
    );
}