// defining the number of rows / columns
const numberColumnsDropdown = document.getElementById("numberColumnsDropdown");
const numberRowsDropdown = document.getElementById("numberRowsDropdown");
let rT;
let cT;

// adding player names 
const typeOfGame = document.getElementById("switcher");
const nameForSinglePlayer = document.getElementById("nameForSinglePlayer");
const nameForMultiplayer = document.getElementById("nameForMultiPlayer")
const inputForSinglePlayerName = document.getElementById('inputForSinglePlayerName');
const inputForMultiPlayerNameOne = document.getElementById("inputForMultiPlayerNameOne");
const inputForMultiPlayerNameTwo = document.getElementById("inputForMultiPlayerNameTwo");

typeOfGame.addEventListener("click", () => {
    if (typeOfGame.checked){
        // single player 
        nameForMultiplayer.style.display = "none";
        nameForSinglePlayer.style.removeProperty("display");

    } else {
        // multiplayer 
        nameForSinglePlayer.style.display = "none";
        nameForMultiplayer.style.removeProperty("display");
    }
});


// play game button 
const playGameButton = document.getElementById("playGameButton");
playGameButton.addEventListener("click", startNewGame);

playGameButton.addEventListener("mouseover", () => {
    playGameButton.style = "width: 130px; height: 76px; font-size: 36px; background-color: rgb(215, 193, 70); border: 6px double rgb(246,246,246); font-weight: 550; color: rgb(207,31,38);";
});

playGameButton.addEventListener("mouseout", () => {
    playGameButton.style = "width: 115px; height: 62px; font-size: 32px; background-color: rgb(246,246,246);";
});

// background music
const soundButtons = document.getElementById("soundButtons");
soundButtons.addEventListener("click", () => {
    // for clicking buttons sound effect 
    selectItem();
    toggleBackgroundAudio();
});

soundButtons.addEventListener("mouseover", () => {
    soundButtons.style = "background: rgb(192, 236, 255); border-color: rgb(124, 139, 255)";
});
soundButtons.addEventListener("mouseout", () => {
    soundButtons.style = "background: rgb(162, 229, 255); border-color: rgb(60, 117, 231)";
});

// play again button 
const optionPlayAgain = document.getElementById('optionPlayAgain');
optionPlayAgain.addEventListener("click", () => {
    // for clicking buttons sound effect 
    selectItem();
    startGame();
});

// back button 
const backButton = document.getElementById("backToMainPageButton");
backButton.addEventListener("click", () => {
    // for clicking buttons sound effect 
    selectItem();
    const backgroundMusic = document.getElementById("backgroundMusic");
    if (!backgroundMusic.paused){
        backgroundMusic.pause();
    }
    document.getElementById("mainGamePage").style.display = "none";
    document.getElementById("startPage").style.removeProperty("display");
})

backButton.addEventListener("mouseover", () => {
    backButton.style = "background: rgb(192, 236, 255); border-color: rgb(124, 139, 255)";
});

backButton.addEventListener("mouseout", () => {
    backButton.style = "background: rgb(162, 229, 255); border-color: rgb(60, 117, 231)";
});

// how to play button 
const howToPlayButton = document.getElementById("instructions");

howToPlayButton.addEventListener("mouseover", () => {
    howToPlayButton.style = "background: rgb(192, 236, 255); border-color: rgb(124, 139, 255)";
});

howToPlayButton.addEventListener("mouseout", () => {
    howToPlayButton.style = "background: rgb(162, 229, 255); border-color: rgb(60, 117, 231)";
});

howToPlayButton.addEventListener("click", () => {
    const gamePage = document.getElementById("gamePage");
    const resetNBack = document.getElementById("resetNBack");
    const gameRules = document.getElementById("gameRules");

    // for clicking buttons sound effect 
    selectItem();
    if(!(gamePage.style.display == "none")){
        gamePage.style.display = "none";
        resetNBack.style.display = "none";
        howToPlayButton.innerHTML = " Back to game ";
        gameRules.style.removeProperty("display");
    } else {
        gamePage.style.removeProperty("display");
        resetNBack.style.removeProperty("display");
        howToPlayButton.innerHTML = " How to play ";
        gameRules.style.display = "none";
    }
    

});


// back to main page button
const backToMainPageButton = document.getElementById('optionBackToMainPage');
backToMainPageButton.addEventListener("click", () => {
    // for clicking buttons sound effect 
    selectItem();
    const backgroundMusic = document.getElementById("backgroundMusic");
    if (!backgroundMusic.paused){
        backgroundMusic.pause();
    }
    document.getElementById("mainGamePage").style.display = "none";
    document.getElementById("startPage").style.removeProperty("display");
});

// restart game button 
const restartGameButton = document.getElementById('resetGameButton');
restartGameButton.addEventListener("click", () => {
    if(notComputerMove){
        // for clicking buttons sound effect 
        selectItem();
        startGame();
    } else{
        // display "wait for computer move to end"
        const resetGameButton = document.getElementById("resetGameButton");
        resetGameButton.innerHTML = "wait for computer move to end";
        resetGameButton.style = "width: 200px"
        // add sound effect 
        if(notMuted){
            const columnFullEffect = document.getElementById("columnFullEffect");
            if(columnFullEffect.paused){
                columnFullEffect.play();
            } else {
                columnFullEffect.currentTime = 0
            }
        }

        setTimeout(() => {
            resetGameButton.style.width = "60px";
            resetGameButton.innerHTML = "reset game";
        }, 500);
    }
});

restartGameButton.addEventListener("mouseover", () => {
    restartGameButton.style = "background: rgb(192, 236, 255); border-color: rgb(124, 139, 255)";
});
restartGameButton.addEventListener("mouseout", () => {
    restartGameButton.style = "background: rgb(162, 229, 255); border-color: rgb(60, 117, 231)";
});

// declaring important variables 
const positionsArray = [];
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const player1Pieces = [];
const player2Pieces = [];
const delay = rT * 300;
const columnsHeight =[];
const noColumnFullMessage = [];
let player1Winnings = 0;
let player2Winnings = 0; 

// initialize with player1 
let currentPlayer = "player1";
let gameInProgress = true;
let checkMoveNotInProgress = true;
let noPlayerWon = true;
let notMuted = true;
let redName;
let yellowName;

// for single player game 
let playAgainstComputer;
let notComputerMove = true; 

function startNewGame(){
    // for computer vs multiplayer games 
    const typeOfGame = document.getElementById("switcher");
    if (typeOfGame.checked){
        playAgainstComputer = true;
        if(inputForSinglePlayerName.value.length != 0 && inputForSinglePlayerName.value.trim().length != 0){
            redName = inputForSinglePlayerName.value;
        } else{
            redName = "Red";
        }
        
    } else {
        playAgainstComputer = false;
        if(inputForMultiPlayerNameOne.value.length != 0 && inputForMultiPlayerNameOne.value.trim().length != 0){
            redName = inputForMultiPlayerNameOne.value;
        } else{
            redName = "Red";
        }
        if(inputForMultiPlayerNameTwo.value.length != 0 && inputForMultiPlayerNameTwo.value.trim().length != 0){
            yellowName = inputForMultiPlayerNameTwo.value; 
        } else{
            yellowName = "Yellow";
        }
        
        
    }


    player1Winnings = 0;
    player2Winnings = 0; 
    rT = numberRowsDropdown.value;
    cT = numberColumnsDropdown.value;
    startGame();
}

function startGame(){
    const gameRules = document.getElementById("gameRules");
    const mainGamePage = document.getElementById("mainGamePage");
    const startPage = document.getElementById("startPage");
    const scorePage = document.getElementById("scorePage");
    const gamePage = document.getElementById("gamePage");
    const soundNinstructions = document.getElementById("soundNinstructions");
    const resetNBack = document.getElementById("resetNBack");
    const topScreenButtons = document.getElementById("topScreenButtons");
    topScreenButtons.style = "justify-content: space-between";
    scorePage.setAttribute("style", "display: none");
    startPage.setAttribute("style", "display: none");
    mainGamePage.setAttribute("style", "display:auto");
    gameRules.style.display = "none";
    gamePage.setAttribute("style", "display:auto");
    soundNinstructions.setAttribute("style", "display:auto");
    resetNBack.setAttribute("style", "display:auto");
    const backgroundMusic = document.getElementById("backgroundMusic");
    if(!backgroundMusic.paused){
        backgroundMusic.pause();
    }
    resetParameter();
    playBackgroundAudio();
    let player1Winnings = 0;
    let player2Winnings = 0; 
    function playBackgroundAudio(){
        const playSoundButton = document.getElementById("playSoundButton");
        const stopSoundButton = document.getElementById("stopSoundButton");
        stopSoundButton.style.display = "none";
        playSoundButton.style.removeProperty("display");
        backgroundMusic.play();
    }

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

    //create div for top arrow 
    const divForArrow = document.getElementById("divForArrow");
    divForArrow.style.width = `${(cT)*110}px`;

    for(i=0; i<cT; i++){
        const arrowColumn = document.createElement('div');
        arrowColumn.id=`column-${i}`;
        arrowColumn.style = "width: 64px; margin:5px; display: flex; justify-content:center; align-items:center;  border-radius: 50px; white-space: nowrap;";
        divForArrow.append(arrowColumn);
    }

    //create columnsHeight array & noColumnFullMessage array 
    for (i=0; i<cT; i++){
        columnsHeight.push(rT);
        noColumnFullMessage.push(true);
    }

    // actual game play 
    for(a=0; a<cT; a++){
        // create an array of the columns 
        let boardColumns = document.querySelectorAll(`.column${a+1}`);
        // reference specific column 
        boardColumns.forEach((column) => {
            // add event listeners for the arrow above board
            column.addEventListener("mouseover", function addArrow(){
                const currentColumn = column.id.split("-")[0];
                const currentArrowDiv = document.getElementById(`column-${currentColumn}`);
                // ensure that the "column full" message is not present
                if (noColumnFullMessage[currentColumn] === true && notComputerMove && noPlayerWon && checkMoveNotInProgress){
                    const arrow = document.createElement("img");
                    arrow.id = `arrow${currentColumn}`;
                    arrow.src = "https://cdn-icons-png.flaticon.com/128/9053/9053262.png";
                    arrow.style = "width: 60px; height: 50px; opacity: 0.4; filter: brightness(30%) saturate(200%)";
                    currentArrowDiv.append(arrow);
                    if (currentPlayer === "player1"){
                        currentArrowDiv.style.background = "red";
                        currentArrowDiv.classList.add("redBorder");
                    } else {
                        currentArrowDiv.style.background = "yellow";
                        currentArrowDiv.classList.add("yellowBorder");
                    }
                }
            });
            column.addEventListener("mouseout", function addArrow(){
                const currentColumn = column.id.split("-")[0];
                const arrow = document.getElementById(`arrow${currentColumn}`);
                const currentArrowDiv = document.getElementById(`column-${currentColumn}`);
                currentArrowDiv.style.background = "none";
                currentArrowDiv.classList.remove("redBorder", "yellowBorder");
                // for cases when arrow removed when displaying "column full" message 
                if(document.body.contains(arrow)){
                    arrow.remove();
                }
                
            });

            //add event listener of player clicking 
            column.addEventListener("click", function makeMove () {
                // for sound effects 
                const placeTokenEffect = document.getElementById("placeTokenEffect");
                const columnFullEffect = document.getElementById("columnFullEffect");
                // check to make sure there is no moving piece / no one has won 
                if(checkMoveNotInProgress && noPlayerWon && notComputerMove) {
                    if(playAgainstComputer){
                        notComputerMove = false;
                    }
                    changeCheckMoveNotInProgressFalse()

                    // check ID clicked piece 
                    const currentColumn = column.id.split("-")[0];
                    const currentRow = column.id.split("-")[1];

                    // check columnHeight of current column 
                    let currentHeight = columnsHeight[currentColumn];
                    const topSpaceInRow = document.getElementById(`${currentColumn}-0`);

                    //place piece based on columnHeight 
                    if (columnsHeight[currentColumn] === 0){
                        notComputerMove = true;
                        // add sound effect 
                        if(notMuted){
                            if(columnFullEffect.paused){
                                columnFullEffect.play();
                            } else {
                                columnFullEffect.currentTime = 0
                            }
                        }

                        // add column full message 
                        if(!document.body.contains(document.getElementById(`columnFullMessage${currentColumn}`))){
                            fadingEffect(currentColumn);
                        }
                        changeCheckMoveNotInProgressTrue();
                    } else if (columnsHeight[currentColumn] === 1) {
                        // add sound effect 
                        if (notMuted){
                            if(placeTokenEffect.paused){
                                placeTokenEffect.play();
                            } else {
                                placeTokenEffect.currentTime = 0
                            }
                        }
                        
                        createRegularToken(topSpaceInRow);
                        addPieceToPlayersArray (0, currentColumn);
                        columnsHeight[currentColumn]--; 
                        
                        //check if player won
                        if (currentPlayer === "player1"){
                            checkIfWon(player1Pieces);
                        } else {
                            checkIfWon(player2Pieces);
                        }

                        //change current player 
                        endMove();
                        changeCheckMoveNotInProgressTrue();
                        
                        //change to computer move for one player game
                        if(playAgainstComputer && noPlayerWon){
                            setTimeout(computerMove, 2000);
                        }

                    } else {
                        // add sound effect 
                        if (notMuted){
                            if(placeTokenEffect.paused){
                                placeTokenEffect.play();
                            } else {
                                placeTokenEffect.currentTime = 0
                            }
                        }

                        //creating animation of moving token
                        for (i=1; i<currentHeight; i++){
                            const startPosition = 0 - (i-1)*115;
                            createMovingToken(document.getElementById(`${currentColumn}-${i-1}`), `${startPosition}`, 105);
                        }
                        //create moving token that stays 
                        const startPosition = 0 - (currentHeight-1)*115;
                        createLastingMovingToken(document.getElementById(`${currentColumn}-${currentHeight-1}`), `${startPosition}`, 0); 

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
                        if(playAgainstComputer && noPlayerWon){
                            setTimeout(computerMove, 2000);          
                        }
                    }
                    //ensure there are possible moves 
                    if (columnsHeight.every((value)=> { return (value === 0)})) {
                        gameInProgress = false;
                        alertDraw();
                    }
                }
            }); 
        })
    }
}

function resetParameter(){
    positionsArray.splice(0);
    player1Pieces.splice(0);
    player2Pieces.splice(0);
    currentPlayer = "player1";
    gameInProgress = true;
    checkMoveNotInProgress = true;
    noPlayerWon = true;
    notMuted = true;
    notComputerMove = true;
    const mainBoard = document.getElementById("mainBoard");
    while (mainBoard.firstChild) {
        mainBoard.removeChild(mainBoard.lastChild);
    }
    const divForArrow = document.getElementById("divForArrow");
    while (divForArrow.firstChild) {
        divForArrow.removeChild(divForArrow.lastChild);
    }
    columnsHeight.splice(0);
    noColumnFullMessage.splice(0);
    const alertWinnerText = document.getElementById("winningText");
    if(document.body.contains(alertWinnerText)){
        alertWinnerText.remove();
    }
//////////////// playing against computer or not?
}

//for playing against computer 
function computerMove(){
    let notMoved = true;
    let computerColumn;
    //ensure there are possible moves 
    if (columnsHeight.every((value)=> { return (value === 0)})) {
        gameInProgress = false;
        alertDraw();
    }
    while(notMoved){
        computerColumn = Math.floor(Math.random() * cT)
        //check if there is space in that column;
        if(columnsHeight[computerColumn] != 0){
            // check columnHeight of current column 
            let currentHeight = columnsHeight[computerColumn];
            const topSpaceInRow = document.getElementById(`${computerColumn}-0`);

            //place piece based on columnHeight 
            if (columnsHeight[computerColumn] === 1) {
                // add sound effect 
                if (notMuted){
                    if(placeTokenEffect.paused){
                        placeTokenEffect.play();
                    } else {
                        placeTokenEffect.currentTime = 0
                    }
                }
                createRegularToken(topSpaceInRow);

                //check if player won
                addPieceToPlayersArray (0, computerColumn);
                if (currentPlayer === "player1"){
                    checkIfWon(player1Pieces);
                } else {
                    checkIfWon(player2Pieces);
                }

                columnsHeight[computerColumn]--; 
                //ensure there are possible moves 
                if (columnsHeight.every((value)=> { return (value === 0)})) {
                    gameInProgress = false;
                    alertDraw();
                }

                //change current player 
                endMove();
                notMoved = false;
                notComputerMove = true;
            } else {
                // add sound effect 
                if (notMuted){
                    if(placeTokenEffect.paused){
                        placeTokenEffect.play();
                    } else {
                        placeTokenEffect.currentTime = 0
                    }
                }

                //creating animation of moving token
                for (i=1; i<currentHeight; i++){
                    const startPosition = 0 - (i-1)*115;
                    createMovingToken(document.getElementById(`${computerColumn}-${i-1}`), `${startPosition}`, 105);
                }
                //create moving token that stays 
                const startPosition = 0 - (currentHeight-1)*115;
                createLastingMovingTokenC(document.getElementById(`${computerColumn}-${currentHeight-1}`), `${startPosition}`, 0); 

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
    token.id= `token${space.id}`;
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
    token.id = `token${space.id}`;
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
    token.id = `token${space.id}`;
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
    } else {
        player2Pieces.push(positionsArray[row][column]);
    }
}

function checkIfWon(playersArray) {
    //check vertically 
    for (r = 0; r < rT-3; r++) {
        for (c = 0; c < cT; c++) {
            if (playersArray.includes(positionsArray[r][c]) && playersArray.includes(positionsArray[r+1][c]) && playersArray.includes(positionsArray[r+2][c]) && playersArray.includes(positionsArray[r+3][c])) {
                console.log("vertical winner");
                // winning tokens 
                const token1 = document.getElementById(`token${c}-${r}`);
                const token2 = document.getElementById(`token${c}-${r+1}`);
                const token3 = document.getElementById(`token${c}-${r+2}`);
                const token4 = document.getElementById(`token${c}-${r+3}`);
                noPlayerWon = false;
                setTimeout(tokensFlashing,delay, token1, token2, token3, token4);
                return; 
            }
        }
    }

    //check horizontally
    for (r = 0; r < rT; r++) {
        for (c = 0; c < cT-3; c++) {
            if (playersArray.includes(positionsArray[r][c]) && playersArray.includes(positionsArray[r][c+1]) && playersArray.includes(positionsArray[r][c+2]) && playersArray.includes(positionsArray[r][c+3])) {
                console.log("horizontal winner");
                // winning tokens 
                const token1 = document.getElementById(`token${c}-${r}`);
                const token2 = document.getElementById(`token${c+1}-${r}`);
                const token3 = document.getElementById(`token${c+2}-${r}`);
                const token4 = document.getElementById(`token${c+3}-${r}`);
                noPlayerWon = false;
                setTimeout(tokensFlashing,delay, token1, token2, token3, token4);
                return; 
            }
        }
    }
        
    // //check diagonally down 
    for (r = 0; r < rT-3; r++) {
        for (c = 0; c < cT-3; c++) {
            if (playersArray.includes(positionsArray[r][c]) && playersArray.includes(positionsArray[r+1][c+1]) && playersArray.includes(positionsArray[r+2][c+2]) && playersArray.includes(positionsArray[r+3][c+3])) {
                console.log("diagonally down  winner");
                // winning tokens 
                const token1 = document.getElementById(`token${c}-${r}`);
                const token2 = document.getElementById(`token${c+1}-${r+1}`);
                const token3 = document.getElementById(`token${c+2}-${r+2}`);
                const token4 = document.getElementById(`token${c+3}-${r+3}`);
                noPlayerWon = false;
                setTimeout(tokensFlashing,delay, token1, token2, token3, token4);
                return; 
            }
        }
    }

    //check diagonally up 
    for (r = 3; r < rT; r++) {
        for (c = 0; c < cT - 3; c++) {
            if (playersArray.includes(positionsArray[r][c]) && playersArray.includes(positionsArray[r-1][c+1]) && playersArray.includes(positionsArray[r-2][c+2]) && playersArray.includes(positionsArray[r-3][c+3])) {
                console.log("diagonally up  winner");
                // winning tokens 
                const token1 = document.getElementById(`token${c}-${r}`);
                const token2 = document.getElementById(`token${c+1}-${r-1}`);
                const token3 = document.getElementById(`token${c+2}-${r-2}`);
                const token4 = document.getElementById(`token${c+3}-${r-3}`);
                noPlayerWon = false; 
                setTimeout(tokensFlashing,delay, token1, token2, token3, token4);
                return; 
            }
        }
    }
}

// make winning tokens flash 
function tokensFlashing(token1, token2, token3, token4) {
    console.log(token1, token2, token3, token4);
    let count = 0;
    function flashing(){
        if(count === 20){
            clearInterval(flashingInterval);
            alertWinner();
        } else {
            if (currentPlayer === "player2"){
                if(token1.style.background === "red"){
                    token1.style.background = "white";
                    token2.style.background = "white";
                    token3.style.background = "white";
                    token4.style.background = "white";

                } else {
                    token1.style.background = "red";
                    token2.style.background = "red";
                    token3.style.background = "red";
                    token4.style.background = "red";
                }
            } else {
                if(token1.style.background === "yellow"){
                    token1.style.background = "white";
                    token2.style.background = "white";
                    token3.style.background = "white";
                    token4.style.background = "white";

                } else {
                    token1.style.background = "yellow";
                    token2.style.background = "yellow";
                    token3.style.background = "yellow";
                    token4.style.background = "yellow";
                }
            }
            count++;
        }
    }
    const flashingInterval = setInterval(flashing, 200);

}

// alert winner 
function alertWinner() {
    const winnerPage = document.getElementById('winnerPage');
    const winnerText = document.createElement('h1');
    winnerText.id = "winningText";
    const gamePage = document.getElementById("gamePage");
    const fourInARowSound = document.getElementById("fourInARow");
    const youLoseAudio = document.getElementById("computerWins");
    if(notMuted && !playAgainstComputer){
        fourInARowSound.play();
    }

    if (currentPlayer === "player1"){
        if(playAgainstComputer){
            if(notMuted){
                youLoseAudio.play();
            }
            winnerText.innerHTML ="Computer wins!";
        } else {
            winnerText.innerHTML =`${yellowName} wins!`;
            
        }
        winnerText.style.color = "rgb(215, 193, 70)";
        // for keeping score of game winnings
        player2Winnings++;

    } else {
        if(playAgainstComputer){
            if (notMuted){
                fourInARowSound.play();
            }
            winnerText.innerHTML =`${redName} wins!`;
        } else {
            winnerText.innerHTML =`${redName} wins!`;
        }
        winnerText.style.color = "rgb(164, 8, 8)";
        // for keeping score of game winnings
        player1Winnings++;
    }
    winnerPage.append(winnerText);
    const soundNinstructions = document.getElementById("soundNinstructions");
    const resetNBack = document.getElementById("resetNBack");
    const centringTitle = document.getElementById("topScreenButtons");
    soundNinstructions.style.display = "none";
    resetNBack.style.display = "none";
    centringTitle.style = "justify-content: center";
    gamePage.style.opacity = "0.2";
    winnerPage.style = "display:auto";
    setTimeout(()=> {
        const backgroundMusic = document.getElementById("backgroundMusic");
        const scorePage = document.getElementById("scorePage");
        if (!backgroundMusic.pauased){
            backgroundMusic.pause()
        } 
        winnerPage.style.display = "none";
        gamePage.style.display = "none";
        scorePage.style.removeProperty("display");
        displayScore();
    }, 2000);
}

function alertDraw(){
    const winnerPage = document.getElementById('winnerPage');
    const drawText = document.createElement('h1');
    drawText.id = "winningText";
    drawText.style.color = "blue";
    if(notMuted){
        const drawSound = document.getElementById("drawSound");
        drawSound.play();
    }
    drawText.innerHTML ="Draw!";
    winnerPage.append(drawText);
    const soundNinstructions = document.getElementById("soundNinstructions");
    const resetNBack = document.getElementById("resetNBack");
    const centringTitle = document.getElementById("topScreenButtons");
    soundNinstructions.style.display = "none";
    resetNBack.style.display = "none";
    centringTitle.style = "justify-content: center";
    gamePage.style.opacity = "0.2";
    winnerPage.style = "display:auto";
    setTimeout(()=> {
        const backgroundMusic = document.getElementById("backgroundMusic");
        const scorePage = document.getElementById("scorePage");
        if (!backgroundMusic.pauased){
            backgroundMusic.pause()
        } 
        winnerPage.style.display = "none";
        gamePage.style.display = "none";
        scorePage.style.removeProperty("display");
        displayScore();
    }, 2000);
}

// for "column full" message 
function fadingEffect(column){
    noColumnFullMessage[column] = false;
    const arrow = document.getElementById(`arrow${column}`);
    if(document.body.contains(arrow)){
        arrow.remove();
        const currentArrowDiv = document.getElementById(`column-${column}`);
        currentArrowDiv.style.background = "none";
        currentArrowDiv.classList.remove("redBorder", "yellowBorder");
    }
    const columnFull = document.createElement('p');
    columnFull.innerHTML = "Column Full"
    const popupWritingDiv = document.getElementById(`column-${column}`);
    columnFull.id =`columnFullMessage${column}`;
    columnFull.className = "columnFullStyling";
    popupWritingDiv.append(columnFull);
    $(`#columnFullMessage${column}`).fadeOut(1200, function() {
        $(`#columnFullMessage${column}`).remove()
        noColumnFullMessage[column] = true;
        if (playAgainstComputer) {
        }
    });
}

function toggleBackgroundAudio(){
    const backgroundMusic = document.getElementById("backgroundMusic");
    const playSoundButton = document.getElementById("playSoundButton");
    const stopSoundButton = document.getElementById("stopSoundButton");
        if(backgroundMusic.paused){
            stopSoundButton.style.display = "none";
            playSoundButton.style.removeProperty("display");
            backgroundMusic.play();
            notMuted = true;
        }else {
            playSoundButton.style.display = "none";
            stopSoundButton.style.removeProperty("display");
            backgroundMusic.pause();
            notMuted = false;
        }
}

// displaying current scores 
function displayScore() {
    const scoresContainer = document.getElementById("displayedScores");
    const player1Score = document.getElementById("player1Score");
    const player2Score = document.getElementById("player2Score");
    if(!playAgainstComputer){
        player1Score.innerHTML = `${redName}: ${player1Winnings}`;
        player2Score.innerHTML = `${yellowName}: ${player2Winnings}`;
    } else{
        player1Score.innerHTML = `${redName}: ${player1Winnings}`;
        player2Score.innerHTML = `Computer: ${player2Winnings}`;
    }
}

// for clicking buttons sound effect 
function selectItem(){
    const selectItem = document.getElementById("selectItem");
    if (notMuted){
        if(selectItem.paused){
            selectItem.play();
        } else {
            selectItem.currentTime = 0
        }
    }
}