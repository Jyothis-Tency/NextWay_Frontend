import { axiosAdmin } from "@/Utils/axiosUtil";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isBlocked: boolean;
  createdAt: string;
}

// Function to handle blocking/unblocking user
export const toggleUserBlock = async (
  userId: string,
  currentBlockStatus: boolean
) => {
  try {
    const response = await axiosAdmin.post("/block-unblock-user", {
      user_id: userId,
      //   block: !currentBlockStatus,
    });
    if (response.status === 200) {
      return response.data.userData; // Assuming the API returns the updated company object
    } else {
      throw new Error("Failed to toggle user block status");
    }
    // Return updated user data
  } catch (error) {
    console.error("Error toggling block/unblock user:", error);
    throw error; // Throw the error to be handled by the calling function
  }
};

export const toggleCompanyBlock = async (
  companyId: string,
  currentBlockStatus: boolean
) => {
  try {
    const response = await axiosAdmin.post(`/toggle-company-block`, {
      company_id: companyId,
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

export const createSubscriptionPlan = async (
  newPlan: Omit<SubscriptionPlan, "_id" | "isBlocked" | "createdAt">
) => {
  try {
    const response = await axiosAdmin.post(
      "/create-subscription-plan",
      newPlan
    );
    if (response.status === 200) {
      return { success: true, message: "New plan created successfully!" }; // Assuming the API returns the updated company object
    } else {
    }
  } catch (error: any) {
    console.error(
      "Error creating subscription plan:",
      error.response?.data?.message
    );
    throw new Error(
      error.response?.data.message || "Failed to create new plan"
    );
  }
};

export const editSubscriptionPlan = async (updatedPlan: SubscriptionPlan) => {
  try {
    const response = await axiosAdmin.put(
      `/edit-subscription-plan`,
      updatedPlan
    );
    if (response.status === 200) {
      return { success: true, message: "Updated plan successfully!" };
    } else {
      throw new Error("Failed to update the plan");
    }
  } catch (error: any) {
    console.error("Error updating subscription plan:", error);
    throw new Error(
      error.response?.data.message || "Failed to update plan"
    );
  }
};
