import { axiosSeeker } from "@/Utils/axiosUtil";

export const fetchJobs = async () => {
  try {
    const response = await axiosSeeker.get(`/getAllJobPosts`);
    console.log(`response- ${response}`);

    const { jobPosts, companies } = response.data;
    console.log(`response- ${jobPosts} ${companies}`);

    // Merge only important company details with jobPosts
    const mergedData = jobPosts.map((jobPost: any) => {
      const company = companies.find(
        (company: any) => company.company_id === jobPost.company_id
      );
      return {
        ...jobPost,
        company: company
          ? {
              companyName: company.name,
              location: company.location,
              website: company.website,
            }
          : {}, // Only include the important company details
      };
    });
    console.log(mergedData);

    return mergedData;
  } catch (error) {
    console.error("Error fetching job posts:", error);
    throw error;
  }
};

export const resentOtp = async (email:string|null) => {
  try {
    const response = await axiosSeeker.post(`/resent-otp`,{email});
    console.log(`response- ${response}`);
    if (response?.data.success) {
      return {
        success: response?.data.success,
        message: response?.data.message,
      };
    }
  } catch (error:any) {
    console.error("Error fetching job posts:", error);
    return {
      success: error.response?.data?.success,
      message: error.response?.data?.message || "Failed to resend OTP",
    };
  }
};

export const fetchJobById = async (jobId: string) => {
  try {
    const response = await axiosSeeker.get(`/getAllJobPosts`);
    console.log(`fetchJobById response- ${response}`);

    const { jobPosts, companies } = response.data;
    console.log(`response- ${jobPosts} ${companies}`);

    // Filter the job post by provided ID
    const filteredJobPost = jobPosts.find(
      (jobPost: any) => jobPost._id === jobId
    );

    if (!filteredJobPost) {
      console.warn(`No job found with ID: ${jobId}`);
      return null; // Return null if no job post matches the given ID
    }

    // Find the corresponding company for the filtered job post
    const company = companies.find(
      (company: any) => company.company_id === filteredJobPost.company_id
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
    console.error("Error fetching job post by ID:", error);
    throw error;
  }
};

export const updateSeekerProfile = async (seeker_id: any, seekerData: any) => {
  try {
    const response = await axiosSeeker.put(
      `/edit-seeker/${seeker_id}`,
      seekerData
    );

    // Log the response data directly
    console.log("Response data:", response);

    // Extract updated seeker profile data from the response
    const updatedSeeker = response.data;

    // Log the updated seeker information
    console.log("Updated Seeker:", updatedSeeker);

    return {
      success: true,
      message: "Profile updated successfully!",
      data: updatedSeeker, // Return updated seeker data
    };
  } catch (error: any) {
    // Improved error handling and logging
    console.error("Error updating seeker profile:", error);

    // Extract and return error message
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update profile.",
    };
  }
};


interface JobApplicationData {
  job_id: string;
  company_id: string;
  seeker_id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  coverLetter: string;
  resume: File;
}

export const submitJobApplication = async (
  applicationData: JobApplicationData
) => {
  try {
    console.log("submitJobApplication");
    console.log(applicationData.resume);

    const formData = new FormData();
    Object.entries(applicationData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const response = await axiosSeeker.post("/post-job-application", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting job application:", error);
    throw error;
  }
};
