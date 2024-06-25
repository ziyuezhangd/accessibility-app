import requests
from zipfile import ZipFile as zzip
import fiona

url = r"https://www1.nyc.gov/assets/planning/download/zip/data-maps/open-data/nyclion_19b.zip"

# download the file contents in binary format
r = requests.get(url)
# open method to open a file on your system and write the contents
with open("input_data/nyclion_19b.zip", "wb") as file:
    file.write(r.content)


fp = "input_data/nyclion_19b.zip"
# opening the zip file in READ mode
with zzip(fp, 'r') as file:
    # printing all the contents of the zip file
    file.printdir()

    # extracting all the files
    #rint('Extracting all the files now...')
    file.extractall("input_data/")
    print('Done!')

gdb_file = r"input_data/lion/lion.gdb"
layers = fiona.listlayers(gdb_file)

for layer in layers:
    print(layer)
