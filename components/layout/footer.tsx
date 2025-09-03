// components/Footer.tsx
import React from "react";
import { 
  ShoppingBag, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin 
} from "lucide-react";

export const Footer = () => {
  const socialLinks = [
    {
      name: "twitter",
      icon: <Twitter className="w-4 h-4" />,
      url: "https://twitter.com/costumworld"
    },
    {
      name: "facebook",
      icon: <Facebook className="w-4 h-4" />,
      url: "https://facebook.com/costumworld"
    },
    {
      name: "instagram",
      icon: <Instagram className="w-4 h-4" />,
      url: "https://instagram.com/costumworld"
    },
    {
      name: "linkedin",
      icon: <Linkedin className="w-4 h-4" />,
      url: "https://linkedin.com/company/costumworld"
    }
  ];

  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                costum<span className="text-blue-400">world</span>
              </h3>
            </div>
            <p className="mb-4">
              Your one-stop shop for all the latest products and trends in 2025.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              {["All Products", "New Arrivals", "Featured", "Discounts"].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2">
              {[
                "Contact Us",
                "FAQs",
                "Shipping Policy",
                "Returns & Exchanges",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">Newsletter</h4>
            <p className="mb-4">
              Subscribe to get updates on new arrivals and special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 CostumWorld. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;