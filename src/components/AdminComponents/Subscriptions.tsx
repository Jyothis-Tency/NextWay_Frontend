import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { axiosAdmin,axiosSubscription } from "@/Utils/axiosUtil";
import { Header } from "@/components/Common/AdminCommon/Header";
import { Sidebar } from "@/components/Common/AdminCommon/Sidebar";
import { Footer } from "@/components/Common/AdminCommon/Footer";
import { Loader2 } from "lucide-react";
import { createSubscriptionPlan, editSubscriptionPlan } from "@/API/adminAPI";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isBlocked: boolean;
  createdAt: string;
}

interface UserSubscription {
  _id: string;
  user_id: string;
  plan_id: string;
  planName: string;
  startDate: string;
  endDate: string;
  price: number;
  features: string[];
  paymentId: string;
  status: string;
  subscriptionId: string;
  isCurrent: boolean;
  createdAt: string;
}

const FeatureRegistry = {
  job_alerts: "Receive personalized job alerts",
  trending_jobs: "Access to trending job listings",
  priority_jobs: "Highlight applications for priority jobs",
  resume_boost: "Feature your resume in search results",
  unlimited_search: "Unlimited advanced job search filters",
  company_stats: "Detailed analytics about companies",
};

const Subscriptions: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [allSubscriptions, setAllSubscriptions] = useState<UserSubscription[]>(
    []
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDisabled = plans.length === 3 ? true : false;

  useEffect(() => {
    fetchPlans();
    fetchAllSubscriptions();
  }, []);

  const fetchPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosAdmin.get("/get-subscription-plan");
      setPlans(response.data.planData);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      setError("Failed to fetch subscription plans. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllSubscriptions = async () => {
    try {
      const response = await axiosSubscription.get("/all-Subscriptions");
      setAllSubscriptions(response.data);
    } catch (error) {
      console.error("Error fetching all subscriptions:", error);
      toast.error("Failed to fetch all subscriptions");
    }
  };

  const handleCreatePlan = async (
    newPlan: Omit<SubscriptionPlan, "_id" | "isBlocked" | "createdAt">
  ) => {
    try {
      const result = await createSubscriptionPlan(newPlan);
      console.log(result);

      if (result?.success) {
        fetchPlans();
        setIsCreateModalOpen(false);
        toast.success(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error creating subscription plan 1:", error);
    }
  };

  const handleEditPlan = async (updatedPlan: SubscriptionPlan) => {
    try {
      const result = await editSubscriptionPlan(updatedPlan);
      if (result?.success) {
        fetchPlans();
        setIsEditModalOpen(false);
        toast.success(result.message);
      }
    } catch (error: any) {
      toast.error(error.message);
      console.error("Error updating subscription plan:", error);
    }
  };

  const handleToggleBlock = async (planId: string, isBlocked: boolean) => {
    try {
      await axiosAdmin.patch(`/subscription-plans/${planId}/toggle-block`, {
        isBlocked,
      });
      fetchPlans();
    } catch (error) {
      console.error("Error toggling plan block status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-y-auto pt-16 pl-64">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Subscription Plans</h1>
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  // className={`${
                  //   isDisabled
                  //     ? "bg-gray-400 cursor-not-allowed"
                  //     : "bg-red-600 hover:bg-red-700"
                  // }`}
                  // disabled={isDisabled}
                >
                  Create Subscription Plan
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : plans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <SubscriptionCard
                      key={plan._id}
                      plan={plan}
                      onEdit={() => {
                        setEditingPlan(plan);
                        setIsEditModalOpen(true);
                      }}
                      onToggleBlock={() =>
                        handleToggleBlock(plan._id, !plan.isBlocked)
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No subscription plans found.
                </div>
              )}

              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">
                  All User Subscriptions
                </h2>
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                  <div
                    className="overflow-x-auto"
                    style={{ maxHeight: "400px" }}
                  >
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Plan Name</TableHead>
                          <TableHead>Start Date</TableHead>
                          <TableHead>End Date</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          {/* <TableHead>Is Current</TableHead> */}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allSubscriptions.map((subscription) => (
                          <TableRow key={subscription._id}>
                            <TableCell>{subscription.user_id}</TableCell>
                            <TableCell>{subscription.planName}</TableCell>
                            <TableCell>
                              {new Date(
                                subscription.startDate
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(
                                subscription.endDate
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>₹{subscription.price}</TableCell>
                            <TableCell>{subscription.status}</TableCell>
                            {/* <TableCell>
                              {subscription.isCurrent ? "Yes" : "No"}
                            </TableCell> */}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>

      <CreateSubscriptionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlan}
      />

      <EditSubscriptionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditPlan}
        plan={editingPlan}
      />
    </div>
  );
};

const CreateSubscriptionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    plan: Omit<SubscriptionPlan, "_id" | "isBlocked" | "createdAt">
  ) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      price: Number(price),
      duration: Number(duration),
      features,
    });
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDuration("");
    setFeatures([]);
  };

  const addFeature = (feature: string) => {
    if (!features.includes(feature)) {
      setFeatures((prev) => [...prev, feature]);
    }
    setIsFeatureDropdownOpen(false);
  };

  const removeFeature = (featureToRemove: string) => {
    setFeatures((prev) =>
      prev.filter((feature) => feature !== featureToRemove)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 text-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create Subscription Plan
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setIsFeatureDropdownOpen(!isFeatureDropdownOpen)
                  }
                  className="w-full text-black justify-start text-left font-normal"
                >
                  Add Features
                </Button>
                {isFeatureDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                    <div className="py-1">
                      {Object.entries(FeatureRegistry).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700"
                          onClick={() => addFeature(key)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {features.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Features:</Label>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded-md"
                    >
                      <span>
                        {
                          FeatureRegistry[
                            feature as keyof typeof FeatureRegistry
                          ]
                        }
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(feature)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Create Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EditSubscriptionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: SubscriptionPlan) => void;
  plan: SubscriptionPlan | null;
}> = ({ isOpen, onClose, onSubmit, plan }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);

  useEffect(() => {
    if (plan) {
      setName(plan.name);
      setPrice(plan.price.toString());
      setDuration(plan.duration.toString());
      setFeatures(plan.features);
    }
  }, [plan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (plan) {
      onSubmit({
        ...plan,
        name,
        price: Number(price),
        duration: Number(duration),
        features,
      });
    }
  };

  const addFeature = (feature: string) => {
    if (!features.includes(feature)) {
      setFeatures((prev) => [...prev, feature]);
    }
    setIsFeatureDropdownOpen(false);
  };

  const removeFeature = (featureToRemove: string) => {
    setFeatures((prev) =>
      prev.filter((feature) => feature !== featureToRemove)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 text-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Subscription Plan
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full text-black"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setIsFeatureDropdownOpen(!isFeatureDropdownOpen)
                  }
                  className="w-full text-black justify-start text-left font-normal"
                >
                  Add Features
                </Button>
                {isFeatureDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                    <div className="py-1">
                      {Object.entries(FeatureRegistry).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700"
                          onClick={() => addFeature(key)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {features.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Features:</Label>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded-md"
                    >
                      <span>
                        {
                          FeatureRegistry[
                            feature as keyof typeof FeatureRegistry
                          ]
                        }
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(feature)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Update Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const SubscriptionCard: React.FC<{
  plan: SubscriptionPlan;
  onEdit: () => void;
  onToggleBlock: () => void;
}> = ({ plan, onEdit, onToggleBlock }) => {
  return (
    <Card className="bg-gray-800 text-white">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{plan.name}</span>
          <span className="text-xl font-bold">₹{plan.price}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2">Duration: {plan.duration} days</p>
        <p className="mb-2">
          Created: {new Date(plan.createdAt).toLocaleDateString()}
        </p>
        <h4 className="font-semibold mb-2">Features:</h4>
        <ul className="list-disc pl-5 mb-4">
          {plan.features.map((feature) => (
            <li key={feature}>
              {FeatureRegistry[feature as keyof typeof FeatureRegistry]}
            </li>
          ))}
        </ul>
        {/* <p className="mb-4">Status: {plan.isBlocked ? "Blocked" : "Active"}</p> */}
        <div className="flex justify-between">
          <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
            Edit
          </Button>
          <Button
            onClick={onToggleBlock}
            className={`${
              plan.isBlocked
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {plan.isBlocked ? "Unblock" : "Block"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Subscriptions;
