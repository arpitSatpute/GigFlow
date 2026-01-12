import Gig from "../models/Gig.js";

// get all gigs by search query or by status
export const getGigs = async (req, res, next) => {
    try {
        const {search, status} = req.query;
        let query = {};

        query.status = status || 'open' ;


        if(search) {
            query.$or = [
                {
                    title: { $regex: search, $options: 'i'}
                },
                {
                    description: { $regex: search, $options: 'i' }
                }
            ];
        }

        const gigs = await Gig.find(query)
            .populate('ownerId', 'name email')
            .sort({createdAt: -1});
         res.status(200).json({
            success: true,
            count: gigs.length,
            data: gigs,
        });
    } catch (error) {
        next(error);
    }
}


// get single gig by gigid
export const getGig = async (req, res, next) => {
    try {
        const gig = await Gig.findById(req.params.id).populate(
            "ownerId",
            "name email"
        );

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found',
            });
        }

        res.status(200).json({
            success: true,
            data: gig,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}


// create a new gig
export const createGig = async (req, res, next) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: gig,
    });
  } catch (error) {
    next(error);
  }
};


// put method to update gig
export const updateGig = async (req, res, next) => {
  try {
    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this gig',
      });
    }

    gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: gig,
    });
  } catch (error) {
    next(error);
  }
};

// delete gigs
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found',
      });
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this gig',
      });
    }

    await gig.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// get own gigs
export const getMyGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};