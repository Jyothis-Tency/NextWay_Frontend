import React from "react";
import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SearchSection: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto -mt-8 relative z-20">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Find Your Perfect Job
      </h2>
      <div className="relative">
        <div className="flex gap-2 p-2 bg-gray-900 rounded-lg border border-red-500 shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,0,0,0.4)] transition-shadow">
          <Input
            type="text"
            placeholder="Job title, skills, or company"
            className="flex-1 bg-transparent border-none focus:ring-1 focus:ring-red-500"
          />
          <div className="flex items-center gap-2 px-4 border-l border-gray-700">
            <MapPin className="w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Location"
              className="bg-transparent border-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white shadow-[0_0_10px_rgba(255,0,0,0.3)]">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
