import express from 'express';
import { getLocations, getAgencyReviews, getPopTours, getAllTours, getTour, bookTour } from '../controllers/api_v1.mjs';

const router = express.Router();

router.get('/locations', getLocations);
router.get('/agency-reviews', getAgencyReviews);
router.get('/popular-tours-previews', getPopTours);
router.get('/all-tours-previews?', getAllTours);
router.get('/all-tours/:tourId', getTour);
router.post('/bookTour', bookTour);

export default router;