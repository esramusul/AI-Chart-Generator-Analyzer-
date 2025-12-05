import utils
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

args = utils.get_args()
df = utils.load_data(args.input)

# Spider chart typically compares 1 or more entities across variables
# Need standardized data preferably
categories = df.select_dtypes(include='number').columns.tolist()
N = len(categories)

if N > 2:
    # What to plot? First row or average of groups?
    # Let's plot average of the group column if exists, or just the first row
    
    values = []
    labels = []
    
    if args.group:
        grouped = df.groupby(args.group)[categories].mean().reset_index()
        # Take first 3 groups
        for i, row in grouped.head(3).iterrows():
            vals = row[categories].values.flatten().tolist()
            vals += vals[:1]
            values.append(vals)
            labels.append(row[args.group])
    else:
        # Just first row
        vals = df.iloc[0][categories].values.flatten().tolist()
        vals += vals[:1]
        values.append(vals)
        labels.append('Row 1')

    # Angles
    angles = [n / float(N) * 2 * np.pi for n in range(N)]
    angles += angles[:1]
    
    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    
    for i, vals in enumerate(values):
        ax.plot(angles, vals, linewidth=1, linestyle='solid', label=labels[i])
        ax.fill(angles, vals, alpha=0.1)
    
    plt.xticks(angles[:-1], categories)
    plt.title('Spider Chart')
    plt.legend(loc='upper right', bbox_to_anchor=(0.1, 0.1))
    
else:
    fig = plt.figure()
    plt.text(0.5, 0.5, 'Need at least 3 numeric variables', ha='center')

utils.save_plot(plt, args.output)
