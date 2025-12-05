import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(12, 6))

if args.x and args.y:
    sns.lineplot(data=df, x=args.x, y=args.y, hue=args.group)
    plt.title(f'Line Chart: {args.y} over {args.x}')
else:
    nums = df.select_dtypes(include='number').columns
    if len(nums) >= 2:
        sns.lineplot(data=df, x=nums[0], y=nums[1], hue=args.group)
        plt.title(f'Line Chart: {nums[1]} over {nums[0]}')
    else:
         plt.text(0.5, 0.5, 'Need ordered x and numeric y', ha='center')

utils.save_plot(plt, args.output)
