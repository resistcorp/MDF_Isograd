/**
 * 
 * @param {[Edge]} edges the node-indices that are connected
 * @param {(number|[any])?} nodeData either what to encapsulate or how to
 * @param {bool?} isDirected wether edges go both ways
 * @returns {Graph}
 */
function makeGraph(edges, nodeData, isDirected = false){
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
		if(!isDirected)
			nB.neighbours.push(A);
	}
	if(expectedNumber > 0 && maxNode >= expectedNumber){
		eprintln("not seen enough nodes when creting graph");
		return null;
	}
	return Object.assign({edges, nodes, maxNode}, GRAPH);
}
/**
 * 
 * @param {((int, int)=>boolean)} edgeFunc a function telling if an edge exists between a and b
 * @param {(number|[any])?} nodeData either what to encapsulate or how to
 * @param {bool?} isDirected wether edges go both ways
 * @returns {Graph}
 */
function makeGraphF(edgeFunc, nodeData, isDirected = false){
	let nodes;
	if(Number.isInteger(nodeData)){
		nodes = new Array(nodeData).fill().map(makeNode);
		expectedNumber = nodeData;
	}else if(Array.isArray(nodeData)){
		nodes = nodeData.map(makeNode);
		expectedNumber = nodes.length;
	}else{
		eprintln("need to know the number of nodes");
		return null;
	}
	const maxNode = nodes.length-1;
	for(const i in nodes){
		const nA = nodes[i];
		for(const j = 0; j <= i; j++){
			const nB = nodes[j];
			if(edgeFunc(i, j))
				nA.neighbours.push(B);
			if(edgeFunc(j, i))
				nB.neighbours.push(B);
		}
		if(!isDirected)
			nB.neighbours.push(A);
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
/** iterator of all (DFS) paths of a given length.
 * 
 * @param {Graph} graph 
 * @param {int} start 
 * @param {int} length 
 * @param {bool} unique whether to allow self retracing paths
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

const GRAPH = {isGraph : true}; GRAPH.type = GRAPH;
const NODE = {isNode : true}; NODE.type = NODE;
const PATH = {isPath : true, contains : function(nodeIndex){return this.node === nodeIndex || this.base?.contains(nodeIndex)}}; PATH.type = PATH;

/////////////////////////////////////////////////////////
//don't copy-paste, this is for unit-testing and typeinfo
/** @export @typedef {import("./basic.js").int} int */
/** @export @typedef {A : int, B : int} Edge */
/** @export @typedef {index : int, data : any, neighbours : [int]} Node */
/** @export @typedef {edges:[Edge], nodes:[Node], maxNode : int} Graph */
/** @export @typedef {base : Path?, length : int, node : int} Path */
/** @export @typedef {path : Path, node : Node, graph : Graph} WayPoint */
export default {makeGraph, bfs, iter, rev, pathsOfLength};
import basic from "./basic.js"
const {eprintln} = basic;