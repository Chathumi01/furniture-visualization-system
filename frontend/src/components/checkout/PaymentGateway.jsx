import React, { useState } from "react";

const DummyPaymentGateway = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <div className="payment-gateway">
      <form onSubmit={handlePayment}>
        <input type="text" required />
        <input type="text" required />
        <input type="text" required />
        <button type="submit" disabled={isProcessing}>
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default DummyPaymentGateway;
