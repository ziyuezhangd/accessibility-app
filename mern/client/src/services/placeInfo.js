import _ from 'lodash';
import { calculateDistanceBetweenTwoCoordinates } from '../utils/MapUtils';

/**
 *
 * Queries the backend for all accessibility cloud place infos in Manhattan
 * which are fully wheelchair accessible.
 *
 * @returns Place Info object:
 * {
 *  category: string,
 *  name: string,
 *  address: string,
 *  latitude: number,
 *  longitude: number,
 * }
 */
export const getPlaceInfos = async () => {
  const response = await fetch(`/api/place-infos`);

  const placeInfo = await response.json();
  if (placeInfo.error) {
    console.error(placeInfo.error);
    return;
  }
  return placeInfo;
};

/**
 *
 * Queries the backend for all possible placeInfo categories
 *
 * @returns Array of categories (strings)
 */
export const getCategories = async () => {
  const response = await fetch(`/api/place-infos/categories`);
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const categories = await response.json();
  return categories;
};



export class PlaceInfoUtilities {
  /**
   * Given a placeInfo object, gets a human-readable string of the address -
   * if not available, returns empty string.
   *
   * @param {{
   *  category: string,
   *  name: string,
   *  address: string,
   *  latitude: string,
   *  longitude: string,
   *  accessibility: string,
   *  hasWheelchairAccessibleRestroom: string}
   * } placeInfo - a placeInfo object
   * @return {string} eg: "100 S Broadway"
   */
  static getStreetAddressText = (placeInfo) => {
    if (placeInfo.address && placeInfo.address.street !== null) {
      return placeInfo.address.text;
    }
    return '';
  };

  /**
   * Given a placeInfo object, checks if it has a wheelchair accessible restroom.
   *
   * @param {{
   *  category: string,
   *  name: string,
   *  address: string,
   *  latitude: string,
   *  longitude: string,
   *  accessibility: string,
   *  hasWheelchairAccessibleRestroom: string}
   * } placeInfo - a placeInfo object
   * @return {boolean} true if restroom is accessible.
   */
  static hasWheelchairAccessibleRestroom = (placeInfo) => {
    return placeInfo.hasWheelchairAccessibleRestroom || placeInfo.category === 'toilets';
  };

  /**
   * Finds the closest placeInfo to a given coordinate from a list of placeInfos. By
   * default, returns the closest. Optionally provide a qty number to get the closest
   * x places.
   *
   * @param {{
   *  category: string,
   *  name: string,
   *  address: string,
   *  latitude: string,
   *  longitude: string,
   *  accessibility: string,
   *  hasWheelchairAccessibleRestroom: string}
   * } placeInfo - a placeInfo object
   * @return {array} list of places
   */
  static getNearest = (placeInfos, lat, lng, qty = 1) => {
    const placesSorted = _.sortBy(placeInfos, (r) => calculateDistanceBetweenTwoCoordinates(r.latitude, r.longitude, lat, lng));
    return placesSorted.slice(0, qty);
  };

  static isSubwayStation = (placeInfo) => placeInfo.category === 'train_station' || placeInfo.category === 'subway_station';
  /**
   *
   * Train station placeInfo objects will have a list of the subway lines in the name field.
   * This function extracts the subway lines and returns them as an array.
   *
   * @param {{
   *  category: string,
   *  name: string,
   *  address: string,
   *  latitude: string,
   *  longitude: string,
   *  accessibility: string,
   *  hasWheelchairAccessibleRestroom: string}
   * } placeInfo - a placeInfo object
   * @return {array} list of subway lines
   * /**
   * @throws {} Will throw an error if the placeInfo is not a station.
   */
  static getSubwayLines = (placeInfo) => {
    if (!this.isSubwayStation(placeInfo)) {
      throw new Error(`Attempted to extract subway lines from a ${placeInfo.category} placeInfo object.`);
    }
    if (!placeInfo.name) {
      console.warn(`Subway station has no name: `, placeInfo);
      return [];
    }
    const openingParenIdx = placeInfo.name.indexOf('(');
    const closingParenIdx = placeInfo.name.indexOf(')');
    const linesString = placeInfo.name.substring(openingParenIdx + 1, closingParenIdx);
    const linesArr = linesString.split(',');
    return linesArr;
  };

  /**
   *
   * Given a plaaceInfo object, extracts the name of the subway station.
   *
   * @param {{
   *  category: string,
   *  name: string,
   *  address: string,
   *  latitude: string,
   *  longitude: string,
   *  accessibility: string,
   *  hasWheelchairAccessibleRestroom: string}
   * } placeInfo - a placeInfo object
   * @return {string} subway station name
   * /**
   * @throws {} Will throw an error if the placeInfo is not a station.
   */
  static getSubwayStationName = (placeInfo) => {
    if (!this.isSubwayStation(placeInfo)) {
      throw new Error(`Attempted to extract subway lines from a ${placeInfo.category} placeInfo object.`);
    }
    if (!placeInfo.name) {
      console.warn(`Subway station has no name: `, placeInfo);
      return [];
    }
    const openingParenIdx = placeInfo.name.indexOf('(');
    return placeInfo.name.substring(0, openingParenIdx);
  };
  /**
   *
   * function to return the marker image of a place info object .
   *
*/
  static getMarkerPNG = (placeInfo) => {
    const { category } = placeInfo;
    const pngUrl = '../../assets/accessibilityMarkers/';
    const parentCategory = categoryToParentCategory[category];
    //we dont want to include all categories that accessibility cloud offers, they have been ommitted from the mapping to the parent category and will not return anything

    if (!parentCategory) {
      return null;
    }
    const iconUrl = `${pngUrl}${parentCategory}.png`;
    return iconUrl;
  };
}

const pubCategories = ['beverages', 'alcohol', 'nightlife'];
const airportCategories = ['airport'];
const booksCategories = ['books','library'];
const educationCategories = ['college', 'education', 'kindergarten', 'music_school', 'school,university'];
const drinkingWaterCategories = ['drinkingwater'];
const retailCategories = ['2nd_hand', 'antiques', 'art_shop', 'bicycle_store', 'butcher', 'clothes', 'computers', 'confectionary', 'convenience_store', 'copyshop', 'department_store', 'electronics', 'furniture', 'gifts', 'greengrocer', 'hiking', 'instruments', 'jewelry', 'kiosk', 'laundry', 'mobile_phones', 'newsagent', 'shoes', 'shopping', 'sports_shop', 'stationery', 'tea_shop', 'textiles', 'tobacco', 'tools', 'toys', 'variety_store', 'video_store'];
const officeCategories = ['communitycentre', 'court', 'embassy', 'employment_agency', 'government_office', 'insurance', 'lawyer', 'other', 'political_party', 'townhall', 'travel_agency'];
const theatreCategories = ['theater'];
const cinemaCategories = ['cinema'];
const carCategories = ['car_dealer', 'car_rental', 'car_repair', 'car_sharing', 'driving_school', 'parking', 'parking_carports', 'taxi'];
const accomodationCategories = ['accommodation', 'bed_breakfast', 'chalet', 'dormitory', 'guest_house', 'hostel', 'hotel', 'motel', 'shelter'];
const policeStationCategories = ['police']
const healthCategories = ['abortion', 'allergology', 'alternative_medicine', 'anaesthetics', 'birthing_centre', 'blood_bank', 'blood_donation', 'cardiology', 'cardiothoracic_surgery', 'chemist', 'child_psychiatry', 'clinic', 'counselling', 'dental_oral_maxillo_facial_surgery', 'dentist', 'dermatology', 'dermatovenereology', 'diagnostic_radiology', 'doctor', 'emergency', 'endocrinology', 'ergotherapist', 'fertility', 'gastroenterology', 'geriatrics', 'gynaecology', 'haematology', 'health', 'hearing_aids', 'hepatology', 'hospice', 'infectious_diseases', 'medical_store', 'midwife', 'neonatology', 'nephrology', 'neurology', 'neuropsychiatry', 'neurosurgery', 'nursing', 'nursing_home', 'nutrition_counselling', 'occupational', 'occupational_therapist', 'oncology', 'ophthalmology', 'orthodontics', 'orthopaedics', 'paediatric_surgery', 'palliative', 'pharmacy', 'physiotherapist', 'plastic_surgery', 'podiatrist', 'psychotherapist', 'psychotherapy', 'rehabilitation', 'speech_therapist', 'therapist', 'vaccination', 'vaccination_centre'];
const restaurantCategories = ['canteen', 'deli', 'fastfood', 'food', 'icecream', 'restaurant'];
const placeOfWorshipCategories = ['place_of_worship'];
const attractionCategories = ['attraction', 'cablecar', 'casino', 'leisure', 'themepark', 'tourism', 'zoo'];
const trainCategoories = ['platform', 'railway_platform', 'train', 'train_station', 'tram_crossing', 'tram_stop'];
const artCategories = ['art_gallery', 'arts_center', 'culture'];
const museumCategories = ['museum'];
const busCategories = ['bus_station', 'bus_stop'];
const marketCategories = ['market'];
const toiletCategories = ['toilets'];
const atmCategories = ['atm', 'currencyexchange'];
const flowersCategories = ['garden_centre', 'flowers', 'allotments'];
const parkCategories = ['park', 'dog_park'];
const veterinaryCategories = ['veterinary'];
const waterCategories = ['beach', 'marina', 'pier', 'swimming'];
const historicCategories = ['archaeological_site', 'castle', 'memorial'];
const ferryCategories = ['ferry'];
const campingCategories = ['camping', 'caravan_site'];
const parkingCategories = ['parking,parking_carports,parking_half_on_kerb,parking_layby,parking_multi_storey,parking_on_kerb,parking_rooftop,parking_street_side,parking_surface,parking_underground'];
const playgroundCategories = ['playground'];
const subwayCategories = ['subway_station', 'subway_entrance'];
const beautyCategories = ['barber', 'beautysalon', 'massage', 'sauna'];
const postCategories = ['post_box', 'post_office'];
const sportsCategories = ['soccer', 'sport', 'sports_center', 'stadium'];
const bikeCategories = ['bicycle_rental', 'bicycle_repair'];
const supermarketCategories = ['organic_food', 'supermarket'];
const serviceCategories = ['charging_station', 'dry_cleaning', 'funeral_home', 'information', 'nursing_home', 'parcel_locker', 'recycling', 'retirement_home', 'shower', 'social_facility', 'tailor'];
const phoneCategories = ['telephone'];
const bankCategories = ['bank'];
const picnicTableCategories = ['picnic_table'];
const cemeteryCategories = ['cemetery'];

const categoryToParentCategory = (category) => {
  if( pubCategories.includes(category)) {
    return 'pub';
  }
  if( airportCategories.includes(category)) {
    return 'airport';
  }
  if( booksCategories.includes(category)) {
    return 'books';
  }
  if( educationCategories.includes(category)) {
    return 'education';
  }
  if( drinkingWaterCategories.includes(category)) {
    return 'drinkingWater';
  }
  if( retailCategories.includes(category)) {
    return 'retail';
  }
  if( officeCategories.includes(category)) {
    return 'office';
  }
  if( theatreCategories.includes(category)) {
    return 'theatre';
  }
  if( cinemaCategories.includes(category)) {
    return 'cinema';
  }
  if( carCategories.includes(category)) {
    return 'car';
  }
  if( accomodationCategories.includes(category)) {
    return 'accomodation';
  }
  if( policeStationCategories.includes(category)) {
    return 'policeStation';
  }
  if( healthCategories.includes(category)) {
    return 'health';
  }
  if( restaurantCategories.includes(category)) {
    return 'restaurant';
  }
  if( trainCategoories.includes(category)) {
    return 'trainStation';
  }
  if( artCategories.includes(category)) {
    return 'art';
  }
  if( busCategories.includes(category)) {
    return 'bus';
  }
  if( marketCategories.includes(category)) {
    return 'market';
  }
  if( toiletCategories.includes(category)) {
    return 'toilet';
  }
  if( flowersCategories.includes(category)) {
    return 'flowers';
  }
  if( parkCategories.includes(category)) {
    return 'park';
  }
  if( veterinaryCategories.includes(category)) {
    return 'veterinary';
  }
  if( waterCategories.includes(category)) {
    return 'water';
  }
  if( historicCategories.includes(category)) {
    return 'historic';
  }
  if( ferryCategories.includes(category)) {
    return 'ferry';
  }
  if( campingCategories.includes(category)) {
    return 'toilet';
  }
  if( parkingCategories.includes(category)) {
    return 'parking';
  }
  if( playgroundCategories.includes(category)) {
    return 'playground';
  }
  if( subwayCategories.includes(category)) {
    return 'subway';
  }
  if( beautyCategories.includes(category)) {
    return 'beauty';
  }
  if( postCategories.includes(category)) {
    return 'post';
  }
  if( bikeCategories.includes(category)) {
    return 'bike';
  }
  if( supermarketCategories.includes(category)) {
    return 'supermarket';
  }
  if( serviceCategories.includes(category)) {
    return 'service';
  }
  if( phoneCategories.includes(category)) {
    return 'phone';
  }
  if( picnicTableCategories.includes(category)) {
    return 'picnic';
  }
  if( bankCategories.includes(category)) {
    return 'bank';
  }
  if( cemeteryCategories.includes(category)) {
    return 'cemetery';
  }
  if( campingCategories.includes(category)) {
    return 'toilet';
  }
  if( sportsCategories.includes(category)) {
    return 'sports';
  }
  if( atmCategories.includes(category)) {
    return 'atm';
  }
  if( placeOfWorshipCategories.includes(category)) {
    return 'placeOfWorship';
  }
  if( museumCategories.includes(category)) {
    return 'museum';
  }
  if( attractionCategories.includes(category)) {
    return 'attraction';
  }
};