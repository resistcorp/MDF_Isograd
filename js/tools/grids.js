/**
 * 
 * @param {number} rows 
 * @param {number?} columns 
 * @param {string?} splitter 
 * @returns 
 */
function readGrid(rows, columns = undefined, splitter = ""){
	let ret = [];
	let cols = 0;
	for(let y = 0; y < rows; y++){
  	const line = readline();
  	const values = split(line, splitter);
		if(cols == 0) cols = values.length;
		ret.push(values);
		if(columns>=0 && values.length != columns)
			eprintln("unexpected column number");
	}
	return Object.assign(ret, GRID, {rows, cols : ret[0].length});
}
const GRID = {isGrid : true, type : null, rows : 0, cols : 0}; GRID.type = GRID;
function readGridHW(splitter = ""){
	const [H, W] = readints();
	return readGrid(H, W, splitter);
}
function readGridWH(splitter = ""){
	const [W, H] = readints();
	return readGrid(H, W, splitter);
}
function readGrid_H(splitter = ""){
	const [_, H] = readints();
	return readGrid(H, undefined, splitter);
}
function readGridH_(splitter = ""){
	const [H, _] = readints();
	return readGrid(H, undefined, splitter);
}

//readingFromGrid
function gridAt(grid, row, col) {
	return grid[row]?.[col];
}
const gridAtPos = (grid, pos) => gridAt(grid, pos.row, pos.col);

//positions
function pos(row, col){ return Object.assign({row, col, x : col, y : row}, POS);};
const POS = {isGrid : true, type : null}; POS.type = POS;
const posXY = (x, y) => pos(y, x);
const posxy = posXY;

function isValid(grid, pos){
	return grid.isGrid && range(pos.row, 0, grid.rows-1) && range(pos.col, 0, grid.cols-1)
}

//////////////////////////////////////////////////////////////////////////////
///don't copy-paste after this
export default { readGrid, readGridHW, readGrid_H, readGridWH, readGridH_, gridAt, gridAtPos, pos, isValid };
import basic from "./basic.js";
import math from "./math.js";
const {readline, readints, split, eprintln} = basic;
const {range} = math;