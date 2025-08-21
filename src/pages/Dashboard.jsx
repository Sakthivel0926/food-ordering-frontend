import { useAuth } from "../context/AuthContext";
import { Link, useSearchParams } from "react-router-dom";
import { ShoppingCart, List, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import axios from "../utils/axiosInstance";

const Dashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const recentOrdersRef = useRef(null);

  // Scroll to recent orders if showRecentOrders param is true
  useEffect(() => {
    if (searchParams.get('showRecentOrders') === 'true' && recentOrdersRef.current) {
      setTimeout(() => {
        recentOrdersRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) {
        setOrders([]);
        setLoadingOrders(false);
        return;
      }
      try {
        const res = await axios.get(`/orders?userId=${user._id}`);
        setOrders(res.data);
      } catch (err) {
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-4 md:p-8 text-white min-h-screen bg-[#0d0d0d]"
    >
      {/* Welcome Message */}
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-bold mb-4"
      >
        Welcome back,{" "}
        <span className="text-[#D4AF37]">{user?.name || "User"}!</span>
      </motion.h1>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 },
          },
        }}
      >
        {[
          {
            icon: <List size={32} className="text-[#D4AF37] mb-2" />,
            label: "Browse Menu",
            to: "/menu",
          },
          {
            icon: <ShoppingCart size={32} className="text-[#D4AF37] mb-2" />,
            label: "View Cart",
            to: "/cart",
          },
          ...(user?.isAdmin
            ? [
                {
                  icon: <ChefHat size={32} className="text-[#D4AF37] mb-2" />,
                  label: "Manage Food",
                  to: "/food-management",
                },
              ]
            : []),
        ].map((action, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-6 text-center hover:shadow-md transition"
          >
            <Link to={action.to} className="flex flex-col items-center">
              {action.icon}
              <span className="text-white text-lg font-semibold">
                {action.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders Section */}
      <div ref={recentOrdersRef} className="mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {loadingOrders ? (
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-6 text-gray-300 text-sm">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#1a1a1a] border border-[#2A2A2A] rounded-xl p-6 text-gray-300 text-sm">
            You haven't placed any orders yet. Start by exploring the menu!
          </div>
        ) : (
          <ul>
            {orders.map((order) => (
              <li
                key={order._id}
                className="mb-4 bg-[#181818] border border-[#232323] rounded p-4"
              >
                <div>
                  <span className="font-bold">{order.name}</span>
                  {" — "}
                  <span>{order.paymentMethod}</span>
                  {" — "}
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mb-2">{order.address}</div>
                {/* Show ordered food items */}
               {/* Show ordered food items */}
            <div className="flex flex-wrap gap-4 mt-2">
              {order.items && order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-[#222] rounded p-2 w-full max-w-xs"
                  style={{ minWidth: 220 }}
              >
                {/* Image on the left */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                  {/* Details on the right */}
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-gray-400">
                      Qty: {item.quantity} | ₹{item.price}
                    </div>
                  </div>
                </div>
               ))}
               </div>
              </li>
            ))}
          </ul>
        )}
        </motion.div>
      </div>

      {/* Manage Profile */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          to="/profile"
          className="inline-block bg-[#D4AF37] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#B22222] hover:text-white transition-all"
        >
          Manage Profile
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;