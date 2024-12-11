import React from "react";
import { Button } from "@/components/ui/button";

const About: React.FC = () => (
  <section
    className="relative h-[400px] rounded-xl overflow-hidden my-12 bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://www.itcilo.org/sites/default/files/styles/fullbody_image/public/resources/cover-images/Actemp%20resource%2003.jpg?h=39ddfeda&itok=NRidxdeT')",
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
    <div className="relative z-10 h-full flex flex-col items-start justify-center text-left p-8 max-w-2xl">
      <h2 className="text-3xl font-bold mb-4 text-white">About NextGig</h2>
      <p className="text-lg text-gray-200 mb-6">
        NextGig is your gateway to exciting career opportunities. We connect
        talented professionals with innovative companies, making job hunting a
        seamless and rewarding experience.
      </p>
      {/* <Button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full">
        Learn More
      </Button> */}
    </div>
  </section>
);

export default About;
