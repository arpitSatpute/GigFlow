import { useState } from 'react';
import { bidApi } from '../../api/bidApi';
import toast from 'react-hot-toast';
import { MessageSquare, DollarSign } from 'lucide-react';

const BidForm = ({ gigId, onBidSubmitted }) => {
  const [formData, setFormData] = useState({
    message: '',
    price: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await bidApi.createBid({
        gigId,
        message: formData.message,
        price: Number(formData.price),
      });

      if (response.success) {
        toast.success('Bid submitted successfully!');
        setFormData({ message: '', price: '' });
        if (onBidSubmitted) onBidSubmitted();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit bid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Submit Your Bid</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Proposal
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="input-field pl-10 min-h-32"
              placeholder="Explain why you're the best fit for this project..."
              required
              maxLength="1000"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formData.message.length}/1000 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Price (USD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-field pl-10"
              placeholder="450"
              required
              min="0"
              step="1"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
};

export default BidForm;