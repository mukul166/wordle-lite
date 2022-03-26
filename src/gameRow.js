import Tile from './tile.js';
export default class gameRow {
    constructor(rowNumber, colNumber){
        const totalRows = [];
        for(let i = 0; i < rowNumber; i++){
            const currentCreatedRow = document.createElement('div');
            currentCreatedRow.classList.add('row');
            for(let j = 0; j < colNumber; j++){
                const tile = new Tile();
                currentCreatedRow.appendChild(tile);
            }
            totalRows.push(currentCreatedRow);
        }
        return totalRows;
    }
}