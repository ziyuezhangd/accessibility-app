export interface PlaceInfo {
  category: string;
  name: string;
  address?: PlaceAddress;
  latitude: number;
  longitude: number;
  hasWheelchairAccessibleRestroom: boolean;
}
interface PlaceAddress {
  city: string;
  street: string;
  house: string;
  text: string;
}

export const getSubCategories = (category: string) => {
  switch (category) {
    case 'accomodations':
      return accomodationCategories;
    case 'restaurants':
      return restaurantCategories;
    case 'toilets':
      return toiletCategories;
    case 'shopping':
      return retailCategories;
    case 'health':
      return healthCategories;
    case 'attractions':
      return attractionCategories;
  }
};

const pubCategories = ['beverages', 'alcohol', 'nightlife'];
const retailCategories = [
  '2nd_hand',
  'antiques',
  'art_shop',
  'bicycle_store',
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
const theatreCategories = ['theater'];
const cinemaCategories = ['cinema'];
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
const artCategories = ['art_gallery', 'arts_center', 'culture'];
const museumCategories = ['museum'];
const marketCategories = ['market'];
const toiletCategories = ['toilets'];
const coffeeCategories = ['coffee'];
const parkCategories = ['park', 'dog_park'];
const waterCategories = ['beach', 'marina', 'pier', 'swimming'];
const historicCategories = ['archaeological_site', 'castle', 'memorial'];
const campingCategories = ['camping', 'caravan_site'];
const playgroundCategories = ['playground'];
const supermarketCategories = ['organic_food', 'supermarket'];
const bankCategories = ['bank'];
const picnicTableCategories = ['picnic_table'];

export enum PLACE_CATEGORIES {
  RESTAURANT,
  ACCOMODATIONS,
  HEALTH,
  RETAIL,
  TOILETS,
  ATTRACTIONS,
  OUTDOORS,
  ENTERTAINMENT,
}

export const categoryToParentCategory = (category: string) => {
  if ([...retailCategories, ...supermarketCategories, ...marketCategories].includes(category)) {
    return PLACE_CATEGORIES.RETAIL;
  }
  if (accomodationCategories.includes(category)) {
    return PLACE_CATEGORIES.ACCOMODATIONS;
  }
  if (healthCategories.includes(category)) {
    return PLACE_CATEGORIES.HEALTH;
  }
  if ([...restaurantCategories, ...coffeeCategories].includes(category)) {
    return PLACE_CATEGORIES.RESTAURANT;
  }
  if (toiletCategories.includes(category)) {
    return PLACE_CATEGORIES.TOILETS;
  }
  if ([...attractionCategories, ...historicCategories, ...museumCategories, ...artCategories].includes(category)) {
    return PLACE_CATEGORIES.ATTRACTIONS;
  }
  if ([...parkCategories, ...waterCategories, ...picnicTableCategories, ...playgroundCategories, ...campingCategories].includes(category)) {
    return PLACE_CATEGORIES.OUTDOORS;
  }
  if ([...cinemaCategories, ...theatreCategories, ...pubCategories].includes(category)) {
    return PLACE_CATEGORIES.ENTERTAINMENT;
  }
};
