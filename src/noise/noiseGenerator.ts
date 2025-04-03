export type NoiseType = 'laplace' | 'gaussian';

export interface NoiseOptions {
  /**
   * In differential privacy, epsilon is a parameter that controls
   * how much noise you add to your data.
   * Smaller ε (e.g., 0.1) → more noise, stronger privacy
   * Larger ε (e.g., 1.0 or more) → less noise, weaker privacy
   * It quantifies the privacy loss: how much the output of a query can change when
   * a single individual's data is added or removed from the dataset.
   */
  epsilon?: number;

  delta?: number;

  /**
   * Sensitivity is the maximum amount a single individual's data can change the output of a query.
   * Formally, it's defined as: The maximum difference in the query result
   * when you add or remove one individual from the dataset.
   * If one person is added or removed, the count changes by at most 1:
   * sensitivity = 1
   */
  sensitivity?: number;

  sigma?: number;
  scale?: number;
}

export class NoiseGenerator {
  public static addNoise(
    value: number,
    type: NoiseType,
    options: NoiseOptions
  ): number {
    const sensitivity = options.sensitivity ?? 1;
    if (type === 'laplace') {
      const scale = options.scale ?? sensitivity / (options.epsilon || 1);
      console.log('scale', scale);
      const noise = NoiseGenerator.laplaceSample(scale);
      console.log('noise', noise);
      return value + noise;
    } else if (type === 'gaussian') {
      const sigma =
        options.sigma ??
        NoiseGenerator.computeGaussianSigma(
          options.epsilon || 1,
          options.delta || 1e-5,
          sensitivity
        );
      console.log('sigma', sigma);
      const noise = NoiseGenerator.gaussianSample(sigma);
      console.log('noise', noise);
      return value + noise;
    }
    return -1;
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
