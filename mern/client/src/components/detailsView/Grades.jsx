import { SentimentDissatisfied, SentimentDissatisfiedTwoTone, SentimentNeutral, SentimentNeutralTwoTone, SentimentSatisfied, SentimentSatisfiedTwoTone, SentimentVeryDissatisfied, SentimentVeryDissatisfiedTwoTone, SentimentVerySatisfied, SentimentVerySatisfiedTwoTone } from '@mui/icons-material';
import { Box, Rating, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

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

export default function Grades() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant='h6'>Busyness</Typography>
        <Box sx={{ display: 'flex' }}>
          <StyledRating name='highlight-selected-only'
            readOnly
            defaultValue={4}
            IconContainerComponent={IconContainer}
            getLabelText={(value) => customIcons[value].label}
            highlightSelectedOnly />
          <Typography variant='body2'>Good</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant='h6'>Noise</Typography>
        <Box sx={{ display: 'flex' }}>
          <StyledRating name='highlight-selected-only'
            readOnly
            defaultValue={3}
            IconContainerComponent={IconContainer}
            getLabelText={(value) => customIcons[value].label}
            highlightSelectedOnly />
          <Typography variant='body2'>Okay</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 1 }}>
        <Typography variant='h6'>Odor</Typography>
        <Box sx={{ display: 'flex' }}>
          <StyledRating name='highlight-selected-only'
            readOnly
            defaultValue={2}
            IconContainerComponent={IconContainer}
            getLabelText={(value) => customIcons[value].label}
            highlightSelectedOnly />
          <Typography variant='body2'>Bad</Typography>
        </Box>
      </Box>
    </Box>
  );
}
