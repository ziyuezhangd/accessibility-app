import geopandas as gpd
from shapely.geometry import Point
import json

def load_lion_data():
    GDB_FILE = r"input_data/lion/lion.gdb"
    lion_gdf = gpd.read_file(GDB_FILE, engine='pyogrio', layer='lion')
    return lion_gdf
def load_segment_ids():
    new_segment_ids = {}
    # Opening JSON file
    f = open(f"output/segment_id_dict.json")
    data = json.load(f)
    for key in data.keys():
        coordinates_tuple = tuple(map(float, key.split(',')))
        new_segment_ids[coordinates_tuple] = data[key]

    return new_segment_ids

def get_segment_id_from_coords(lat, lng, lion_gdf):
    point = Point(lng, lat)
    if lion_gdf.crs.is_geographic:
        point_gdf = gpd.GeoDataFrame([{'geometry': point}], crs=lion_gdf.crs)
    else:
        point_gdf = gpd.GeoDataFrame([{'geometry': point}], crs="EPSG:4326").to_crs(lion_gdf.crs)
    
    lion_gdf['distance'] = lion_gdf.geometry.distance(point_gdf.iloc[0].geometry)
    nearest_segment = lion_gdf.loc[lion_gdf['distance'].idxmin()]
    segment_id = nearest_segment['SegmentID']
    return segment_id

def save_segment_ids(segment_ids):
    segment_ids_as_json = {}
    for key in segment_ids.keys():
        tuple_str = ",".join([str(key[0]), str(key[1])])
        segment_ids_as_json[tuple_str] = segment_ids[key]

    # Save segment ids for future use
    with open(f"output/segment_id_dict.json", "w") as outfile: 
        json.dump(segment_ids_as_json, outfile)
        print("Segment ids saved")

# Function which iterates over each row in the df and
# fills in the segment id for each lat/lng
def add_segment_id_column(df):
    lion_gdf = load_lion_data()
    segment_ids = load_segment_ids()
    updated_coordinates = []
    for idx, row in df.iterrows():
        if (idx % 1000 == 0):
            print(f"Completed {idx} rows")
            rows_left = df['SegmentId'].isnull().sum()
            print(f'Rows left: {rows_left}')
        try:
            lat = round(row['Latitude'], 4)
            lng = round(row['Longitude'], 4)
            if (lat, lng) not in updated_coordinates: # Need to update this column
                if (lat, lng) not in segment_ids.keys(): # Need to calculate
                    segment_id = get_segment_id_from_coords(lat, lng, lion_gdf)
                    segment_ids[(lat, lng)] = segment_id
                else: # We can pull from our dict
                    segment_id = segment_ids[(lat, lng)]
                df.loc[(round(df.Latitude, 4) == lat) & (round(df.Longitude, 4) == lng), 'SegmentId'] = segment_id
                
                rows_left = df['SegmentId'].isnull().sum()
                updated_coordinates.append((lat, lng))

                if rows_left == 0:
                    return
            else:
                # Any seg
                pass
        except Exception as e:
#             print(f"Unable to translate ({lat}, {lng}), skipping", e)
            pass
    save_segment_ids(segment_ids)
