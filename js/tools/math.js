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

//ranges
const range = (v, min, max) => ass(min<=max, "min<=max")&&v <=max && v >= min;

function ass(val, msg = "assertion failed"){
	if(!val) throw(msg);
	return true;
}

//////////////////////////////////////////////////////////////////////////////
///don't copy-paste after this
export default { sum, floor, random, rnd, rndi, rndarr, arrRnd, rndI, range };