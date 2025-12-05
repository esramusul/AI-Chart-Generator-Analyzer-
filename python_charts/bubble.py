import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 8))

# Needs X, Y and Size
if args.x and args.y:
    sz = args.size
    if not sz:
         # Try to find a 3rd numeric column
        nums = df.select_dtypes(include='number').columns
        for n in nums:
             if n != args.x and n != args.y:
                 sz = n
                 break
    
    sns.scatterplot(data=df, x=args.x, y=args.y, size=sz, sizes=(20, 200), legend='full', alpha=0.7)
    plt.title(f'Bubble Plot: {args.x} vs {args.y} (Size: {sz or "None"})')
else:
    plt.text(0.5, 0.5, 'Need X and Y columns', ha='center')

utils.save_plot(plt, args.output)
