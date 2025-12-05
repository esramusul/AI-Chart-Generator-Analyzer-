import utils
import matplotlib.pyplot as plt
import squarify
import pandas as pd

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(12, 8))

# Need a category and a value
cat_col = args.x
val_col = args.y

if not cat_col:
    cats = df.select_dtypes(include='object').columns
    if len(cats) > 0: cat_col = cats[0]

if not val_col:
    nums = df.select_dtypes(include='number').columns
    if len(nums) > 0: val_col = nums[0]

if cat_col and val_col:
    # aggregate
    df_agg = df.groupby(cat_col)[val_col].sum().reset_index()
    df_agg = df_agg.sort_values(by=val_col, ascending=False).head(20) # Limit to top 20
    
    squarify.plot(sizes=df_agg[val_col], label=df_agg[cat_col], alpha=.8)
    plt.axis('off')
    plt.title(f'Treemap: {val_col} by {cat_col}')
else:
    plt.text(0.5, 0.5, 'Need category and numeric column', ha='center')

utils.save_plot(plt, args.output)
