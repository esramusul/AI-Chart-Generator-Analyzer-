import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 8))

if args.x and args.y:
    sns.kdeplot(data=df, x=args.x, y=args.y, fill=True, cmap="Blues", thresh=0.05)
    plt.title(f'2D Density: {args.y} vs {args.x}')
else:
    nums = df.select_dtypes(include='number').columns
    if len(nums) >= 2:
         sns.kdeplot(data=df, x=nums[0], y=nums[1], fill=True, cmap="Blues")
         plt.title(f'2D Density: {nums[1]} vs {nums[0]}')
    else:
         plt.text(0.5, 0.5, 'Need 2 numeric columns', ha='center')

utils.save_plot(plt, args.output)
