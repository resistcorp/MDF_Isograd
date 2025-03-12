
function genetic(createFn, scoreFn, mateFn) {
  const numSamples = 1000;
  const keep = 100;
  const time = 10_900;

  const population = new Array(numSamples).fill().map(createFn).map(value => {
    return { value, fitness: scoreFn(value) };
  });

  const endTime = performance.now() + time;
  let loops = 0;
  while (performance.now() < endTime) {

    population.slice(keep).forEach((element) => {
      const parentA = population[rndI(keep)].value;
      const parentB = population[rndI(keep)].value;

      mateFn(element.value, parentA, parentB);
    });
    population.forEach(element => {
      element.fitness = scoreFn(element.value);
    });
    population.sort((a, b) => a.fitness - b.fitness);

    loops++;
  }
  eprintln(`we evaluated ${loops} generations of ${numSamples} solutions`);
  return population;
}
