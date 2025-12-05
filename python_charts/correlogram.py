import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

# Pairplot requires numeric columns
nums = df.select_dtypes(include='number').columns

if len(nums) >= 2:
    sns.pairplot(df[nums])
    # Pairplot creates its own figure, so we need to save the current figure
    # Note: save_plot uses plt.savefig, which saves the current figure.
    # Seaborn PairGrid is figure-level.
else:
    plt.figure()
    plt.text(0.5, 0.5, 'Need at least 2 numeric columns', ha='center')

utils.save_plot(plt, args.output)
