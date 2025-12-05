import utils
import matplotlib.pyplot as plt
import seaborn as sns

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(8, 8))

# Same logic as pie but with hole
cat_col = args.x
val_col = args.y

if not cat_col:
    cats = df.select_dtypes(include='object').columns
    if len(cats) > 0: cat_col = cats[0]

if not val_col:
    nums = df.select_dtypes(include='number').columns
    if len(nums) > 0: val_col = nums[0]

if cat_col and val_col:
    data_agg = df.groupby(cat_col)[val_col].sum()
    plt.pie(data_agg, labels=data_agg.index, autopct='%1.1f%%', wedgeprops=dict(width=0.5))
    plt.title(f'Doughnut Chart: {val_col} by {cat_col}')
else:
    plt.text(0.5, 0.5, 'Need categorical and numeric column', ha='center')

utils.save_plot(plt, args.output)
