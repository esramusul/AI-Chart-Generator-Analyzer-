import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 6))

col = args.x
if not col:
     col = df.select_dtypes(include='number').columns[0]

if col:
    sns.kdeplot(data=df, x=col, fill=True, alpha=0.5)
    plt.title(f'Density Plot of {col}')
else:
    plt.text(0.5, 0.5, 'No numeric column found', ha='center')

utils.save_plot(plt, args.output)
