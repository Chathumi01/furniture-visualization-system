import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">FurnitureViz</div>
      <ul className="nav-links">
        <li>Home</li>
        <li>Design Room</li>
        <li>My Saved Designs</li>
        <li>Checkout</li>
      </ul>
    </nav>
  );
};

export default Navbar;
