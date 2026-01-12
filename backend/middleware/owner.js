const asyncHandler = require('express-async-handler');
const Gig = require('../models/Gig');

const isGigOwner = asyncHandler(async (req, res, next) => {
    const gig = await Gig.findById(req.params.gigId || req.body.gigId);

    if(!gig) {
        return res.status(403).json({
            success: false,
            message: 'Not the owner of tthe Gig',
        });
    }

    req.gig = gig;
    next();

});

module.exports = { isGigOwner };
