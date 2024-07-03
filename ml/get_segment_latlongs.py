import geopandas as gpd
import json
GDB_FILE = r"input_data/lion/lion.gdb"

lion_gdf = gpd.read_file(GDB_FILE, engine='pyogrio', layer='lion')
lion_gdf = lion_gdf[lion_gdf.LBoro == 1]

# lion_gdf = lion_gdf.to_crs(4326)
segment_ids = lion_gdf['SegmentID'].unique()
segment_to_latlong = {}

# For each segment id, get a lat/lng
for segment_id in segment_ids:
    latLong = {}
    y = lion_gdf.query(f'SegmentID == "{segment_id}"').geometry.centroid.to_crs(epsg=4326).y
    latLong["lat"] = y.values[0]
    x = lion_gdf.query(f'SegmentID == "{segment_id}"').geometry.centroid.to_crs(epsg=4326).x
    latLong["lng"] = x.values[0]
    segment_to_latlong[segment_id] = latLong

# Save segment ids for future use
with open(f"output/segment_to_lat_long.json", "w") as outfile: 
    json.dump(segment_to_latlong, outfile)
    print("Segment ids saved")