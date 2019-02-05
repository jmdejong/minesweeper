
var canvas,
    ctx,
    unfound,
    scl=16,
    f,
    mode=0,
    dead=0,
    toGo,
    left,
    ne={w:9,h:9,m:10,t:0},
    timer;
 
window.onload=function (){
    canvas=document.getElementById("canvas");
    canvas.onclick=fieldClick;
    ctx=canvas.getContext("2d");
    unfound=document.getElementById("unfound");
    start(ne.w,ne.h,ne.m,ne.t);
}

function fieldClick(e){
    var layerX=e.clientX-canvas.offsetLeft+pageXOffset,
        layerY=e.clientY-canvas.offsetTop+pageYOffset,
        x=Math.floor((layerX-(f.t>=6)*layerY/2)/scl),
        y=Math.floor((layerY)/scl);
    update(x,y,e.button);
}

function create(width,height,type){
    var field=new Grid({width:width,height:height});
        field.fillFn(function(i,j){
            return {
                mines:0,
                visible:0,
                marked:0,
                x:i,
                y:j
            };
        });
    field.w=width;
    field.h=height;
    field.t=type;
    return field;
}


function fill(f,mines){
    toGo=f.w*f.h-mines;
    var i=mines;
    while (i>0){
        var x=Math.floor(Math.random()*f.w);
        var y=Math.floor(Math.random()*f.h);
        if (f.get(x,y).mines>9)
            continue;
        f.get(x,y).mines=10;
        i--;
    }
}


function findAround(f,x,y){
    var a=[];
    var b=[];
    switch (f.t){
        case 4:
            b.push([-2,-2],[2,-2],[-2,2],[2,2]);
        case 3:
            b.push([-2,-1],[2,-1],[-2,1],[2,1],[-1,-2],[1,-2],[-1,2],[1,2]);
        case 2:
            b.push([0,-2],[-2,0],[2,0],[0,2]);
        case 0:
            b.push([-1,-1],[1,-1],[-1,1],[1,1]);
        case 1:
            b.push([0,-1],[-1,0],[1,0],[0,1]);
        break;
        case 6:
            b.push([0,-1],[-1,0],[1,0],[0,1],[1,-1],[-1,1]);
    }
    for (var i=0;i<b.length;i++){
        var c= f.get(b[i][0]+x,b[i][1]+y);
        c&&a.push(c);
    }
    return a;
}

function calculate(f){
    f.for(function (x,y,cell){
        if (cell.mines>9)
            return 0;
        var a=findAround(f,x,y);
        var n=0;
        for (var i=0;i<a.length;i++)
            n+=(a[i].mines>9);
        cell.mines=n;
    });
}

function die(){
    timer.stop();
    alert("BOOM!\nMorto");
    dead=true;
}

function win(){
    var a=timer.stop();
    alert("You won! in "+(a/1000)+" seconds");
}

function test(){
    function a(x){
        var n=6;

        (x&&(n=4));
        return n;}
    var b,c,d;
    b={x:3,y:3}
    alert(toGo);
}

function draw(f){
    canvas.width=f.w*scl*(1+(f.t>=6)/2);
    canvas.height=f.h*scl;
    ctx.fillStyle="#ffffff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    function drawchar(x,y,char){
        if (f.t<6){
            ctx.fillText(char,(x+0.4)*scl,(y+0.7)*scl);
        } else {
            ctx.fillText(char,(x+(f.t>=6)*y/2+0.4)*scl,(y+0.7)*scl);
        }
        return 1;
    }
 
    function drawborder(x,y){
        ctx.strokeRect((x+(f.t>=6)*y/2)*scl,y*scl,scl,scl);
    }
 
    ctx.fillStyle="#000000";
    f.for(function(x,y,c){
        if (c.visible)
            (c.mines>9)&&(drawchar(x,y,"X"),drawchar(x,y,"-"))||(c.mines&&drawchar(x,y,c.mines));
        else{
            drawborder(x,y);
            c.marked&&(drawchar(x,y-0.1,"~"),drawchar(x,y-0.2,"~"),drawchar(x,y,"|"));
        };
    });
    unfound.innerHTML=left;
}

function update(x,y,button){
    var c=f.get(x,y);
    if (!c||c.visible||dead)
        return 0;
    if (mode||button){
        (c.marked||(c.marked=1,left--,0))&&(c.marked=0,left++);
    } else {
        if (c.marked) return 0;
        (c.mines>9)&&die();
        c.visible=1;
        if (!c.mines){
            var a=findAround(f,x,y);
            for (var i=0;i<a.length;i++)
                update(a[i].x,a[i].y,button);
        }
        (--toGo)<=0&&!dead&&win();
    }
    timer.on||timer.start();
    draw(f);
}

function start(w,h,mines,type){
    f=create(w,h,type);
    fill(f,mines);
    left=mines;
    calculate(f);
    dead=0;
    draw(f);
    timer=new Timer("timer");
}