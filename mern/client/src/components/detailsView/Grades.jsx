import { SentimentDissatisfiedTwoTone, SentimentNeutralTwoTone, SentimentSatisfiedTwoTone, SentimentVeryDissatisfiedTwoTone, SentimentVerySatisfiedTwoTone } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { calculateDistanceBetweenTwoCoordinates, findClosestSegment, isBetween } from '../../utils/MapUtils';

const MeterBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '80%',
  height: '10px',
  backgroundColor: '#e0e0e0',
  borderRadius: '5px',
  overflow: 'hidden',
  marginBottom: theme.spacing(1),
}));

const Fill = styled(Box)(({ width, color }) => ({
  width: `${width}%`,
  height: '100%',
  backgroundColor: color,
  transition: 'width 1s ease-in-out',
}));

const IconBox = styled(Box)(({ theme, showIcon }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(1),
  marginTop: theme.spacing(-1),
  opacity: showIcon ? 1 : 0,
  transition: 'opacity 0.5s ease-in',
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedTwoTone color='error' />,
    label: 'Very Bad',
    color: '#d32f2f',
  },
  2: {
    icon: <SentimentDissatisfiedTwoTone color='error' />,
    label: 'Bad',
    color: '#f44336',
  },
  3: {
    icon: <SentimentNeutralTwoTone color='warning' />,
    label: 'Okay',
    color: '#ff9800',
  },
  4: {
    icon: <SentimentSatisfiedTwoTone color='success' />,
    label: 'Good',
    color: '#4caf50',
  },
  5: {
    icon: <SentimentVerySatisfiedTwoTone color='success' />,
    label: 'Excellent',
    color: '#388e3c',
  },
};

const letterGradeToValue = {
  'A': 5,
  'B': 4,
  'C': 3,
  'D': 2,
  'E': 2,
  'F': 1,
};
const numberGradeToValue = {
  0: 5,
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1,
};

export default function Grades({lat, lng, predictions}) {
  const { busynessData, odorData, noiseData } = useContext(DataContext);
  const [busynessGrade, setBusynessGrade] = useState(1);
  const [odorGrade, setOdorGrade] = useState(1);
  const [noiseGrade, setNoiseGrade] = useState(1);
  const [filledBusyness, setFilledBusyness] = useState(0);
  const [filledOdor, setFilledOdor] = useState(0);
  const [filledNoise, setFilledNoise] = useState(0);
  const [showIcons, setShowIcons] = useState(false);

  useEffect(() => {
    if (predictions) {
      setBusynessGrade(letterGradeToValue[predictions['busyness']]);
      setNoiseGrade(numberGradeToValue[predictions['noise']]);
      setOdorGrade(letterGradeToValue[predictions['odor']]);
    } else {
      getGrades();
    }
  }, [predictions, busynessData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilledBusyness((busynessGrade / 5) * 100);
      setFilledOdor((odorGrade / 5) * 100);
      setFilledNoise((noiseGrade / 5) * 100);
    });

    return () => clearTimeout(timeout);
  }, [busynessGrade, odorGrade, noiseGrade]);

  useEffect(() => {
    const iconTimeout = setTimeout(() => {
      setShowIcons(true);
    },1100);
    
    return () => clearTimeout(iconTimeout);
  }, [filledBusyness, filledOdor, filledNoise]);

  const getGrades = async () => {
    const closestBusynessGrade = findClosestSegment({lat, lng}, busynessData);
    setBusynessGrade(letterGradeToValue[closestBusynessGrade.prediction]);

    const closestOdorGrade = _.minBy(odorData, bd => calculateDistanceBetweenTwoCoordinates(bd.location.lat, bd.location.lng, lat, lng));
    setOdorGrade(letterGradeToValue[closestOdorGrade.prediction]);
    console.log('Odor: ', closestOdorGrade.prediction, letterGradeToValue[closestOdorGrade.prediction]);

    const closestNoiseGrade = findClosestSegment({ lat, lng }, noiseData);
    setNoiseGrade(numberGradeToValue[closestNoiseGrade.prediction]);
    console.log('Noise: ', closestNoiseGrade.prediction, numberGradeToValue[closestNoiseGrade.prediction]);
  };

  const renderGrade = (label, grade, fillWidth, showIcon) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 1, width: '100%' }}>
      <Typography variant='h6'>{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <MeterBox>
          <Fill width={fillWidth}
            color={customIcons[grade].color} />
        </MeterBox>
        <IconBox showIcon={showIcon}>{customIcons[grade].icon}</IconBox>
      </Box>
      <Typography variant='body2'>{customIcons[grade].label}</Typography>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      {renderGrade('Busyness', busynessGrade, filledBusyness, showIcons)}
      {renderGrade('Noise', noiseGrade, filledNoise, showIcons)}
      {renderGrade('Odor', odorGrade, filledOdor, showIcons)}
    </Box>
  );
}
