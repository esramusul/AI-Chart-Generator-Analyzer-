import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 6))

if args.y and args.x:
    sns.violinplot(data=df, x=args.x, y=args.y)
    plt.title(f'Violin Plot: {args.y} by {args.x}')
elif args.y:
     sns.violinplot(data=df, y=args.y)
     plt.title(f'Violin Plot of {args.y}')
else:
    nums = df.select_dtypes(include='number').columns
    if len(nums) > 0:
         sns.violinplot(data=df, y=nums[0])
         plt.title(f'Violin Plot of {nums[0]}')

utils.save_plot(plt, args.output)
