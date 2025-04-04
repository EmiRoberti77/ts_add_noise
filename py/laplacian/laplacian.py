import numpy as np
sensitivity=1.00
epsilon=0.5
b=sensitivity/epsilon
n=2000 #number of individuals
noise = np.random.laplace(0,b,n)
print(noise)