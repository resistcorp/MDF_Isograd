import { math } from "./math.js";
import { assert, assertLess, assertGreaterOrEqual } from "jsr:@std/assert";

Deno.test("random ints", async (t) => {
	for(let max = 1; max < 2; max++){
		await t.step(`rndi ${max}`, () =>{
			const num = math.rndi(max);
			assert(!Number.isNaN(num), `got NaN ${num}`);
			assert(Number.isInteger(num), `got non integer ${num}`);
			assertLess(num, max);
			assertGreaterOrEqual(num, 0, `rand : ${num} should be less than max ${max}`);
		});
	}
});

let val = math.rndi(15);
console.log(val);