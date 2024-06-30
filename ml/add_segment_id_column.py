import geopandas as gpd
from shapely.geometry import Point
import json
import sys
import os
import requests
from zipfile import ZipFile as zzip
import pandas as pd

from os.path import abspath, dirname
# dirname = os.path.dirname(__file__)
# filename = os.path.join(dirname, 'relative/path/to/file/you/want')

print ('argument list', sys.argv)
source_type = sys.argv[1]
csv_file_name = sys.argv[2]
supported_sources = ['citibike-tripdata']

is_supported = False
for supported_source in supported_sources:
    if supported_source in csv_file_name:
        is_supported = True
        break

if not is_supported:
    raise Exception(f"{source_type} is not supported. Supported files: {supported_sources.join(',')}")

csv_file_path = f'input_data/{csv_file_name}'

if not os.path.exists(csv_file_path):
    raise Exception(f"Data file does not exist at {csv_file_path}")


LION_ZIP_DIR = "input_data/nyclion_19b.zip"
GDB_FILE = r"input_data/lion/lion.gdb"
OUTPUT_DIR = "output/"

def main():
    # Do things
    print('sup')
    df = read_csv(csv_file_path)
    df = filter_to_manhattan(df)
    df = standardize_columns(df)
    add_segment_id_column(df)
    print_stats(df)
    
    csv = f"{OUTPUT_DIR}/{csv_file_name}-with-segments.csv"
    df.to_csv(csv, index=False)

def print_stats(df):
    print(f"======= {csv_file_name} =======")
    print(f"Columns: {','.join(list(df.columns.values))}")
    print(f"Num rows: {len(df)}")
    print(f"Num segment ids: {len(df['SegmentId'].unique())}")

# Ensures columns Latitude, Longitude and Segment Id exist
def standardize_columns(df):
    if source_type == 'citibike-tripdata':
        # Capitalize Lat/Long and add Segment Id
        new_df = df.copy()
        new_df['SegmentId'] = None
        df['started_at'] = pd.to_datetime(df['started_at'])
        df['ended_at'] = pd.to_datetime(df['ended_at'])

        new_df['Timestamp'] = pd.concat([df['started_at'], df['ended_at']], ignore_index=True)
        new_df['Timestamp'] = pd.to_datetime(new_df['Timestamp'])
        new_df['Timestamp_Rounded'] = new_df['Timestamp'].dt.round("h")
        new_df['Latitude_Unrounded'] = pd.concat([df['start_lat'], df['end_lat']], ignore_index=True)
        new_df['Longitude_Unrounded'] = pd.concat([df['start_lng'], df['end_lng']], ignore_index=True)

        # Round the lat/lngs
        new_df['Latitude'] = new_df['Latitude_Unrounded'].round(3)
        new_df['Longitude'] = new_df['Longitude_Unrounded'].round(3)
        return new_df

def filter_to_manhattan(df):
    if source_type == 'citibike-tripdata':
        return df # No boroughs in this data

# Ensures columns Latitude, Longitude and Segment Id exist
def read_csv(csv_file_path):
    if source_type == 'citibike-tripdata':
        # Capitalize Lat/Long and add Segment Id
        return pd.read_csv(csv_file_path, dtype={"start_station_id": str, "end_station_id": str})

def download_lion_data():
    # Download and store lion files
    url = r"https://www1.nyc.gov/assets/planning/download/zip/data-maps/open-data/nyclion_19b.zip"

    # download the file contents in binary format
    r = requests.get(url)
    # open method to open a file on your system and write the contents
    with open(LION_ZIP_DIR, "wb") as file:
        file.write(r.content)

    # opening the zip file in READ mode
    with zzip(LION_ZIP_DIR, 'r') as file:
        # printing all the contents of the zip file
        file.printdir()

        # extracting all the files
        file.extractall("input_data/")
        print('Done!')
    load_lion_data()

tries = 0
def load_lion_data():
    GDB_FILE = r"input_data/lion/lion.gdb"
    global tries
    if tries == 1:
        raise Exception("Can't download LION data")
    try:
        tries += 1
        print("Reading lion data")
        lion_gdf = gpd.read_file(GDB_FILE, engine='pyogrio', layer='lion')
        return lion_gdf
    except Exception as e:
        print(e)
        print("Downloading lion data")
        download_lion_data()

def load_segment_ids():
    print("loading segment ids")
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
                    save_segment_ids(segment_ids)
                    return
            else:
                # Any seg
                pass
        except Exception as e:
#             print(f"Unable to translate ({lat}, {lng}), skipping", e)
            pass
    save_segment_ids(segment_ids)

if __name__ == '__main__':
    main()