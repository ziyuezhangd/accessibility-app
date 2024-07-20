import { View, Text, TouchableHighlight } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import React, { useContext, useState } from 'react';
import { useTheme, Surface, TouchableRipple, MD3Theme, List, Icon } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { PLACE_CATEGORIES, PlaceInfo, categoryToParentCategory } from '../interfaces/PlaceInfo';
import { MarkerConfig } from '../interfaces/Map';
import { GoogleMapContext, GoogleMapContextType } from '../providers/MapProvider';
import { DataContext, DataContextType } from '../providers/DataProvider';

export default function PlacesBottomPanel() {
  const { createMarkers, setRegion, region } = useContext(GoogleMapContext) as GoogleMapContextType;
  const { placeInfos, restrooms } = useContext(DataContext) as DataContextType;
  const theme = useTheme();

  const [filteredPlaces, setFilteredPlaces] = useState<PlaceInfo[]>([]);

  const handleCategoryPressed = (category: PLACE_CATEGORIES) => {
    if (category === PLACE_CATEGORIES.TOILETS) {
      // TODO: fix
      setFilteredPlaces([]);
      const markers: MarkerConfig[] = restrooms.map((r, idx) => ({ lat: r.latitude, lng: r.longitude, title: r.name, key: `${r.name}-${idx}`, description: r.restroomType }));
      createMarkers(markers, true);
    } else {
      const placeInfosInCategory = placeInfos.filter((pi) => categoryToParentCategory(pi.category) === category);
      setFilteredPlaces(placeInfosInCategory);
      const markers: MarkerConfig[] = placeInfosInCategory.map((pi, idx) => ({ lat: pi.latitude, lng: pi.longitude, title: pi.name, key: `${pi.name}-${idx}`, icon: pi.hasWheelchairAccessibleRestroom ? 'toilet' : null }));
      createMarkers(markers, true);
    }

    // Zoom out a bit
    if (!region) {
      console.log('No region');
    }
    setRegion({ latitude: region.latitude, longitude: region.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 });
  };

  const PlaceCategory = ({ theme, name, category, icon }: { theme: MD3Theme; name: string; category: PLACE_CATEGORIES; icon: string }) => {
    return (
      <TouchableHighlight onPress={() => handleCategoryPressed(category)} style={{ ...styles.surface }}>
        <Surface style={{ ...styles.surface, backgroundColor: theme.colors.primaryContainer }}>
          <Icon source={icon} size={25} />
          <Text style={{color: theme.colors.onSurface}}>{name}</Text>
        </Surface>
      </TouchableHighlight>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.surfaceContainer}>
        <PlaceCategory theme={theme} name='Restaurants' category={PLACE_CATEGORIES.RESTAURANT} icon='silverware-fork-knife' />
        <PlaceCategory theme={theme} name='Toilets' category={PLACE_CATEGORIES.TOILETS} icon='toilet' />
        <PlaceCategory theme={theme} name='Shopping' category={PLACE_CATEGORIES.RETAIL} icon='shopping-outline' />
      </View>
      <View style={styles.surfaceContainer}>
        <PlaceCategory theme={theme} name='Health' category={PLACE_CATEGORIES.HEALTH} icon='hospital-box-outline' />
        <PlaceCategory theme={theme} name='Accomodation' category={PLACE_CATEGORIES.ACCOMODATIONS} icon='bed' />
        <PlaceCategory theme={theme} name='Attractions' category={PLACE_CATEGORIES.ATTRACTIONS} icon='camera' />
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
