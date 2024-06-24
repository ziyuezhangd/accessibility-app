import requests
from zipfile import ZipFile as zzip
import os 
import fiona
import geopandas as gpd
from shapely.geometry import Point
from prophet import Prophet

GDB_FILE = r"./input_data/lion/lion.gdb"
lion_gdf = gpd.read_file(GDB_FILE, engine='pyogrio', layer='lion')

def get_segment_id_from_coords(lat: int, lng: int):
    point = Point(lng, lat)
    if lion_gdf.crs.is_geographic:
        point_gdf = gpd.GeoDataFrame([{'geometry': point}], crs=lion_gdf.crs)
    else:
        point_gdf = gpd.GeoDataFrame([{'geometry': point}], crs="EPSG:4326").to_crs(lion_gdf.crs)
    
    lion_gdf['distance'] = lion_gdf.geometry.distance(point_gdf.iloc[0].geometry)
    nearest_segment = lion_gdf.loc[lion_gdf['distance'].idxmin()]
    segment_id = nearest_segment['SegmentID']
    print("SegmentID: ", segment_id)
    return segment_id

