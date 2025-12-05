import utils
import matplotlib.pyplot as plt
import geopandas as gpd

args = utils.get_args()
# For demonstration, we'll assume 'geopandas' and a world map dataset are available
# or just plot points on a blank canvas if no shapefile provided.

plt.figure(figsize=(12, 8))

try:
    world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))
    world.plot(ax=plt.gca(), color='lightgrey')
    plt.title('Background Map')
except Exception as e:
    plt.text(0.5, 0.5, 'GeoPandas/Map Data not available', ha='center')
    print(f"Map error: {e}")

utils.save_plot(plt, args.output)
