const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  for (let key in obj) {
    if (!allowedFields.includes(key)) delete obj[key];
  }

  return obj;
};

const updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;

  // 1) Create error if user POSTs password data
  if (password || passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );

  // 2) Update user document
  // ONLY allow user to update name and email, filter out unwanted fields not allowed to change.
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// For USER delete their own account
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// For USER get data about themselves
const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

const getAllUsers = factory.getAll(User);
const getUser = factory.getOne(User);

// DO NOT update password with this! when we use findByIdAndUpdate, all SAVE middleware not run!
const updateUser = factory.updateOne(User);

// For admin delete user
const deleteUser = factory.deleteOne(User);

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  getUser,
  updateMe,
  deleteMe,
  getMe,
};
