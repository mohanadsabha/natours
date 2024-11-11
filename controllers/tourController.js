const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
    // Excute Query
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;
    // Send Query
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours },
    });
});
exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
        return next(new AppError('No tour found with that id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { tour },
    });
});
exports.creatTour = catchAsync(async (req, res, next) => {
    // const newTour = new Tour({});
    // newTour.save(); //Same as:
    // mongo throw error when required fields not sent;
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { tour: newTour },
    });
});
exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        // run the validators in the schema again, such as the length of the name
        runValidators: true,
    });
    if (!tour) {
        return next(new AppError('No tour found with that id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: { tour },
    });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError('No tour found with that id', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                // _id: '$ratingsAverage',
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuentity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            // 1 means ascending,, in this stage we already have the data as in the group stage.
            $sort: { avgPrice: 1 },
        },
        // {
        //     $match: { _id: { ne: 'EASY' } }
        // }
    ]);
    res.status(200).json({
        status: 'success',
        data: { stats },
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            // deconstruct array fields from the input doc, outputs 1 doc for each el in the array
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lse: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numTourStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            // Adds a new field month to the output, duplicating the _id value which contains the month number.
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                // Excludes the _id field from the output
                _id: 0,
            },
        },
        {
            $sort: { numTourStarts: -1 },
        },
        // {
        //     $limit: 6
        // }
    ]);
    res.status(200).json({
        status: 'success',
        data: { plan },
    });
});
