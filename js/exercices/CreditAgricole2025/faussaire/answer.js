const startTime = performance.now();

function main(){
    let best = -1;
    let bestDiff = Number.MAX_VALUE;

    const pref = ri();
		const norme = squares(pref);
		err(`norme = ${norme}`);
    const bottles = rpl().map((line, i)=>{
			// err(`checking bottle ${i} : ${line}`);
			let values = ints(line);
			let diff = calcDiff(pref, values);
			if (diff <= bestDiff){
					bestDiff = diff;
					best = i;
			}
			return values;
    });

		let guess = new Array(50).fill(best);
		// eprintln(`score pour meilleure bouteille : ${scoreMelange(pref, bottles[best], norme)}`);
		// eprintln(`score pour guess stupide : ${scoreGuess(pref, guess, bottles, norme)}`);

		const endTime = startTime + 1000.0;
		do{
			guess = refine(guess, bottles, pref, norme, 50 * 10);
		}while(performance.now() < endTime);
    
    print(...guess);
}

function refine(guess, bottles, pref, norme, tests = 1000){
	const bestguess = [...guess];
	const len = bestguess.length;
	const bestScore = scoreGuess(pref, guess, bottles, norme);
	for(let i = 0; i < tests; i++){
		const index = i%len;
		const prev = bestguess[index];
		const toTest = rndi(bottles.length);
		bestguess[index] = toTest;

		const score = scoreGuess(pref, bestguess, bottles, norme);

		if(score <= bestScore)
			bestguess[index] = prev;

	}
	return bestguess;
}

function squares(ints) {
	return sum(ints.map(v => v*v));
}

function melange(guess, bottles){
	const bottle = new Array(10).fill(0);
	guess.forEach(b => {
		bottles[b].forEach((v, i) => bottle[i] += v);
	});
	const len = guess.length;
	return bottle.map(v => v / len);
}

function scoreGuess(pref, guess, bottles, norme){
	const bottle = melange(guess, bottles);
	return scoreMelange(pref, bottle, norme);
}

function scoreMelange(pref, bottle, norme){
	const ecart = calcDiff(pref, bottle);

	return (1 - ecart / norme) * 1_000_000;
}

function calcDiff(pref, values){
    if(values.length != pref.length) return Number.MAX_VALUE;
    let ret = 0;
    for(let i in pref){
        let diff = pref[i] - values[i];
        ret += diff * diff;
    }
    return ret;
}

// this line plugs-in the tools. Call your main function main (or replace main with your main func name ^^)
// readline() (or rl(1) or r()) is different when running
//  - in isograd 
//  - and in vscode
var readline_object;//<<redefine their weird thing
createReader(readline_object).then(main);

/** @arg {[number]} arr @returns {number} */
const sum = arr => arr.reduce((acc, v ) => acc + v, 0);
const floor = Math.floor;
const random = Math.random;
const rnd = (max = 1, min = 0) => min + (random() * max);
const rndi = (max = Number.MAX_SAFE_INTEGER, min = 0) => floor(rnd(max, min));

/** @arg {[T: any]} arr @returns {T} a randomly selected element of arr */
const arrRnd = arr => arr[rndi(arr.lenght)];
const rndarr = arrRnd;
const rndI = rndi;

//printing aliases
let println = (...params) => console.log(...params);//<<overwritten in vscode
const eprintln = (...params) => console.error(...params);
const print = (...params)=>println(params); const p = print;
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

function createReader(isogradReader){
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
		}else{
			import("../../../tools/debug.js")
			.then(imp => {
				console.log("was able to import debug :", imp);
				println = imp.makePrintLn();
				resolve(imp.makeReadline());
			})
			.catch(reject);
		}
	}).then(fn => readline = fn)
		.catch(e => eprintln("could not init", e));
}