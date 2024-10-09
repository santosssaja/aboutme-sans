// created by creativewiz🥀

"use strict";
let c, ctx, W, H;
let touchx,touchy;
let camera, e;
let points = [];
let move = false;
let mouse = {x: 0, y: 0};
let dots = [];

const random = (max=1, min=0) => Math.random() * (max - min) + min;

const clear = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, W, H);
};

const createDots = ()=> {
    for(let z=10; z<100; z+=5){
         let x = W;
         let y = H;
         let b = 5 + random(20);
         let s = 0.1;
         for(let p=0; p<360; p++)dots.push(new Dot(x, y, z, p, b, s));
    }
};

const updateDots = ()=> {
    for(let i=1; i<dots.length; i++){
        dots[i].update();
        if(dots[i].z<0){
            dots[i].z = 90;
            dots[i].pos.x = dots[i].pos.recX;
            dots[i].pos.y = dots[i].pos.recY;
            dots[i].color = 'red';
            dots.push(dots.shift());
        } 
    }
}; 
const eventsListener = ()=> {
    c.addEventListener("touchstart",function(e){
        touchx = e.touches[0].pageX;
        touchy = e.touches[0].pageY;
    });
    c.addEventListener("touchmove",function(e){
        camera.x += 2*(e.touches[0].pageX-touchx);
        touchx = e.touches[0].pageX;
        camera.y += 2*(e.touches[0].pageY-touchy);
        touchy = e.touches[0].pageY;
    });
    c.addEventListener("mousemove", function(e){
        if(move){
            camera.x += 2*(e.clientX-mouse.x);
            camera.y += 2*(e.clientY-mouse.y);
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }
    });
    c.addEventListener("mousedown", function(e){
        move=true;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    c.addEventListener("mouseup", function(){move=false});
}; 


class Dot {
    constructor(x, y, z, p, b, s) {
        this.xS = -2 + p/100;
        this.z = z ;
        this.size = 0.15;
        this.pos = {x:x, y:y, recX:x, recY:y};
        this.speed = {x:random(7, -7), y:random(7, -7), z:s};
        this.color = 'red';
        this.boom = b;
    }
    projection(x, y, z) {
        this.dx = this.x - camera.x;
        this.dy = this.y - camera.y;
        this.dz = this.z - camera.z;
        this.bx = e.z * this.dx/this.dz + e.x;
        this.by = e.z * this.dy/this.dz + e.y;
        return [this.bx+W/2, this.by+H/3];
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(...this.projection(this.x, this.y, 10), this.size*(100/this.dz), 0, 2 * Math.PI);
        ctx.fill();
    }
    check() {
        if(this.xS > 1.8)this.xS = -1.8;
        if(this.z<this.boom){
            this.pos.x += this.speed.x;
            this.pos.y += this.speed.y;
            this.color = 'rgba(255,255,255,0.6)';
         } 
    }
    update() {
        this.xS += 0.0002;
        this.x = W+this.pos.x + this.xS * 100;
        this.y = H+this.pos.y + (Math.sqrt(Math.cos(this.xS)) * Math.cos(100*this.xS)  + Math.sqrt(Math.abs(this.xS)))*100;
        this.z -= this.speed.z;
        this.check();
        this.draw();
    }
}
const init = () => {
    c = document.getElementById("canvas");
    c.width = W = window.innerWidth;
    c.height = H = window.innerHeight;
    ctx = c.getContext("2d");
    camera = {x:W*2.5, y:H*3.5, z:-1};
    e = {x:0, y:0, z:-5};
    eventsListener();
    createDots();
    animate();
};

const animate = () => {
    clear();
    updateDots();
    window.requestAnimationFrame(animate);
};

window.onload = init;

pop_alert('Swipe over Screen to change camera view, if you like the code give a Sub to our Youtube Channel.','Wel Come🥀', 'Thanks😊', true, 'red');