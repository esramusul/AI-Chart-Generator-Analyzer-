import utils
import matplotlib.pyplot as plt
import seaborn as sns

# Streamgraph is tricky in pure matplotlib without baseline correction
# We will do a generic Stackplot (Baseline=sym) if possible, or just standard stackplot

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(12, 6))

if args.x and args.y and args.group:
    pivot = df.pivot_table(index=args.x, columns=args.group, values=args.y, aggfunc='sum').fillna(0)
    plt.stackplot(pivot.index, pivot.T.values, labels=pivot.columns, baseline='sym')
    plt.legend(loc='upper left')
    plt.title(f'Streamgraph (Symmetric): {args.y} by {args.group}')
else:
    plt.text(0.5, 0.5, 'Need X, Y and Group columns', ha='center')

utils.save_plot(plt, args.output)
