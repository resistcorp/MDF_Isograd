function main() {
  const pref = ri();
  const bottles = rpl().map(v => ints(v));
  const norme = pref.map(x => x * x).reduce((v, a) => a + v, 0);

  const BAG = [];
  const numSamples = 1000;
  const keep = 100;
  const currentGeneration = new Array(numSamples).fill().map(_ => randomBlend(bottles.length, 1, 50));
  currentGeneration.forEach(element => {
    element.diff = scoreBottle(bottles, element.blend, pref, norme);
  });
  
  const endTime = performance.now() + 10_000;// 10 sceconds to make it
  let loops = 0;
  while(performance.now() < endTime){
    
    currentGeneration.sort( (a, b) => a.diff - b.diff );
    currentGeneration.slice(keep).forEach(blend => mutate(blend, currentGeneration, bottles.length, keep));
    currentGeneration.forEach(element => {
      element.diff = scoreBottle(bottles, element.blend, pref, norme);
    });

    loop ++;
  }
  
  const best = currentGeneration[0];
  eprintln("expecting a score of", score(best.diff, norme))
  eprintln(`we evaluated ${loops} generations of 10 000 solutions`)

  print(...best.blend);
}

function randomBlend(total, min, max){
 const len = rndI(max, min);
 const blend = new Array(50).fill(0);
 blend.length = len;
 for(let i in blend) blend[i] = rndI(total);
 blend.sort();
 const diff = 10000;
 return {
  blend, diff
 };
}

function mutate(test, best, numBottles, keep){
  const parentA = best[rndI(keep)];
  const parentB = best[rndI(keep)];
  /** @type {[import("../../../tools/basic.js").int]} */
  const blend = test.blend;
  blend.length = 0;

  for(const i in parentA.blend){
    blend.push(take(parentA.blend, parentB.blend, i));
  }

  const mutateChance = rnd();
  if (mutateChance > 0.95 && blend.length > 1)
    blend.splice(rndI(blend.length), 1);
  else if (mutateChance > 0.9 && blend.length < 50)
    blend.splice(rndI(blend.length), 0, rndI(numBottles));

  blend.sort();
}

function take(bA, bB, i){
  if(i%2 && i < bB.length)
    return bB[i];
  return bA[i];
}

function calcDiff(pref, values) {
  if (values.length != pref.length) return Number.MAX_VALUE;
  let ret = 0;
  for (let i in pref) {
    let diff = pref[i] - values[i];
    ret += diff * diff;
  }
  return ret;
}

const SCORE_SCRATCH = new Array(10);
function scoreBottle(bottles, blend, pref, norme) {
  SCORE_SCRATCH.fill(0);
  const len = blend.length;
  // eprintln(`scoring blend ${blend}`);
  for (const idx of blend) {
    const bottle = bottles[idx];
    // eprintln("blending bottle", idx, ":", bottle)
    // eprintln(" into", SCORE_SCRATCH)

    bottle.forEach((v, i) => SCORE_SCRATCH[i] += v / len);
  }
  // eprintln(`values are ${SCORE_SCRATCH}`);
  const diff = calcDiff(pref, SCORE_SCRATCH);
  return diff;
}
function score(diff, norme){
  return (1 - diff / norme) * 1_000_000;
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
const print = (...params) => println(...params); const p = print;
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
const r = () => readline();//reads one line as a string

//specials
const readPrefixedLines = () => rl(pi(r()));//reads an int N, then returns the N next lines
const rpl = readPrefixedLines;

/** @arg {[number]} arr @returns {number} */
const sum = arr => arr.reduce((acc, v) => acc + v, 0);
const floor = Math.floor;
const random = Math.random;
const rnd = (max = 1, min = 0) => min + (random() * max);
const rndi = (max = Number.MAX_SAFE_INTEGER, min = 0) => floor(rnd(max, min));

/** @arg {[T: any]} arr @returns {T} a randomly selected element of arr */
const arrRnd = arr => arr[rndi(arr.lenght)];
const rndarr = arrRnd;
const rndI = rndi;

//ranges
const range = (v, min, max) => ass(min <= max, "min<=max") && v <= max && v >= min;

function ass(val, msg = "assertion failed") {
  if (!val) throw (msg);
  return true;
}


const pi = v => parseInt(v, 10);
const pf = v => parseFloat(v);
const int = pi; const float = pf;
/** @arg {string|[string]} line @returns {[string]} */
const ints = line => typeof line == "string" ? ints(split(line)) : line.map?.(pi) ?? [];
/** @arg {string?} line @arg {string?} splitter @returns {[string]} */
const split = (line, splitter = " ") => line?.split(splitter) ?? [];
const readsplit = (splitter = " ") => split(readline(), splitter);
const readints = (splitter = " ") => readsplit(splitter).map(pi);
const rs = readsplit; const ri = readints;

function createReader(isogradReader, testData) {
  return new Promise((resolve, reject) => {
    if (isogradReader) {
      //the isograd way
      let input = [];
      readline_object.on("line", (value) => input.push(value));
      let index = 0;
      let ret = () => input[index++];
      readline_object.on("close", () => {
        ret.size = input.length;
        resolve(ret);
      });
    } else if (testData) {
      if (testData.println) println = testData.println;
      resolve(testData.readline);
    } else {
      import("../../../tools/debug.js")
        .then(imp => {
          console.log("was able to import debug :", imp);
          let pr = imp.makePrintLn();
          if (pr) println = pr;
          resolve(imp.makeReadline());
        })
        .catch(reject);
    }
  }).then(fn => readline = fn)
    .catch(e => eprintln("could not init", e));
}