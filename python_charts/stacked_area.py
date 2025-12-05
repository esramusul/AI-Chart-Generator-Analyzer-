import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(12, 6))

if args.x and args.y and args.group:
    # Pivot needed: X as index, Group as Cols, Y as Values
    pivot = df.pivot_table(index=args.x, columns=args.group, values=args.y, aggfunc='sum').fillna(0)
    plt.stackplot(pivot.index, pivot.T.values, labels=pivot.columns)
    plt.legend(loc='upper left')
    plt.title(f'Stacked Area: {args.y} by {args.group}')
else:
    plt.text(0.5, 0.5, 'Need X, Y and Group columns', ha='center')

utils.save_plot(plt, args.output)
