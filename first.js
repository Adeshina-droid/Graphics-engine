const cvs = document.querySelector('#c');
const ctx = cvs.getContext('2d');

cvs.width = 1080;
cvs.height = 620;


const CW = cvs.width;
const CH = cvs.height;
const CX = CW / 2;
const CY = CH /2;

class Vertex{
    constructor(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;

    }

    draw(){
        let px = this.x + CX;
        let py = this.y + CY;

        ctx.beginPath();
        ctx.arc(px,py,8,0,Math.PI*2);
        ctx.fillStyle = "white";
        ctx.fill();
    }
}

class Cube{
    constructor(x,y,z,edge){
        this.x = x;
        this.y = y;
        this.z = z;
        this.edge = edge;
        this.verteces = [];
        this.verteces[0] = new Vertex(x+edge/2,y+edge/2,z+edge/2);
        this.verteces[1] = new Vertex(x-edge/2,y+edge/2,z+edge/2);
        this.verteces[2] = new Vertex(x+edge/2,y-edge/2,z+edge/2);
        this.verteces[3] = new Vertex(x-edge/2,y-edge/2,z+edge/2);
        this.verteces[4] = new Vertex(x+edge/2,y+edge/2,z-edge/2);
        this.verteces[5] = new Vertex(x-edge/2,y+edge/2,z-edge/2);
        this.verteces[6] = new Vertex(x+edge/2,y-edge/2,z-edge/2);
        this.verteces[7] = new Vertex(x-edge/2,y-edge/2,z-edge/2);
    }
    draw(){
    let projected = [];

    for (let i = 0; i < this.verteces.length; i++){
        let v = this.verteces[i];

        // apply rotation (Y axis)
        let x = v.x * Math.cos(angle) - v.z * Math.sin(angle);
        let z = v.x * Math.sin(angle) + v.z * Math.cos(angle);
        let y = v.y;

        // apply translation
        x += X;
        y += Y;
        z += Z;

        // perspective projection
        let px = d * x / (z + d);
        let py = d * y / (z + d);

        projected.push({
            x: px + CX,
            y: py + CY
        });
    }

    const edges = [
        [0,1],[1,3],[3,2],[2,0], // front
        [4,5],[5,7],[7,6],[6,4], // back
        [0,4],[1,5],[2,6],[3,7]  // sides
    ];

    for (let e of edges){
        let a = projected[e[0]];
        let b = projected[e[1]];

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }
}
}

const cubes = [];
cubes[0] = new Cube(0,0,0,50);
cubes[1] = new Cube(50,50,0,10);

const floor = [];
floor[0] = new Vertex(1000,300,1000);
floor[1] = new Vertex(-1000,300,1000);
floor[2] = new Vertex(1000,300,-1000);
floor[3] = new Vertex(-1000,300,-1000);
let fx = floor[0].y;

let d = 1000;

let angle = 0;

let Y = 0;
let X = 0;
let Z = 0;

let keysDown = {};
document.addEventListener('keydown', e => keysDown[e.key] = true);
document.addEventListener('keyup', e => keysDown[e.key] = false);


function engine(){

    ctx.fillStyle="black";
    ctx.fillRect(0,0,CW,CH);

    ctx.strokeStyle = 'green';
    ctx.lineWidth = 1;
    ctx.beginPath();

    if (keysDown["ArrowLeft"]){angle += 0.1;};
    if (keysDown["ArrowRight"]){angle -= 0.1;};
    if (keysDown["ArrowDown"]){Y += 8;};
    if (keysDown["ArrowUp"]){Y -= 8;};
    if (keysDown["A"] || keysDown["a"]){X += 5;}
    if (keysDown["D"] || keysDown["d"]){X -= 5;}
    if (keysDown["W"] || keysDown["w"]){Z -= 5;}
    if (keysDown["S"] || keysDown["s"]){Z += 5;}

    for (let i=0; i<floor.length; i++){
        floor[i].draw();
    }

    for(let i=0;i<cubes.length;i++){
        
        if (cubes[i].y<fx){
            cubes[i].draw();
        }
    }

    requestAnimationFrame(engine);
}

engine();