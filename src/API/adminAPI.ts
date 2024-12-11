import { axiosAdmin } from "@/Utils/axiosUtil";

// Function to handle blocking/unblocking seeker
export const toggleSeekerBlock = async (
  seekerId: string,
  currentBlockStatus: boolean
) => {
  try {
    const response = await axiosAdmin.post("/block-unblock-seeker", {
      seeker_id: seekerId,
      //   block: !currentBlockStatus,
    });
    if (response.status === 200) {
      return response.data.seekerData; // Assuming the API returns the updated company object
    } else {
      throw new Error("Failed to toggle seeker block status");
    }
    // Return updated seeker data
  } catch (error) {
    console.error("Error toggling block/unblock seeker:", error);
    throw error; // Throw the error to be handled by the calling function
  }
};

export const toggleCompanyBlock = async (
  companyId: string,
  currentBlockStatus: boolean
) => {
  try {
    const response = await axiosAdmin.post(`/toggle-company-block`, {
      company_id:companyId,
      //   isBlocked: !currentBlockStatus,
    });

    if (response.status === 200) {
      return response.data.companyData; // Assuming the API returns the updated company object
    } else {
      throw new Error("Failed to toggle company block status");
    }
  } catch (error) {
    console.error("Error in toggleCompanyBlock:", error);
    throw error;
  }
};
