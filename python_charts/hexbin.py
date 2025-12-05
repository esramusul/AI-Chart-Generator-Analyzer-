import utils
import matplotlib.pyplot as plt

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 8))

if args.x and args.y:
    # Standard hexbin plot of X vs Y
    hb = plt.hexbin(df[args.x], df[args.y], gridsize=50, cmap='inferno')
    plt.colorbar(hb, label='Count')
    plt.title(f'Hexbin Map/Plot: {args.y} vs {args.x}')
else:
    plt.text(0.5, 0.5, 'Need X and Y columns', ha='center')

utils.save_plot(plt, args.output)
