import JobUserProfile from "@/components/UserComponents/UserProfile";
import Header from "@/components/Common/UserCommon/Header";
import Footer from "@/components/Common/UserCommon/Footer";

const UserProfilePage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <JobUserProfile />
      <Footer />
    </div>
  );
};

export default UserProfilePage;
