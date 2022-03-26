import { allWordsWithFiveLetter } from './dictionary.js';
import gameRow from  './gameRow.js';
import { loadState, saveState } from './localStorage.js';
const keyboardMapping = {
    q: 0,
    w: 1,
    e: 2,
    r: 3,
    t: 4,
    y: 5,
    u: 6,
    i: 7,
    o: 8,
    p: 9,
    a: 10,
    s: 11,
    d: 12,
    f: 13,
    g: 14,
    h: 15,
    j: 16,
    k: 17,
    l: 18,
    z: 19,
    x: 20,
    c: 13,
    v: 14,
    b: 15,
    n: 16,
    m: 17,
    Enter: 18,
    Backspace: 19,
}
let selectedWord = loadState('selected-word');
let selectedTime = loadState('selected-time');
let isSumitted = loadState('is_submitted');
let currentWord = '';
let trialNumber = 0;
const saveTodaysWord = function(){
    const randomIndex = Math.floor(Math.random(0, 1) * allWordsWithFiveLetter.length);
    selectedWord = allWordsWithFiveLetter[randomIndex];
    selectedTime = new Date().getDate();
    saveState('selected-word', selectedWord);
    saveState('selected-time', selectedTime);
}
// if(!selectedWord || selectedWord.length === 0 || !selectedTime){
//     saveTodaysWord();
// }
// else {
//     if(selectedTime < new Date().getDate()){
//         saveTodaysWord();
//     }
// }
saveTodaysWord();
function initGameBoard() {
    const gameBoard = document.getElementsByClassName('game-board');
    const createdRows = new gameRow(6, 5);
    gameBoard[0].append(...createdRows);
    const keyboard = document.getElementsByClassName('button');
    for(let i = 0; i < keyboard.length; i++){
        keyboard[i].addEventListener('click', (e) => {
            if((e.target.attributes).hasOwnProperty('data-key')){
                handleKeyboardClick((e.target).attributes['data-key']['value']);
            }
            else if((e.target.parentNode.attributes).hasOwnProperty('data-key')){
                handleKeyboardClick((e.target.parentNode).attributes['data-key']['value']);
            }
        });
    }
}

function listenKeyboard(){
    document.addEventListener('keyup', (e) => handleKeyboardClick(e.key));
}

function handleKeyboardClick(e){
    if(keyboardMapping[e] == undefined || loadState('is_submitted'))return;
    const totalTiles = document.getElementsByClassName('tile');
    let firstEmptyTileIndex = -1;
    let lastNonEmptyTileIndex = -1;
    for(let i = 0; i < totalTiles.length; i++){
        if(totalTiles[i].innerHTML == ""){
            firstEmptyTileIndex = i;
            break;
        }
    }
    for(let i = 0; i < totalTiles.length; i++){
        if(totalTiles[totalTiles.length - 1 - i].innerHTML != ""){
            lastNonEmptyTileIndex = totalTiles.length - 1 - i;
            break;
        }
    }
    console.log(e, firstEmptyTileIndex, lastNonEmptyTileIndex, trialNumber);
    switch (e) {
        case 'Enter':
            console.log(currentWord, trialNumber, allWordsWithFiveLetter.includes(currentWord));
            const tiles = document.getElementsByClassName('tile');
            if(allWordsWithFiveLetter.includes(currentWord) === false){
                addShaker(trialNumber, tiles, 'Not in word list')
            }
            else if(tiles[(trialNumber)*5 + 4].innerHTML === ''){
                addShaker(trialNumber, tiles, 'Not Enough Words');
            }
            else {
                const keyboard = document.getElementsByClassName('button');
                for(let i = trialNumber * 5; i <= trialNumber * 5 + 4; i++){
                    if(currentWord[i - trialNumber * 5] ===  selectedWord[i - trialNumber * 5]){
                        tiles[i].classList.add('bg-correct');
                        tiles[i].classList.add('animated');
                        tiles[i].classList.add('flipInY');
                        updateKeyboardState(currentWord[i - trialNumber * 5], 'correct', keyboard);
                    }
                    else if(isletterPresent(currentWord[i - trialNumber * 5], selectedWord)){
                        tiles[i].classList.add('bg-present');
                        tiles[i].classList.add('animated');
                        tiles[i].classList.add('flipInY');
                        updateKeyboardState(currentWord[ i - trialNumber * 5], 'present', keyboard);
                    }
                    else {
                        tiles[i].classList.add('bg-absent');
                        tiles[i].classList.add('animated');
                        tiles[i].classList.add('flipInY');
                        updateKeyboardState(currentWord[ i - trialNumber * 5], 'absent', keyboard);
                    }
                }
                if(currentWord === selectedWord){
                    document.body.classList.add('pt-none');
                    showToast('Woohoo!! You guessed it 😎');
                    saveState('is_submitted', true);
                }
                else if(trialNumber === 5) {
                    document.body.classList.add('pt-none');
                    showToast(selectedWord.toUpperCase());
                }
                console.log('HERE COMING', currentWord);
                currentWord = '';
                trialNumber++;
            }
            break;
        case 'Backspace':
            if(lastNonEmptyTileIndex != -1 && (trialNumber <= lastNonEmptyTileIndex / 5)){
                totalTiles[lastNonEmptyTileIndex].innerHTML = '';
                currentWord = currentWord.slice(0, currentWord.length - 1);
            }
            break;
        default:
            if(currentWord.length === 5)return;
            totalTiles[firstEmptyTileIndex].innerHTML = e;
            currentWord += e;
            break;
    }
}

const checkAnyLetterMatching = function(str1, str2){
    for(let i = 0; i < str1.length; i++){
        for(let j = 0; j < str2.length; j++){
            if(str1[i] == str2[j])return true;
        }
    }
    return false;
}
const isletterPresent = function(chr, str){
    for(let i = 0; i < str.length; i++){
        if(chr === str[i])return true;
    }
    return false;
}

const addShaker = function(rowNumber, tiles, message){
    showToast(message);
    const gameBoard = document.getElementsByClassName('game-board');
    const toastElement = document.getElementsByClassName('game-toaster');
    gameBoard[0].classList.add('animated');
    gameBoard[0].classList.add('shake');
    for(let i = rowNumber * 5; i < rowNumber * 5 + 5; i++){
        tiles[i].classList.add('animated');
        tiles[i].classList.add('shake');
    }
    setTimeout(() => {
        for(let i = rowNumber * 5; i < rowNumber * 5 + 5; i++){
            tiles[i].classList.remove('animated');
            tiles[i].classList.remove('shake');
        }
        toastElement[0].classList.add('dsp-none');
        toastElement[0].innerHTML = '';
    },2000);
} 

function updateKeyboardState(chr, dataState, keys){
    for(let i = 0; i < keys.length; i++){
        if(keys[i].innerHTML !== chr)continue;
        console.log(keys[i].getAttribute('data-state'));
        if(!keys[i].getAttribute('data-state')){
            keys[i].setAttribute('data-state', dataState);
        }
    }
}

function showToast(message){
    const toastElement = document.getElementsByClassName('game-toaster');
    toastElement[0].classList.remove('dsp-none');
    toastElement[0].innerHTML = message;
}

initGameBoard();
listenKeyboard();


