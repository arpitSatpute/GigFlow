import LoginForm from '../components/auth/LoginForm';
import { Briefcase } from 'lucide-react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Briefcase className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">GigFlow</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
