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
            startDFS();
            break;
    }
    
}

//DFS
var memo = [];
for (let i = 0; i < 15; i++) {
    memo.push([]);
    for (let j = 0; j < 30; j++) {
        memo[i].push(0);
    }
}


let finish = false;
let stack = [];
let started = false;
startDFS = () => {
    if (!started) {
        stack.push([positions[2][0], positions[2][1]]);
        started = true;
    }
    if (stack.length === 0) {
        return;
    }
    let [row, col] = stack[stack.length-1];
    step = memo[row][col];
    if (grid[row][col] === 3) {
        finish = true;
        addNumberToCell(row, col, step);
        return;
    }
    makeCell(row, col);
    addNumberToCell(row, col, step);
    if (row+1 < 15 && [0, 3].includes(grid[row+1][col]) && memo[row+1][col] === 0) {
        stack.push([row+1, col]);
        memo[row+1][col] = step+1;
    } else if (row-1 >= 0 && [0, 3].includes(grid[row-1][col]) && memo[row-1][col] === 0) {
        stack.push([row-1, col]);
        memo[row-1][col] = step+1;
    } else if (col+1 < 30 && [0, 3].includes(grid[row][col+1]) && memo[row][col+1] === 0) {
        stack.push([row, col+1]);
        memo[row][col+1] = step+1;
    } else if (col-1 >= 0 && [0, 3].includes(grid[row][col-1]) && memo[row][col-1] === 0) {
        stack.push([row, col-1]);
        memo[row][col-1] = step+1;
    } else {
        ///backtracking can be done here
        stack.pop();
    }
    setTimeout(() => startDFS(), 50);
    
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

    