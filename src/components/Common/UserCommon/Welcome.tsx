import React from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";

const WelcomeSection: React.FC = () => {
  const userName = useSelector(
    (state: RootState) => state.user.userInfo?.firstName
  );
  console.log(userName);
  const navigate = useNavigate()

  return (
    <section
      className="relative w-full h-[600px] flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://as2.ftcdn.net/v2/jpg/08/10/92/69/1000_F_810926942_LcXpqYlTiWNcNntJpVTh8nr510jnZniK.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-90"></div>
      <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
        {userName ? (
          <>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Welcome back, {userName}!
            </h1>
            <p className="text-xl text-gray-300">
              Ready to find your next gig?
            </p>
            <Button
              onClick={() => navigate("../job-posts")}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg"
            >
              Explore Jobs
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl text-gray-300">
              Connecting talent with opportunities
            </p>
            <div className="space-x-4">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-lg">
                Get Started
              </Button>
              {/* <Button className="bg-transparent hover:bg-white hover:text-black text-white px-8 py-3 rounded-full text-lg border-2 border-white">
                Learn More
              </Button> */}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default WelcomeSection;
