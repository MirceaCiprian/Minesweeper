let array = [];
let arrayWin = [];
let no_cells;
let totalbombs;
let gameEnded = 0;
let level;

function generateTable(bLevel, cells, bombs) {
    let noRow = 0;
    let word;
    level = bLevel;
    no_cells = cells;
    totalbombs = bombs;
    let cell = 0;
    let i;
    generateArray();
    for(i = 0; i < array.length; i++) {
        document.getElementById("table").innerHTML += `
        <tr id="row${noRow}">
        `;
        word = "row" + i;
        console.log(word);
        for(let j = 0; j < array.length; j++) {
            document.getElementById(word).innerHTML += `
            <td><div class="square" id=${cell} onclick="buttonPushed(${cell})"> </div></td>
            `;
            cell++;
        }
        document.getElementById("table").innerHTML += `
        </tr>
        `;
        noRow++;
    }
    generateBombArray();
    lockButtons();
}

function lockButtons() {
    document.getElementById("mainButton1").style.display = "none";
    document.getElementById("mainButton2").style.display = "none";
    document.getElementById("mainButton3").style.display = "none";
    document.getElementById("mainButton"+level).style.display = "block";
    document.getElementById("mainButton1").setAttribute("onclick","none");
    document.getElementById("mainButton2").setAttribute("onclick","none");
    document.getElementById("mainButton3").setAttribute("onclick","none");
}

function generateArray() {
    for(let i = 0; i < no_cells; i++) {
        array[i] = [];
        arrayWin[i] = [];
        for(let j = 0; j < no_cells; j++) {
            array[i][j] = 0; 
            arrayWin[i][j] = 0; /* to test when all squares are discovered except where the bombs are */
        }
    }
}

function discoverAllSquares() {
    for(let i = 0; i < no_cells; i++) {
        for(let j = 0; j < no_cells; j++) {
            discoverSquare(i,j);
        }
    }
}

function buttonPushed(id) {
    if(!gameEnded) {
        let coordinaterX = Math.floor(id / no_cells);
        let coordinaterY = id % no_cells;
        if(array[coordinaterX][coordinaterY] == 'X') {
            endGame()
        }
        else if(array[coordinaterX][coordinaterY] == 0) {
            discoverSurroundings(coordinaterX, coordinaterY, "all");
        }
        else {
            discoverSquare(coordinaterX,coordinaterY);
        }
    }
}

function endGame() {
    gameEnded = 1;
    discoverAllSquares();
    document.getElementById("mainButton"+level).innerHTML = "Start again!"
    document.getElementById("mainButton"+level).setAttribute("onclick","restartGame()");
    document.getElementById("topTitle").innerHTML = "You lose!";
}

function discoverSurroundings(rX, rY) {
    if((array[rX][rY] == 0) && (limitTest(rX,rY))) {
        array[rX][rY] = -1;
        /* Test above and below limits */
        if(limitTest(rX - 1, rY - 1)) {   
            discoverSquare(rX - 1 ,rY - 1); // 1
        }
        if(limitTest(rX - 1, rY)) {
            discoverSquare(rX - 1,rY);      // 2
            discoverSurroundings(rX - 1, rY);
        } 
        if(limitTest(rX - 1, rY + 1)) {
            discoverSquare(rX - 1,rY + 1);  // 3
        }
        if(limitTest(rX, rY - 1)) {
            discoverSquare(rX ,rY - 1);     // 4
            discoverSurroundings(rX, rY - 1);
        }
        if(limitTest(rX, rY)) {
            discoverSquare(rX,rY);          // 5
        }  
        if(limitTest(rX, rY + 1)) {
            discoverSquare(rX,rY + 1);      // 6
            discoverSurroundings(rX, rY + 1);
        }
        if(limitTest(rX + 1, rY - 1)) {
            discoverSquare(rX + 1,rY - 1);  // 7
        }
        if(limitTest(rX + 1, rY)) {
            discoverSquare(rX + 1,rY);      // 8
            discoverSurroundings(rX + 1, rY);
        }
        if(limitTest(rX + 1, rY + 1)) {
            discoverSquare(rX + 1,rY + 1);  // 9
        }
    }
}

function limitTest(x, y) {
    coord1 = x;
    coord2 = y;
    if((0 <= coord1 && coord1 < no_cells) && (0 <= coord2 && coord2 < no_cells))
        return 1;
    return 0;
}

function discoverSquare(i, j) {
    arrayWin[i][j] = 1;
    if(array[i][j] == 0 || array[i][j] == -1) {
        document.getElementById(i * no_cells + j).style.background = "white";
    }
    else {
        if(array[i][j] == 1) {
            document.getElementById(i * no_cells + j).style.color = "blue";
        }
        else if(array[i][j] == 2) {
            document.getElementById(i * no_cells + j).style.color = "green";

        }
        else if(array[i][j] == 3) {
            document.getElementById(i * no_cells + j).style.color = "red";
        }
        document.getElementById(i * no_cells + j).innerHTML = array[i][j];
    }
    if(array[i][j] == 'X') {
        document.getElementById(i * no_cells + j).innerHTML = '💣';
    }
    document.getElementById(i * no_cells + j).setAttribute("onclick","click()");
    checkGameFinished();
}

function generateBombArray() {
    let nrBombs = 0;
    let rX;
    let rY;
    while(nrBombs < totalbombs)
    {
        rX = getRandomInt(no_cells);
        rY = getRandomInt(no_cells);
        if(array[rX][rY] == 0) {
            array[rX][rY] = 'X';
            nrBombs++;
            /* uncomment to see the mines */
            // document.getElementById(rX * no_cells + rY).innerHTML = 'X';
        }
    }
    updateNeighbours();   
}

function updateNeighbours() {
    let minesNearby = 0;
    for(let i = 0; i < no_cells; i++)
    {
        for(let j = 0; j < no_cells; j++)
        {
            if(array[i][j] != 'X') {
                if((i - 1) >= 0 && ((j - 1) >= 0) && array[i - 1][j - 1] == 'X')
                    minesNearby++;
                if((i - 1) >= 0 && array[i - 1][j] == 'X')
                    minesNearby++;
                if((i - 1) >= 0 && ((j + 1) < no_cells) && array[i - 1][j + 1] == 'X')
                    minesNearby++;
                if(((j - 1) >= 0) && array[i][j - 1] == 'X')
                    minesNearby++;
                if(((j + 1) < no_cells) && array[i][j + 1] == 'X')
                    minesNearby++;
                if((i + 1) < no_cells && ((j - 1) >= 0) && array[i + 1][j - 1] == 'X')
                    minesNearby++;
                if((i + 1) < no_cells && (j >= 0) && array[i + 1][j] == 'X')
                    minesNearby++;
                if((i + 1) < no_cells && ((j + 1) < no_cells) && array[i + 1][j + 1] == 'X')
                    minesNearby++;

                array[i][j] = minesNearby;
            }
            minesNearby = 0;
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function click() {
    //do nothing
}

function checkGameFinished() {
    let sum = 0;
    for(let i = 0; i < no_cells; i++) {
        for(let j = 0; j < no_cells; j++) {
            sum = sum + arrayWin[i][j];
        }
    }
    if(sum == (no_cells * no_cells) - totalbombs && (!gameEnded)) {
        endGame();
        document.getElementById("topTitle").innerHTML = "You won!";
    }    
}

function restartGame() {
    location.reload();
}
