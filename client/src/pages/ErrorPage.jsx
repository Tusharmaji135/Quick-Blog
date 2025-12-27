import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-[150px] sm:text-[200px] font-bold text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-2">🔍</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mt-4 text-base sm:text-lg">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200 shadow-lg shadow-primary/25"
          >
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
          >
            Go Back
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-2">
          <span className="w-2 h-2 bg-primary/30 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:0.1s]"></span>
          <span className="w-2 h-2 bg-primary/70 rounded-full animate-bounce [animation-delay:0.2s]"></span>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
