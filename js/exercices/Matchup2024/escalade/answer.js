function main(){
	const envergure = pf(rl());
	const ev2 = envergure * envergure;
	const start = readPos();
	const end = readPos();
	let prises  = rpl().map(parsePos);
	prises.push(start);
	prises.push(end);
	let edges = [];
	for(let i = 0; i < prises.length; i++){
		let A = prises[i];
		A.connexions ??= [];
		A.index = i;
		for(let j = 0; j < i; j++){
			let B = prises[j];
			B.connexions ??= [];
			if(distSq(A, B) <= ev2){
				edges.push({A, B});
				A.connexions.push(j);
				B.connexions.push(i);
			}
		}
	}
	//BFS
  let pool = [];
	let front = [[start]];
	let next = [];
	let visited = new Set();
	while(front.length > 0){
		next.length = 0;
		for(let path of front){
			let prise = path[0];
			visited.add(prise.index);
			for(const index of prise.connexions){
				let to = prises[index];
				if(to == end){
					for(const pt of path.reverse())
						print(pt.x, pt.y);
					print(end.x, end.y);
					return;
				}
				if(!path.includes(to) && ! visited.has(to.index)){
					let newPath = pool.pop() ?? [];
					newPath.push(to);
					newPath.push(...path);
					next.push(newPath);
				}
			}
			path.length = 0;
			pool.push(path);
		}
		[front, next] = [next, front];
	}
	print(-1);
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
const floats = line => typeof line == "string"? floats(split(line)) : line.map?.(pf) ?? [];
/** @arg {string?} line @arg {string?} splitter @returns {[string]} */
const split = (line, splitter = " ") => line?.split(splitter) ?? [];
const readsplit = (splitter = " ") => split(readline(), splitter);
const readints = (splitter = " ") => readsplit(splitter).map(pi);
const readfloats = (splitter = " ") => readsplit(splitter).map(pf);
const rs = readsplit; const ri = readints; const rf = readfloats;

function createReader(isogradReader, testData){
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
		}else if(testData){
			if(testData.println) println = testData.println;
			resolve(testData.readline);
		}else{
			import("../../../tools/debug.js")
			.then(imp => {
				console.log("was able to import debug :", imp);
				let pr = imp.makePrintLn();
				if(pr) println = pr;
				resolve(imp.makeReadline());
			})
			.catch(reject);
		}
	}).then(fn => readline = fn)
		.catch(e => eprintln("could not init", e));
}

//positions
function pos(row, col){ return Object.assign({row, col, x : col, y : row}, POS);};
const POS = {
	isGrid : true, type : null,
	minus : function(other){return minusPos(this, other)},
	plus : function(other){return plusPos(this, other)},
	lengthSq : function(){return this.x * this.x + this.y * this.y},
	length : function(){return Math.sqrt(this.lengthSq())},
	toString : function(){return `pos(x${this.x},y${this.y})`}}; POS.type = POS;
const posXY = (x, y) => pos(y, x);
const posxy = posXY;

const readPos = ()=> posXY(...readfloats());
const parsePos = (line)=> posXY(...floats(line));
const minusPos = (a, b) => pos(a.row - b.row, a.col - b.col);
const plusPos = (a, b) => pos(a.row + b.row, a.col + b.col);

const dist = (posA, posB) => posA.minus(posB).length();
const distSq = (posA, posB) => posA.minus(posB).lengthSq();

const last = arr => arr[arr.length-1];