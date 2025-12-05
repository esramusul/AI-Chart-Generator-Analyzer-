import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(8, 8))

if args.x and args.y:
    # x: categorical/labels, y: numeric/values
    # Aggregation might be needed if multiple rows per category
    data_agg = df.groupby(args.x)[args.y].sum()
    plt.pie(data_agg, labels=data_agg.index, autopct='%1.1f%%')
    plt.title(f'Pie Chart: {args.y} by {args.x}')
else:
    cats = df.select_dtypes(include='object').columns
    nums = df.select_dtypes(include='number').columns
    if len(cats) > 0 and len(nums) > 0:
        data_agg = df.groupby(cats[0])[nums[0]].sum()
        plt.pie(data_agg, labels=data_agg.index, autopct='%1.1f%%')
        plt.title(f'Pie Chart: {nums[0]} by {cats[0]}')
    else:
        plt.text(0.5, 0.5, 'Need categorical and numeric columns', ha='center')

utils.save_plot(plt, args.output)
