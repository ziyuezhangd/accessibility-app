import { View, Text } from 'react-native';
import React from 'react';
import { useTheme } from 'react-native-paper';

export default function PredictionsBottomPanel() {
  const theme = useTheme();
  return (
    <View>
      <Text style={{ fontSize: 40, color: theme.colors.primary }}>PredictionsBottomPanel</Text>
    </View>
  );
}
