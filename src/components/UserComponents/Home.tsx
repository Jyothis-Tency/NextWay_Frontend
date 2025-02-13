import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CompanyStatic from "../../../public/Comany-Static-Logo.svg";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import { axiosMain } from "@/Utils/axiosUtil";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Briefcase, MapPin, Star } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Company {
  company_id: string;
  name: string;
  rating: string;
  employees: string;
  logo: string;
}

interface JobPost {
  _id: string;
  title: string;
  company_id: string;
  location: string;
  type: string;
  salary: string;
  posted: string;
}

interface Company {
  company_id: string;
  name: string;
  logo: string;
}

interface CombinedJobPost extends JobPost {
  companyName: string;
  logo: string;
}

const Home: React.FC = () => {
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<CombinedJobPost[]>([]);
  const [allProfileImages, setAllProfileImages] = useState<
    {
      company_id: string;
      profileImage: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [allCompanies, setAllCompanies] = useState([]);
  const [allJobPosts, setAllJobPosts] = useState([]);
  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: allJobPosts.length },
    { icon: Star, label: "Companies", value: allCompanies.length },
    // { icon: Calendar, label: "Interviews", value: "857" },
    //  { icon: Award, label: "Placements", value: "492" },
  ];
  const userName = useSelector(
    (state: RootState) => state.user.userInfo?.firstName
  );
  const state = useSelector((state: RootState) => state);
  console.log("redux state", state);

  console.log(userName);
  const navigate = useNavigate();
  const fetchTopCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axiosMain.get("/user/all-companies");
      console.log(response);
      setAllCompanies(response.data.companyData);
      setTopCompanies(response.data?.companyData || []);
    } catch (error) {
      console.error("Error fetching top companies:", error);
      setError("Failed to load top companies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getAllProfileImages = async () => {
    try {
      const response = await axiosMain.get("/user/getAllCompanyProfileImages");
      console.log(response.data);
      setAllProfileImages(response.data);
    } catch (error) {
      console.error("Error fetching profile images:", error);
    }
  };

  const getAllJobPosts = async () => {
    const allJobPosts = await axiosMain.get("/user/getAllJobPosts");
    const jobPosts: JobPost[] = allJobPosts.data?.jobPosts || [];
    const companies: Company[] = allJobPosts.data?.companies || [];

    // Create a map of companies for quick lookup
    const companyMap = new Map<string, Company>();
    companies.forEach((company) => {
      companyMap.set(company.company_id, company);
    });

    // Combine jobPosts with company details
    const combinedData: CombinedJobPost[] = jobPosts.map((job) => {
      const company = companyMap.get(job.company_id);
      return {
        ...job,
        companyName: company?.name || "Unknown Company",
        logo: company?.logo || "/placeholder.svg",
      };
    });

    setRecommendedJobs(combinedData);
    setAllJobPosts(allJobPosts.data.jobPosts);
  };

  useEffect(() => {
    fetchTopCompanies();
    getAllJobPosts();
    //Adding getAllProfileImages as a dependency to fix the issue.
    getAllProfileImages();
  }, []);

  //Removed this useEffect as getAllProfileImages is now called in the above useEffect
  // useEffect(() => {
  //   getAllProfileImages();
  // }, [topCompanies]);

  const renderCompanyAvatar = (companyId: string, companyName: string) => {
    const companyProfileImage = allProfileImages.find(
      (img) => img.company_id === companyId
    )?.profileImage;

    return (
      <Avatar className="h-8 w-12 mr-2 mb-3">
        <AvatarImage
          src={companyProfileImage || CompanyStatic}
          alt={companyName}
          className="w-12 h-12 rounded-full"
        />
        <AvatarFallback>{companyName[0]}</AvatarFallback>
      </Avatar>
    );
  };
  return (
    <div className="space-y-12 bg-[#000000]">
      <section
        className="relative w-full h-[665px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://as2.ftcdn.net/v2/jpg/08/10/92/69/1000_F_810926942_LcXpqYlTiWNcNntJpVTh8nr510jnZniK.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#121212] opacity-90"></div>
        <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl mx-auto">
          {userName ? (
            <>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
                Welcome back, {userName}!
              </h1>
              <p className="text-xl text-[#E0E0E0]">
                Ready to find your next way?
              </p>
              <Button
                onClick={() => navigate("../job-posts")}
                className="bg-[#4F46E5] hover:bg-[#6366F1] text-white px-8 py-3 rounded-full text-lg"
              >
                Explore Jobs
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white">
                Find Your Dream Job Today
              </h1>
              <p className="text-xl text-[#E0E0E0]">
                Connecting talent with opportunities
              </p>
              <div className="space-x-4">
                <Button
                  className="bg-[#4F46E5] hover:bg-[#6366F1] text-white px-8 py-3 rounded-full text-lg"
                  onClick={() => navigate("../login")}
                >
                  Login As User
                </Button>
                <Button
                  className="bg-[#4F46E5] hover:bg-[#6366F1] text-white px-8 py-3 rounded-full text-lg"
                  onClick={() => window.open("/company/login", "_blank")}
                >
                  Login As Company
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-7xl">
        <section
          className="relative h-[400px] rounded-xl overflow-hidden my-12 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://www.itcilo.org/sites/default/files/styles/fullbody_image/public/resources/cover-images/Actemp%20resource%2003.jpg?h=39ddfeda&itok=NRidxdeT')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212] to-transparent"></div>
          <div className="relative z-10 h-full flex flex-col items-start justify-center text-left p-8 max-w-2xl">
            <h2 className="text-3xl font-bold mb-4 text-white">
              About NextWay
            </h2>
            <p className="text-lg text-[#E0E0E0] mb-6">
              NextWay is your gateway to exciting career opportunities. We
              connect talented professionals with innovative companies, making
              job hunting a seamless and rewarding experience.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Top Companies</h2>
          {loading ? (
            <p className="text-[#E0E0E0]">Loading...</p>
          ) : error ? (
            <p className="text-[#EF4444]">{error}</p>
          ) : (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="bg-[#1E1E1E] p-4 rounded-xl border border-[#4F46E5] hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-300 flex flex-col justify-between h-[120px]"
                    onClick={() =>
                      navigate(`../company-profile/${company.company_id}`)
                    }
                  >
                    <div className="flex items-start gap-3">
                      {renderCompanyAvatar(company.company_id, company.name)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-white">
                          {company.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3.5 h-3.5 text-[#6366F1] fill-[#6366F1]" />
                          <span className="text-xs text-[#E0E0E0]">
                            {company.rating}
                          </span>
                          <span className="text-xs text-[#A0A0A0]">
                            • {company.employees} employees
                          </span>
                        </div>
                      </div>
                    </div>
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
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent rounded-xl"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Top Employers</h3>
                  <p className="text-sm text-[#E0E0E0]">
                    Discover opportunities with industry leaders
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-6 text-white">
            NextWay by the Numbers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-[#1E1E1E] p-4 rounded-xl border border-[#4F46E5] flex items-center gap-4 hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] transition-all duration-300"
              >
                <div className="p-3 bg-[#4F46E5]/10 rounded-lg">
                  <stat.icon className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <div>
                  <p className="text-sm text-[#A0A0A0]">{stat.label}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Recommended Jobs</h2>
          {loading ? (
            <p className="text-[#E0E0E0]">Loading...</p>
          ) : error ? (
            <p className="text-[#EF4444]">{error}</p>
          ) : recommendedJobs.length === 0 ? (
            <p className="text-[#A0A0A0]">No job posts available right now.</p>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <div
                className="w-full md:w-1/3 h-[400px] relative bg-cover bg-center rounded-xl"
                style={{
                  backgroundImage:
                    "url('https://images.ctfassets.net/pdf29us7flmy/4vqUBQWFBgeB7FWjdT5Csb/064c7127f6ae2f9ea5d1b10e8b91466c/Career_Guide_Photos-2160x1215-GettyImages-1307598870.jpg?w=720&q=100&fm=jpg')",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent rounded-xl"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    Find Your Dream Job
                  </h3>
                  <p className="text-sm text-[#E0E0E0]">
                    Explore opportunities tailored just for you
                  </p>
                </div>
              </div>
              <div className="w-full md:w-2/3 space-y-4 h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {recommendedJobs.map((job, index) => (
                  <div
                    key={index}
                    className="group bg-[#1E1E1E] p-4 rounded-xl border border-[#4F46E5] hover:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-300"
                    onClick={() =>
                      navigate(`../job-posts?selectedJobId=${job._id}`)
                    }
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        {renderCompanyAvatar(job.company_id, job.companyName)}
                        <div>
                          <h3 className="font-semibold group-hover:text-[#6366F1] transition-colors">
                            {job.title}
                          </h3>
                          <p className="text-sm text-[#A0A0A0]">
                            {job.companyName}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#4F46E5] font-semibold">
                          {job.salary}
                        </span>
                        <span className="text-[#A0A0A0]">{job.posted}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* <section className="my-12">
          <h2 className="text-2xl font-bold mb-6 text-white">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-white">
                How do I create an account?
              </AccordionTrigger>
              <AccordionContent className="text-[#E0E0E0]">
                To create an account, click on the "Sign Up" button in the top
                right corner of the homepage. Fill in your details, including
                your name, email address, and password. Once you've completed
                the form, click "Create Account" to finish the process.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-white">
                How can I search for jobs?
              </AccordionTrigger>
              <AccordionContent className="text-[#E0E0E0]">
                You can search for jobs using the search bar on the homepage.
                Enter keywords related to the job title, skills, or company
                you're interested in. You can also filter results by location,
                job type, and salary range to find the most relevant
                opportunities.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-white">
                How do I apply for a job?
              </AccordionTrigger>
              <AccordionContent className="text-[#E0E0E0]">
                To apply for a job, click on the job listing that interests you.
                On the job details page, you'll find an "Apply Now" button.
                Click this button and follow the instructions to submit your
                application, which may include uploading your resume and cover
                letter.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-white">
                Is my personal information secure?
              </AccordionTrigger>
              <AccordionContent className="text-[#E0E0E0]">
                Yes, we take the security of your personal information very
                seriously. We use industry-standard encryption and security
                measures to protect your data. We also have a strict privacy
                policy that outlines how we collect, use, and protect your
                information.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section> */}
      </div>
    </div>
  );
};

export default Home;
