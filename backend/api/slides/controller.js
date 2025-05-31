const slideService = require('./service');

const getAllSlides = async (req, res) => {
  try {
    const slides = await slideService.getAllSlides();
    res.status(200).json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSlideById = async (req, res) => {
  try {
    const slide = await slideService.getSlideById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    res.status(200).json(slide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSlide = async (req, res) => {
  try {
    const slide = await slideService.createSlide(req.body);
    res.status(201).json(slide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSlide = async (req, res) => {
  try {
    const slide = await slideService.updateSlide(req.params.id, req.body);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    res.status(200).json(slide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSlide = async (req, res) => {
  try {
    const slide = await slideService.deleteSlide(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    res.status(200).json({ message: 'Slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
};
