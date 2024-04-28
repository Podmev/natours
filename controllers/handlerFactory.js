/* eslint-disable prefer-template */
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id).exec();

    if (!doc) {
      return next(
        new AppError(
          `No ${Model.modelName.toLowerCase()} found with that ID`,
          404,
        ),
      );
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    const docName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(new AppError(`No ${docName} found with that ID`, 404));
    }

    const resObj = {
      status: 'success',
      data: {},
    };
    resObj.data[docName] = doc;
    res.status(200).json(resObj);
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    const docName = Model.modelName.toLowerCase();

    const resObj = {
      status: 'success',
      data: {},
    };
    resObj.data[docName] = newDoc;
    res.status(201).json(resObj);
  });

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);
    const doc = await query;

    const docName = Model.modelName.toLowerCase();
    //Tour.findOne({_id: req.params.id})

    if (!doc) {
      return next(new AppError(`No ${docName} found with that ID`, 404));
    }

    const resObj = {
      status: 'success',
      data: {},
    };
    resObj.data[docName] = doc;
    res.status(200).json(resObj);
  });

exports.getAll = (Model, dataPluralName) =>
  catchAsync(async (req, res, next) => {
    // to allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const docs = await features.query.explain();
    const docs = await features.query;

    const docName = Model.modelName.toLowerCase();
    const docNamePlural = dataPluralName || docName + 's';

    // SEND RESPONSE
    const resObj = {
      status: 'success',
      results: docs.length,
      data: {},
    };
    resObj.data[docNamePlural] = docs;
    res.status(200).json(resObj);
  });
