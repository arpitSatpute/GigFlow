import RegisterForm from '../components/auth/RegisterForm';
import { Briefcase } from 'lucide-react';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Briefcase className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">GigFlow</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;