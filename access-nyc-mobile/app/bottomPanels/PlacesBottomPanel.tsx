import { View, Text, TouchableHighlight } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import React, { useContext, useState } from 'react';
import { useTheme, Surface, TouchableRipple, MD3Theme, List } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { PLACE_CATEGORIES, PlaceInfo, categoryToParentCategory } from '../interfaces/PlaceInfo';
import { MarkerConfig } from '../interfaces/Map';
import { GoogleMapContext, GoogleMapContextType } from '../providers/MapProvider';

export default function PlacesBottomPanel({ placeInfos }: { placeInfos: PlaceInfo[] }) {
  const { createMarkers, setRegion, region } = useContext(GoogleMapContext) as GoogleMapContextType;
  const theme = useTheme();

  const [filteredPlaces, setFilteredPlaces] = useState<PlaceInfo[]>([]);

  const handleCategoryPressed = (category: PLACE_CATEGORIES) => {
    const placeInfosInCategory = placeInfos.filter((pi) => categoryToParentCategory(pi.category) === category);
    setFilteredPlaces(placeInfosInCategory);
    const markers: MarkerConfig[] = placeInfosInCategory.map((pi, idx) => ({ lat: pi.latitude, lng: pi.longitude, title: pi.name, key: `${pi.name}-${idx}`, icon: pi.hasWheelchairAccessibleRestroom ? 'toilet' : null }));
    createMarkers(markers, true);

    // Zoom out a bit
    if(!region) {
      console.log('No region')
    }
    setRegion({ latitude: region.latitude, longitude: region.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 });
  };

  const PlaceCategory = ({ theme, name, category }: { theme: MD3Theme; name: string; category: PLACE_CATEGORIES }) => {
    return (
      <TouchableHighlight onPress={() => handleCategoryPressed(category)} style={{ ...styles.surface }}>
        <Surface style={{ ...styles.surface, backgroundColor: theme.colors.primary }}>
          <Text>{name}</Text>
        </Surface>
      </TouchableHighlight>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.surfaceContainer}>
        <PlaceCategory theme={theme} name='Restaurants' category={PLACE_CATEGORIES.RESTAURANT} />
        <PlaceCategory theme={theme} name='Toilets' category={PLACE_CATEGORIES.TOILETS} />
        <PlaceCategory theme={theme} name='Shopping' category={PLACE_CATEGORIES.RETAIL} />
      </View>
      <View style={styles.surfaceContainer}>
        <PlaceCategory theme={theme} name='Health' category={PLACE_CATEGORIES.HEALTH} />
        <PlaceCategory theme={theme} name='Accomodation' category={PLACE_CATEGORIES.ACCOMODATIONS} />
        <PlaceCategory theme={theme} name='Attractions' category={PLACE_CATEGORIES.ATTRACTIONS} />
      </View>
      <ScrollView>
        {filteredPlaces.map((place, i) => (
          // TODO: add this when we have accesibility info left={(props) => <List.Icon {...props} icon='folder' />}
          <List.Item key={i} title={place.name} description={place.address?.text} right={(props) => <List.Icon {...props} icon='heart-outline' />} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'column',
    gap: 9,
  },
  surfaceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    flexWrap: 'wrap',
  },
  surface: {
    borderRadius: 10,
    padding: 8,
    height: 90,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
