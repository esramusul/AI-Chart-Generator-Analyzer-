import utils
import matplotlib.pyplot as plt
import networkx as nx

args = utils.get_args()
df = utils.load_data(args.input)

plt.figure(figsize=(10, 8))

# Expects 'source', 'target' columns
cols = df.columns
if len(cols) >= 2:
    src, tgt = cols[0], cols[1]
    G = nx.from_pandas_edgelist(df, source=src, target=tgt)
    pos = nx.spring_layout(G)
    nx.draw(G, pos, with_labels=True, node_color='lightblue', edge_color='gray')
    plt.title('Network Diagram')
else:
    plt.text(0.5, 0.5, 'Need Source and Target columns', ha='center')

utils.save_plot(plt, args.output)
