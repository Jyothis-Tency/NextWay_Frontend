import React from "react";
import { Briefcase, Star, Calendar, Award } from "lucide-react";

const Statistics: React.FC = () => {
  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "2,145" },
    { icon: Star, label: "Companies", value: "1,384" },
    { icon: Calendar, label: "Interviews", value: "857" },
    { icon: Award, label: "Placements", value: "492" },
  ];

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6">NextGig by the Numbers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 p-4 rounded-xl border border-red-500 flex items-center gap-4 hover:shadow-[0_0_20px_rgba(255,0,0,0.2)] transition-all duration-300"
          >
            <div className="p-3 bg-red-500/10 rounded-lg">
              <stat.icon className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Statistics;
