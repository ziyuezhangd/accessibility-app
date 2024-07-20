import _ from 'lodash';
import { calculateDistanceBetweenTwoCoordinates } from '../utils/MapUtils';
import { retryFetch } from '../utils/retryFetch';

/**
 *
 * Queries the backend for all accessibility cloud place infos in Manhattan
 * which are fully wheelchair accessible.
 *
 * @returns {Promise<Array<PlaceInfo>>} placeInfos
 */
export const getPlaceInfos = async () => {
  try {
    console.log('Getting place infos');
    const placeInfos = await retryFetch('/api/place-infos');
    return placeInfos.map((placeInfo) => {
      return new PlaceInfo({
        ...placeInfo,
        latitude: parseFloat(placeInfo.latitude),
        longitude: parseFloat(placeInfo.longitude),
      });
    });
  } catch (error) {
    console.error('Failed to fetch placeInfos:', error.message);
    return null;
  }
};

/**
 *
 * Queries the backend for all possible placeInfo categories
 *
 * @returns {Promise<Array<string>>} list of categories
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

/**
 * Class representing a the place info returned from the accessibility endpoint
 */
export class PlaceInfo {
  /**
   * Create a Location.
   * @param {Object} options - The options for the restroom.
   * @param {string} options.category - The category of the place info.
   * @param {string} options.name - The name of the place info.
   * @param {string} options.address - The address of the place info.
   * @param {number} options.latitude - The latitude of the place info.
   * @param {number} options.longitude - The longitude of the place info.
   * @param {string} options.hasWheelchairAccessibleRestroom - Indicates if the place info has a wheelchair-accessible restroom.
   */
  constructor({ category, name, address, latitude, longitude, hasWheelchairAccessibleRestroom }) {
    this.category = category;
    this.name = name;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.hasWheelchairAccessibleRestroom = hasWheelchairAccessibleRestroom;
  }

  /**
   * Gets a human-readable string of the address - if not available, returns empty string.
   * */
  getStreetAddressText() {
    if (this.address && this.address.street !== null) {
      return this.address.text;
    }
    return '';
  }

  /**
   * Check is the place either is a toilet or has a wheelchair accessible restroom
   *
   * @returns {boolean} true if restroom is accessible.
   */
  hasWheelchairAccessibleRestrooms() {
    return this.hasWheelchairAccessibleRestroom || this.category === 'toilets';
  }
  /**
   * Check if the place is a subway station
   *
   * @returns {boolean} true if the place is a subway station
   */
  isSubwayStation() {
    return this.category === 'train_station' || this.category === 'subway_station';
  }

  /**
   *
   * Train station placeInfo objects will have a list of the subway lines in the name field (Example: Canal Street (A,2,3)).
   * This function extracts the subway lines and returns them as an array.
   *
   * @return {Array<string>} list of subway lines
   * @throws {} Will throw an error if the placeInfo is not a station.
   */
  getSubwayLines() {
    if (!this.isSubwayStation()) {
      throw new Error(`Attempted to extract subway lines from a ${this.category} placeInfo object.`);
    }
    if (!this.name) {
      console.log(`Subway station has no name`);
      return [];
    }

    const openingParenIdx = this.name.indexOf('(');
    const closingParenIdx = this.name.indexOf(')');
    if (openingParenIdx === -1 || closingParenIdx === -1 || openingParenIdx >= closingParenIdx) {
      console.log(`Subway station name format is incorrect`);
      return [];
    }
    const linesString = this.name.substring(openingParenIdx + 1, closingParenIdx);
    const linesArr = linesString.split(',').map((line) => line.trim());
    return linesArr;
  }

  /**
   *
   * Get the subway station name from a subway station place
   *
   * @return {string} subway station name
   * @throws {} Will throw an error if the placeInfo is not a station.
   */
  getSubwayStationName() {
    if (!this.isSubwayStation()) {
      throw new Error(`Attempted to extract subway lines from a ${this.category} placeInfo object.`);
    }
    if (!this.name) {
      console.log(`Subway station has no name`);
      return '';
    }
    const openingParenIdx = this.name.indexOf('(');
    if (openingParenIdx === -1) {
      return this.name;
    }
    return this.name.substring(0, openingParenIdx).trim();
  }
}

export class PlaceInfoUtilities {
  /**
   * Finds the closest placeInfo to a given coordinate from a list of placeInfos. By
   * default, returns the closest. Optionally provide a qty number to get the closest
   * x places.
   *
   * @param {PlaceInfo[]} placeInfos - a list of placeinfos to search in
   * @return {Array<PlaceInfo>} list of places
   */
  static getNearest = (placeInfos, lat, lng, qty = 1) => {
    if (!_.isArray(placeInfos) || !_.every(placeInfos, (place) => place instanceof PlaceInfo)) {
      console.warn('Invalid placeInfos: must be an array of PlaceInfo instances');
      return [];
    }
    if (qty === 0) {
      console.warn('Quantity is 0: returning an empty array');
    }
    const placesSorted = _.sortBy(placeInfos, (r) => calculateDistanceBetweenTwoCoordinates(r.latitude, r.longitude, lat, lng));
    return placesSorted.slice(0, qty);
  };

  /**
   *
   * function to return the marker image of a place info object .
   *
   */
  static getMarkerPNG = (placeInfo) => {
    console.log('getMarkerPNG has been called');
    const { category } = placeInfo;
    const svgUrl = '../../accessibilityMarkersSVG/';
    const parentCategory = categoryToParentCategory(category);
    if (!parentCategory) {
      return null;
    } else {
      const imgSrc = `${svgUrl}${parentCategory}.svg`;
      return imgSrc;
    }
  };

  static getMarkerStyle = (category) => {
    const style = { invert: 0, sepia: 0, saturate: 0, hueRotate: 0 };
    switch (category) {
    case 'books':
    case 'education':
      style.saturate = 4247;
      style.hueRotate = 170;
      break;
    case 'retail':
    case 'market':
    case 'phone':
    case 'supermarket':
    case 'beauty':
      style.saturate = 4247;
      style.hueRotate = 136;
      break;
    case 'theatre':
    case 'cinema':
      style.saturate = 4247;
      style.hueRotate = 200;
      break;
    case 'car': 
    case 'train': 
    case 'airport': 
    case 'bus': 
    case 'parking': 
    case 'ferry': 
    case 'bike':
      style.saturate=3000;
      style.hueRotate=100;
      break;
    case 'accomodation': 
    case 'policeStation': 
    case 'office': 
    case 'cemetery': 
    case 'atm': 
    case 'post': 
    case 'service': 
    case 'bank': 
    case 'health': 
    case 'veterinary':
      style.saturate = 4247;
      style.hueRotate = 300;
      break;
    case 'restaurant':
    case 'coffee':
    case 'pub':
      style.saturate = 4247;
      style.hueRotate = 45;
      break;
    case 'placeOfWorship':
      style.saturate = 4247;
      style.hueRotate = 10;
      break;
    case 'art' :
    case 'museum' :
    case 'attraction' :
    case 'sports':
    case 'historical':
      style.saturate = 4247;
      style.hueRotate = 10;
      break;
    case 'toilet':
      style.saturate = 4247;
      style.hueRotate = 300;
      break;
    case 'drinkingWater':
      style.saturate = 4247;
      style.hueRotate = 300;
      break;
    case 'camping':
    case 'picnicTable':
    case 'flowers':
    case 'water':
    case 'playground':
      style.saturate = 4247;
      style.hueRotate = 170;
      break;
    default:
      break;
    }
    return style;
  };
}

const pubCategories = ['beverages', 'alcohol', 'nightlife', 'nightclub', 'pub'];
const airportCategories = ['airport'];
const booksCategories = ['books', 'library'];
const educationCategories = ['college', 'education', 'kindergarten', 'music_school', 'school', 'university'];
const drinkingWaterCategories = ['drinkingwater'];
const retailCategories = [
  '2nd_hand',
  'antiques',
  'art_shop',
  'bicycle_store',
  'bread',
  'butcher',
  'clothes',
  'computers',
  'confectionary',
  'convenience_store',
  'copyshop',
  'department_store',
  'electronics',
  'furniture',
  'gifts',
  'greengrocer',
  'hiking',
  'instruments',
  'jewelry',
  'kiosk',
  'laundry',
  'mobile_phones',
  'newsagent',
  'pet_store',
  'shoes',
  'shopping',
  'sports_shop',
  'stationery',
  'tea_shop',
  'textiles',
  'tobacco',
  'tools',
  'toys',
  'variety_store',
  'video_store',
];
const officeCategories = ['communitycentre', 'court', 'embassy', 'employment_agency', 'government_office', 'insurance', 'lawyer', 'other', 'political_party', 'townhall', 'travel_agency'];
const theatreCategories = ['theatre'];
const cinemaCategories = ['cinema'];
const carCategories = ['car_dealer', 'car_rental', 'car_repair', 'car_sharing', 'driving_school', 'parking', 'parking_carports', 'taxi'];
const accomodationCategories = ['accommodation', 'bed_breakfast', 'chalet', 'dormitory', 'guest_house', 'hostel', 'hotel', 'motel', 'shelter'];
const policeStationCategories = ['police'];
const healthCategories = [
  'abortion',
  'allergology',
  'alternative_medicine',
  'anaesthetics',
  'birthing_centre',
  'blood_bank',
  'blood_donation',
  'cardiology',
  'cardiothoracic_surgery',
  'chemist',
  'child_psychiatry',
  'clinic',
  'counselling',
  'dental_oral_maxillo_facial_surgery',
  'dentist',
  'dermatology',
  'dermatovenereology',
  'diagnostic_radiology',
  'doctor',
  'emergency',
  'endocrinology',
  'ergotherapist',
  'fertility',
  'gastroenterology',
  'geriatrics',
  'gynaecology',
  'haematology',
  'health',
  'hearing_aids',
  'hepatology',
  'hospice',
  'hospital',
  'infectious_diseases',
  'medical_store',
  'midwife',
  'neonatology',
  'nephrology',
  'neurology',
  'neuropsychiatry',
  'neurosurgery',
  'nursing',
  'nursing_home',
  'nutrition_counselling',
  'occupational',
  'occupational_therapist',
  'oncology',
  'ophthalmology',
  'orthodontics',
  'orthopaedics',
  'paediatric_surgery',
  'palliative',
  'pharmacy',
  'physiotherapist',
  'plastic_surgery',
  'podiatrist',
  'psychotherapist',
  'psychotherapy',
  'rehabilitation',
  'speech_therapist',
  'therapist',
  'vaccination',
  'vaccination_centre',
];
const restaurantCategories = ['canteen', 'deli', 'fastfood', 'food', 'icecream', 'restaurant'];
const placeOfWorshipCategories = ['place_of_worship'];
const attractionCategories = ['attraction', 'cablecar', 'casino', 'leisure', 'themepark', 'tourism', 'zoo'];
const trainCategories = ['platform', 'public_transport', 'railway_platform', 'train', 'train_station', 'tram_crossing', 'tram_stop'];
const artCategories = ['art_gallery', 'arts_center', 'culture', 'public_art'];
const museumCategories = ['museum'];
const busCategories = ['bus_station', 'bus_stop'];
const marketCategories = ['market'];
const toiletCategories = ['toilets'];
const atmCategories = ['atm', 'currencyexchange'];
const coffeeCategories = ['coffee'];
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
  if (pubCategories.includes(category)) {
    return 'pub';
  }
  if (campingCategories.includes(category)) {
    return 'camping';
  }
  if (airportCategories.includes(category)) {
    return 'airport';
  }
  if (booksCategories.includes(category)) {
    return 'books';
  }
  if (educationCategories.includes(category)) {
    return 'education';
  }
  if (drinkingWaterCategories.includes(category)) {
    return 'drinkingWater';
  }
  if (retailCategories.includes(category)) {
    return 'retail';
  }
  if (officeCategories.includes(category)) {
    return 'office';
  }
  if (theatreCategories.includes(category)) {
    return 'theatre';
  }
  if (cinemaCategories.includes(category)) {
    return 'cinema';
  }
  if (carCategories.includes(category)) {
    return 'car';
  }
  if (accomodationCategories.includes(category)) {
    return 'accomodation';
  }
  if (policeStationCategories.includes(category)) {
    return 'police';
  }
  if (healthCategories.includes(category)) {
    return 'health';
  }
  if (restaurantCategories.includes(category)) {
    return 'restaurant';
  }
  if (trainCategories.includes(category)) {
    return 'train';
  }
  if (artCategories.includes(category)) {
    return 'art';
  }
  if (busCategories.includes(category)) {
    return 'bus';
  }
  if (marketCategories.includes(category)) {
    return 'market';
  }
  if (toiletCategories.includes(category)) {
    return 'toilets';
  }
  if (flowersCategories.includes(category)) {
    return 'flowers';
  }
  if (parkCategories.includes(category)) {
    return 'park';
  }
  if (veterinaryCategories.includes(category)) {
    return 'veterinary';
  }
  if (waterCategories.includes(category)) {
    return 'water';
  }
  if (historicCategories.includes(category)) {
    return 'historic';
  }
  if (ferryCategories.includes(category)) {
    return 'ferry';
  }
  if (toiletCategories.includes(category)) {
    return 'toilet';
  }
  if (parkingCategories.includes(category)) {
    return 'parking';
  }
  if (playgroundCategories.includes(category)) {
    return 'playground';
  }
  if (subwayCategories.includes(category)) {
    return 'subway';
  }
  if (beautyCategories.includes(category)) {
    return 'beauty';
  }
  if (postCategories.includes(category)) {
    return 'post';
  }
  if (bikeCategories.includes(category)) {
    return 'bike';
  }
  if (supermarketCategories.includes(category)) {
    return 'supermarket';
  }
  if (serviceCategories.includes(category)) {
    return 'service';
  }
  if (phoneCategories.includes(category)) {
    return 'phone';
  }
  if (picnicTableCategories.includes(category)) {
    return 'picnicTable';
  }
  if (bankCategories.includes(category)) {
    return 'bank';
  }
  if (cemeteryCategories.includes(category)) {
    return 'cemetery';
  }
  if (sportsCategories.includes(category)) {
    return 'sports';
  }
  if (atmCategories.includes(category)) {
    return 'atm';
  }
  if (placeOfWorshipCategories.includes(category)) {
    return 'placeOfWorship';
  }
  if (museumCategories.includes(category)) {
    return 'museum';
  }
  if (attractionCategories.includes(category)) {
    return 'attraction';
  }
  if (coffeeCategories.includes(category)) {
    return 'coffee';
  }
};

export { categoryToParentCategory };
