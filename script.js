// Display/UI

import { TILE_STATUSES,createBoard ,markTile ,revealTile ,checkWin,checkLose} from "./minesweeper.js";

let boardSize = 7;
let numberOfMines = 10;  

const resetButton = document.querySelector(".reset");
const emoji = document.querySelector(".emoji");
const messageText = document.querySelector(".subtext");
const boardElement = document.querySelector(".board");
const easyBtn = document.querySelector(".easy");
const medBtn = document.querySelector(".medium");
const hardBtn = document.querySelector(".hard");

easyBtn.addEventListener('click',() => {
    resetValues();
    boardSize=7;
    numberOfMines=10;

    newGame(boardSize,numberOfMines);
})
medBtn.addEventListener('click',() => {
    resetValues();
    boardSize=10;
    numberOfMines=30;

    newGame(boardSize,numberOfMines);
})
hardBtn.addEventListener('click',() => {
    resetValues();
    boardSize=15;
    numberOfMines=100;

    newGame(boardSize,numberOfMines);
})

resetButton.addEventListener("click",() => {
    resetValues();

    newGame(boardSize,numberOfMines);
})

function newGame(BOARD_SIZE,NUMBER_OF_MINES){


    
const board = createBoard(BOARD_SIZE,NUMBER_OF_MINES);

boardElement.innerHTML="";

messageText.innerHTML="";

messageText.textContent = "Mines Left : "

const span = document.createElement("span");

messageText.appendChild(span);

span.textContent = NUMBER_OF_MINES;
boardElement.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, ${100 / BOARD_SIZE}%)`;
boardElement.style.gridTemplateRows = `repeat(${BOARD_SIZE}, ${100 / BOARD_SIZE}%)`;




board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
          tile.element.addEventListener('click',() => {

            revealTile(board,tile);
            checkGameEnd();


          })
          tile.element.addEventListener('contextmenu', (e) => {
             e.preventDefault();
             if(listMinesLeft()>0 || tile.status===TILE_STATUSES.MARKED)
             markTile(tile);
             listMinesLeft();

          })
    })
})



function listMinesLeft(){
    const markedTilesCount = board.reduce((count,row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length;
    },0);

    span.textContent = NUMBER_OF_MINES - markedTilesCount;

    return NUMBER_OF_MINES - markedTilesCount;

}


function checkGameEnd(){
    const win = checkWin(board);
    const lose  = checkLose(board);

    if(win || lose){
        boardElement.addEventListener('click',stopProp,{capture:true});
        boardElement.addEventListener('contextmenu',stopProp,{capture:true});
    }

    if(win){
        messageText.textContent = "You Win";
        emoji.textContent = "😎";
    }
    if(lose){
        messageText.textContent = "You Lost";
        emoji.textContent = "😭"
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status === TILE_STATUSES.MARKED) markTile(tile);
                if(tile.mine) revealTile(board,tile);
            })
        })
    }
     
}



}

function stopProp(e) {
    e.stopImmediatePropagation();
}



function resetValues(){

    emoji.textContent = "😄";

    boardElement.removeEventListener('click',stopProp,true);
    boardElement.removeEventListener('contextmenu',stopProp,true);


}
