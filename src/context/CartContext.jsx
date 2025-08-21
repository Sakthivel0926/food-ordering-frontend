import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import { useFood } from "./FoodContext";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();
  const { foodItems, setFoodItems } = useFood();

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
      fetchCartItems();
    }
  }, [user]);


  // ✅ Fetch Cart Items
  const fetchCartItems = async () => {
    try {

      const res = await axios.get("/cart", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setCartItems(res.data); // ✅ Your backend returns array, not { cart: [] }
    } catch (error) {
      console.error("❌ Failed to fetch cart:", error.response?.data || error.message);
      toast.error("Failed to load cart");
    }
  };

  // ✅ Add to Cart
  const addToCart = async (foodItem) => {
    try {
      // Check if item is in stock
      const foodInStock = foodItems.find(item => item._id === foodItem._id);
      if (!foodInStock || foodInStock.quantity <= 0) {
        toast.error(`${foodItem.name} is out of stock`);
        return;
      }

      await axios.post(
        "/cart",
        {
          foodId: foodItem._id,
          name: foodItem.name,
          image: foodItem.image,
          price: foodItem.price,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      // Update the food items quantity in the UI immediately
      setFoodItems(prevItems => 
        prevItems.map(item => 
          item._id === foodItem._id 
            ? { ...item, quantity: Math.max(0, item.quantity - 1) } 
            : item
        )
      );

      toast.success(`${foodItem.name} added to cart`);
      fetchCartItems();
    } catch (error) {
      console.error("❌ Add to cart error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  // ✅ Remove from Cart
  const removeFromCart = async (foodId, returnToStock = false) => {
    try {
      // Get the cart item to find out how many to return to stock
      const cartItem = cartItems.find(item => item.foodId === foodId || item._id === foodId);
      
      await axios.delete(`/cart/${foodId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      // If returning to stock (like when removing from cart), update the food items quantity
      if (returnToStock && cartItem) {
        setFoodItems(prevItems => 
          prevItems.map(item => 
            item._id === cartItem.foodId || item._id === cartItem._id
              ? { ...item, quantity: (item.quantity || 0) + (cartItem.quantity || 1) }
              : item
          )
        );
      }

      toast.success("Item removed from cart");
      fetchCartItems();
    } catch (error) {
      console.error("❌ Remove from cart error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to remove item from cart");
    }
  };

  // ✅ Update Quantity
  const updateItemQuantity = async (foodId, quantity) => {
    try {
      await axios.put(
        `/cart/${foodId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      toast.success("Quantity updated");
      fetchCartItems();
    } catch (error) {
      console.error("❌ Update quantity error:", error.response?.data || error.message);
      toast.error("Failed to update quantity");
    }
  };

  // ✅ Clear Cart
  const clearCart = async (returnToStock = false) => {
    try {
      // If returning items to stock, update the food items quantities first
      if (returnToStock && cartItems.length > 0) {
        setFoodItems(prevItems => 
          prevItems.map(foodItem => {
            const cartItem = cartItems.find(ci => ci.foodId === foodItem._id || ci._id === foodItem._id);
            if (cartItem) {
              return { 
                ...foodItem, 
                quantity: (foodItem.quantity || 0) + (cartItem.quantity || 1) 
              };
            }
            return foodItem;
          })
        );
      }

      await axios.delete("/cart", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("❌ Clear cart error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to clear cart");
    }
  };

  // ✅ Auto-fetch cart when user logs in
  // useEffect(() => {
  //   console.log("🧪 Current user:", user);
  //   if (user?.token) {
  //     fetchCartItems();
  //   }
  // }, [user]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
