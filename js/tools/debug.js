import { assertEquals } from "jsr:@std/assert";

const folder = Deno.args[0];
const inputName = Deno.args[1];
console.log(`reading input ${folder} from folder ${inputName}`);


export function makeReadline(){
	const lines = Deno.readTextFileSync(`${folder}\\input${inputName}.txt`).split(" ");
	let indexIn = 0;
	return ()=>lines[indexIn++];
}

export function makePrintLn(){
	const lines = Deno.readTextFileSync(`${folder}\\output${inputName}.txt`).split(" ");
	let indexIn = 0;
	return (...parts)=>{
		const line = parts.join(" ");
  	const expected = lines[indexIn++];
		console.log("printing ", line);
		assertEquals(expected, line, `wrong ${indexIn}th line : ${line} (expected ${expected})`);
		console.log(line)
	}

}
