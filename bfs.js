//state variables
cellTypes = {
    1:'obstacle',
    2:'start',
    3:'end',
    4:'bfs'
}

positions = {
    1: [],
    2: [],
    3: []
}
start = [];
end = [];
currentStage = 1;
startFlag = false;
endFlag = false;
grid = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

//grid click handler
clickHandler = (row, col) => {
    if (positions[currentStage].length == 0 && grid[row][col] === 0) makeCell(row, col);
    else if (grid[row][col] === currentStage) removeCell(row, col);      
}



//initial grid load
//size is hardcoded
//1200px width
//by 600px height
window.onload = () => {
    const root = document.getElementById("root");
    const grid = document.createElement("div");
    grid.classList.add("grid-container");

    for (let i = 1; i <= 15; i++) {
        for (let j = 1; j <= 30; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = (i-1).toString() + '-' + (j-1).toString();
            cell.style.gridArea = i.toString() + ' / ' + j.toString() + ' / ' + (i+1).toString() + ' / ' + (j+1).toString();   
            cell.addEventListener('click', () => clickHandler(i-1, j-1));
            grid.appendChild(cell);
        }
    }

    cols = Array(30).fill('30px').join(' ');
    rows = Array(15).fill('30px').join(' ');
    let style= document.createElement('style');
    style.innerHTML = "\
      .grid-container { \
        grid-template-columns:" + cols + "; \
        grid-template-rows:" + rows + "; \
      }";

    document.head.appendChild(style);
    root.appendChild(grid);
    
    generateStageInstructions();
   
    };

//Instructions
generateStageInstructions = () => {
    let instructions= document.getElementById('instructions');
    instructions.innerHTML = "";

    let next = document.createElement("button");
    next.addEventListener('click', () => nextHandler());
    next.innerHTML = "Next";

    let back = document.createElement("button");
    back.addEventListener('click', () => backHandler());
    back.innerHTML = "Back";

    let start = document.createElement("button");
    start.addEventListener('click', () => nextHandler());
    start.innerHTML = "Start";
    
    let instruct = document.createElement("h2");

    switch (currentStage) {
        case 1:
            instruct.innerHTML = "Select obstacles";
            instructions.appendChild(instruct);
            instructions.appendChild(next);      
            break;
        case 2:
            instruct.innerHTML = "Select start";
            instructions.appendChild(instruct);
            instructions.appendChild(back);
            instructions.appendChild(next);
            break;
        case 3:
            instruct.innerHTML = "Select end";
            instructions.appendChild(instruct);
            instructions.appendChild(back);
            instructions.appendChild(start);
            break;
        case 4:
            instruct.innerHTML = "Started";
            instructions.appendChild(instruct);
            startBFS();
            break;
    }
    
}
//class Node
class Node {
    constructor(val = 0, front = null, back = null) {
        this.val = val;
        this.back = back;
        this.front = front;
    }
}
//class Queue
class Queue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    enque(val) {
        let newNode = new Node(val);
        if (this.size === 0) {
            this.tail = newNode;
            this.head = newNode;
        } else {
            newNode.front = this.tail;
            this.tail.back = newNode;
            this.tail = newNode;
        }
        this.size++;
    }
    deque() {
        if (this.size === 0) {
            return -1;
        }
        let tmp = null;
        if (this.size === 1) {
            tmp = this.head.val;
            this.head = null;
            this.tail = null;
            this.size--;
            return tmp;
        }
        tmp = this.head.val;
        this.head = this.head.back;
        this.size--;
        return tmp;
    }
    peek() {
        return this.head.val;
    }
    getSize() {
        return this.size;
    }

}
//BFS
var memo = [];
for (let i = 0; i < 15; i++) {
    memo.push([]);
    for (let j = 0; j < 30; j++) {
        memo[i].push(0);
    }
}
q = new Queue();
let started = false;
let currentStep = 0;
let finish = true;
startBFS = () => {
 
    //start position. Insert all valid adjacent squares into q with step = 1;
    //pop from q and append subsequent adjacent with step+1. 
    //When step == 2, change color of all squares that have been popped to seen
    //continue
    if (!started) {
    q.enque([positions[2][0], positions[2][1], 0]);
    memo[positions[2][0]][positions[2][1]] = 1;
    started = true;
    }

    while (finish && q.getSize() > 0) {
        let [row, col, step] = q.peek();
        if (step !== currentStep) {
            currentStep++;
            setTimeout(()=>startBFS(), 1000);
            console.log(row, col, step);
            break;
        }
        q.deque();
        [[0,1], [1,0], [0,-1], [-1,0]].forEach(([x,y]) => {
            if (row+x < 0 || row+x >= 15 || col+y < 0 || col+y >= 30) {
                return;
            }
            if (grid[row+x][col+y] === 3) {
                finish = false;
                addNumberToCell(row+x, col+y, step+1);
            }
            if (grid[row+x][col+y] !== 0 || memo[row+x][col+y] === 1) {
                return;
            }
            q.enque([row+x, col+y, step+1]);
            console.log(row+x, col+y, step+1);
            makeCell(row+x, col+y);
            addNumberToCell(row+x, col+y, step+1);
            memo[row+x][col+y] = 1;
        });
    }
}
//Button handlers
nextHandler = () => {
    currentStage++;
    generateStageInstructions();
    console.log(grid);
}
backHandler = () => {
    currentStage--;
    generateStageInstructions();
    console.log(grid);
}
//Obstacle/Start/End click helper functions
makeCell = (row, col) => {
    grid[row][col] = currentStage;
    let cell = document.getElementById(row.toString() + '-' + col.toString());
    cell.classList.add(cellTypes[currentStage]);
    if (cellTypes[currentStage] === 'start' || cellTypes[currentStage] === 'end') {
        positions[currentStage].push(row);
        positions[currentStage].push(col);
    }
    console.log(row, col);
}

addNumberToCell = (row, col, num) => {
    let cell = document.getElementById(row.toString() + '-' + col.toString());
    cell.innerHTML = num.toString();

}

removeCell = (row, col) => {
    grid[row][col] = 0;
    let cell = document.getElementById(row.toString() + '-' + col.toString());
    cell.classList.remove(cellTypes[currentStage]);
    positions[currentStage] = [];
}

    