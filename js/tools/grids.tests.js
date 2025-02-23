import basic from "./basic.js";
import grids from "./grids.js";
import { readerFromString } from "./debug.js";
import { assert, assertExists, assertFalse } from "jsr:@std/assert";
import { assertEquals} from "jsr:@std/assert/equals";

const {readGrid, gridAt, readGridHW, gridAtPos, pos, isValid} = grids;
const {createReader} = basic;

const BASIC_GRID = 
`AAA
BBC`;
const BASIC_GRID_WITH_HEADER_HW = 
`2 3
${BASIC_GRID}`;
Deno.test("grids", async (t)=> {
	await t.step("basic grid can be read", async ()=>{
		await createReader(null, {readline : readerFromString(BASIC_GRID)})
		const grid = readGrid(2, 3);
		assert(grid);
	});
	await t.step("grid with header can be read", async ()=>{
		await createReader(null, {readline : readerFromString(BASIC_GRID_WITH_HEADER_HW)})
		const grid = readGridHW();
		assert(grid);
		console.log(grid);
		assertEquals("A", gridAt(grid, 0, 0));
		assertEquals("B", gridAt(grid, 1, 0));
		assertFalse(gridAt(grid, 2,5));
	});
	await t.step("basic grid has dimensions", async ()=>{
		await createReader(null, {readline : readerFromString(BASIC_GRID)})
		const grid = readGrid(2, 3);
		assertExists(grid.length, "has length");
		assertExists(grid.rows, "has rows");
		assertExists(grid.cols, "has cols");
		assertEquals(2, grid.length);
		assertEquals(2, grid.rows);
		assertEquals(3, grid.cols);
	});
	await t.step("grid access with pos does work", async ()=>{
		await createReader(null, {readline : readerFromString(BASIC_GRID_WITH_HEADER_HW)})
		const grid = readGridHW();
		assertEquals("A", gridAtPos(grid, pos(0, 2)));
		assertEquals("B", gridAtPos(grid, pos(1, 0)));
		assertEquals(undefined, gridAtPos(grid, pos(2, 0)));
		assertEquals(undefined, gridAtPos(grid, pos(0, 3)));
		assertEquals(undefined, gridAtPos(grid, pos(-1, 0)));
	});
	await t.step("gridValid does work", async ()=>{
		await createReader(null, {readline : readerFromString(BASIC_GRID_WITH_HEADER_HW)})
		const grid = readGridHW();
		console.log("grid : ", grid);
		assert(isValid(grid, pos(0, 0)))
		assert(isValid(grid, pos(1, 2)))
		assertFalse(isValid(grid, pos(2, 0)));
		assertFalse(isValid(grid, pos(0, 3)));
		assertFalse(isValid(grid, pos(-1, 0)));
	});
});

Deno.test("positions", async (t) => {
	await t.step("creation", () =>{
		const p = pos(5, 4);
		assertExists(p.col);
		assertExists(p.row);
		assertEquals(4, p.col);
		assertEquals(5, p.row);
	})
	await t.step("xy", () =>{
		const p = pos(5, 4);
		assertExists(p.x);
		assertExists(p.y);
		assertEquals(4, p.x);
		assertEquals(5, p.y);
	})
	await t.step("toString", () =>{
		const p = pos(5, 4);
		assertEquals("pos(x4,y5)", p.toString());

	})
})