export default class Tile{
    constructor(){
        const tile = document.createElement('div');
        tile.classList.add('word-tile');
        tile.classList.add('tile');
        tile.classList.add('tile-empty');
        return tile;
    }
}