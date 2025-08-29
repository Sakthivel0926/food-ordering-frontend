import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../utils/axiosInstance";

const FoodList = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("/api/food");
        if (Array.isArray(res.data)) {
          setFoodItems(res.data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
        setError(error.response?.data?.message || "Failed to load food items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return <p className="text-center">Loading food items...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Food Items</h1>
      {foodItems.length === 0 ? (
        <p className="text-center text-gray-500">No food items found.</p>
      ) : (
        <div className="space-y-4">
          {foodItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center p-4 border rounded shadow"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.category}</p>
                <p className="text-sm text-gray-800 font-medium">₹{item.price}</p>
              </div>
              <Link
                to={`/admin/food/edit/${item._id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodList;