import GigCard from './GigCard';

const GigList = ({ gigs, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No gigs found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gigs.map((gig) => (
        <GigCard key={gig._id} gig={gig} />
      ))}
    </div>
  );
};

export default GigList;
