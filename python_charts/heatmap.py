import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 8))

# Heatmaps usually need a matrix (pivot table) or correlation matrix
# If data is raw, we might correlate it
numeric_df = df.select_dtypes(include='number')

if not numeric_df.empty:
    corr = numeric_df.corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm')
    plt.title('Correlation Heatmap')
else:
    plt.text(0.5, 0.5, 'No numeric columns for correlation', ha='center')

utils.save_plot(plt, args.output)
