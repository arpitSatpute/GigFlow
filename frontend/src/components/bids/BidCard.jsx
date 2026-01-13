import { User, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react';

const BidCard = ({ bid, showHireButton, onHire, hiring }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      hired: { bg: 'bg-green-100', text: 'text-green-800', label: 'Hired' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
    };

    const badge = badges[status] || badges.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        {/* <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">
            {bid.freelancerId?.name || 'Anonymous'}
          </span>
        </div> */}
        {getStatusBadge(bid.status)}
      </div>

      <p className="text-gray-700 mb-4">{bid.message}</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold text-gray-900">${bid.price}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(bid.createdAt)}</span>
          </div>
        </div>

        {showHireButton && bid.status === 'pending' && (
          <button
            onClick={() => onHire(bid._id)}
            disabled={hiring}
            className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hiring ? 'Hiring...' : 'Hire'}
          </button>
        )}

        {bid.status === 'hired' && (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Hired</span>
          </div>
        )}

        {bid.status === 'rejected' && (
          <div className="flex items-center space-x-1 text-red-600">
            <XCircle className="w-5 h-5" />
            <span className="font-medium">Rejected</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidCard;
