import React from 'react';

const Navbar = () => (
  <nav className="w-full flex items-center justify-between p-4 bg-gray-900 text-white">
    <div className="font-bold text-lg">MyApp</div>
    <ul className="flex gap-4">
      <li><a href="/" className="hover:underline">Home</a></li>
      <li><a href="/about" className="hover:underline">About</a></li>
      <li><a href="/contact" className="hover:underline">Contact</a></li>
    </ul>
  </nav>
);

export default Navbar;
