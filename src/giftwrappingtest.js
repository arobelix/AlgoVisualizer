
//initialize global variables
instructionRegistry = {};
stageRegistry = {};

//register instructions
instructionRegistry["PlacePoints"] = "Left-Click on the canvas to add a point. Right-Click on the canvas to remove the last added point.";

//register stage order
stageRegistry[0] = ["PlacePoints"];

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.neighbor = null;
        this.potentialNeighbor = null;
        this.bastPotentialNeighbor = null;
        this.currentPoint = false;
    }
}

//view class is used generate updates to the screen
class View {
    static createCanvas(height = 500, width = 500) {
        const root = document.getElementById("root");
        let canvas = document.createElement("canvas");
        canvas.height = height;
        canvas.width = width;
        canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
        canvas.id = 'canvas';
        root.appendChild(canvas);
    }

    static updateCanvas(points) {
        View.resetCanvas();
        const root = document.getElementById("canvas");
        const ctx = canvas.getContext('2d');
        View.resetCanvas()
        points.forEach((point) => {
            
            ctx.beginPath();

            ctx.moveTo(0,0);
            if (point.currentPoint) {
                ctx.fillStyle = 'green';
                ctx.fillRect(point.x-4, point.y-4,6,6);
            } else {
                ctx.rect(point.x-2, point.y-2,2,2);
            }
            if (point.neighbor != null) {
                View.drawLine(point, point.neighbor, 'black');
            } 
            if (point.potential != null) {
                View.drawLine(point, point.potential, 'green');
            }
            if (point.bestPotential != null) {
                View.drawLine(point, point.bestPotential, 'blue');
            }

            ctx.stroke();
        })
    }

    static resetCanvas() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width, canvas.height);
    }

    static drawLine(p1, p2, color) {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        console.log(p1, p2);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    static displayInstructions(instructionText, leftButtonHandler = null, rightButtonHandler = null, leftButtonText = "", rightButtonText = "") {
        let instructions = document.getElementById('instructionContainer');
        let instructionMessage = document.createElement('p');
        instructionMessage.innerText = instructionText;
        instructions.appendChild(instructionMessage);
        if (leftButtonHandler != null) {
            let leftButton = document.createElement('button');
            leftButton.innerText = leftButtonText;
            leftButton.addEventListener('click', () => leftButtonHandler());
            instructions.appendChild(leftButton);
        }

        if (rightButtonHandler != null) {
            let rightButton = document.createElement('button');
            rightButton.innerText = rightButtonText;
            rightButton.addEventListener('click', () => rightButtonHandler());
            instructions.appendChild(rightButton);
        }
    }
}

//Controller for setting up scan
class SetupController {
    constructor() {
        this.points = [];
        View.createCanvas();
        let canvas = document.getElementById("canvas");
        //create set/remove listener for canvas decouple this part
        canvas.addEventListener('mousedown', (m) => {
            m.preventDefault();
            if (m.button == 0) {
                this.addPoint(Math.round(m.clientX-canvas.getBoundingClientRect().left), Math.round(m.clientY-canvas.getBoundingClientRect().top));
            } else if (m.button == 2) {
                
                this.removePoint();
            }
        })
        var iterateController = new IterateController(this.points);
        View.displayInstructions(instructionRegistry["PlacePoints"], this.resetPoints.bind(this), iterateController.start.bind(iterateController), "Reset", "Start");
    }

    addPoint(x, y) {
        //debugging
        console.log((x), (y));
        //check if point already exists in points
        for (var i = 0; i < this.points.length; i++) {
            if (x == this.points[i].x && y == this.points[i].y) {
                return;
            }
        }
        this.points.push(new Point(x, y));
        View.updateCanvas(this.points);
    }

    removePoint() {
        this.points.pop();
        View.updateCanvas(this.points);
    }

    resetPoints() {
        while (this.points.length > 0)
        {
            this.points.pop();
        }
        View.resetCanvas();
    }
}

class IterateController {
    constructor(points) {
        this.points = points;
        this.currentPoint;
        this.potential;
        this.bestPotential = null;
        this.shellList = [];
        this.currentChecked = [];
        this.startPoint = null;
        this.speed = 1000;
    }

    start() {
        let canvas = document.getElementById("canvas");
        canvas.remove();
        View.createCanvas();
        var completedController = new CompletedController();
        if (this.points.length < 3) {
            completedController.completed(false);
            return;
        } 
        //Find current lowest, leftest point in points
        this.findStartPoint();
        this.iterate();
        View.displayInstructions("", this.increaseSpeed.bind(this), this.decreaseSpeed.bind(this), "Fast", "Slow");
    }
    
    increaseSpeed() {
        this.speed -= 100;
        console.log(this.speed);
    }

    decreaseSpeed() {
        this.speed += 100;
        console.log(this.speed);
    }
    iterate() {
        console.log("iterate");
        if (!this.selectPotential()) {
            setTimeout(this.iterate.bind(this), this.speed);
        } else {
            console.log(this.bestPotential)
            if (this.bestPotential == null) {
                this.currentPoint.potential = null;
                this.currentPoint.neighbor = this.startingPoint;
                this.currentPoint.bestPotential = null;
                View.updateCanvas(this.points);  
                return;
            }
            if (this.crossProduct(this.currentPoint, this.startingPoint, this.bestPotential) < 0) {
                this.currentPoint.potential = null;
                this.currentPoint.neighbor = this.startingPoint;
                this.currentPoint.bestPotential = null;
                View.updateCanvas(this.points);  
                return;
            }
            console.log("h2")
            this.currentPoint.potential = null;
            this.currentPoint.neighbor = this.currentPoint.bestPotential;
            this.currentPoint.bestPotential = null;

            this.currentPoint = this.currentPoint.neighbor;
            this.potential = null
            this.bestPotential = null;
            this.shellList.push(this.currentPoint);
            this.currentChecked = [];
            this.iterate();  
        } 
        View.updateCanvas(this.points);        
    }

    selectPotential() {
        var flag = true;
        for (var i = 0; i < this.points.length  ; i++) {
            if (this.shellList.indexOf(this.points[i]) != -1 || this.currentChecked.indexOf(this.points[i]) != -1) {
                continue;
            }    
            this.potential = this.points[i];    
            this.currentChecked.push(this.points[i]);
            flag = false;
            break;        
        }
        if (this.bestPotential == null || this.crossProduct(this.currentPoint, this.potential, this.bestPotential) < 0) {
            console.log(this.bestPotential)
            console.log(this.potential)
            this.bestPotential = this.potential;  
        } 
        this.currentPoint.potential = this.potential;
        this.currentPoint.bestPotential = this.bestPotential;
        return flag;
    }

    crossProduct(currentPoint, potential, bestPotential) {
        var a_x = potential.x - currentPoint.x;
        var a_y = potential.y - currentPoint.y;
        console.log(bestPotential)
        var b_x = bestPotential.x - currentPoint.x;
        var b_y = bestPotential.y - currentPoint.y;
        console.log(a_x * b_y - b_x * a_y);
        return a_x * b_y - b_x * a_y; 
    }

    findStartPoint() {
        var curMinPoint = this.points[0];
        var curMinX = this.points[0].x;
        var curMinY = this.points[0].y;
        for (var i = 0; i < this.points.length; i++) {
            if (this.points[i].x < curMinX) {
                curMinPoint = this.points[i];
                curMinX = this.points[i].x;
                curMinY = this.points[i].y;
            }
            else if (this.points[i].x == curMinX && this.points[i].y < curMinY) {
                curMinPoint = this.points[i];
                curMinX = this.points[i].x;
                curMinY = this.points[i].y;
            }
        }

        this.currentPoint = curMinPoint;
        this.shellList.push(this.currentPoint);
        this.startingPoint = curMinPoint;
        View.updateCanvas(this.points);
    }
}

class CompletedController {
    completed() {
        
        
    }
}


window.onload = () => {
    var controller = new SetupController();
};








