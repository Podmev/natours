const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.setTourAndUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);

// exports.deleteReview = catchAsync(async (req, res, next) => {
//   const { user } = req;

//   let review = null;
//   if (user.role === 'admin') {
//     review = await Review.findByIdAndDelete(req.params.id, {});
//   } else {
//     // TODO can be 403 code forbidden, but i don't know how to do it
//     review = await Review.findByIdAndDelete(req.params.id, { user: user._id });
//   }

//   if (!review) {
//     return next(new AppError('Review not found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
