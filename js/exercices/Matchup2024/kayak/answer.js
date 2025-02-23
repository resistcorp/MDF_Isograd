function main(){
	const grid = rgh();
	let best = grid.cols * grid.rows;
	const runners = new Array(grid.cols).fill(0).map((_, idx)=>{
		let runner = idx +1;
		let position = pos(0, idx);
		let length = 0;
		let viewed = new Set();
		err(`runner ${runner} starts at ${position}`);
		while(isValid(grid, position)){
			if(viewed.has(position.toString())) return;
			viewed.add(position.toString());
			position = move(grid, position);
			length ++;
		}
		err(`runner ${runner} stopped after ${length}`);
		if(position.row>=grid.rows){
    		err(`runner ${runner} won!!!`);
			if(length < best)
				best = length;
			return length;
		}
		err(`runner ${runner} stopped after ${length}`);

		return Number.POSITIVE_INFINITY;
	});

	let res = [];

	runners.forEach((v, i)=>{
		if(v == best) res.push(i+1);
	});

	print(...res);
}

function move(grid, position){
	switch(grid.at(position)){
		case "^" : return pos(position.row - 1, position.col);
		case "v" : return pos(position.row + 1, position.col);
		case "<" : return pos(position.row, position.col - 1);
		case ">" : return pos(position.row, position.col + 1);
	}
	return pos(-1, -1);
}

// this line plugs-in the tools. Call your main function main (or replace main with your main func name ^^)
// readline() (or rl(1) or r()) is different when running
//  - in isograd 
//  - and in vscode
var readline_object;//<<redefine their weird thing
createReader(readline_object).then(main);

//printing aliases
let println = (...params) => console.log(...params);//<<overwritten in vscode
const eprintln = (...params) => console.error(...params);
const print = (...params)=>println(...params); const p = print;
const err = eprintln; const ep = eprintln; const e = eprintln;

//reading tools
/** @type { () => string } */
let readline;
/**
 * @arg {number} num - how many lines to read
 * @returns {[string]} the lines in an array
 * */
const readlines = (num = 1) => new Array(num).fill().map(readline);
const rl = readlines;//reads lines in an array
const r = ()=>readline();//reads one line as a string

//specials
const readPrefixedLines = ()=>rl(pi(r()));//reads an int N, then returns the N next lines
const rpl = readPrefixedLines;

const pi = v => parseInt(v, 10);
const pf = v => parseFloat(v);
const int = pi; const float = pf;
/** @arg {string|[string]} line @returns {[string]} */
const ints = line => typeof line == "string"? ints(split(line)) : line.map?.(pi) ?? [];
/** @arg {string?} line @arg {string?} splitter @returns {[string]} */
const split = (line, splitter = " ") => line?.split(splitter) ?? [];
const readsplit = (splitter = " ") => split(readline(), splitter);
const readints = (splitter = " ") => readsplit(splitter).map(pi);
const rs = readsplit; const ri = readints;

function createReader(isogradReader){
	return new Promise((resolve, reject) => {
		if(isogradReader){
		//the isograd way
				let input = [];
				readline_object.on("line", (value) => input.push(value));
				let index = 0;
				let ret = ()=>input[index++];
				readline_object.on("close", ()=>{
					ret.size = input.length;
					resolve(ret);
				}); 
		}else{
			import("../../../tools/debug.js")
			.then(imp => {
				console.log("was able to import debug :", imp);
				println = imp.makePrintLn();
				resolve(imp.makeReadline());
			})
			.catch(reject);
		}
	}).then(fn => readline = fn)
		.catch(e => eprintln("could not init", e));
}

/** @arg {[number]} arr @returns {number} */
const sum = arr => arr.reduce((acc, v ) => acc + v, 0);
const floor = Math.floor;
const random = Math.random;
const rnd = (max = 1, min = 0) => min + (random() * max);
const rndi = (max = Number.MAX_SAFE_INTEGER, min = 0) => floor(rnd(max, min));

/** @arg {[T: any]} arr @returns {T} a randomly selected element of arr */
const arrRnd = arr => arr[rndi(arr.lenght)];
const rndarr = arrRnd;
const rndI = rndi;

//ranges
const range = (v, min, max) => ass(min<=max, "min<=max")&&v <=max && v >= min;

function ass(val, msg = "assertion failed"){
	if(!val) throw(msg);
	return true;
}


//grids
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
const GRID = {isGrid : true, type : null, rows : 0, cols : 0, at : function(pos){return gridAtPos(this, pos);}}; GRID.type = GRID;
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

const rghw = readGridHW;
const rgh = readGridH_;
const rg_h = readGrid_H;
const rgwh = readGridWH;

//readingFromGrid
function gridAt(grid, row, col) {
	return grid[row]?.[col];
}
const gridAtPos = (grid, pos) => gridAt(grid, pos.row, pos.col);

//positions
function pos(row, col){ return Object.assign({row, col, x : col, y : row}, POS);};
const POS = {isGrid : true, type : null, toString : function(){return `pos(x${this.x},y${this.y})`}}; POS.type = POS;
const posXY = (x, y) => pos(y, x);
const posxy = posXY;

function isValid(grid, pos){
	return grid.isGrid && range(pos.row, 0, grid.rows-1) && range(pos.col, 0, grid.cols-1)
}
