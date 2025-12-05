import utils
import matplotlib.pyplot as plt

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(12, 6))
# Nodes on a line, arcs between them.
# Simple mock:

plt.plot([1, 2, 3, 4], [0, 0, 0, 0], 'o')
# Draw arcs
import numpy as np
t = np.linspace(0, np.pi, 100)
plt.plot(1 + 0.5 + 0.5*np.cos(t), 0.5*np.sin(t), 'b-') # Arc 1-2
plt.plot(2 + 1 + 1*np.cos(t), 1*np.sin(t), 'b-') # Arc 2-4

plt.title('Arc Diagram (Mock)')
plt.yticks([])

utils.save_plot(plt, args.output)
