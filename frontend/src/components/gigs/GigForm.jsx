import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gigApi } from '../../api/gigApi';
import toast from 'react-hot-toast';
import { Briefcase, FileText, DollarSign } from 'lucide-react';

const GigForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await gigApi.createGig({
        ...formData,
        budget: Number(formData.budget),
      });

      if (response.success) {
        toast.success('Gig created successfully!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Post a New Gig</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="e.g., Build a React Website"
                required
                maxLength="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field pl-10 min-h-32"
                placeholder="Describe the project requirements, skills needed, timeline, etc."
                required
                maxLength="2000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/2000 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="500"
                required
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Post Gig'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GigForm;