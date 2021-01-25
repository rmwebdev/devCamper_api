const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get courses
// @route GET /api/V1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public

exports.getCourses = asyncHandler(async (req, res, next) => {
    if(req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success:true,
            count: courses.length,
            data: courses
        });
    } else {
      res.status(200).json(res.advancedResults);
    } 
});


// @desc    Get single courses
// @route GET /api/V1/courses/:id
// @access  Public

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if(!course) {
        return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }
    res.status(200).json({
        success:true,
        data: course
    });
});


// @desc    Add new courses
// @route POST /api/V1/bootcamps/:bootcampId/courses
// @access  Privte
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;


    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp) {
        return next(
        new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404);
    }

        // Make sure user id bootcamp owner
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ErrorResponse(`User id: ${req.user.name} is not autorize to add course to this bootcamp ${bootcamp._id}`, 401));
        }

    const course = await Course.create(req.body);
    
    res.status(200).json({
        success:true,
        data: course
    });
});


// @desc    Update courses
// @route PUT /api/V1/courses/:i
// @access  Privte
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id);

    if(!course) {
        return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }
        // Make sure user id course owner
        if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ErrorResponse(`User id: ${req.user.name} is not autorize to update course to this course ${course._id}`, 401));
        }
    
    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success:true,
        data: course
    });
});


// @desc    Delete courses
// @route DELETE /api/V1/courses/:i
// @access  Privte
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id);

    if(!course) {
        return next(
        new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }
    // Make sure user id course owner
    if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User id: ${req.user.name} is not autorize to delete course to this course ${course._id}`, 401));
    }
    
   await course.remove();
    res.status(200).json({
        success:true,
        data: {}
    });
});