import { axiosMain } from "@/Utils/axiosUtil";
import { AxiosError } from "axios";
import { ApiError } from "@/Utils/interface";
import HttpStatusCode from "@/enums/httpStatusCodes";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  period: string;
  // duration: number;
  features: string[];
  isBlocked: boolean;
  createdAt: string;
}

const adminAPIs = {
  fetchAllUsers: async () => {
    try {
      const response = await axiosMain.get("/admin/all-users");
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
  fetchAllCompanies: async () => {
    try {
      const response = await axiosMain.get("/admin/all-companies");
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
  fetchAllJobPosts: async () => {
    try {
      const response = await axiosMain.get("/admin/getAllJobPosts");
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
  getCompanyDetails: async (company_id: string) => {
    try {
      const response = await axiosMain.get(`/admin/get-company/${company_id}`);
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
  statusChange: async (company_id: string, newStatus: string) => {
    try {
      const response = await axiosMain.patch(
        `/admin/update-verification/${company_id}`,
        {
          newStatus: newStatus,
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
  getAllCompanyProfileImages: async () => {
    try {
      const response = await axiosMain.get("/admin/getAllCompanyProfileImages");
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
  handleBlockUnblockCompany: async (
    companyId: string,
    currentBlockStatus: boolean
  ) => {
    try {
      const response = await axiosMain.post("/admin/block-unblock-company", {
        company_id: companyId,
        block: !currentBlockStatus,
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
  subscriptionBlockUnBlock: async (planId: string, isBlocked: boolean) => {
    try {
      const response = await axiosMain.patch(
        `/admin/subscription-plans/${planId}/toggle-block`,
        {
          isBlocked,
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
  fetchSubscriptionPlans: async () => {
    try {
      const response = await axiosMain.get("/admin/get-subscription-plan");
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
  fetchAllSubscriptions: async () => {
    try {
      const response = await axiosMain.get("/subscribe/all-Subscriptions");
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
      const response = await axiosMain.get("/admin/getAllUserProfileImages");
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
  toggleUserBlock: async (userId: string) => {
    try {
      const response = await axiosMain.post("/admin/block-unblock-user", {
        user_id: userId,
      });
      return response.data.userData;
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
  createSubscriptionPlan: async (
    newPlan: Omit<SubscriptionPlan, "_id" | "isBlocked" | "createdAt">
  ) => {
    try {
      const response = await axiosMain.post(
        "/admin/create-subscription-plan",
        newPlan
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
  editSubscriptionPlan: async (updatedPlan: SubscriptionPlan) => {
    try {
      const response = await axiosMain.put(
        `/admin/edit-subscription-plan`,
        updatedPlan
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

export default adminAPIs;
