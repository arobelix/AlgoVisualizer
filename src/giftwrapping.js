points = {};
p = [];
window.onload = () => {
    const root = document.getElementById("root");
    const canvas = document.createElement("canvas");
    canvas.height = 500;
    canvas.width = 500;
    canvas.classList.add('canvas');
    const ctx = canvas.getContext('2d');
    canvas.id = 'canvas';
    canvas.addEventListener('click', (m) => {
        if (points.hasOwnProperty((m.clientX-canvas.getBoundingClientRect().left).toString() + '-' + (m.clientY-canvas.getBoundingClientRect().top).toString())) {
            return;
        }
        console.log((m.clientX-canvas.getBoundingClientRect().left), (m.clientY-canvas.getBoundingClientRect().top));
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.rect(m.clientX-canvas.getBoundingClientRect().left-1, m.clientY-canvas.getBoundingClientRect().top-1,2,2);
        ctx.stroke();
        points[(m.clientX-canvas.getBoundingClientRect().left).toString() + '-' + (m.clientY-canvas.getBoundingClientRect().top).toString()] = true;
        p.push([(m.clientX-canvas.getBoundingClientRect().left), (m.clientY-canvas.getBoundingClientRect().top)]);
    })
    root.appendChild(canvas);
    generateInstructions();
    };

    generateInstructions = () => {
        let instructions = document.getElementById('instructions');
        let reset = document.createElement('button');
        reset.innerHTML = "Reset";
        reset.addEventListener('click', () => resetCanvas());
        instructions.appendChild(reset);
        let start = document.createElement('button');
        start.innerHTML = "Start";
        start.addEventListener('click', () => startWrap());
        instructions.appendChild(start);
    }


    resetCanvas = () => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0,0,canvas.width, canvas.height);
        points = {}
    }

    drawLine = (p1, p2) => {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        console.log(p1, p2);
        ctx.beginPath();
        ctx.moveTo(p1[0], p1[1]);
        ctx.lineTo(p2[0], p2[1]);
        ctx.stroke();
    }

    startWrap = () => {
        //find lowest point OR maintain the lowest(highest y value) point
        //change its color to green. Draw potential line to any other point, make it red. 
        //Iterate through all points. When more lefter point is found, draw new line.
        //  -Redraw original screen and then draw new line 
        //When all points have been iterated through, add the line to list of valid lines, and redraw screen (with only valid lines).
        //valid lines are blue
        //do this until we arrive back at starting point. 
        //Then finish


    }

    cross = (p1, p2) => {
        return p1[0]*p2[1]-p1[1]*p2[0];
    }

    addLine = (p1, p2) => {
        //add line to list of valid lines

    }

    drawScreen = () => {
        //draw all points and lines
    }