import utils
import matplotlib.pyplot as plt
import geopandas as gpd

args = utils.get_args()

plt.figure(figsize=(12, 8))

try:
    world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))
    world.plot(ax=plt.gca(), color='lightgrey')
    
    df = utils.load_data(args.input)
    # Expects start_lat, start_lon, end_lat, end_lon
    # Or just standard plot of lines if args provided?
    # Simple hack: if columns have specific names
    
    if {'start_lat', 'start_lon', 'end_lat', 'end_lon'}.issubset(df.columns):
        for idx, row in df.iterrows():
            plt.plot([row['start_lon'], row['end_lon']], [row['start_lat'], row['end_lat']], 'b-', alpha=0.5)
        plt.title('Connection Map')
    else:
        plt.title('Connection Map (No suitable Lat/Lon cols found)')
        
except Exception as e:
     plt.text(0.5, 0.5, f'Map error: {e}', ha='center')

utils.save_plot(plt, args.output)
