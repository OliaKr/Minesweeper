// function buildBoard(gCell, ROWS, COLS) {
//     var mat = []
//     for (var i = 0; i < ROWS; i++) {
//         var row = []
//         for (var j = 0; j < COLS; j++) {
//             row.push(gCell)
//         }
//         mat.push(row)
//     }
//     return mat
// }


//Get empty location
function getEmptyLocation() {
    var emptyLocations = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j] === EMPTY) emptyLocations.push({ i: i, j: j });
        }
    }
    if (!emptyLocations.length) return null;
    return emptyLocations[getRandomIntInclusive(0, emptyLocations.length - 1)];
}

//neigboors
function countNegs(mat, rowIdx, colIdx) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            if (mat[i][j] === MINE_ICON) count++;
        }
    }
    return count
}


function drawNum() {
    return gNums.pop()
}


function shuffle(items) {
    var randIdx, keep, i;
    for (i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length - 1);
        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`)
    elCell.innerHTML = value;
}

function getRandomIntInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}



function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}


function startTimer() {
    var elTimer = document.querySelector('.timerDisplay')
    var date = Date.now()
    gInterval = setInterval(function () {
        var time = ((Date.now() - date) / 1000).toFixed(3)
        elTimer.innerText = time
    }, 10)
}

function revealNonBomb(mat, rowIdx, colIdx) {
    var nonbombNegs = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue;
            if (i === rowIdx && j === colIdx) continue;
            nonbombNegs.push(mat[i][j])
        }
    }
    return nonbombNegs
}