import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditFoodItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Added error state for better UX

  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        // Fetch the specific food item by ID
        const res = await axios.get(`/api/food/${id}`);
        const item = res.data;
        
        if (item && item._id) {
          setFormData({
            name: item.name || "",
            category: item.category || "",
            price: item.price?.toString() || "",
            image: item.image || "",
          });
        } else {
          throw new Error("Food item not found");
        }
      } catch (error) {
        console.error("Error fetching food item:", error);
        setError(error.message || "Failed to fetch food item");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItem();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/food/${id}`, {
        ...formData,
        price: Number(formData.price), // Ensure price is a number
      });
      alert("Food item updated successfully!");
      navigate("/admin/foods");
    } catch (error) {
      console.error("Error updating food item:", error);
      setError(error.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading food item...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/admin/foods")}
          className="mt-4 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Back to Food List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Food Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Image URL"
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default EditFoodItem;