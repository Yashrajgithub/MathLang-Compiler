import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Enhanced error logging with additional context
    console.error(
      `404 Error: Attempted access to a non-existent route: ${location.pathname}. Please check the URL or navigate back to the homepage.`
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center max-w-lg p-6 bg-white shadow-xl rounded-lg">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Page not found.</p>
        <p className="text-md text-gray-500 mb-4">
          The page you're looking for doesn't exist. You might have followed a broken link or mistyped the address.
        </p>
        <Link
          to="/"
          className="text-lg text-blue-600 hover:text-blue-800 font-semibold underline transition-all duration-300 ease-in-out"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
