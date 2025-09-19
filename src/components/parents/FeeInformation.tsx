// FeeInformation.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeeInformation = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fee Information</h1>
      {/* Existing table or fee details */}

      <button
        onClick={() => navigate('/parent/payment')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Pay Fees
      </button>
    </div>
  );
};

export default FeeInformation;
