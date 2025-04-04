import numpy as np
import math

def compute_gaussian_sigma(epsilon: float, delta: float, sensitivity: float) -> float:
    """
    Compute sigma for (ε, δ)-differential privacy using Gaussian mechanism.
    """
    return math.sqrt(2 * math.log(1.25 / delta)) * sensitivity / epsilon

def add_gaussian_noise(value: float, epsilon: float, delta: float, sensitivity: float = 1.0) -> float:
    """
    Adds Gaussian noise to a value for differential privacy.
    """
    sigma = compute_gaussian_sigma(epsilon, delta, sensitivity)
    noise = np.random.normal(loc=0.0, scale=sigma)
    return value + noise

# Simulated CMM reach report (e.g., unique reach per platform or demo group)
reach_report = {
    "YouTube_M_25-34": 1200,
    "Facebook_F_18-24": 950,
    "Instagram_All_35-44": 670
}

# Differential privacy parameters
epsilon = 0.5
delta = 1e-5
sensitivity = 1  # Single user affects reach by max 1

# Noisy report
noisy_report = {}

print("📊 Noisy Reach Report with Gaussian Noise:")
for group, value in reach_report.items():
    noisy_value = add_gaussian_noise(value, epsilon, delta, sensitivity)
    noisy_report[group] = round(noisy_value)
    print(f"{group}: {value} ➜ {noisy_report[group]}")

