function main(){
	const [A] = ri();
	const [B] = ri();
	const [L] = ri();

	const mem = new Map();
	function mv(l){
		if(l <= A) return 1;
		let count = 0;

		for(let m = A; m <= B && m <= l; m++){
			count += movements(l - m - 1);
		}

		return count;
	}
	const movements = memoize1(mv);
	for(let m = 0; m<L; m++)
		movements(m);
	print(movements(L));
}

function memoize1(fn){
	const mem = new Map();
	return a => {
		if(!mem.has(a))
			mem.set(a, fn(a))
		return mem.get(a);
	}
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