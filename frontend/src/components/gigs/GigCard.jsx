import { Link } from 'react-router-dom';
import { DollarSign, User, Calendar } from 'lucide-react';

const GigCard = ({ gig }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Link to={`/gig/${gig._id}`}>
      <div className="card hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
            {gig.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              gig.status === 'open'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {gig.status === 'open' ? 'Open' : 'Assigned'}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {gig.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4" />
              <span className="font-semibold text-gray-900">${gig.budget}</span>
            </div>
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{gig.ownerId?.name || 'Anonymous'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(gig.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
