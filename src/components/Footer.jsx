const Footer = () => {
    return (
      <footer className="fixed bottom-0 left-0 w-full bg-[#0f0f0f] text-[#888888] text-xs text-center py-3 border-t border-[#222]">
        © {new Date().getFullYear()} <span className="text-[#FFD700] font-semibold">HomeBites</span>. All rights reserved.
      </footer>
    );
  };
  
  export default Footer;
  