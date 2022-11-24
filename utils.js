function renderBoard(selector) {
    var strHTML = ``
    for (var i = 0; i < gLevel.boardLength; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.boardLength; j++) {
            var className = getClassName({ i: i, j: j })
            strHTML += `<td class="${className} cell${i}-${j}" onmousedown="handleClick(this, ${i}, ${j}, event)"></td>`
        }
        strHTML += '</tr>'
    }

    var elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}


function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`)
    elCell.classList.add('revealed')
    elCell.innerHTML = value
}
//olga
function hideCell(location) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`)
    elCell.classList.remove('revealed')
    elCell.innerHTML = EMPTY
}

function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j;
    return cellClass;
}


function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}


function startTimer() {
    var elTimer = document.querySelector('.timerDisplay')
    var date = Date.now()
    gTimerInterval = setInterval(function () {
        var time = ((Date.now() - date) / 1000).toFixed(2)
        elTimer.innerText = time
    }, 100)
}


function setMinesAroundCount() {
    // var count = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j]. isMine) continue
            else gBoard[i][j].minesAroundCount = countNeighbors(i, j)
            // count = countNeighbors(gBoard, i, j);
        //     gBoard[i][j].minesAroundCount = count;
        }
    }
    // return count
}


function countNeighbors(cellI, cellJ) {
    var mineCount = 0;

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {

            if (j < 0 || j >= gBoard[i].length - 1) continue
            if (i === cellI && j === cellJ) continue
            if (gBoard[i][j].isMine) mineCount++
        }
    }
    // if (!mineCount) mineCount = ''
 
    return mineCount
}

function expandedView(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {

        if (i < 0 || i > gBoard.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {

            if (j < 0 || j >= gBoard[i].length || (i === rowIdx && j === colIdx)) continue 

            if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
                gBoard[i][j].isShown = !gBoard[i][j].isShown
                gGame.shownCount++;

                var location = { i, j }
                var minesAroundCount = gBoard[i][j].minesAroundCount;
                if (minesAroundCount === 0) {
                    renderCell(location, EMPTY)
                } else if (minesAroundCount > 0) {
                    renderCell(location, minesAroundCount)
                }
                if (minesAroundCount === EMPTY) {
                    expandedView(location.i, location.j)
                }
            }
        }
    }
}
