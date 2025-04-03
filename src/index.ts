import { LINE } from './constants';
import { NoiseGenerator } from './noise/noiseGenerator';

const trueReach = 1200;

function main() {
  console.log('laplace noise');
  for (let i = 0; i < 5; i++) {
    console.log(LINE);
    const laplaceReach = NoiseGenerator.addNoise(trueReach, 'laplace', {
      epsilon: 0.9,
      sensitivity: 1,
    });
    console.log('laplaceReach', laplaceReach, 'trueReach', trueReach);
  }

  console.log('gaussian noise');
  for (let i = 0; i < 5; i++) {
    console.log(LINE);
    const gaussianReach = NoiseGenerator.addNoise(trueReach, 'gaussian', {
      epsilon: 1,
      delta: 1e-5,
      sensitivity: 1,
    });
    console.log('gaussianReach', gaussianReach, 'trueReach', trueReach);
  }
}

main();
