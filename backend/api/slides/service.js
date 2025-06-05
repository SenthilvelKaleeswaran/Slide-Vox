const Slide = require('./model');

const getAllSlides = async () => {
  try {
    return await Slide.find();
  } catch (error) {
    throw new Error('Failed to fetch slides');
  }
};

const getSlideById = async (id) => {
  try {
    return await Slide.findById(id);
  } catch (error) {
    throw new Error('Failed to fetch slide by ID');
  }
};

const getSlideByConversationId = async (id) => {
  try {
    return await Slide.find({conversationId: id});
  } catch (error) {
    throw new Error('Failed to fetch slide by ID');
  }
};

const createSlide = async (slideData) => {
  try {
    const slide = new Slide(slideData);
    return await slide.save();
  } catch (error) {
    throw new Error('Failed to create slide');
  }
};

const updateSlide = async (id, slideData) => {
  try {
    return await Slide.findByIdAndUpdate(id, slideData, { new: true });
  } catch (error) {
    throw new Error('Failed to update slide');
  }
};

const deleteSlide = async (id) => {
  try {
    return await Slide.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Failed to delete slide');
  }
};

module.exports = {
  getAllSlides,
  getSlideById,
  getSlideByConversationId,
  createSlide,
  updateSlide,
  deleteSlide,
};
