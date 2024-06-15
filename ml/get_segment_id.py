# Code inspired by https://jeremysze.github.io/GIS_exploration/build/html/networkdistance_lion.html
# This script is an example of how to find the LION SegmentId from Lat/Lon coordinates
import geopandas as gpd
from shapely.geometry import box, LineString, Point,MultiPoint

gdb_file = r"input_data/lion/lion.gdb"
lion_gdf = gpd.read_file(gdb_file, engine='pyogrio', layer='lion')
for col in lion_gdf.columns:
    print(col)
# Your given coordinates
longitude, latitude = -73.985656, 40.748433  # Example coordinates

# Create a point geometry from the coordinates
point = Point(longitude, latitude)
print("Got point: ", point)

# Ensure the coordinate reference system (CRS) matches
# Reproject the point to the same CRS as the LION segments if necessary
if lion_gdf.crs.is_geographic:
    point_gdf = gpd.GeoDataFrame([{'geometry': point}], crs=lion_gdf.crs)
else:
    point_gdf = gpd.GeoDataFrame([{'geometry': point}], crs="EPSG:4326").to_crs(lion_gdf.crs)
print("Got point_gdf: ", point_gdf)
# Find the nearest LION segment
lion_gdf['distance'] = lion_gdf.geometry.distance(point_gdf.iloc[0].geometry)
nearest_segment = lion_gdf.loc[lion_gdf['distance'].idxmin()]
print("Got nearest_segment: ", nearest_segment)

# Get the segment ID (replace 'segment_id_column_name' with the actual column name)
segment_id = nearest_segment['SegmentID']
print(f"The nearest LION segment ID is: {segment_id}")