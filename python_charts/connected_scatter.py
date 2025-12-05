import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 6))

if args.x and args.y:
    # Plot points and line
    plt.plot(df[args.x], df[args.y], marker='o', linestyle='-')
    plt.xlabel(args.x)
    plt.ylabel(args.y)
    plt.title(f'Connected Scatter: {args.y} vs {args.x}')
else:
    plt.text(0.5, 0.5, 'Need X and Y columns', ha='center')

utils.save_plot(plt, args.output)
