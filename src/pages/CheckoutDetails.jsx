import React, { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useFood } from "../context/FoodContext";

const CheckoutDetails = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { fetchFoodItems } = useFood();
  const [form, setForm] = useState({
    name: user?.name || "",
    address: "",
    contact: "",
    location: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      if (!form.name || !form.address || !form.contact || !form.location || !form.paymentMethod) {
        throw new Error('All fields are required');
      }

      // console.log('Cart items:', cartItems);
      
      const orderData = {
        name: form.name,
        address: form.address,
        contact: form.contact,
        location: form.location,
        paymentMethod: form.paymentMethod,
        userId: user?._id,
        items: cartItems.map(item => {
          // Ensure foodId is a string, not an object
          const foodId = typeof item.foodId === 'object' ? item.foodId._id : item.foodId || item._id;
          return {
            foodId: foodId,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
          };
        }),
      };
      
      // console.log('Sending order data:', JSON.stringify(orderData, null, 2));
      
      try {
        const response = await axios.post("/orders", orderData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Order created:', response.data);
        
        // Clear the cart after successful order
        await clearCart();
        await fetchFoodItems();
        
        // Navigate to success page with order details
        navigate('/order-success', {
          state: { order: response.data.order }
        });
      } catch (error) {
        console.error('Order API Error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          headers: error.response?.headers,
          request: error.request
        });
        throw error;
      }

    } catch (err) {
      console.error("Order failed:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      alert(`❌ Failed to place order: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#1A1A1A] p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-[#FFD700]">Checkout Details</h2>
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#0d0d0d] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            required
            value={form.address}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#0d0d0d] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            required
            value={form.contact}
            onChange={(e) => {
    
              const value = e.target.value.replace(/\D/g, "");
              setForm({ ...form, contact: value });
            }}
            pattern="[0-9]{10,}"
            maxLength={15}
            className="w-full p-3 rounded-lg bg-[#0d0d0d] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          />
          <input
            type="text"
            name="location"
            placeholder="Location (City / Area)"
            required
            value={form.location}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#0d0d0d] text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          />
          <select
            name="paymentMethod"
            required
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-[#0d0d0d] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          >
            <option value="">Select Payment Method</option>
            <option value="upi">UPI</option>
            <option value="card">Credit/Debit Card</option>
            <option value="cod">Cash on Delivery</option>
          </select>
          <button
            type="submit"
            className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-[#B22222] hover:text-white transition"
          >
            Place Order
          </button>
          </form>
        </div>
      </div>
  );
};

export default CheckoutDetails;