import Home from "@/components/UserComponents/Home";
import Header from "@/components/Common/UserCommon/Header";
import Footer from "@/components/Common/UserCommon/Footer";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-black text-white scrollbar-thin scrollbar-thumb-scroll-thumb scrollbar-track-scroll-track scrollbar-thumb-rounded-md scrollbar-track-rounded-md">
      <Header />
      <Home />
      <Footer />
    </div>
  );
};

export default HomePage;
