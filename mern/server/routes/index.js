import express from 'express';
import accessibilityHighlightPlace from './accessibilityHighlightPlace.js';
import busynessRating from './busynessRating.js';
import feedback from './feedback.js';
import noiseRating from './noiseRating.js';
import odourRating from './odourRating.js';
import pedestrianRamps from './pedestrianRamps.js';
import pedestrianSignals from './pedestrianSignals.js';
import placeInfos from './placeInfos.js';
import seatingAreas from './seatingAreas.js';

const router = express.Router();

router.use('/accessibility-highlight-place', accessibilityHighlightPlace);
router.use('/busyness-ratings', busynessRating);
router.use('/feedback', feedback);
router.use('/noise-ratings', noiseRating);
router.use('/odour-ratings', odourRating);
router.use('/place-infos', placeInfos);
router.use('/seating-areas', seatingAreas);
router.use('/pedestrian-signals', pedestrianSignals);
router.use('/pedestrian-ramps', pedestrianRamps);

export default router;
