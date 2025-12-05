import utils
import matplotlib.pyplot as plt

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 6))

if args.x and args.y:
    plt.fill_between(df[args.x], df[args.y], color="skyblue", alpha=0.4)
    plt.plot(df[args.x], df[args.y], color="Slateblue", alpha=0.6, linewidth=2)
    plt.title(f'Area Chart: {args.y}')
    plt.xlabel(args.x)
    plt.ylabel(args.y)
else:
     nums = df.select_dtypes(include='number').columns
     if len(nums) > 0:
         plt.fill_between(range(len(df)), df[nums[0]], color="skyblue", alpha=0.4)
         plt.plot(range(len(df)), df[nums[0]], color="Slateblue", alpha=0.6)
         plt.title(f'Area Chart: {nums[0]}')

utils.save_plot(plt, args.output)
