import utils
import matplotlib.pyplot as plt
import geopandas as gpd

args = utils.get_args()

plt.figure(figsize=(12, 8))

try:
    world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))
    world.plot(ax=plt.gca(), color='lightgrey')
    
    df = utils.load_data(args.input)
    # Expect lat, lon, size
    
    if args.x and args.y: # assume x=lon, y=lat
        sz = args.size
        if sz: # Scale sizes?
             plt.scatter(df[args.x], df[args.y], s=df[sz]*10, alpha=0.5, c='red')
        else:
             plt.scatter(df[args.x], df[args.y], alpha=0.5, c='red')
        plt.title('Bubble Map')
    else:
         plt.text(0.5, 0.5, 'Need Lon (x) and Lat (y)', ha='center')
         
except Exception as e:
     plt.text(0.5, 0.5, f'Map error: {e}', ha='center')

utils.save_plot(plt, args.output)
