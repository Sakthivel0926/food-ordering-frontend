import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import axios from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const OrdersPage = forwardRef(({ scrollToRecent = false }, ref) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const recentOrdersRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToRecent: () => {
      recentOrdersRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }));

  useEffect(() => {
    if (scrollToRecent && recentOrdersRef.current) {
      recentOrdersRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollToRecent]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/orders?userId=${user?._id}`);
        setOrders(response.data);
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchOrders();
    }
  }, [user?._id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateOrderStatus = () => {
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.status === 'delivered' || order.status === 'cancelled') {
            return order;
          }

          const orderTime = new Date(order.createdAt);
          const timeDiff = (currentTime - orderTime) / (1000 * 60); // Difference in minutes
          
          // If between 25-30 minutes, mark as delivered
          if (timeDiff >= 25 && timeDiff <= 30) {
            return { ...order, status: 'delivered' };
          }
          
          return order;
        })
      );
    };

    updateOrderStatus();
  }, [currentTime]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await axios.put(`/orders/${orderId}/cancel`, { userId: user?._id });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'cancelled' } : order
      ));
      alert('Order has been cancelled successfully.');
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(err.response?.data?.message || 'Failed to cancel order. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { 
        bg: 'bg-gradient-to-r from-yellow-400 to-orange-500', 
        text: 'text-white',
        icon: '🕒'
      },
      processing: { 
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600', 
        text: 'text-white',
        icon: '👨‍🍳'
      },
      completed: { 
        bg: 'bg-gradient-to-r from-green-500 to-green-600', 
        text: 'text-white',
        icon: '✅'
      },
      cancelled: { 
        bg: 'bg-gradient-to-r from-red-500 to-red-600', 
        text: 'text-white',
        icon: '❌'
      },
      delivered: { 
        bg: 'bg-gradient-to-r from-purple-500 to-purple-600', 
        text: 'text-white',
        icon: '🎉'
      }
    };
    
    const config = statusConfig[status] || { 
      bg: 'bg-gradient-to-r from-gray-400 to-gray-500', 
      text: 'text-white',
      icon: '📦'
    };
    
    return (
      <span className={`px-4 py-2 text-sm font-semibold rounded-full ${config.bg} ${config.text} shadow-lg flex items-center gap-2`}>
        <span>{config.icon}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-black p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span className="text-base font-medium text-gray-700">Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
          <div className="text-4xl mb-3">😕</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-red-500 mb-4 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-black p-8 rounded-xl shadow-lg max-w-sm w-full text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
          <p className="text-gray-600 mb-6 text-sm">Start exploring our delicious menu!</p>
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md font-medium">
            Browse Menu 🍕
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            My Food Orders 🍽️
          </h1>
        </div>
        
        {error && (
          <div className="bg-black text-white px-6 py-4 rounded-2xl mb-8 shadow-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              {error}
            </div>
          </div>
        )}

        <div className="space-y-8" ref={recentOrdersRef}>
          {orders.map((order, index) => (
            <div key={order._id} className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        🧾 Order Details
                      </h2>
                      <p className="text-orange-50 text-lg">
                        👤 Ordered by: {order.name || 'Customer'}
                      </p>
                    </div>
                    <p className="text-orange-100 text-lg mt-1">
                      📅 {format(new Date(order.createdAt), 'MMM d, yyyy • h:mm a')}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <span className="ml-2 text-sm bg-white/20 px-2 py-0.5 rounded-full">
                          🕒 Delivered Within : {format(new Date(new Date(order.createdAt).getTime() + 30 * 60000), 'h:mm a')}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(order.status)}
                    <div className="text-right">
                      <div className="text-2xl font-semibold">
                        ₹{(
                          order.items?.reduce((total, item) => total + (item.price * item.quantity), 0) + 
                          parseFloat(order.deliveryFee || 0) + 
                          parseFloat(order.taxes || (order.items?.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.05))
                        ).toFixed(2)}
                      </div>
                      <div className="text-orange-100 text-sm">Total Amount</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Order Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Delivery Address */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      🏠 Delivery Address
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p className="flex items-center gap-2">
                        <span className="text-blue-500">📍</span>
                        {order.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-green-500">🌍</span>
                        {order.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-purple-500">📞</span>
                        {order.contact}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      📊 Order Summary
                    </h3>
                    <div className="space-y-3 text-gray-700">
                      <div className="bg-white p-4 rounded-xl space-y-3">
                        {/* Items Count */}
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                          <span className="flex items-center gap-2 text-gray-600">
                            🍕 Items
                          </span>
                          <span className="font-medium">
                            {order.items?.reduce((total, item) => total + item.quantity, 0)}
                          </span>
                        </div>
                        
                        {/* Subtotal */}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Subtotal</span>
                          <span>₹{order.items?.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                        </div>
                        
                        {/* Delivery Fee */}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Delivery Fee</span>
                          <span>₹{order.deliveryFee || '0.00'}</span>
                        </div>
                        
                        {/* Taxes */}
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Taxes & Charges</span>
                          <span>₹{order.taxes || ((order.items?.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.05).toFixed(2))}</span>
                        </div>
                        
                        {/* Total Amount */}
                        <div className="flex justify-between items-center pt-3 mt-2 border-t border-gray-100 font-bold text-lg">
                          <span>Total Amount</span>
                          <span className="text-green-600">
                            ₹{(
                              order.items?.reduce((total, item) => total + (item.price * item.quantity), 0) + 
                              parseFloat(order.deliveryFee || 0) + 
                              parseFloat(order.taxes || (order.items?.reduce((total, item) => total + (item.price * item.quantity), 0) * 0.05))
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      {order.estimatedDeliveryTime && (
                        <div className="flex items-center gap-2 bg-white p-3 rounded-xl">
                          <span className="text-orange-500">⏰</span>
                          <span className="text-sm">
                            Expected: {format(new Date(order.estimatedDeliveryTime), 'MMM d • h:mm a')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    🛒 Your Delicious Items
                  </h3>
                  <div className="grid gap-4">
                    {order.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-orange-50 hover:to-red-50 transition-all duration-300">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-2xl shadow-lg hover:scale-110 transition-transform duration-300"
                        />
                        <div className="flex-1">
                          <p className="text-xl font-bold text-gray-800">{item.name}</p>
                          <p className="text-gray-600 flex items-center gap-2 mt-1">
                            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                              Qty: {item.quantity}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">₹{item.price}</p>
                          <p className="text-sm text-gray-500">per item</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg flex items-center gap-2"
                    >
                      ❌ Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Back to Top Button */}
        {orders.length > 3 && (
          <div className="text-center mt-12">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg"
            >
              🚀 Back to Top
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default OrdersPage;