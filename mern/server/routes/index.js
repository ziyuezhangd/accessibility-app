import express from 'express';
import accessibilityHighlightPlace from './accessibilityHighlightPlace.js';
import busynessRating from './busynessRating.js';
import feedback from './feedback.js';
import noiseRating from './noiseRating.js';
import odourRating from './odourRating.js';
import placeInfos from './place-infos.js';
import records from './record.js';
import soundRating from './soundRating.js';

const router = express.Router();

router.use('/accessibility-highlight-place', accessibilityHighlightPlace);
router.use('/busyness-ratings', busynessRating);
router.use('/feedback', feedback);
router.use('/noise-ratings', noiseRating);
router.use('/odour-ratings', odourRating);
router.use('/place-infos', placeInfos);
router.use('/record', records);
router.use('/sound-ratings', soundRating);

export default router;