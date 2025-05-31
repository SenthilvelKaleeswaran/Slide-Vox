// routes/slides.js
const express = require('express');
const router = express.Router();
const slideController = require('./controller');

router.get('/', slideController.getAllSlides);

router.get('/:id', slideController.getSlideById);

router.post('/', slideController.createSlide);

router.put('/:id', slideController.updateSlide);

router.delete('/:id', slideController.deleteSlide);

module.exports = router;
