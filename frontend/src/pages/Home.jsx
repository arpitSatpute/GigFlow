import { useState, useEffect } from 'react';
import { gigApi } from '../api/gigApi';
import GigList from '../components/gigs/GigList';
import { Search } from 'lucide-react';

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async (search = '') => {
    setLoading(true);
    try {
      const response = await gigApi.getAllGigs(search);
      if (response.success) {
        setGigs(response.data);
      }
    } catch (error) {
      console.error('Error fetching gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs(searchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Next Opportunity
        </h1>
        <p className="text-xl text-gray-600">
          Browse open gigs and submit your bids
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gigs by title or description..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary"
          >
            Search
          </button>
        </form>
      </div>

      {/* Gigs List */}
      <GigList gigs={gigs} loading={loading} />
    </div>
  );
};

export default Home;