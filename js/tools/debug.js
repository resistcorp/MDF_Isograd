import { assertEquals } from "jsr:@std/assert";
import basic from "./basic.js";

const {lines, eprintln} = basic;
const importTime = performance.now();

export function makeReadline(){
	const folder = Deno.args[0];
	const inputName = Deno.args[1];
	console.log(`reading input ${folder} from folder ${inputName}`);
	const lines = Deno.readTextFileSync(`${folder}\\input${inputName}.txt`).split("\n");
	return readerFromLines(lines);
}

export function readerFromLines(lines) {
  let indexIn = 0;
  return () => lines[indexIn++];
}
export const readerFromString = str => readerFromLines(lines(str));

export function makePrintLn(){
	const folder = Deno.args[0];
	const inputName = Deno.args[1];
	console.log(`preparing outputs ${folder} from folder ${inputName}`);
	try{
		const lines = Deno.readTextFileSync(`${folder}\\output${inputName}.txt`).split("\n");
		return printerFromLines(lines);
	}catch(e){
		console.error("no output file to compare. Will just run");
	}
}

export function printerFromLines(lines) {
  let indexIn = 0;
  return (...parts) => {
    const line = parts.join(" ");
    const expected = lines[indexIn++];
    console.log("printing ", line);
		if(expected != line)
			eprintln(`unexpected ${indexIn}th line : ${line} (expected ${expected})`);
    console.log(line);
		if(indexIn >= lines.length){
			eprintln("printed last line after", performance.now() - importTime, "ms");
		}
  };
}
