/******************************************
 * Starter code created by Hans Dulimarta.
 *****************************************/

// Isaac Smith

let gl;
let sizeInput, outMessage;
let posAttr, vertexBuff, prog;
let maze = {
    vertices: [],
    entry: [],
    exit: [],
    visited: []
}

function main() {
    let canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas, null);
    let button = document.getElementById("gen");
    sizeInput = document.getElementById("size");
    outMessage = document.getElementById("msg");
    button.addEventListener("click", generateMaze);
    ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
        .then(program => {
            gl.useProgram(program);

            prog = program;

            render();
        });
}
/*************************************************************
* Draws the initial scene and starts the maze drawing process.
***************************************************************/
function drawScene() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.viewport(0, 0, 800, 800);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    drawMaze();
}
/******************************************
 * Creates buffer and draws maze to screen
 ******************************************/
function drawMaze() {
    // create a buffer
    let mazeBuff = makeMazeWalls(gl, maze.vertices);

    // obtain a reference to the shader letiable (on the GPU)
    posAttr = gl.getAttribLocation(prog, "vertexPos");
    gl.enableVertexAttribArray(posAttr);
    let colAttr = gl.getAttribLocation(prog, "vertexCol");
    gl.enableVertexAttribArray(colAttr);

    gl.bindBuffer(gl.ARRAY_BUFFER, mazeBuff.position);
    gl.vertexAttribPointer(posAttr,
        2, /* number of components per attribute, in our case (x,y) */
        gl.FLOAT, /* type of each attribute */
        false, /* does not require normalization */
        0, /* stride: number of bytes between the beginning of consecutive attributes */
        0); /* the offset (in bytes) to the first component in the attribute array */
    gl.bindBuffer(gl.ARRAY_BUFFER, mazeBuff.color);
    gl.vertexAttribPointer(colAttr, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINES,
        0, /* starting index in the array */
        maze.vertices.length / 2); /* we are drawing four vertices */

    drawEntry();
}

/******************************************
 * Creates buffer and draws maze walls to screen
 ******************************************/
function makeMazeWalls(gl, vertices, color) {
    let vertexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

    let colors = [];

    for(let i = 0; i < vertices.length; i++) {
        colors.push(235.0/255.0, 244.0/255.0, 66.0/255.0, 1.0); // Blue
    }

    let cBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(colors), gl.STATIC_DRAW);

    return {"position" : vertexBuff, "color" : cBuff};
}
/******************************************
 * Creates buffer and draws maze entry point to screen
 ******************************************/
function drawEntry() {
    // create a buffer
    let diamondBuff = makeDiamond(gl, maze.entry);
    // obtain a reference to the shader letiable (on the GPU)
    let posAttr = gl.getAttribLocation(prog, "vertexPos");
    gl.enableVertexAttribArray(posAttr);
    let colAttr = gl.getAttribLocation(prog, "vertexCol");
    gl.enableVertexAttribArray(colAttr);

    gl.bindBuffer(gl.ARRAY_BUFFER, diamondBuff.position);
    gl.vertexAttribPointer(posAttr,
        2, /* number of components per attribute, in our case (x,y) */
        gl.FLOAT, /* type of each attribute */
        false, /* does not require normalization */
        0, /* stride: number of bytes between the beginning of consecutive attributes */
        0); /* the offset (in bytes) to the first component in the attribute array */
    gl.bindBuffer(gl.ARRAY_BUFFER, diamondBuff.color);
    gl.vertexAttribPointer(colAttr, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP,
        0, /* starting index in the array */
        maze.entry.length / 2); /* we are drawing four vertices */
    drawExit();
}

/******************************************
 * Draws exit point
 ******************************************/
function drawExit() {
    // create a buffer
    let diamondBuff = makeSquare(gl, maze.exit);
    // obtain a reference to the shader letiable (on the GPU)
    let posAttr = gl.getAttribLocation(prog, "vertexPos");
    gl.enableVertexAttribArray(posAttr);
    let colAttr = gl.getAttribLocation(prog, "vertexCol");
    gl.enableVertexAttribArray(colAttr);

    gl.bindBuffer(gl.ARRAY_BUFFER, diamondBuff.position);
    gl.vertexAttribPointer(posAttr,
        2, /* number of components per attribute, in our case (x,y) */
        gl.FLOAT, /* type of each attribute */
        false, /* does not require normalization */
        0, /* stride: number of bytes between the beginning of consecutive attributes */
        0); /* the offset (in bytes) to the first component in the attribute array */
    gl.bindBuffer(gl.ARRAY_BUFFER, diamondBuff.color);
    gl.vertexAttribPointer(colAttr, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP,
        0, /* starting index in the array */
        maze.exit.length / 2); /* we are drawing four vertices */
}
/******************************************
 * Makes diamond for entrance
 ******************************************/
function makeDiamond(gl, vertices) {
    let vertexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

    let colors = [];

    for(let i = 0; i < vertices.length; i++) {
        colors.push(0.0, 1.0, 0.0, 1.0); // Green
    }

    let cBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(colors), gl.STATIC_DRAW);

    return {"position" : vertexBuff, "color" : cBuff};
}
/******************************************
 * Makes square for exit
 ******************************************/
function makeSquare(gl, vertices){
    let vertexBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

    let colors = [];

    for(let i = 0; i < vertices.length; i++) {
        colors.push(1.0, 0.0, 0.0, 1.0); // Red
    }

    let cBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(colors), gl.STATIC_DRAW);

    return {"position" : vertexBuff, "color" : cBuff};
}

function render() {
    drawScene();
    requestAnimationFrame(render);
}
/******************************************
 * Function called by button click
 * to generate a maze of specific
 * dimensions
 ******************************************/
function generateMaze() {
    let sz = sizeInput.valueAsNumber;
    if (!sz) {
        outMessage.innerHTML = "Must set size in the input box";
    } else {
        outMessage.innerHTML = "I have to generate a maze of size " + sz + "x" + sz;
        maze = setupMazeWalls(sz);
    }
}

/* TODO: You may add more functions as needed */
/******************************************
 * Sets up all cells in maze
 * Also calls functions to generate a
 * path through the maze
 ******************************************/
function setupMazeWalls(size) {
    let maze = {
        cells: [],
        entryCell: null,
        exitCell: null,
    };

    //initialize the maze with cells
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let cell = {
                x: i,
                y: j,
                leftSide: [],
                rightSide: [],
                topSide: [],
                bottomSide: []
            }

            cell.bottomSide.push(i, j);
            cell.bottomSide.push(i + 1, j);
            cell.rightSide.push(i + 1, j);
            cell.rightSide.push(i + 1, j + 1);
            cell.topSide.push(i + 1, j + 1);
            cell.topSide.push(i, j + 1);
            cell.leftSide.push(i, j + 1);
            cell.leftSide.push(i, j);

            maze.cells.push(cell);
        }
    }

    // find entrance and exit
    let entryPoint = getEndPoint(size);
    let entrySide = getEndPointOrientation();
    maze.entryCell = createEntry(size, entryPoint, entrySide);
    maze.exitCell = createExit(size, entrySide);

    return findPath(maze, size);
}
/******************************************
 * Uses depth first search to generate a
 * random maze
 ******************************************/
function findPath(maze, size){
    //create path through the maze
    let visited = [];
    let currentCell = findCell(maze, maze.entryCell.x, maze.entryCell.y);
    visited.push(currentCell);
    let backTrackCounter = 1;

    while (visited.length !== maze.cells.length) {
        let nextCell = getNext(visited, currentCell, size);
        if (nextCell) {
            currentCell = removeSides(currentCell, nextCell.dir, 0);

            currentCell = maze.cells.find((cell) => {
                return cell.x === nextCell.x && cell.y === nextCell.y;
            });

            currentCell = removeSides(currentCell, nextCell.dir, 1);
            visited.push(currentCell);
            backTrackCounter = 1;
        } else {
            currentCell = visited[visited.length - backTrackCounter];
            backTrackCounter++;
        }
    }
    return convertToVertices(maze, size, visited);
}
/******************************************
 * Creates our entry point
 ******************************************/
function createEntry(size, entryPoint, entrySide){
    let entryCell = {
        x: null,
        y: null,
        sides: []
    };
    // 0 is a horizontal and 1 is vertical
    if (entrySide === 0) {
        entryCell.x = entryPoint;
        entryCell.y = 0;
    } else if (entrySide === 1) {
        entryCell.x = entryPoint;
        entryCell.y = size - 1;
    } else if (entrySide === 2) {
        entryCell.x = 0;
        entryCell.y = entryPoint;
    } else if (entrySide === 3) {
        entryCell.x = size - 1;
        entryCell.y = entryPoint;
    }

    entryCell.sides.push(entryCell.x + .5, entryCell.y + .25);
    entryCell.sides.push(entryCell.x + .25, entryCell.y + .5);
    entryCell.sides.push(entryCell.x + .5, entryCell.y + .75);
    entryCell.sides.push(entryCell.x + .75, entryCell.y + .5);
    entryCell.sides.push(entryCell.x + .5, entryCell.y + .25);
    return entryCell;
}
/******************************************
 * Creates our exit
 ******************************************/
function createExit(size, entrySide){
    let exitPoint = getEndPoint(size);
    let exitSide = entrySide;

    while (exitSide === entrySide) {
        exitSide = getEndPointOrientation();
    }

    let exitCell = {
        x: null,
        y: null,
        sides: []
    };

    if (exitSide === 0) {
        exitCell.x = exitPoint;
        exitCell.y = 0;
    } else if (exitSide === 1) {
        exitCell.x = exitPoint;
        exitCell.y = size - 1;
    } else if (exitSide === 2) {
        exitCell.x = 0;
        exitCell.y = exitPoint;
    } else if (exitSide === 3) {
        exitCell.x = size - 1;
        exitCell.y = exitPoint;
    }

    //setting up square
    exitCell.sides.push(exitCell.x + .25, exitCell.y + .75);
    exitCell.sides.push(exitCell.x + .75, exitCell.y + .75);
    exitCell.sides.push(exitCell.x + .75, exitCell.y + .25);
    exitCell.sides.push(exitCell.x + .25, exitCell.y + .25);
    exitCell.sides.push(exitCell.x + .25, exitCell.y + .75);

    return exitCell;
}
/******************************************
 * Randomly picks the next cell we will
 * move towards
 ******************************************/
function getNext(visited, currentCell, size) {
    let nextCell = null;
    let possibleDirections = [0, 1, 2, 3];

    while (nextCell == null && possibleDirections.length > 0) {
        let direction = possibleDirections[getRandomInt(0, possibleDirections.length - 1)];
        if (direction === 0) {
            if (currentCell.y - 1 >= 0) {
                nextCell = {
                    x: currentCell.x,
                    y: currentCell.y - 1,
                    dir: 0,
                    direction: 'down'
                };
            }
            possibleDirections.splice(possibleDirections.indexOf(0), 1);
        } else if (direction === 1) {
            if (currentCell.y + 1 < size) {
                nextCell = {
                    x: currentCell.x,
                    y: currentCell.y + 1,
                    dir: 1,
                    direction: 'up'
                };
            }
            possibleDirections.splice(possibleDirections.indexOf(1), 1);
        } else if (direction === 2) {
            if (currentCell.x - 1 >= 0) {
                nextCell = {
                    x: currentCell.x - 1,
                    y: currentCell.y,
                    dir: 2,
                    direction: 'left'
                };
            }
            possibleDirections.splice(possibleDirections.indexOf(2), 1);
        } else if (direction === 3) {
            if (currentCell.x + 1 < size) {
                nextCell = {
                    x: currentCell.x + 1,
                    y: currentCell.y,
                    dir: 3,
                    direction: 'right'
                };
            }
            possibleDirections.splice(possibleDirections.indexOf(3), 1);
        }

        if (nextCell) {
            let visitedCell = visited.find((cell) => {
                return cell.x === nextCell.x && cell.y === nextCell.y;
            });

            if (!visitedCell) {
                break;
            } else {
                nextCell = null;
            }
        }
    }

    return nextCell;
}
/******************************************
 * Removes maze wall when we are moving
 * through it
 ******************************************/
function removeSides(cell, direction, second) {
    if (second) {
        if (direction === 0) {
            cell.topSide = [];
        } else if (direction === 1) {
            cell.bottomSide = [];
        } else if (direction === 2) {
            cell.rightSide = [];
        } else if (direction === 3) {
            cell.leftSide = [];
        }
    } else {
        if (direction === 0) {
            cell.bottomSide = [];
        } else if (direction === 1) {
            cell.topSide = [];
        } else if (direction === 2) {
            cell.leftSide = [];
        } else if (direction === 3) {
            cell.rightSide = [];
        }
    }

    return cell;
}


function convertVertex(num, size) {
    let canvasSize = 800;
    return ((num * ((canvasSize * 2) / size)) - canvasSize) / canvasSize;
}

function getEndPoint(size) {
    return getRandomInt(1, size - 2);
}

// 0 is a horizontal and 1 is vertical
function getEndPointOrientation() {
    return getRandomInt(0, 3);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function findCell(maze, x, y) {
    let cell = maze.cells.find((cell) => {
        return cell.x === x && cell.y === y;
    });

    return cell;
}

function convertToVertices(maze, size, visited) {
    let convertedMaze = {
        vertices: [],
        entry: [],
        exit: [],
        visited: [],
        solution: [],
        originalMaze: maze
    };

    if(maze.cells) {
        for (let i = 0; i < maze.cells.length; i++) {
            for (let j = 0; j < maze.cells[i].leftSide.length; j++) {
                convertedMaze.vertices.push(.95 * convertVertex(maze.cells[i].leftSide[j], size));
            }
            for (let j = 0; j < maze.cells[i].rightSide.length; j++) {
                convertedMaze.vertices.push(.95 * convertVertex(maze.cells[i].rightSide[j], size));
            }
            for (let j = 0; j < maze.cells[i].topSide.length; j++) {
                convertedMaze.vertices.push(.95 * convertVertex(maze.cells[i].topSide[j], size));
            }
            for (let j = 0; j < maze.cells[i].bottomSide.length; j++) {
                convertedMaze.vertices.push(.95 * convertVertex(maze.cells[i].bottomSide[j], size));
            }
        }
    }

    if(maze.entryCell) {
        for (let i = 0; i < maze.entryCell.sides.length; i++) {
            convertedMaze.entry.push(.95 * convertVertex(maze.entryCell.sides[i], size));
        }
    }

    if(maze.exitCell) {
        for (let i = 0; i < maze.exitCell.sides.length; i++) {
            convertedMaze.exit.push(.95 * convertVertex(maze.exitCell.sides[i], size));
        }
    }

    if(maze.solution) {
        for (let i = 0; i < maze.solution.length; i++) {
            convertedMaze.solution.push(.95 * convertVertex(maze.solution[i].x + .5, size));
            convertedMaze.solution.push(.95 * convertVertex(maze.solution[i].y + .5, size));
        }
    }

    return convertedMaze;
}