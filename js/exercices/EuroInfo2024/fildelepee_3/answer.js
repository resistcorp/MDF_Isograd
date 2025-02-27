function main(){
	const players = rpl().map(line => {
		const [A, R, E] = ints(line);
		return {A,R,E};
	});
	function beats(i, j){
		let a = players[i];
		let b = players[j];
		let count = (a.A > b.A) + (a.R > b.R) + (a.E > b.E);

		return count >= 2;
	}

	const graph = makeGraphF(beats, players);
	for(const path of pathsOfLength(graph, 0, 4, true)){
		const end = path.node;
		if(beats(end, 0)){
			print("Yes");
			return
		}
	}
	print("No");
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

/**
 * 
 * @param {((int, int)=>boolean)} edgeFunc a function telling if an edge exists between a and b
 * @param {(number|[any])?} nodeData either what to encapsulate or how to
 * @returns {Graph}
 */
function makeGraphF(edgeFunc, nodeData){
	let nodes;
	if(Number.isInteger(nodeData)){
		nodes = new Array(nodeData).fill().map(makeNode);
	}else if(Array.isArray(nodeData)){
		nodes = nodeData.map(makeNode);
	}else{
		eprintln("need to know the number of nodes");
		return null;
	}
	const maxNode = nodes.length-1;
	for(let i = 0; i <= maxNode; i++){
		const nA = nodes[i];
		for(let j = 0; j <= i; j++){
			const nB = nodes[j];
			if(edgeFunc(i, j))
				nA.neighbours.push(j);
			if(edgeFunc(j, i))
				nB.neighbours.push(i);
		}

	}
	return Object.assign({nodes, maxNode}, GRAPH);
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

/** iterator of all (DFS) paths of a given length.
 * 
 * @param {Graph} graph 
 * @param {int} start 
 * @param {int} length 
 * @param {bool} unique
 * @param {Path?} basePath (used in recursion, pass null to start process)
 */
function* pathsOfLength(graph, start, length, unique, basePath){
	basePath ??= makePath(start);
	const node = graph.nodes[start];

	for(const neighbour of node.neighbours){
		if(unique && basePath.contains(neighbour))
			continue;
		const path = makePath(neighbour, basePath);
		if(path.length >= length)
			yield path;
		else
			yield * pathsOfLength(graph, neighbour, length, unique, path);
		
	}
}

const GRAPH = {isGraph : true}; GRAPH.type = GRAPH;
const PATH = {isPath : true, contains : function(nodeIndex){return this.node === nodeIndex || this.base?.contains(nodeIndex)}}; PATH.type = PATH;
const NODE = {isNode : true}; NODE.type = NODE;