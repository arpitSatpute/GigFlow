import Gig from "../models/Gig.js";
import Bid from '../models/Bid.js';
import mongoose from "mongoose";

export const createBid = async (req, res, next) => {
    try {
       const {gigId, message, price } = req.body;
       
       if (!gigId || !message || !price) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }
        const gig = await Gig.findById(gigId);
        
        if (!gig) {
            return res.status(404).json({
                success: false,
                message: 'Gig not found',
            });
        }
        if (gig.status !== 'open') {
            console.log(gig.status)
            return res.status(400).json({
                success: false,
                message: 'This gig is no longer accepting bids',
            });
        }

        if (gig.ownerId.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot bid on your own gig',
            });
        }

        const existingBid = await Bid.findOne({
            gigId,
            freelancerId: req.user._id,
        });

        if (existingBid) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted a bid for this gig',
            });
        }

        const bid = await Bid.create({
            gigId,
            freelancerId: req.user._id,
            message,
            price,
        });

        await bid.populate('freelancerId', 'name email');

        res.status(201).json({
            success: true,
            data: bid,
        });
    } catch (error) {
        next(error);
    }
};


export const getBidsForGig = async (req, res, next) => {
    try {
        const { gigId } = req.params;

        const gig = await Gig.findById(gigId);

        if (!gig) {
        return res.status(404).json({
            success: false,
            message: 'Gig not found',
        });
        }

        if (gig.ownerId.toString() !== req.user._id.toString()) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to view bids for this gig',
        });
        }

        const bids = await Bid.find({ gigId })
        .populate('freelancerId', 'name email')
        .sort({ createdAt: -1 });

        res.status(200).json({
        success: true,
        count: bids.length,
        data: bids,
        });
    } catch (error) {
        next(error);
    }
};



export const getMyBids = async (req, res, next) => {
    try {
        const bids = await Bid.find({ freelancerId: req.user._id })
        .populate('gigId')
        .sort({ createdAt: -1 });

        res.status(200).json({
        success: true,
        count: bids.length,
        data: bids,
        });
    } catch (error) {
        next(error);
    }
};




export const hireBid = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { bidId } = req.params;

        const bid = await Bid.findById(bidId)
        .populate('gigId')
        .session(session);

        if (!bid) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
            success: false,
            message: 'Bid not found',
        });
        }

        const gig = bid.gigId;

        if (gig.ownerId.toString() !== req.user._id.toString()) {
        await session.abortTransaction();
        session.endSession();
        return res.status(401).json({
            success: false,
            message: 'Not authorized to hire for this gig',
        });
        }

        if (gig.status !== 'open') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'This gig has already been assigned',
            });
        }

        if (bid.status !== 'pending') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: 'This bid has already been processed',
            });
        }

        
        bid.status = 'hired';
        await bid.save({ session });


        gig.status = 'assigned';
        await gig.save({ session });


        await Bid.updateMany(
            {
                gigId: gig._id,
                _id: { $ne: bid._id },
                status: 'pending',
            },
            { status: 'rejected' },
            { session }
        );


        await session.commitTransaction();
        session.endSession();


        await bid.populate('freelancerId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Freelancer hired successfully',
            data: bid,
        });
    } 
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};