import React from 'react';

const PayFees = () => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert('Failed to load Razorpay SDK. Please check your internet connection.');
      return;
    }

    const options = {
      key: 'rzp_test_gOyPPGHu7NlMi7', // Replace with your Razorpay key
      amount: 50000, // Amount in paise (e.g., 50000 paise = 500 INR)
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Payment for fees',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'Your Name',
        email: 'your.email@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div>
      <h1>Pay Fees</h1>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PayFees;
