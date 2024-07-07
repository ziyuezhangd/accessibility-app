import geopandas as gpd
import json
import shapely


GDB_FILE = r"output/filtered-lion.gdb"

lion_gdf = gpd.read_file(GDB_FILE, engine="pyogrio")

segment_ids = lion_gdf["SegmentID"].unique()
segment_to_latlong = {}

# For each segment id, get a lat/lng
for segment_id in segment_ids:
    latLong = {"start": {"lat": None, "lng": None}, "end": {"lat": None, "lng": None}}
    if segment_id not in segment_ids:
        print("Segment not found: ", segment_id)
        continue
    geom = lion_gdf[lion_gdf['SegmentID'] == segment_id].to_crs(epsg=4326)['geometry'].iloc[0]
    start_lng, start_lat = geom.coords[0]

    latLong["start"]["lat"] = start_lat
    latLong["start"]["lng"] = start_lng

    end_lng, end_lat = geom.coords[-1]
    latLong["end"]["lat"] = end_lat
    latLong["end"]["lng"] = end_lng
    print(latLong)

    segment_to_latlong[segment_id] = latLong

# Save segment ids for future use
with open(f"output/segment_to_lat_long.json", "w") as outfile:
    json.dump(segment_to_latlong, outfile)
    print("Segment ids saved")
