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

export const math = { sum, floor, random, rnd, rndi, rndarr, arrRnd, rndI };

///don't copy-paste
export default { sum, floor, random, rnd, rndi, rndarr, arrRnd, rndI };