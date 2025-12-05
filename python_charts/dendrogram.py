import utils
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.cluster.hierarchy import dendrogram, linkage

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 7))

# Dendrogram requires numerical matrix
nums = df.select_dtypes(include='number')
nums = nums.dropna()

if len(nums.columns) >= 2 and len(nums) > 1:
    # Limit rows for readability
    sample = nums.head(50)
    
    Z = linkage(sample, 'ward')
    dendrogram(Z, labels=sample.index, leaf_rotation=90)
    plt.title('Hierarchical Clustering Dendrogram')
else:
    plt.text(0.5, 0.5, 'Need numerical matrix > 2 cols', ha='center')

utils.save_plot(plt, args.output)
