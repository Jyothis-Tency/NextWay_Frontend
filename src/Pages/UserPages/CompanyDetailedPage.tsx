import CompanyDetailed from "@/components/UserComponents/CompanyDetailed";
import Header from "@/components/Common/UserCommon/Header";
import Footer from "@/components/Common/UserCommon/Footer";

const CompanyDetailedPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <CompanyDetailed />
      <Footer />
    </div>
  );
};

export default CompanyDetailedPage;
