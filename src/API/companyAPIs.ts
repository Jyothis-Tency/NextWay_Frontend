import { axiosMain } from "@/Utils/axiosUtil";
import { AxiosError } from "axios";
import { ApiError } from "@/Utils/interface";
import HttpStatusCode from "@/enums/httpStatusCodes";

interface IJobPost {
  title: string;
  description: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  salaryRange: {
    min: number;
    max: number;
  };
  skills: string[];
  responsibilities: string[];
  perks: string[];
  status: "open" | "closed" | "paused";
}

const companyAPIs = {
  fetchChatHistory: async (company_id: string) => {
    try {
      const response = await axiosMain.get(`/chat/company-history`, {
        params: { company_id: company_id },
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
  getAllUserProfileImages: async () => {
    try {
      const response = await axiosMain.get("/company/getAllUserProfileImages");
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
  companySearch: async (searchQuery: string) => {
    try {
      const response = await axiosMain.get(
        `/company/search/users?query=${searchQuery}`
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
  fetchCompanyData: async (company_id: string) => {
    try {
      const response = await axiosMain.get(
        `/company/get-company/${company_id}`
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
  uploadProfilePicture: async (company_id: string, formData: FormData) => {
    try {
      const response = await axiosMain.post(
        `/company/upload-profile-img/${company_id}`,
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
  getCompanyJobs: async (company_id: string) => {
    try {
      const response = await axiosMain.get(
        `/company/get-company-jobs/${company_id}`
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
  getJobApplications: async (company_id: string) => {
    try {
      const response = await axiosMain.get(
        `/company/job-applications/${company_id}`
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
  fetchApplications: async (jobId: string) => {
    try {
      const response = await axiosMain.get(
        `/company/job-applications-post/${jobId}`
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
  jobApplicationsDetailed: async (applicationId: string) => {
    try {
      const response = await axiosMain.get(
        `/company/job-applications-detailed/${applicationId}`
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
  getUserProfile: async (user_id: string) => {
    try {
      const response = await axiosMain.get(`/company/user-profile/${user_id}`);
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
  updateApplicationStatus: async (
    applicationId: string,
    formData: FormData
  ) => {
    try {
      const response = await axiosMain.put(
        `/company/update-application-status/${applicationId}`,
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
  setInterviewDetails: async (
    applicationId: string,
    dateTime: string,
    message: string,
    modalType: string
  ) => {
    try {
      const response = await axiosMain.put(
        `/company/set-interview-details/${applicationId}`,
        {
          interviewStatus: modalType === "cancel" ? "canceled" : "scheduled",
          dateTime: modalType !== "cancel" ? dateTime : undefined,
          message,
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
  getJobPost: async (jobId: string) => {
    try {
      const response = await axiosMain.get(`/company/get-job-post/${jobId}`);
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
  createOrUpdateJobPost: async (jobData: IJobPost) => {
    try {
      const response = await axiosMain.put(
        `/company/create-update-job-post`,
        jobData
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
  resentOtp: async (email: string | null) => {
    try {
      const response = await axiosMain.post(`/company/resent-otp`, { email });
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
  deleteJobPost: async (job_id: string | undefined) => {
    try {
      const response = await axiosMain.delete(
        `/company/delete-job-post/${job_id}`
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

export default companyAPIs;
