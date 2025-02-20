import { axiosMain } from "@/Utils/axiosUtil";
import { AxiosError } from "axios";
import { ApiError } from "@/Utils/interface";
import HttpStatusCode from "@/enums/httpStatusCodes";

export interface IJobPost {
  _id: string;
  title: string;
  description: string;
  location: string;
  employmentType?: "Full-time" | "Part-time" | "Contract" | "Internship";
  salaryRange?: { min: number; max: number };
  skills?: string[];
  jobApplications?: string;
  responsibilities?: string[];
  perks?: string[];
  postedBy: string; // Reference to Recruiter
  company_id: string; // Reference to Company
  companyName: string;
  applicants?: string; // References JobApplication IDs
  status?: "open" | "closed" | "paused";
}

interface JobApplicationData {
  job_id: string;
  company_id: string;
  user_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  coverLetter: string;
  resume: File;
  companyName: string;
  jobTitle: string;
}

interface Experience {
  jobTitle: string;
  company: string;
  location: string;
  startDate: Date | string;
  endDate: Date | string | null;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: Date | string;
  endDate: Date | string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  preferredLocation: string;
  preferredRoles: string[];
  salaryExpectation: number;
  remoteWork: boolean;
  willingToRelocate: boolean;
  skills: string[];
  experience: Experience[];
  education: Education[];
  portfolioLink: string;
}

export interface ICompany {
  company_id: string; // Unique identifier for the company
  googleId: string;
  name: string; // Company name
  email: string; // Company account email
  phone: string; // Company account phone number
  password: string; // Company account password
  role: string;
  isBlocked: boolean;
  profileImage?: string; // Optional profile picture URL
  certificate?: string;
  isVerified: "accept" | "reject" | "pending";
  description?: string; // Optional company description
  industry?: string; // Optional industry type
  companySize?: number; // Optional number of employees
  location?: string; // Optional location
  website?: string; // Optional website URL
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  // List of employees with roles
  logo?: string; // Optional company logo
  images?: string[]; // Optional array of company-related image URLs
  status?: "pending" | "approved" | "rejected"; // Approval status
  jobPosts?: string; // References to job posts

  lastLogin?: Date; // Last login timestamp
}

const userAPIs = {
  getCompanyProfile: async (companyId: string) => {
    try {
      const response = await axiosMain.get(`/user/get-company/${companyId}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },

  getAllCompanies: async () => {
    try {
      const response = await axiosMain.get("/user/all-companies");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },

  getAllCompanyProfileImages: async () => {
    try {
      const response = await axiosMain.get("/user/getAllCompanyProfileImages");
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  getAllJobPosts: async () => {
    try {
      const response = await axiosMain.get("/user/getAllJobPosts");
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  fetchJobApplications: async (userId: string) => {
    try {
      const response = await axiosMain.get(`/user/job-applications/${userId}`);
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  fetchUserData: async (userId: string) => {
    try {
      const response = await axiosMain.get(`/user/user-profile/${userId}`);
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  getSubscriptionPlan: async () => {
    try {
      const response = await axiosMain.get("/subscribe/get-subscription-plan");
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  subscriptionHistory: async (userId: string) => {
    try {
      const response = await axiosMain.get(
        `/subscribe/subscription-history/${userId}`
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  currentSubscription: async (userId: string) => {
    try {
      const response = await axiosMain.get(
        `/subscribe/current-subscription/${userId}`
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },

  subscribeInitialize: async (userId: string, planId: string) => {
    try {
      const response = await axiosMain.post(`/subscribe/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: { userId, planId },
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  subscribeVerify: async (
    payment_id: string,
    order_id: string,
    signature: string
  ) => {
    try {
      const response = await axiosMain.post(`/subscribe/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_payment_id: payment_id,
          razorpay_order_id: order_id,
          razorpay_signature: signature,
        }),
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  cancelSubscription: async (subscriptionId: string) => {
    try {
      const response = await axiosMain.delete(
        `/subscribe/cancel/${subscriptionId}`
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  searchCompanies: async (searchQuery: string) => {
    try {
      const response = await axiosMain.get(
        `/user/search/companies?query=${searchQuery}`
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  uploadProfilePicture: async (user_id: string, formData: FormData) => {
    try {
      const response = await axiosMain.post(
        `/user/upload-profile-picture/${user_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  fetchChatHistory: async (user_id: string) => {
    try {
      const response = await axiosMain.get(`/chat/user-history`, {
        params: { user_id: user_id },
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  fetchJobs: async () => {
    try {
      const response = await axiosMain.get(`/user/getAllJobPosts`);

      const { jobPosts, companies } = response.data;

      const mergedData = jobPosts.map((jobPost: IJobPost) => {
        const company = companies.find(
          (company: ICompany) => company.company_id === jobPost.company_id
        );
        return {
          ...jobPost,
          company: company
            ? {
                companyName: company.name,
                location: company.location,
                website: company.website,
                isVerified: company.isVerified,
              }
            : {}, // Only include the important company details
        };
      });
      const filteredMergedData = mergedData.filter(
        (job: {
          company: {
            isVerified: "pending" | "accept" | "reject" | undefined;
          };
        }) =>
          job.company.isVerified === "pending" ||
          job.company.isVerified === "accept"
      );
      console.log(mergedData);

      return filteredMergedData;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  resentOtp: async (email: string | null) => {
    try {
      const response = await axiosMain.post(`/user/resent-otp`, { email });
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  fetchJobById: async (jobId: string) => {
    try {
      const response = await axiosMain.get(`/user/getAllJobPosts`);
      console.log(`fetchJobById response- ${response}`);

      const { jobPosts, companies } = response.data;
      console.log(`response- ${jobPosts} ${companies}`);

      // Filter the job post by provided ID
      const filteredJobPost = jobPosts.find(
        (jobPost: IJobPost) => jobPost._id === jobId
      );

      if (!filteredJobPost) {
        console.warn(`No job found with ID: ${jobId}`);
        return null; // Return null if no job post matches the given ID
      }

      // Find the corresponding company for the filtered job post
      const company = companies.find(
        (company: ICompany) => company.company_id === filteredJobPost.company_id
      );

      // Combine filtered job post with relevant company details
      const mergedData = {
        ...filteredJobPost,
        company: company
          ? {
              companyName: company.name,
              location: company.location,
              website: company.website,
            }
          : {}, // Only include important company details if available
      };

      console.log(mergedData);

      return mergedData;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  updateUserProfile: async (user_id: string, userData: UserProfile) => {
    try {
      const response = await axiosMain.put(
        `/user/edit-user/${user_id}`,
        userData
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
  submitJobApplication: async (applicationData: JobApplicationData) => {
    try {
      const formData = new FormData();
      Object.entries(applicationData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axiosMain.post(
        "/user/post-job-application",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        throw {
          message: error.response.data.message,
          statusCode: error.response.status,
        } as ApiError;
      }
      throw {
        message: "Something went wrong. Please try again later.",
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      } as ApiError;
    }
  },
};

export default userAPIs;
