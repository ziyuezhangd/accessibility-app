import { SentimentDissatisfied, SentimentDissatisfiedTwoTone, SentimentNeutral, SentimentNeutralTwoTone, SentimentSatisfied, SentimentSatisfiedTwoTone, SentimentVeryDissatisfied, SentimentVeryDissatisfiedTwoTone, SentimentVerySatisfied, SentimentVerySatisfiedTwoTone } from '@mui/icons-material';
import { Box, Rating, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { calculateDistanceBetweenTwoCoordinates, findClosestSegment, isBetween } from '../../utils/MapUtils';

const StyledRating = styled(Rating)(({ theme }) => ({
  '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
    color: theme.palette.action.disabled,
  },
}));

const customIcons = {
  1: {
    icon: <SentimentVeryDissatisfiedTwoTone color='error' />,
    label: 'Very Bad',
  },
  2: {
    icon: <SentimentDissatisfiedTwoTone color='error' />,
    label: 'Bad',
  },
  3: {
    icon: <SentimentNeutralTwoTone color='warning' />,
    label: 'Okay',
  },
  4: {
    icon: <SentimentSatisfiedTwoTone color='success' />,
    label: 'Good',
  },
  5: {
    icon: <SentimentVerySatisfiedTwoTone color='success' />,
    label: 'Excellent',
  },
};

function IconContainer(props) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

export default function Grades({lat, lng}) {
  const {getPredictions} = useContext(DataContext);
  const {createMarkers} = useContext(GoogleMapContext);
  const [busynessGrade, setBusynessGrade] = useState(1);
  const [odorGrade, setOdorGrade] = useState(1);
  const [noiseGrade, setNoiseGrade] = useState(1);
  
  useEffect(() => {
    getGrades();
  }, [lat, lng]);

  const getGrades = async () => {
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
    const {busynessData, odorData, noiseData} = await getPredictions();

    // TODO: these take a while to calculate - what if we just change the code such that users can only click on segments?
    const closestBusynessGrade = findClosestSegment({lat, lng}, busynessData);
    setBusynessGrade(letterGradeToValue[closestBusynessGrade.prediction]);
    
    /// TODO: not great
    const closestOdorGrade = _.minBy(odorData, bd => calculateDistanceBetweenTwoCoordinates(bd.location.lat, bd.location.lng, lat, lng));
    setOdorGrade(letterGradeToValue[closestOdorGrade.prediction]);
    console.log('Odor: ', closestOdorGrade.prediction, letterGradeToValue[closestOdorGrade.prediction]);
  
    const closestNoiseGrade = findClosestSegment({lat, lng}, noiseData);
    setNoiseGrade(numberGradeToValue[closestNoiseGrade.prediction]);
    console.log('Noise: ', closestNoiseGrade.prediction, numberGradeToValue[closestNoiseGrade.prediction]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant='h6'>Busyness</Typography>
        <Box sx={{ display: 'flex' }}>
          <StyledRating name='highlight-selected-only'
            readOnly
            value={busynessGrade}
            IconContainerComponent={IconContainer}
            highlightSelectedOnly />
          <Typography variant='body2'>{customIcons[busynessGrade].label}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant='h6'>Noise</Typography>
        <Box sx={{ display: 'flex' }}>
          <StyledRating name='highlight-selected-only'
            readOnly
            value={noiseGrade}
            IconContainerComponent={IconContainer}
            highlightSelectedOnly />
          <Typography variant='body2'>{customIcons[noiseGrade].label}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant='h6'>Odor</Typography>
        <Box sx={{ display: 'flex' }}>
          <StyledRating name='highlight-selected-only'
            readOnly
            value={odorGrade}
            IconContainerComponent={IconContainer}
            highlightSelectedOnly />
          <Typography variant='body2'>{customIcons[odorGrade].label}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
