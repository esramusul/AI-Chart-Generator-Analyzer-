import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 8))

# Need Cat and Num
cat = args.x
val = args.y

if not cat:
     cats = df.select_dtypes(include='object').columns
     if len(cats) > 0: cat = cats[0]
if not val:
     nums = df.select_dtypes(include='number').columns
     if len(nums) > 0: val = nums[0]

if cat and val:
    # Limit to top 20
    sub = df.groupby(cat)[val].mean().sort_values(ascending=True).tail(20)
    
    plt.hlines(y=sub.index, xmin=0, xmax=sub.values, color='skyblue')
    plt.plot(sub.values, sub.index, "o")
    plt.title(f'Lollipop Chart: {val} by {cat}')
    plt.xlabel(val)
else:
    plt.text(0.5, 0.5, 'Need Numeric and Categorical columns', ha='center')

utils.save_plot(plt, args.output)
