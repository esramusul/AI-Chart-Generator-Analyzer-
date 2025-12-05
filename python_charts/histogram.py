import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 6))

# Determine column to plot
col = args.x
if not col and len(df.columns) > 0:
    col = df.select_dtypes(include='number').columns[0]

if col:
    sns.histplot(data=df, x=col, kde=True)
    plt.title(f'Histogram of {col}')
else:
    plt.text(0.5, 0.5, 'No suitable numeric column found', ha='center')

utils.save_plot(plt, args.output)
