import { axiosMain } from "@/Utils/axiosUtil";

export const createOrUpdateJobPost = async (jobData: any) => {
  try {
    const response = await axiosMain.put(
      `/company/create-update-job-post`,
      jobData
    );

    if (response.status === 200) {
      console.log(`Created new job post successfully: ${response.data}`);
      return { success: true, message: "New Job Posted successfully!" };
    }
  } catch (error: any) {
    console.error(`Error in createNewJobPost:`, error);

    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Failed to update profile",
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};

export const resentOtp = async (email: string | null) => {
  try {
    const response = await axiosMain.post(`/company/resent-otp`, { email });
    console.log(`response- ${response}`);
    if (response?.data.success) {
      return {
        success: response?.data.success,
        message: response?.data.message,
      };
    }
  } catch (error: any) {
    console.error("Error fetching job posts:", error);
    return {
      success: error.response?.data?.success,
      message: error.response?.data?.message || "Failed to resend OTP",
    };
  }
};

export const deleteJobPost = async (job_id: string | undefined) => {
  try {
    const response = await axiosMain.delete(
      `/company/delete-job-post/${job_id}`
    );
    if (response.status === 200) {
      console.log(`Created new job post successfully: ${response}`);
      return { success: true, message: "Job Post Deleted" };
    }
  } catch (error: any) {
    console.error(`Error in createNewJobPost:`, error);

    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || "Failed to update profile",
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
};
