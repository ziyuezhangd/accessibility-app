import axios from 'axios';
import logger from '../logger';

const ACCESSIBILITY_CLOUD_API_KEY = process.env.ACCESSIBILITY_CLOUD_API_KEY;
const ACCESSIBILITY_CLOUD_URL = 'https://accessibility-cloud-v2.freetls.fastly.net/';
const TILES = [
  { z: 15, x: 9650, y: 12320 },
  { z: 15, x: 9649, y: 12320 },
  { z: 15, x: 9648, y: 12320 },
  { z: 16, x: 19296, y: 24642 },
  { z: 14, x: 4823, y: 6160 }, 
  { z: 14, x: 4824, y: 6159 }, 
  { z: 14, x: 4823, y: 6159 }, 
  { z: 15, x: 9650, y: 12318 },
  { z: 15, x: 9650, y: 12319 },
  { z: 14, x: 4824, y: 6158 },
  { z: 15, x: 9647, y: 12316 },
  { z: 15, x: 9647, y: 12317 },
  { z: 15, x: 9650, y: 12316 },
  { z: 15, x: 9650, y: 12317 },
  { z: 16, x: 19302, y: 24632 },   
  { z: 14, x: 4824, y: 6157 },
  { z: 14, x: 4825, y: 6157 },
  { z: 15, x: 9647, y: 12314 },
  { z: 15, x: 9647, y: 12315 },
  { z: 16, x: 19304, y: 24630 },
  { z: 16, x: 19304, y: 24629 },
  { z: 16, x: 19304, y: 24628 },
  { z: 16, x: 19305, y: 24628 },
  { z: 17, x: 38608, y: 49262 },
  { z: 17, x: 38610, y: 49259 },
  { z: 17, x: 38610, y: 49258 },
  { z: 17, x: 38611, y: 49258 },
  { z: 17, x: 38612, y: 49256 },
  { z: 18, x: 77224, y: 98514 },
  { z: 15, x: 9652, y: 12312 },
  { z: 15, x: 9651, y: 12312 },
  { z: 15, x: 9651, y: 12313 },
  { z: 16, x: 19306, y: 24627 },
  { z: 16, x: 19306, y: 24626 },
  { z: 16, x: 19307, y: 24626 },
  { z: 14, x: 4825, y: 6156 },
  { z: 14, x: 4824, y: 6156 },  
  { z: 15, x: 9654, y: 12311 },
  { z: 15, x: 9654, y: 12310 },
  { z: 15, x: 9655, y: 12310 },
  { z: 16, x: 19310, y: 24622 },
  { z: 17, x: 38620, y: 49247 },
  { z: 17, x: 38620, y: 49246 },
  { z: 17, x: 38621, y: 49246 },
  { z: 17, x: 38622, y: 49245 },
  { z: 17, x: 38622, y: 49244 },
  { z: 16, x: 19312, y: 24620 },
  { z: 17, x: 38624, y: 49242 },
  { z: 14, x: 4826, y: 6155 },
  { z: 14, x: 4825, y: 6155 },
  { z: 15, x: 9649, y: 12311 },
  { z: 16, x: 19299, y: 24621 },
  { z: 14, x: 4826, y: 6154 },
  { z: 14, x: 4825, y: 6154 },
  { z: 16, x: 19308, y: 24616 },
  { z: 16, x: 19308, y: 24617 },
  { z: 15, x: 9654, y: 12309 },
  { z: 16, x: 19310, y: 24619 },
  { z: 14, x: 4826, y: 6153 },
  { z: 15, x: 9651, y: 12307 },
  { z: 16, x: 19308, y: 24612 },
  { z: 16, x: 19308, y: 24613 },
  { z: 16, x: 19308, y: 24614 },
  { z: 16, x: 19308, y: 24615 },      
  { z: 16, x: 19308, y: 24611 },
  { z: 16, x: 19308, y: 24609 },
  { z: 16, x: 19308, y: 24608 },
  { z: 16, x: 19309, y: 24608 },
  { z: 14, x: 4826, y: 6152 },      
  { z: 15, x: 9653, y: 12303 },
  { z: 15, x: 9654, y: 12303 },
  { z: 16, x: 19310, y: 24606 },
  { z: 15, x: 9653, y: 12302 },
  { z: 15, x: 9654, y: 12302 },
  { z: 15, x: 9655, y: 12302 },
  { z: 15, x: 9654, y: 12301 },
  { z: 15, x: 9655, y: 12301 },
  { z: 16, x: 19312, y: 24603 },
  { z: 16, x: 19312, y: 24602 },
  { z: 16, x: 19312, y: 24601 },
  { z: 16, x: 19311, y: 24601 },
  { z: 16, x: 19310, y: 24601 },
  { z: 16, x: 19309, y: 24601 },
  { z: 17, x: 38620, y: 49201 },
  { z: 17, x: 38621, y: 49201 },
];

const accessibilityCloud = {  
  /**
   * @returns {Promise<Array<{category: string, name: string, latitude: number, longitude: number, hasWheelchairAccessibleRestroom: boolean}>>} 
  */
  async requestPlaceInfos() {
    async function fetchTileData(tile, maxRetries = 5) {
      let retries = 0;
      const { x, y, z } = tile;
      while (retries < maxRetries) {
        try {
          const result = await axios.get(`${ACCESSIBILITY_CLOUD_URL}place-infos.json`, {
            params: {
              appToken: ACCESSIBILITY_CLOUD_API_KEY,
              x,
              y,
              z,
              filter: 'fully-accessible-by-wheelchair'
            },
          });
          return result.data;
        } catch (error) {
          retries += 1;
          if (retries >= maxRetries) {
            logger.error(`Max retries reached. Failed to fetch placeInfos data for tile {x:${x}, y:${y}, z:${z}}`);
            return null;
          }
        }
      }
    }

    const promises = TILES.map(tile => fetchTileData(tile));
    const results = await Promise.all(promises);
    const placeInfos = [];
    
    for (const result of results) {
      if (!result || !result.features) {
        continue;
      }

      const places = result.features;
      for (const place of places) {
        const { properties } = place;
        let hasWheelchairAccessibleRestroom = properties.category === 'toilets';
        if (properties.accessibility.areas) {
          hasWheelchairAccessibleRestroom = properties.accessibility.areas[0].restrooms[0].isAccessibleWithWheelchair;
        }
        const placeInfo = {
          category: properties.category,
          name: properties.name?.en,
          address: properties.address,
          latitude: place.geometry.coordinates[1],
          longitude: place.geometry.coordinates[0],
          hasWheelchairAccessibleRestroom: hasWheelchairAccessibleRestroom ?? false, // Default to false if undefined
        };
        placeInfos.push(placeInfo);
      }
    }
    
    return placeInfos;
  },
  
  /**
   * @returns {Promise<Array<string>>} 
  */
  async getCategories() {
    const categories = [];
    const result = await axios.get(`${ACCESSIBILITY_CLOUD_URL}categories.json`, {
      params: {
        appToken: ACCESSIBILITY_CLOUD_API_KEY,
      },
    });
    for (const d of result.data.results) {
      categories.push(d._id);
    }
    
    return categories;
  },
};

export default accessibilityCloud;