import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gigApi } from '../api/gigApi';
import { bidApi } from '../api/bidApi';
import GigCard from '../components/gigs/GigCard';
import BidCard from '../components/bids/BidCard';
import { Briefcase, MessageSquare, Plus } from 'lucide-react';

const Dashboard = () => {
  const [myGigs, setMyGigs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('gigs');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gigsResponse, bidsResponse] = await Promise.all([
        gigApi.getMyGigs(),
        bidApi.getMyBids(),
      ]);

      if (gigsResponse.success) {
        setMyGigs(gigsResponse.data);
      }
      if (bidsResponse.success) {
        setMyBids(bidsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Manage your gigs and bids</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('gigs')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'gigs'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>My Gigs ({myGigs.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'bids'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>My Bids ({myBids.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'gigs' && (
            <div>
              {myGigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myGigs.map((gig) => (
                    <GigCard key={gig._id} gig={gig} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 card">
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">No gigs posted yet</p>
                  <Link to="/create-gig" className="inline-flex items-center space-x-2 btn-primary">
                    <Plus className="w-4 h-4" />
                    <span>Post Your First Gig</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bids' && (
            <div>
              {myBids.length > 0 ? (
                <div className="space-y-4">
                  {myBids.map((bid) => (
                    <div key={bid._id} className="card">
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {bid.gigId?.title || 'Gig Title'}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {bid.gigId?.description}
                        </p>
                      </div>
                      <BidCard bid={bid} showHireButton={false} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 card">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-4">No bids submitted yet</p>
                  <Link to="/" className="btn-primary">
                    Browse Gigs
                  </Link>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
