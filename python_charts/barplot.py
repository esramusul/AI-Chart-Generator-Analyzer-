import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(12, 6))

if args.x and args.y:
    sns.barplot(data=df, x=args.x, y=args.y, hue=args.group)
    plt.title(f'Bar Plot: {args.y} by {args.x}')
    plt.xticks(rotation=45)
else:
    # Try to find a categorical and a numeric
    cats = df.select_dtypes(include='object').columns
    nums = df.select_dtypes(include='number').columns
    
    if len(cats) > 0 and len(nums) > 0:
        sns.barplot(data=df, x=cats[0], y=nums[0])
        plt.title(f'Bar Plot: {nums[0]} by {cats[0]}')
        plt.xticks(rotation=45)
    else:
        plt.text(0.5, 0.5, 'Need categorical and numeric columns', ha='center')

utils.save_plot(plt, args.output)
