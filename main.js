'use strict'

const MINE_ICON = '💣'
const FLAG_ICON = '🏳️'


var gLevel = {
    boardSize: 16,
    boardLength: Math.sqrt(16),
    numOfMines: 2,
}

const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// const gCell = {
//     minesAroundCount: 0,
//     isShown: false,
//     isMine: false,
//     isMarked: false
// }


var gBoard
var gBoardSize = 16 //Default
var gNumOfMines = 2 //Default 
var gCount = 0
var gLives = 0
var gInterval

var length = Math.sqrt(gBoardSize)



function onInit() {
    gBoard = buildBoard(gLevel.boardLength)
    // console.log(gBoard);
    rendelBoard('.board')
    gGame.isOn = true
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
            }
        }
    }
    return board
}


function rendelBoard(selector) {
    var strHTML = ''
    for (var i = 0; i < gLevel.boardLength; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.boardLength; j++) {
            var className = getClassName({ i: i, j: j })
            strHTML += `<td class="${className} cell${i}-${j} clicked" onclick="revealCell(this, ${i}, ${j}), event"></td>`
        }
        strHTML += '</tr>'
    }

    var elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass;
}

function setDifficultyLevel(boardSize) {
    gBoardSize = boardSize
    if (gBoardSize === 16) gNumOfMines === 2
    if (gBoardSize === 64) gNumOfMines === 14
    if (gBoardSize === 144) gNumOfMines === 32
    onInit()
}

function placeMines(firstCI, firstCJ) {
    for (var i = 0; i < gLevel.numOfMines; i++) {
        do {
            var randomI = getRandomIntInt(0, gLevel.boardLength)
            var randomJ = getRandomIntInt(0, gLevel.boardLength)
        } while (gBoard[randomI][randomJ].isMine || (firstCI === randomI && firstCJ === randomJ))
        gBoard[randomI][randomJ].isMine = true
    }
}


// function placeMines(gBoard) {
//     var minesA = []
//     for (var i = 0; i < gLevel.size; i++) {
//         var randomI = getRandomIntInclusive(0, gBoardSize - 1)
//         var randomJ = getRandomIntInclusive(0, gBoardSize - 1)

//         // var randCell = { i: randomI, j: randomJ }
//         console.log(gBoard[randomI][randomJ])
//         gBoard[randomI][randomJ].isMine = true
//         gBoard[randomI][randomJ].innerHTML = MINE_ICON

//         // renderCell(randCell, MINE_ICON)
//     }
// }

function placeMines(firstCI, firstCJ) {
    for (var i = 0; i < gLevel.numOfMines; i++) {
        do {
            var randomI = getRandomIntInt(0, gLevel.boardLength)
            var randomJ = getRandomIntInt(0, gLevel.boardLength)
        } while (gBoard[randomI][randomJ].isMine || (firstCI === randomI && firstCJ === randomJ))
        gBoard[randomI][randomJ].isMine = true
    }
}

function markeCell(i, j) {
    var location = { i: i, j: j }
    if (gBoard[i][j].isShown) return
    if (gBoard[i][j].isMarked) {
        renderCell(location, FLAG_ICON)
        gBoard[i][j].isMarked = true
        gGame.markedCount++
    }
}


function revealCell(elCell, i, j, event) {
    gGame.markedCount++
    gCount++

    if (gCount === 1) {
        startTimer()
        placeMines(i, j)
    }

    gBoard[i][j].isShown = true

    if (gBoard[i][j].isMine) {
        var randLocation = { i: i, j: j }
        renderCell(randLocation, MINE_ICON)
        gLives++
        if (gLives === 2) {

            document.querySelector('h4').innerText = 'You have no Lives'
        }
        if (gLives === 1) document.querySelector('h4').innerText = 'You have 1 Life: ❤️'

    } else {
        var countedNegs = countNegs(gBoard, i, j)
        var count = 0
        for (var i = 0; i < countedNegs.length; i++) {
            count++
        }
        elCell.innerText = count

        if (count === 0) {
            var nonBombsnegs = revealNonBomb(gBoard, i, j)
            for (var i = 0; i < nonBombsnegs; i++) {
                var elCell = document.querySelector(`.clicked`)
                elCell.innerText = count
                console.log(elCell)
            }

            // revealNonBomb()
        }
    }    
}













