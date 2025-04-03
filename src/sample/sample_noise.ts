// noise.ts

export type NoiseType = 'laplace' | 'gaussian';

export interface NoiseOptions {
  epsilon?: number; // Privacy budget for Laplace
  delta?: number; // Only needed for Gaussian
  sensitivity?: number; // How much a single record can change the result
  sigma?: number; // For Gaussian if already known
  scale?: number; // For Laplace if already known
}

export class NoiseGenerator {
  static addNoise(
    value: number,
    type: NoiseType,
    options: NoiseOptions
  ): number {
    const sensitivity = options.sensitivity ?? 1;

    if (type === 'laplace') {
      const scale = options.scale ?? sensitivity / (options.epsilon || 1);
      const noise = NoiseGenerator.laplaceSample(scale);
      return value + noise;
    } else if (type === 'gaussian') {
      const sigma =
        options.sigma ??
        NoiseGenerator.computeGaussianSigma(
          options.epsilon || 1,
          options.delta || 1e-5,
          sensitivity
        );
      const noise = NoiseGenerator.gaussianSample(sigma);
      return value + noise;
    } else {
      throw new Error(`Unsupported noise type: ${type}`);
    }
  }

  private static laplaceSample(scale: number): number {
    const u = Math.random() - 0.5;
    return -scale * Math.sign(u) * Math.log(1 - 2 * Math.abs(u));
  }

  private static gaussianSample(sigma: number): number {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return sigma * z;
  }

  private static computeGaussianSigma(
    epsilon: number,
    delta: number,
    sensitivity: number
  ): number {
    // Very simplified approximation; real systems use tighter bounds
    return (Math.sqrt(2 * Math.log(1.25 / delta)) * sensitivity) / epsilon;
  }
}
