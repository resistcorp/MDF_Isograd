import { assertEquals } from "jsr:@std/assert";
import basic from "./basic.js";

const {lines} = basic;

export function makeReadline(){
	const folder = Deno.args[0];
	const inputName = Deno.args[1];
	console.log(`reading input ${folder} from folder ${inputName}`);
	const lines = Deno.readTextFileSync(`${folder}\\input${inputName}.txt`).split(" ");
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
	const lines = Deno.readTextFileSync(`${folder}\\output${inputName}.txt`).split(" ");
	return printerFromLines(lines);
}

export function printerFromLines(lines) {
  let indexIn = 0;
  return (...parts) => {
    const line = parts.join(" ");
    const expected = lines[indexIn++];
    console.log("printing ", line);
    assertEquals(expected, line, `wrong ${indexIn}th line : ${line} (expected ${expected})`);
    console.log(line);
  };
}
