import { math } from "./math.js";
import { assert, assertFalse, assertLess, assertGreaterOrEqual, assertThrows } from "jsr:@std/assert";

const {rndi, range} = math;

Deno.test("random ints", async (t) => {
	for(let max = 1; max < 2; max++){
		await t.step(`rndi ${max}`, () =>{
			const num = rndi(max);
			assert(!Number.isNaN(num), `got NaN ${num}`);
			assert(Number.isInteger(num), `got non integer ${num}`);
			assertLess(num, max);
			assertGreaterOrEqual(num, 0, `rand : ${num} should be less than max ${max}`);
		});
	}
});
Deno.test("ranges", async (t)=>{
	await t.step("basic case : true", ()=>{
		assert(range(1, 0, 2), "1 is in [0, 2]");
		assert(range(1.5, 0, 2), "1.5 is in [0, 2]");
		assert(range(-1, -5, 2), "-1 is in [-5, 2]");
	});
	await t.step("basic case : false", ()=>{
		assertFalse(range(-1, 0, 2), "-1 is NOT in [0, 2]");
		assertFalse(range(1.5, 0, 1), "1.5 is NOT in [0, 1]");
		assertFalse(range(3, -5, 2), "3 is NOT in [-5, 2]");
	});
	await t.step("edge cases", ()=>{
		assert(range(-1, -1, 1), "1 is in [0, 2]");
		assert(range(1.5, 1.5, 1.8), "1.5 is in [0, 2]");
		assert(range(0, 0, 0), "-1 is in [-5, 2]");
	});
	await t.step("throws when badly called", ()=>{
		assertThrows(_=> range(0, 1, 0));
		assertThrows(_=> range());
		assertThrows(_=> range(""));
		assertThrows(_=> range(0, 1, ""));
	});
});