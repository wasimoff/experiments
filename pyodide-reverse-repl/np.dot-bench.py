import matplotlib.pyplot as plt
import numpy as np
from timeit import timeit

def dots(n):
  A, B = np.random.random((n, n)), np.random.random((n, n))
  return timeit(lambda: np.dot(A, B), number=10) / 10.0

# use to benchmark 100 .. 2000:
# { n: dots(n) for n in list(range(100, 2001, 100)) }

# OMP_NUM_THREADS=1 python 3.11.2
python_omp1 = { 100: 0.0001502331011579372, 200: 0.0007899609991000034, 300: 0.002007135399617255, 400: 0.0020066512006451376, 500: 0.00394393559981836, 600: 0.007412322401069105, 700: 0.011468904899084009, 800: 0.017456347899860704, 900: 0.026917069499904755, 1000: 0.03628311630018288, 1100: 0.048925385701295454, 1200: 0.06279168930050219, 1300: 0.07816772899968782, 1400: 0.09405990649975138, 1500: 0.11263103860110277, 1600: 0.1395792847004486, 1700: 0.17810903079953277, 1800: 0.19652771359978943, 1900: 0.2279702150000958, 2000: 0.26743650419957704 }

# python 3.11.2 (no OMP_NUM_THREADS restriction)
python = { 100: 0.0007520419996581041, 200: 0.003450069800601341, 300: 0.0006215843997779303, 400: 0.0008140639009070582, 500: 0.001698018600291107, 600: 0.0025901556000462733, 700: 0.0047947326995199544, 800: 0.006300078499771189, 900: 0.009389655399718321, 1000: 0.012756639599683695, 1100: 0.01668511880125152, 1200: 0.02086473330127774, 1300: 0.02804810060042655, 1400: 0.03677294879889814, 1500: 0.04338117270090151, 1600: 0.046600544100510885, 1700: 0.05573021820018766, 1800: 0.07120616379979765, 1900: 0.07788907510112039, 2000: 0.09739211209962377 }
python_2 = { 100: 0.0002246770993224345, 200: 0.001717799600737635, 300: 0.00045616560091730205, 400: 0.0009495650010649115, 500: 0.0017405778999091126, 600: 0.0023777057009283452, 700: 0.004004787300073076, 800: 0.007954248700116295, 900: 0.009610922999854665, 1000: 0.01368287069926737, 1100: 0.017091372299182693, 1200: 0.020722160399600398, 1300: 0.02793263769999612, 1400: 0.03551008399954299, 1500: 0.04361315779970028, 1600: 0.049063075699086765, 1700: 0.05765598500001943, 1800: 0.06928855040023336, 1900: 0.0768136702987249, 2000: 0.0990556741002365 }

# pyodide v0.27.5 in Firefox 138.0.1
firefox = { 100: 0.0011999999999943612, 200: 0.005399999999997363, 300: 0.017200000000002547, 400: 0.03589999999999236, 500: 0.06580000000000155, 600: 0.12889999999999874, 700: 0.184699999999998, 800: 0.4506999999999948, 900: 0.5989000000000033, 1000: 0.9233000000000061, 1100: 1.9017000000000053, 1200: 4.081000000000006, 1300: 3.8198999999999956, 1400: 4.3275000000000095, 1500: 6.600499999999988, 1600: 11.624700000000008, 1700: 10.943900000000008, 1800: 13.027500000000009, 1900: 15.3875, 2000: 32.315999999999995 }

# pyodide v0.27.5 in Chrome 136.0.7103.93
chrome = { 100: 0.0012500000000001065, 200: 0.009179999900000091, 300: 0.02073999999999998, 400: 0.03529, 500: 0.07382000000000008, 600: 0.14501000009999993, 700: 0.24261000000000016, 800: 0.6268799999999999, 900: 0.7120399999999997, 1000: 1.0840900001000002, 1100: 1.8569099998999996, 1200: 3.78292, 1300: 3.91755, 1400: 5.2884700001, 1500: 13.312700000000001, 1600: 18.39855, 1700: 24.336540000000003, 1800: 21.279530000000012, 1900: 24.418959999900018, 2000: 49.7840699999 }


# Extract the data for plotting
n_values = list(python_omp1.keys())
times_omp1 = list(python_omp1.values())
times_python = list(python.values())
times_python_2 = list(python_2.values())
times_firefox = list(firefox.values())
times_chrome = list(chrome.values())

# Plot the actual time data
def plot_data():
  plt.figure(figsize=(12, 8))
  plt.plot(n_values, times_omp1, marker="o", linestyle="-", label="Python 3.11.2 (OMP_NUM_THREADS=1)")
  plt.plot(n_values, times_python, marker="s", linestyle="-", label="Python 3.11.2")
  plt.plot(n_values, times_python_2, marker="s", linestyle="-", label="Python 3.11.2")
  plt.plot(n_values, times_firefox, marker="^", linestyle="-", label="Pyodide v0.27.5, Firefox 138.0.1")
  plt.plot(n_values, times_chrome, marker="d", linestyle="-", label="Pyodide v0.27.5, Chrome 136.0.7103.93")
  plt.yscale("log")
  plt.title("benchmark of np.dots with two random NxN matrices")
  plt.xlabel("N")
  plt.xticks(n_values)
  plt.ylabel("time (seconds)")
  plt.legend()
  plt.grid(True)
  plt.show()

relative_baseline = [ 1 for n in n_values ]
relative_omp1 = [python_omp1[n] / python[n] for n in n_values]
relative_firefox = [firefox[n] / python[n] for n in n_values]
relative_chrome = [chrome[n] / python[n] for n in n_values]

# plot relative runtime factors
def plot_relative():
  plt.figure(figsize=(12, 8))
  plt.plot(n_values, relative_omp1, marker="o", linestyle="-", label="Python 3.11.2 (OMP_NUM_THREADS=1)")
  plt.plot(n_values, relative_baseline, marker="s", linestyle="-", label="Python 3.11.2")
  plt.plot(n_values, relative_firefox, marker="^", linestyle="-", label="Pyodide v0.27.5, Firefox 138.0.1")
  plt.plot(n_values, relative_chrome, marker="d", linestyle="-", label="Pyodide v0.27.5, Chrome 136.0.7103.93")
  plt.xticks(n_values)
  plt.yscale("log")
  plt.title("normalized runtime of np.dots with random NxN matrices")
  plt.xlabel("N")
  plt.ylabel("relative factor")
  plt.legend()
  plt.grid(True)
  plt.show()

plot_data()
plot_relative()
