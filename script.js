let rT = 6;
let cT = 7;

const positionsArray = [];
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const player1Pieces = [];
const player2Pieces = [];

//initialize with player1 
let currentPlayer = "player1";
let gameInProgress = true;
let checkMoveNotInProgress = true;
let noPlayerWon = true;
let twoPlayer = false;

// for single player game 
let playAgainstComputer = false;
let notComputerMove = true; 

// organising stuff before game begins 
for(i=0; i<rT; i++){
    // create array of all positions available 
    const rowPositionsArray = [];
    positionsArray.push(rowPositionsArray);
    for(a=0; a<cT; a++){
        rowPositionsArray.push(`${alphabet[a]}${i+1}`);
    }
    //creates game board 
    const mainBoard = document.getElementById("mainBoard");
    const boardRow = document.createElement('div');
    boardRow.style = `display: flex; align-items: center; justify-content: space-around; width: ${(cT)*110}px; height: 120px;`;
    mainBoard.append(boardRow);

    for(a=0; a<cT; a++){
        const boardColumn = document.createElement('div');
        boardColumn.style = " width: 105px; height: 105px; background:rgb(211, 211, 211); margin:5px; border-radius: 50px; overflow:hidden";
        boardColumn.classList.add(`column${a+1}`);
        boardColumn.id = (`${a}-${i}`);
        boardColumn.setAttribute("name", `${a+1}`);
        boardRow.append(boardColumn);
    }
}
console.log(positionsArray);

//create columnsHeight array
const columnsHeight =[];
for (i=0; i<cT; i++){
    columnsHeight.push(rT);
}

// actual game play 
for(a=0; a<cT; a++){
    // create an array of the columns 
    let boardColumns = document.querySelectorAll(`.column${a+1}`);
    // reference specific column 
    boardColumns.forEach((column) => {
        //add event listener of player clicking 
        column.addEventListener("click", function makeMove () {
            
            //check to make sure there is no moving piece / no one has won 
            if(checkMoveNotInProgress && noPlayerWon && notComputerMove) {
                if(playAgainstComputer){
                    notComputerMove = false;
                }
                changeCheckMoveNotInProgressFalse()

                //check ID clicked piece 
                const currentColumn = column.id.split("-")[0];
                const currentRow = column.id.split("-")[1];

                // check columnHeight of current column 
                let currentHeight = columnsHeight[currentColumn];
                const topSpaceInRow = document.getElementById(`${currentColumn}-0`);

                //place piece based on columnHeight 
                if (columnsHeight[currentColumn] === 0){
                    alert("column full");
                    changeCheckMoveNotInProgressTrue();
                } else if (columnsHeight[currentColumn] === 1) {
                    createRegularToken(topSpaceInRow);

                    //check if player won
                    addPieceToPlayersArray (0, currentColumn);
                    if (currentPlayer === "player1"){
                        checkIfWon(player1Pieces);
                    } else {
                        checkIfWon(player2Pieces);
                    }

                    columnsHeight[currentColumn]--; 
                    //change current player 
                    endMove();
                    changeCheckMoveNotInProgressTrue();
                    //change to computer move for one player game
                    if(playAgainstComputer){
                        setTimeout(computerMove, 2000);
                    }

                } else {
                    //creating animation of moving token
                    for (i=1; i<currentHeight; i++){
                        const startPosition = 0 - (i-1)*115;
                        createMovingToken(document.getElementById(`${currentColumn}-${i-1}`), `${startPosition}`, 105);
                    }
                    //create moving token that stays 
                    const startPosition = 0 - (currentHeight-1)*115;
                    createLastingMovingToken(document.getElementById(`${currentColumn}-${currentHeight-1}`), `${startPosition}`, 0); 
                    console.log(`${currentColumn}-${currentHeight-1}`);

                    //check if player won
                    addPieceToPlayersArray (currentHeight-1, currentColumn);
                    if (currentPlayer === "player1"){
                        checkIfWon(player1Pieces);
                    } else {
                        checkIfWon(player2Pieces);
                    }

                    columnsHeight[currentColumn]--; 
                    endMove();
                    //change to computer move for one player game
                    if(playAgainstComputer){
                        setTimeout(computerMove, 2000);          
                    }
                }
                //ensure there are possible moves 
                if (columnsHeight.every((value)=> { return (value === 0)})) {
                    alert("draw");
                    gameInProgress = false;
                }
            }
        });
        
    })
}

//for playing against computer 
function computerMove(){
    let notMoved = true;
    let computerColumn;
    while(notMoved){
        computerColumn = Math.floor(Math.random() * cT)
        //check if there is space in that column;
        if(columnsHeight[computerColumn] != 0){
            // check columnHeight of current column 
            let currentHeight = columnsHeight[computerColumn];
            const topSpaceInRow = document.getElementById(`${computerColumn}-0`);

            //place piece based on columnHeight 
            if (columnsHeight[computerColumn] === 1) {
                createRegularToken(topSpaceInRow);

                //check if player won
                addPieceToPlayersArray (0, computerColumn);
                if (currentPlayer === "player1"){
                    checkIfWon(player1Pieces);
                } else {
                    checkIfWon(player2Pieces);
                }

                columnsHeight[computerColumn]--; 
                //change current player 
                endMove();
                notMoved = false;
                notComputerMove = true;
            } else {
                //creating animation of moving token
                for (i=1; i<currentHeight; i++){
                    const startPosition = 0 - (i-1)*115;
                    createMovingToken(document.getElementById(`${computerColumn}-${i-1}`), `${startPosition}`, 105);
                }
                //create moving token that stays 
                const startPosition = 0 - (currentHeight-1)*115;
                createLastingMovingTokenC(document.getElementById(`${computerColumn}-${currentHeight-1}`), `${startPosition}`, 0); 
                console.log(`${computerColumn}-${currentHeight-1}`);

                //check if player won
                addPieceToPlayersArray (currentHeight-1, computerColumn);
                if (currentPlayer === "player1"){
                    checkIfWon(player1Pieces);
                } else {
                    checkIfWon(player2Pieces);
                }

                columnsHeight[computerColumn]--; 
                endMove();
                notMoved = false;
            }
        }  
    }
}



//creating regular token 
function createRegularToken(space) {
    const token = document.createElement("div");
    if (currentPlayer === "player1"){
        token.style = `width: 105px; height: 105px; background:red; border-radius: 50px; position: relative;`;
    } else {
        token.style = `width: 105px; height: 105px; background:yellow; border-radius: 50px; position: relative;`;
    }
    space.append(token);
}

//creating moving token 
function createMovingToken(space, startPosition, endPosition) {
    //create token
    const token = document.createElement("div");
    if (currentPlayer === "player1"){
        token.style = `width: 105px; height: 105px; background:red; border-radius: 50px; position: relative; display:none`;
    } else {
        token.style = `width: 105px; height: 105px; background:yellow; border-radius: 50px; position: relative; display:none`;
    }
    space.append(token);

    //moving disappearing token 
    disappearingMovingToken(token, startPosition, endPosition);
}

//moving disappearing token
function disappearingMovingToken(tokenPiece, startPosition, endPosition) {
    let movement;
    let pos = startPosition;
    function frame() {
        if (pos === endPosition) {
            clearTimeout(movement);
            tokenPiece.remove();
            return;
        } else {
            tokenPiece.style.removeProperty("display");
            pos++;
            tokenPiece.style.top = pos + "px";
            movement = setTimeout(frame, 1);
        }
    }
    setTimeout(frame, 100);
}


//creating non-disappearing moving token (player)
function createLastingMovingToken(space, startPosition, endPosition) {
    //create token
    const token = document.createElement("div");
    if (currentPlayer === "player1"){
        token.style = `width: 105px; height: 105px; background:red; border-radius: 50px; position: relative; display:none`;
    } else {
        token.style = `width: 105px; height: 105px; background:yellow; border-radius: 50px; position: relative; display:none`;
    }
    space.append(token);

    //moving token 
    MovingToken(token, startPosition, endPosition);
}

//creating non-disappearing moving token (computer)
function createLastingMovingTokenC(space, startPosition, endPosition) {
    //create token
    const token = document.createElement("div");
    if (currentPlayer === "player1"){
        token.style = `width: 105px; height: 105px; background:red; border-radius: 50px; position: relative; display:none`;
    } else {
        token.style = `width: 105px; height: 105px; background:yellow; border-radius: 50px; position: relative; display:none`;
    }
    space.append(token);

    //moving token 
    MovingTokenC(token, startPosition, endPosition);
}

//moving non-disappearing token (player)
function MovingToken(tokenPiece, startPosition, endPosition) {
    let movement;
    let pos = startPosition;
    function frame() {
        if (pos === endPosition) {
            clearTimeout(movement);
            changeCheckMoveNotInProgressTrue();
            return;
        } else {
            tokenPiece.style.removeProperty("display");
            pos++;
            tokenPiece.style.top = pos + "px";
            movement = setTimeout(frame, 1);
        }
    }
    setTimeout(frame, 100);
}

//moving non-disappearing token (computer)
function MovingTokenC(tokenPiece, startPosition, endPosition) {
    let movement;
    let pos = startPosition;
    function frame() {
        if (pos === endPosition) {
            clearTimeout(movement);
            changeCheckMoveNotInProgressTrue();
            notComputerMove = true;
            return;
        } else {
            tokenPiece.style.removeProperty("display");
            pos++;
            tokenPiece.style.top = pos + "px";
            movement = setTimeout(frame, 1);
        }
    }
    setTimeout(frame, 100);
}

//change checkMoveNotInProgress to false / true 
const changeCheckMoveNotInProgressFalse = () => checkMoveNotInProgress = false; 
const changeCheckMoveNotInProgressTrue = () => checkMoveNotInProgress = true; 


//change current player 
const endMove = () => {
    return currentPlayer === "player1"? currentPlayer = "player2" : currentPlayer = "player1";
} 

//add piece to current player's array 
function addPieceToPlayersArray (row, column) {
    if (currentPlayer === "player1"){
        player1Pieces.push(positionsArray[row][column]);
        console.log(player1Pieces);
    } else {
        player2Pieces.push(positionsArray[row][column]);
        console.log(player2Pieces);
    }
}

//check if player won 
function checkIfWon(playersArray) {
    //check vertically 
    for (r = 0; r < rT-3; r++) {
        for (c = 0; c < cT; c++) {
            if (playersArray.includes(positionsArray[r][c]) && playersArray.includes(positionsArray[r+1][c]) && playersArray.includes(positionsArray[r+2][c]) && playersArray.includes(positionsArray[r+3][c])) {
                console.log("vertical winner");
                //alert winner 
                alertWinner();
                noPlayerWon = false;
                return; 
            }
        }
    }

    //check horizontally
    for (r = 0; r < rT; r++) {
        for (c = 0; c < cT-3; c++) {
            if (playersArray.includes(positionsArray[r][c]) && playersArray.includes(positionsArray[r][c+1]) && playersArray.includes(positionsArray[r][c+2]) && playersArray.includes(positionsArray[r][c+3])) {
                console.log("horizontal winner");
                //alert winner 
                alertWinner();
                noPlayerWon = false; 
                return; 
            }
        }
    }
        
    // //check diagonally down 
    for (r = 0; r < rT-3; r++) {
        for (c = 0; c < cT-3; c++) {
            if (playersArray.includes(positionsArray[r][c]) && playersArray.includes(positionsArray[r+1][c+1]) && playersArray.includes(positionsArray[r+2][c+2]) && playersArray.includes(positionsArray[r+3][c+3])) {
                console.log("diagonally down  winner");
                //alert winner 
                alertWinner();
                noPlayerWon = false;
                return; 
            }
        }
    }

    //check diagonally up 
    for (r = 3; r < rT; r++) {
        for (c = 0; c < cT - 3; c++) {
            if (playersArray.includes(positionsArray[r][c]) && playersArray.includes(positionsArray[r-1][c+1]) && playersArray.includes(positionsArray[r-2][c+2]) && playersArray.includes(positionsArray[r-3][c+3])) {
                console.log("diagonally up  winner");
                //alert winner 
                alertWinner();
                noPlayerWon = false; 
                return; 
            }
        }
    }
}

//alert winner 
function alertWinner() {
    if (currentPlayer === "player1"){
        alert("red wins");
    } else {
        alert("yellow wins");
    }
}