import utils
import matplotlib.pyplot as plt
from pandas.plotting import parallel_coordinates

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(12, 6))

group_col = args.group
if not group_col:
    cats = df.select_dtypes(include='object').columns
    if len(cats) > 0: group_col = cats[0]

# Filter numeric columns + group
nums = df.select_dtypes(include='number').columns.tolist()

if group_col and len(nums) > 1:
    cols = [group_col] + nums[:5] # limit to 5 vars
    subset = df[cols].dropna()
    parallel_coordinates(subset, group_col, colormap=plt.get_cmap("Set2"))
    plt.title('Parallel Coordinates')
else:
    plt.text(0.5, 0.5, 'Need group and multiple numeric columns', ha='center')

utils.save_plot(plt, args.output)
