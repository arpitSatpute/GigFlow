import BidCard from './BidCard';

const BidList = ({ bids, loading, showHireButton, onHire, hiring }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 text-lg">No bids yet</p>
        <p className="text-gray-400 text-sm mt-2">Be the first to submit a bid!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bids.map((bid) => (
        <BidCard
          key={bid._id}
          bid={bid}
          showHireButton={showHireButton}
          onHire={onHire}
          hiring={hiring}
        />
      ))}
    </div>
  );
};

export default BidList;