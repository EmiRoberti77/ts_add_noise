# NoiseGenerator for Cross-Media Measurement (CMM)

This library provides methods to apply **differential privacy** to measurement values (like reach, frequency, impressions) using **Laplace** and **Gaussian noise**.

It is designed for use in Cross-Media Measurement systems where privacy-preserving reporting is critical.

---

## ✨ What Is Differential Privacy?

Differential Privacy (DP) ensures that the inclusion or exclusion of a single individual's data **does not significantly change the outcome** of a computation.

This is achieved by adding carefully calibrated **random noise** to the results. The two most common mechanisms are:

- **Laplace Mechanism** (pure ε-DP)
- **Gaussian Mechanism** (approximate (ε, δ)-DP)

---

## 🔧 Usage in CMM

In **Cross-Media Measurement (CMM)** systems (like those supported by Google, Meta, etc.), noise is added to measurement outputs such as:

- **Unique Reach**
- **Frequency Histograms**
- **Demographic Breakdowns**

This protects user privacy while still allowing aggregate analysis by advertisers and media platforms.

Each result (e.g. reach for Males aged 25–34 on Mobile) may have noise added independently.

---

## 🧮 Laplace Mechanism

### How It Works

Laplace noise is sampled from a distribution centered at zero with `scale = sensitivity / epsilon`.

- **Epsilon (ε)**: Privacy budget (smaller ε → stronger privacy)
- **Sensitivity**: Maximum impact one individual can have on the result

### Formula

```ts
scale = sensitivity / epsilon
noise ~ Laplace(0, scale)
```

### Pros

- Requires only ε (simpler privacy accounting)
- Tighter, less noise for simple count queries

### Cons

- Not well-suited for complex or repeated queries

---

## 🌪️ Gaussian Mechanism

### How It Works

Gaussian noise is sampled from a normal distribution centered at zero with a computed standard deviation (`sigma`) based on ε, δ, and sensitivity.

- **Epsilon (ε)**: Privacy budget
- **Delta (δ)**: Probability of privacy failure (e.g. 1e-5)
- **Sensitivity**: As above

### Formula (Simplified)

```ts
sigma = sqrt(2 * log(1.25 / delta)) * sensitivity / epsilon
noise ~ Gaussian(0, sigma)
```

### Pros

- Better for **composed queries** or when aggregating over many groups
- Often required by CMM specs (e.g., Google's differential privacy framework)

### Cons

- Adds **more noise** than Laplace for the same ε

---

## 📊 Example

```ts
const noisyReach = NoiseGenerator.addNoise(1200, 'laplace', {
  epsilon: 0.5,
  sensitivity: 1,
});

const noisyReachGaussian = NoiseGenerator.addNoise(1200, 'gaussian', {
  epsilon: 0.5,
  delta: 1e-5,
  sensitivity: 1,
});
```

---

## 📦 When to Use What in CMM

| Use Case                                | Recommended Mechanism |
| --------------------------------------- | --------------------- |
| Simple counts (e.g., reach)             | Laplace               |
| Composed queries / histograms           | Gaussian              |
| Privacy compliance (with delta support) | Gaussian              |

---

## 🛡️ Privacy Parameters

| Parameter     | Description                                            |
| ------------- | ------------------------------------------------------ |
| `epsilon`     | Privacy budget; lower = more privacy                   |
| `delta`       | Probability of privacy compromise (used with Gaussian) |
| `sensitivity` | Max effect a single user has on result                 |

---

## ✅ Summary

| Mechanism | Type      | Adds More Noise | Suitable For         |
| --------- | --------- | --------------- | -------------------- |
| Laplace   | ε-DP      | No              | Single count queries |
| Gaussian  | (ε, δ)-DP | Yes             | CMM / multi-query    |

---

## 📁 File Structure

```
/noise
  └── noiseGenerator.ts
README.md
```
