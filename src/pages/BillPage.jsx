// src/pages/BillPage.jsx
import { Link } from "react-router-dom";

const BillPage = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold text-[#D4AF37] mb-6">🎉 Thank You!</h1>
      <p className="text-lg mb-4">Your payment was successful and your order is being processed.</p>
      <Link
        to="/menu"
        className="px-5 py-2 bg-[#D4AF37] text-black rounded-full hover:bg-[#B22222] hover:text-white transition"
      >
        Back to Menu
      </Link>
    </div>
  );
};

export default BillPage;
