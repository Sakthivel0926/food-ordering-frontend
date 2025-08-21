import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  useEffect(() => {
    // Redirect to home if no order data is available
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  const handleViewOrders = () => {
    // Navigate to dashboard with a query parameter to trigger scroll to recent orders
    navigate('/dashboard?showRecentOrders=true');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. Your order has been placed successfully.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h2 className="font-semibold text-gray-800 mb-2">Order Details</h2>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Order ID:</span> {order._id.slice(-8).toUpperCase()}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Estimated Delivery:</span>{' '}
            {new Date(order.estimatedDeliveryTime).toLocaleString()}
          </p>
          <p className="text-lg font-semibold mt-3">
            Total: ${order.totalAmount?.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleViewOrders}
            className="w-full bg-[#D4AF37] text-black py-2 px-4 rounded-md hover:bg-[#B22222] hover:text-white transition"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="w-full bg-white text-[#B22222] border border-[#B22222] py-2 px-4 rounded-md hover:bg-gray-50 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
