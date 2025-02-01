import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "react-feather";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-5 gap-8">
          {/* Logo Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-white">Next</span>
              <span className="text-2xl font-bold text-red-600">Way</span>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="/career" className="text-gray-400 hover:text-white">
                  Career
                </a>
              </li>
              <li>
                <a href="/news" className="text-gray-400 hover:text-white">
                  News
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/accessibility"
                  className="text-gray-400 hover:text-white"
                >
                  Accessibility
                </a>
              </li>
              <li>
                <a href="/partners" className="text-gray-400 hover:text-white">
                  Partners
                </a>
              </li>
              <li>
                <a href="/employers" className="text-gray-400 hover:text-white">
                  Employers
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-of-use"
                  className="text-gray-400 hover:text-white"
                >
                  Terms Of Use
                </a>
              </li>
            </ul>
          </div>

          {/* About Us Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about-jobior"
                  className="text-gray-400 hover:text-white"
                >
                  About Jobior
                </a>
              </li>
              <li>
                <a
                  href="/work-for-jobior"
                  className="text-gray-400 hover:text-white"
                >
                  Work for Jobior
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="text-gray-400 hover:text-white"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="mt-12 flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              <Twitter className="w-6 h-6" />
            </a>
          </div>
          <div className="text-gray-400 text-sm">NextWay Copyright © 2024</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
