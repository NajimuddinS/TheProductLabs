// @desc    Get home page data
// @route   GET /api/home
// @access  Private
const getHome = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Welcome to the protected home page!',
      user: req.user
    }
  });
};

module.exports = { getHome };