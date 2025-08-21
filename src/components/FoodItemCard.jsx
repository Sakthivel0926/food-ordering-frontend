import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const FoodItemCard = ({ item, addToCart }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="border border-yellow-600 rounded-xl p-4 shadow-lg bg-black text-white"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-36 object-cover rounded-md mb-3 border border-yellow-900"
      />

      <h2 className="text-lg font-bold text-yellow-400">{item.name}</h2>
      <p className="text-red-400 font-semibold">${item.price}</p>
      <p className="text-sm text-gray-400">{item.category}</p>
      
      {/* Stock Status */}
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-sm font-medium ${item.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
        </span>
      </div>

      {/* ⭐ Dummy Rating */}
      <div className="flex items-center gap-1 text-yellow-500 mt-1">
        <Star size={16} fill="currentColor" /> <span className="text-sm">4.5</span>
      </div>

      <button
        onClick={() => addToCart(item)}
        disabled={item.stock <= 0}
        className={`mt-3 bg-gradient-to-r from-yellow-500 to-red-500 text-black font-semibold px-4 py-2 rounded-lg w-full transition ${
          item.stock > 0 
            ? 'hover:opacity-90 cursor-pointer' 
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </motion.div>
  );
};

FoodItemCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  addToCart: PropTypes.func.isRequired,
};

export default FoodItemCard;
