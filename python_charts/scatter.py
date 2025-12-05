import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 6))

if args.x and args.y:
    sns.scatterplot(data=df, x=args.x, y=args.y, hue=args.group)
    plt.title(f'Scatter Plot: {args.x} vs {args.y}')
else:
    # Auto-detect if missing
    nums = df.select_dtypes(include='number').columns
    if len(nums) >= 2:
        sns.scatterplot(data=df, x=nums[0], y=nums[1], hue=args.group)
        plt.title(f'Scatter Plot: {nums[0]} vs {nums[1]}')
    else:
        plt.text(0.5, 0.5, 'Need at least 2 numeric columns', ha='center')

utils.save_plot(plt, args.output)
