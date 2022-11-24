'use strict'

const MINE_ICON = '💣'
const FLAG_ICON = '🏳️'
const HINT = '💡'
const WIN_DISPLAY = document.querySelector('.win-dis')
const LOOSE_DISPLAY = document.querySelector('.lose-dis')
const USER_HEARTS = document.querySelector('.lives')
const EMPTY = ''


var gLevel = {
    boardSize: 16,
    boardLength: Math.sqrt(16),
    numOfMines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    hints: 3
}

var gBoard
var gTimerInterval
var gLives = 3 //given 3 lives - at 3 the player looses
var gIsHint = false
var gIsFirstClick = true



function onInit() {
    gBoard = buildBoard(gLevel.boardLength)
    renderBoard('.board')
    gGame.isOn = true
    clearInterval(gTimerInterval)
    renderSymbol(gGame.hints, HINT)
   
    
  
}


function buildBoard(boardLength) {
    var board = []

    for (var i = 0; i < boardLength; i++) {
        board[i] = []

        for (var j = 0; j < boardLength; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isHint: false
            }
        }
    }
    return board
}




function setDifficultyLevel(colLen) {
    gLevel.boardSize = colLen*colLen
    gLevel.boardLength = colLen
    if (gLevel.boardLength === 4) gLevel.numOfMines = 2
    else if (gLevel.boardLength === 8) gLevel.numOfMines = 14
    else if (gLevel.boardLength === 12) gLevel.numOfMines = 32
    resetGame()
}



function placeFixedMines(firstCI, firstCJ){
    var numberOfMinesPlaced = 0;
    var maxManualMines = gLevel.numOfMines ;

    for (var i = firstCI; i < gLevel.boardLength; i++){
        for (var j = 0; j < gLevel.boardLength; j++){
            if (numberOfMinesPlaced < maxManualMines && (firstCJ !== j || firstCI !== i) ){
                gBoard[i][j].isMine = true;
                numberOfMinesPlaced++
            }
        }
    }

}

function placeRandomMines(firstCI,firstCJ){
    var numberOfMinesPlaced = 0;
    var maxManualMines = gLevel.numOfMines;
    var i = getRandomIntInt(0, gLevel.boardLength )
    var j = getRandomIntInt(0, gLevel.boardLength )

    while (numberOfMinesPlaced < maxManualMines ) {
        if (!gBoard[i][j].isMine && (i !== firstCI || j !== firstCJ)) {

            gBoard[i][j].isMine = true
            numberOfMinesPlaced++
            console.log("mine place",numberOfMinesPlaced)
        }
        i = getRandomIntInt(0, gLevel.boardLength)
        j = getRandomIntInt(0, gLevel.boardLength)
    }
}


function placeMines(firstCI, firstCJ) {
   
    placeRandomMines(firstCI,firstCJ)
}


//checks witch click and points to the correct function
//stops clicks when game is over
//starts the timer & placing the mineson first click
function handleClick(elCell, i, j, event) {
    if (!gGame.isOn) return
    if (gGame.shownCount === 0) {
        startTimer()
        placeMines(i, j)
        setMinesAroundCount()

    }

    if (gIsHint) {
        hint(i, j)
        gIsHint = false
        return
    }

    if (event.button === 2) {
        markCell(i, j)

    } else {
        revealCell( i, j)
        gGame.shownCount++

    }
    gIsFirstClick = false;
    checkVictory()
}


// left click
function revealCell( i, j, isHint= false) {
    
    
    if (gBoard[i][j].isMarked ) return

    if (!gBoard[i][j].isShown) {
        gBoard[i][j].isShown = !gBoard[i][j].isShown
        var randLocation = { i: i, j: j }

        if (gBoard[i][j].isMine ) {
            renderCell(randLocation, MINE_ICON)

            if (!isHint) {
                gLives--
                gBoard[i][j].minesAroundCount++
                usersLives()
            }
            
        } else {
            if (gBoard[i][j].minesAroundCount === 0) {
                renderCell(randLocation, EMPTY);

                if (!isHint)
                    expandedView(i, j)
                return;
            } else {
                renderCell(randLocation, gBoard[i][j].minesAroundCount);
                return;
            }
        }
    }

}



//right click
function markCell(i, j) {
    if (gBoard[i][j].isShown) return
    var location = { i, j }
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        gGame.markedCount--
        renderCell(location, EMPTY)
        var elCell = document.querySelector(`.cell${location.i}-${location.j}`)
        elCell.classList.remove('revealed')
    } else {
        gBoard[i][j].isMarked = true
        renderCell(location, FLAG_ICON)
        gGame.markedCount++

    }
}



function usersLives() {
    if (gLives === 1) USER_HEARTS.innerText = ' Lives: ❤️||'
    else if (gLives === 2) USER_HEARTS.innerText = ' Lives: ❤️❤️||'
    else if (gLives === 3) USER_HEARTS.innerText = ' Lives: ❤️❤️||'
    if (gLives === 0) {
        USER_HEARTS.innerText = 'You have no Lives||'
        gameOver()
    }
}



function checkVictory() {
    if (gGame.shownCount + gGame.markedCount === gLevel.boardSize && gLives > 0) {
        gGame.isOn = false
        clearInterval(gTimerInterval)
        WIN_DISPLAY.style.display = 'block'
        document.querySelector('.smiley').innerText = '😎'
    }

}


function gameOver() {
    LOOSE_DISPLAY.style.display = 'block'
    document.querySelector('.smiley').innerText = '😔'
    clearInterval(gTimerInterval)
    console.log("game over")
    gGame.isOn = false;
    gGame.shownCount = 0
}

function resetGame() {
    document.querySelector('.timerDisplay').innerText = '00.00'
    LOOSE_DISPLAY.style.display = 'none'
    WIN_DISPLAY.style.display = 'none'
    document.querySelector('.smiley').innerText = '😊'
    clearInterval(gTimerInterval)
    gBoard = buildBoard(gLevel.boardLength)
    USER_HEARTS.innerText = 'Lives: ❤️❤️❤️||'
    renderBoard('.board')
    gGame.isOn = true
    gLives = 3
    gGame.shownCount = 0
    gGame.markedCount = 0
}

function hint(cellI, cellJ) {
    var hintedCells = []
    var location = {}
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length - 1) continue
            if (i === cellI && j === cellJ) continue
            location = {'i':i,'j':j}
            hintedCells.push(location)
            revealCell(location.i, location.j,true)
        }
    }



    setTimeout(function() {
        for (var i = 0; i < hintedCells.length; i++) {
            hideCell(hintedCells[i], EMPTY)
            gBoard[hintedCells[i].i][hintedCells[i].j].isShown = false
        }
    
    }, 1000);
    
    
}

function getHint() {
    if(gIsFirstClick) return
    if (gGame.hints > 0) {
        gIsHint = true
        gGame.hints--
        renderSymbol(gGame.hints, HINT)
       
    }
    
}

function renderSymbol(amount, symbol) {
    var elHints = document.querySelector('.hints-box span')
    var symbolStr = ''
    for (var i = 0; i < amount; i++) {
       symbolStr += symbol
        
    }
    if (HINT) {
        elHints.innerHTML = symbolStr
    }
}

