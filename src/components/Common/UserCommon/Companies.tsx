import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { axiosAdmin } from "@/Utils/axiosUtil";

interface Company {
  name: string;
  rating: string;
  employees: string;
  logo: string;
}

const TopCompanies: React.FC = () => {
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchTopCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosAdmin.get("/all-companies");
      console.log(response);
      
      setTopCompanies(response.data?.companyData || []);
    } catch (error) {
      console.error("Error fetching top companies:", error);
      setError("Failed to load top companies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopCompanies();
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">Top Companies</h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topCompanies.map((company, index) => (
              <div
                key={index}
                className="bg-[#1a1f2e] p-4 rounded-xl border border-red-500 hover:shadow-[0_0_20px_rgba(255,0,0,0.3)] transition-all duration-300 flex flex-col justify-between h-[120px]"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-white">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-300">
                        {company.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        • {company.employees} employees
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-sm h-8"
                  variant="default"
                >
                  View Jobs
                </Button>
              </div>
            ))}
          </div>
          <div
            className="w-full md:w-1/3 h-[400px] relative bg-cover bg-center rounded-xl"
            style={{
              backgroundImage:
                "url('https://img.freepik.com/premium-photo/silhouette-steve-jobs-seamlessly-integrated-into-iconic-apple-logo_1329608-6961.jpg')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent rounded-xl"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Top Employers</h3>
              <p className="text-sm">
                Discover opportunities with industry leaders
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TopCompanies;
