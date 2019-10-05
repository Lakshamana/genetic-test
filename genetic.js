const OPTIMAL = 'Hello'
const POPSIZE = 100

// 60~70% mutation probability is good
const MUTATION_PROBABILITY = 0.7

// generators
const code = char => char.charCodeAt(0)

const rand = (min, max) => min + Math.ceil(Math.random() * (max - min))

const randChar = () => String.fromCharCode(rand(41, 126))

function generate(length, father, cb) {
  return Array.from({ length }, () => cb(father))
}

function generateOffspring(father) {
  return generate(POPSIZE, father, father => {
    father = crossover(father)
    const mutationRand = Math.random()
    if (mutationRand <= MUTATION_PROBABILITY) {
      father = mutation(father)
    }
    return father
  })
}

// console.log(generateOffspring('father'))

// mutation
function mutationCallback(idx, chr) {
  return chr.substring(0, idx) + randChar() + chr.substring(idx + 1, chr.length)
}

function mutation(chr, cb) {
  const idx = rand(0, chr.length - 1)
  return cb ? cb(idx, chr) : mutationCallback(idx, chr)
}

// console.log(mutation('ada.65465.%$#%$#.jkjhk'))

// crossover
function crossoverCallback(idx, chr) {
  let s = ''
  const chunkPoints = [0, Math.floor(idx / 2), idx + 1, chr.length]
  const pl = pairs(chunkPoints)
  const chunks = [pl[2], pl[1], pl[0]]
  for (const chk of chunks) {
    s += chr.substring(chk[0], chk[1])
  }
  return s
}

function crossover(chr, cb) {
  const idx = rand(1, chr.length - 2)
  return cb ? cb(idx, chr) : crossoverCallback(idx, chr)
}

function pairs(l) {
  const p = l.map((v, i) => l[i + 1] && [v, l[i + 1]])
  p.pop()
  return p
}

// console.log(Array.from({length: 25}, () => crossover(OPTIMAL)))


// fitness evaluation must 'help' too
function fitness(chr) {
  let r = 0
  for (const i in chr) {
    r += Math.abs(code(chr[i]) - code(OPTIMAL[i]))
  }
  return 1 / r
}

/**
 * 
 * @param {Array} population
 * @returns {Array} population's best fitness individual
 */
function getBestFitness(population) {
  // const fitnesses = population.map(i => ({
  //   value: i,
  //   fitness: fitness(i)
  // }))
  // console.log(fitnesses.filter(f => f.fitness > 0))
  return population.sort((a, b) => fitness(b) - fitness(a))[0]
}

let fatherChr = generate(OPTIMAL.length, null, () => randChar()).join('')

// console.log('Father:', fatherChr)
// console.log(generateOffspring(fatherChr))
// console.log(getBestFitness(generateOffspring(fatherChr)), fitness(fatherChr))
let generation = 0
while (fatherChr !== OPTIMAL) {
  const offspring = generateOffspring(fatherChr)
  fatherChr = getBestFitness(offspring)
  
  if (generation % 100 === 0) {
    console.log(`Generation ${generation} best fit:`, fatherChr)
    console.log('Fitness:', fitness(fatherChr))
  } 
  generation++
}
console.log('Optimal found at generation', generation, ':', fatherChr)
