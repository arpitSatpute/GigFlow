import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gigApi } from '../api/gigApi';
import { bidApi } from '../api/bidApi';
import { useAuth } from '../contexts/AuthContext';
import BidForm from '../components/bids/BidForm';
import BidList from '../components/bids/BidList';
import toast from 'react-hot-toast';
import { DollarSign, User, Calendar, ArrowLeft } from 'lucide-react';

const GigDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [hiring, setHiring] = useState(false);
  const [userHasBid, setUserHasBid] = useState(false);

  useEffect(() => {
    fetchGigDetails();
  }, [id]);

  const fetchGigDetails = async () => {
    setLoading(true);
    try {
      const response = await gigApi.getGigById(id);
      if (response.success) {
        setGig(response.data);
        
        // If user is the owner, fetch bids
        if (isAuthenticated && user && response.data.ownerId._id === user._id) {
          fetchBids();
        }
        
        // Check if user has already bid
        if (isAuthenticated && user) {
          checkUserBid();
        }
      }
    } catch (error) {
      toast.error('Failed to fetch gig details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async () => {
    setBidsLoading(true);
    try {
      const response = await bidApi.getBidsForGig(id);
      if (response.success) {
        setBids(response.data);
      }
    } catch (error) {
      console.error('Error fetching bids:', error);
    } finally {
      setBidsLoading(false);
    }
  };

  const checkUserBid = async () => {
    try {
      const response = await bidApi.getMyBids();
      if (response.success) {
        const hasBid = response.data.some((bid) => bid.gigId?._id === id);
        setUserHasBid(hasBid);
      }
    } catch (error) {
      console.error('Error checking user bid:', error);
    }
  };

  const handleBidSubmitted = () => {
    setUserHasBid(true);
    toast.success('Your bid has been submitted!');
  };

  const handleHire = async (bidId) => {
    if (!window.confirm('Are you sure you want to hire this freelancer?')) {
      return;
    }

    setHiring(true);
    try {
      const response = await bidApi.hireBid(bidId);
      if (response.success) {
        toast.success('Freelancer hired successfully!');
        // Refresh gig and bids
        fetchGigDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to hire freelancer');
    } finally {
      setHiring(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Gig not found</p>
      </div>
    );
  }

  const isOwner = isAuthenticated && user && gig.ownerId._id === user._id;
  const canBid = isAuthenticated && !isOwner && gig.status === 'open' && !userHasBid;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  gig.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {gig.status === 'open' ? 'Open' : 'Assigned'}
              </span>
            </div>

            <div className="prose max-w-none mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {gig.description}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Posted by: </span>
                  <span className="font-medium text-gray-900">
                    {gig.ownerId.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDate(gig.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bids Section for Owner */}
          {isOwner && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Received Bids ({bids.length})
              </h2>
              <BidList
                bids={bids}
                loading={bidsLoading}
                showHireButton={gig.status === 'open'}
                onHire={handleHire}
                hiring={hiring}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Budget Card */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget</h3>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-primary-600" />
              <span className="text-3xl font-bold text-gray-900">
                ${gig.budget}
              </span>
            </div>
          </div>

          {/* Bid Form */}
          {canBid && (
            <BidForm gigId={gig._id} onBidSubmitted={handleBidSubmitted} />
          )}

          {userHasBid && !isOwner && (
            <div className="card bg-blue-50 border-blue-200">
              <p className="text-blue-800 text-center">
                You have already submitted a bid for this gig
              </p>
            </div>
          )}

          {!isAuthenticated && gig.status === 'open' && (
            <div className="card bg-gray-50">
              <p className="text-gray-700 text-center mb-4">
                Sign in to submit a bid
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full btn-primary"
              >
                Login
              </button>
            </div>
          )}

          {gig.status === 'assigned' && !isOwner && (
            <div className="card bg-gray-50 border-gray-200">
              <p className="text-gray-700 text-center">
                This gig has been assigned to a freelancer
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetail;