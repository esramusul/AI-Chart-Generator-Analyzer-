import utils
import matplotlib.pyplot as plt

# Chord diagrams are very hard in matplotlib.
# We will draw a simple circle with connections placeholder.

args = utils.get_args()
plt.figure(figsize=(8, 8))
ax = plt.subplot(111, polar=True)
plt.title('Chord Diagram (Placeholder)')
plt.text(0.5, 0.5, 'Chord diagrams require advanced libraries\nlike Chord or Plotly', ha='center')
ax.axis('off')

utils.save_plot(plt, args.output)
