import GigForm from '../components/gigs/GigForm';

const CreateGig = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Gig</h1>
        <p className="text-gray-600">
          Describe your project and find the perfect freelancer
        </p>
      </div>
      <GigForm />
    </div>
  );
};

export default CreateGig;