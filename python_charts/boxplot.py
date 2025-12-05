import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 6))

if args.y:
    # x can be group
    sns.boxplot(data=df, x=args.x, y=args.y)
    plt.title(f'Box Plot of {args.y}')
else:
    nums = df.select_dtypes(include='number').columns
    if len(nums) > 0:
        sns.boxplot(data=df, y=nums[0], x=args.x)
        plt.title(f'Box Plot of {nums[0]}')

utils.save_plot(plt, args.output)
