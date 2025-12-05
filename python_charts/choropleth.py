import utils
import matplotlib.pyplot as plt
import geopandas as gpd

args = utils.get_args()
# Expects a shapefile or geojson in input usually, or a csv with country codes + values
# For prototype, we'll try to merge a built-in map with the CSV data

plt.figure(figsize=(12, 8))

try:
    df = utils.load_data(args.input)
    world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))
    
    # Simple merge attempt on 'name' or 'iso_a3'
    # df must have a column matching 'name' or 'iso_a3'
    
    country_col = args.x # assume x is country code/name
    val_col = args.y # value
    
    if country_col and val_col:
        # Merge
        merged = world.merge(df, left_on='name', right_on=country_col, how='left')
        merged.plot(column=val_col, ax=plt.gca(), legend=True, legend_kwds={'label': val_col}, missing_kwds={'color': 'lightgrey'})
        plt.title(f'Choropleth Map: {val_col}')
    else:
        world.plot(ax=plt.gca(), color='whitesmoke', edgecolor='black')
        plt.text(0.5, 0.5, 'Need Country Column (x) and Value (y)', ha='center')
        
except Exception as e:
    plt.text(0.5, 0.5, f'Map generation failed: {e}', ha='center')

utils.save_plot(plt, args.output)
