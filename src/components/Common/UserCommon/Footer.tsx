import type React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const Footer: React.FC = () => (
  <footer className="bg-[#1E1E1E] text-white py-12 mt-16">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-2xl font-bold text-white">Next</span>
            <span className="text-2xl font-bold text-[#4F46E5]">Way</span>
          </div>
          <p className="text-[#A0A0A0] mb-4">NextWay Copyright © 2024</p>
          <div className="flex space-x-4">
            <a href="#" className="text-[#A0A0A0] hover:text-white">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-[#A0A0A0] hover:text-white">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-[#A0A0A0] hover:text-white">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-[#A0A0A0] hover:text-white">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-[#E0E0E0] hover:text-white">
                Blog
              </a>
            </li>
            <li>
              <a href="#" className="text-[#E0E0E0] hover:text-white">
                Career
              </a>
            </li>
            <li>
              <a href="#" className="text-[#E0E0E0] hover:text-white">
                News
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-[#E0E0E0] hover:text-white">
                Accessibility
              </a>
            </li>
            <li>
              <a href="#" className="text-[#E0E0E0] hover:text-white">
                Partners
              </a>
            </li>
            <li>
              <a href="#" className="text-[#E0E0E0] hover:text-white">
                Employers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-[#E0E0E0] hover:text-white">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="text-[#E0E0E0] hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="text-[#E0E0E0] hover:text-white">
                Terms of Use
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
