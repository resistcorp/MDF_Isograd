import { assertEquals, assertFalse, assert } from "jsr:@std/assert";
import graphs from "./graphs.js";
const {makeGraph, bfs, iter, rev} = graphs;

const edges = [{A : 0, B : 1},{A : 0, B : 2},{A : 1, B : 3}]
const bigdata = new Array(6).fill(0).map((_, i) => `${i}:???`);
Deno.test("Graph creation", async (t)=> {
	await t.step("just edges can make a graph", ()=>{
		const graph = makeGraph(edges);
		assertEquals(3, graph.maxNode);
		assertEquals(4, graph.nodes.length);
	});
	await t.step("can give correct length ", ()=>{
		const graph = makeGraph(edges, 4);
		assert(graph);
		assertEquals(3, graph.maxNode);
		assertEquals(4, graph.nodes.length);
		assertFalse(graph.nodes[2].hasdata);
	});
	await t.step("can give too much data ", ()=>{
		const graph = makeGraph(edges, bigdata);
		assert(graph);
		assertEquals(5, graph.maxNode);
		assertEquals(6, graph.nodes.length);
		assertEquals("1:???", graph.nodes[1].data);
	});
	await t.step("can give too great length ", ()=>{
		const graph = makeGraph(edges, 9);
		assert(graph);
		assertEquals(8, graph.maxNode);
		assertEquals(9, graph.nodes.length);
		assert(graph.nodes[8].isNode);
		assertFalse(graph.nodes[9]);
		assertEquals([], graph.nodes[8].neighbours);
	});
	await t.step("cannot give too low length ", ()=>{
		const graph = makeGraph(edges, 2);
		assertFalse(graph);
	});
	await t.step("cannot give too small data ", ()=>{
		const data = ["A", "B"];
		const graph = makeGraph(edges, data);
		assertFalse(graph);
	});
});

Deno.test("bfs", async (t) =>{
	await t.step("can iterate over all paths" , ()=>{
		const graph = makeGraph(edges, bigdata);
		const paths = [...bfs(graph, 0)];
		assertEquals(4, paths.length);
	});
	await t.step("iteration functions check that they are given a path" , ()=>{
		assertEquals([], [...iter(null)])
		assertEquals([], [...iter()])
		assertEquals([], [...iter(1)])
		assertEquals([], [...rev(1)])
	});
	await t.step("can find path 0-3" , ()=>{
		const graph = makeGraph(edges, bigdata);
		let found = null;
		for( const {path, node} of bfs(graph, 0)){
			if(path.node == 3){
				found = path;
				break;
			}
		}
		assert(found);
		assertEquals(3, found.length);
		assertEquals([0, 1, 3], [...iter(found)])
		assertEquals([3, 1, 0], [...rev(found)])
	});
});