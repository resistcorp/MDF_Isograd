function main(){
	const envergure = pf(rl());
	const ev2 = envergure * envergure;
	const start = readPos();
	const end = readPos();
	let prises  = [start, end, ...rpl().map(parsePos)];
	let edges = [];
	for(let i = 0; i < prises.length; i++){
		let A = prises[i];
		for(let j = 0; j < i; j++){
			let B = prises[j];
			if(distSq(A, B) <= ev2){
				edges.push({A : i, B : j});
			}
		}
	}

	const graph = makeGraph(edges, prises);
	const startIdx = 0;
	const endIdx = 1;

	try{
		for(const {path, node} of bfs(graph, startIdx)){
			if(node.index == endIdx){
				for(const id of iter(path)){
					const prise = prises[id];
					print(prise.x, prise.y);
				}
				return;
			}

		}
	}catch(e){
		eprintln("error while calling bfs");
		eprintln(e);
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

/**
 * 
 * @param {[Edge]} edges the node-indices that are connected
 * @param {(number|[any])?} nodeData either what to encapsulate or how to
 * @returns {Graph}
 */
function makeGraph(edges, nodeData){
	let expectedNumber = 0;
	let nodes;
	if(Number.isInteger(nodeData)){
		nodes = new Array(nodeData).fill().map(makeNode);
		expectedNumber = nodeData;
	}else if(Array.isArray(nodeData)){
		nodes = nodeData.map(makeNode);
		expectedNumber = nodes.length;
	}else{
		nodes = [];
	}
	let maxNode = expectedNumber - 1;
	for(const {A, B} of edges){
		maxNode = Math.max(A, B, maxNode);
		nodes.length = maxNode+1;
		const nA = nodes[A] ??= makeNode(null, A);
		const nB = nodes[B] ??= makeNode(null, B);
		nA.neighbours.push(B);
		nB.neighbours.push(A);
	}
	if(expectedNumber > 0 && maxNode >= expectedNumber){
		eprintln("not seen enough nodes when creting graph");
		return null;
	}
	return Object.assign({edges, nodes, maxNode}, GRAPH);
}
/**
 * @generator
 * @param { Graph } graph 
 * @param { int } startIdx 
 * @yields { WayPoint } the next node, a path leading to it, in bfs order
 */
function* bfs(graph, startIdx){
	const passed = new Set([startIdx]);
	let front = [makePath(startIdx, null)];
	let next = [];

	while(front.length > 0){
		for(const path of front){
      const nodeID = path.node;
			const node = graph.nodes[nodeID];
			const wp = {path, node, graph};
			yield wp;
			for(const neighbour of node.neighbours){
				if(passed.has(neighbour))
					continue;
				passed.add(neighbour);
				next.push(makePath(neighbour, path));
			}
		}
		[front, next] = [next, front];
		next.length = 0;
	}
}
/** @returns {Node} */
function makeNode(data, index){
	const neighbours = [];
	return Object.assign({neighbours, index, data, hasData : !!data}, NODE);
}
/**
 * @param {Graph} graph ref to the graph we're working in
 * @param {int} node index of the node in that graph
 * @param {Path?} base if this is not a base path, the path leading to here
 * @param {number} weight in weighted graphs, the cost of the edge
 * @returns {Path} a new Path
 */
function makePath(node, base, weight = 1){
	const length = (base?.isPath ? base.length : 0) + weight;
	return Object.assign({base, length, node}, PATH);
}

/** iterate over a path, from the end to the start
 * @generator
 * @param {Path} path 
 * @yields {int} the previous node in this path
 */
function* rev(path){
	let p = path;
	while(p?.isPath){
		yield p.node;
		p = p.base;
	}
}
/** iterate over a path, in expected order: 
 * @generator
 * @param {Path} path 
 * @yields {int} the previous node in this path
 */
function* iter(path){
	if(path?.base?.isPath)
		yield * iter(path.base)
	if(path?.isPath)
		yield path.node;
}

const GRAPH = {isGraph : true}; GRAPH.type = GRAPH;
const NODE = {isNode : true}; NODE.type = NODE;
const PATH = {isPath : true}; PATH.type = PATH;

