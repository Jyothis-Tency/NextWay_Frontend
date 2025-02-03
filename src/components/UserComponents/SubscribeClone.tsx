import type React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Loader2, Calendar, CheckCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RootState } from "@/redux/store";
import { axiosUser, axiosAdmin, axiosSubscription } from "@/Utils/axiosUtil";
import { toast } from "sonner";
import { loadRazorpay } from "@/Utils/loadRazorpay";
import { useSocket } from "@/Context/SocketContext";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  period: string;
  duration: number;
  features: string[];
}

interface SubscriptionHistory {
  _id: string;
  user_id: string;
  plan_id: string;
  planName: string;
  period: string;
  startDate: Date;
  features: string[];
  endDate: Date;
  price: number;
  paymentId: string;
  status: string;
  subscriptionId?: string;
  isCurrent?: boolean;
  createdAt?: Date;
}

interface History {
  user_id: string;
  plan_id: string;
  planName: string;
  period: "daily" | "weekly" | "monthly" | "yearly";
  createdType: string;
  startDate: Date;
  endDate: Date;
  price: number;
  createdAt: Date;
}

interface CurrentSubscription {
  _id: "strings";
  user_id: string;
  plan_id: string;
  planName: string;
  startDate: Date;
  features: string[];
  endDate: Date;
  period: string;
  price: number;
  paymentId: string;
  status: string;
  subscriptionId?: string;
  isCurrent?: boolean;
  createdAt?: Date;
}

const Subscriptions: React.FC = () => {
  const socket = useSocket();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [history, setHistory] = useState<History[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentSubscription | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [errorPlans, setErrorPlans] = useState<string | null>(null);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);
  const [errorCurrent, setErrorCurrent] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const userId = userInfo?.user_id;
  const userName = `${userInfo?.firstName} ${userInfo?.lastName}`;
  const userEmail = userInfo?.email;
  const userPhone = userInfo?.phone;

  const fetchSubscriptionData = async () => {
    if (userId) {
      try {
        setLoadingHistory(true);
        setLoadingCurrent(true);

        const [historyResponse, currentResponse] = await Promise.all([
          axiosUser.get(`/subscription-history/${userId}`),
          axiosUser.get(`/current-subscription/${userId}`),
        ]);

        setHistory(historyResponse.data.history || []);
        setCurrentSubscription(currentResponse.data.current || null);
      } catch (err) {
        console.error("Error fetching subscription data:", err);
      } finally {
        setLoadingHistory(false);
        setLoadingCurrent(false);
      }
    }
  };

  useEffect(() => {
    if (socket && userId) {
      socket.emit("join:subscription", userId);

      socket.on(
        "subscription:updated",
        async (data: {
          type:
            | "new_subscription"
            | "subscription_cancelled"
            | "subscription_renewed";
          subscription?: any;
          subscriptionId?: string;
          newEndDate?: Date;
        }) => {
          console.log("Subscription update received:", data);

          switch (data.type) {
            case "new_subscription":
              toast.success("New subscription activated successfully!");
              break;
            case "subscription_cancelled":
              toast.info("Subscription has been cancelled");
              break;
            case "subscription_renewed":
              toast.success("Subscription has been renewed successfully!");
              break;
          }

          await fetchSubscriptionData();
        }
      );

      return () => {
        socket.off("subscription:updated");
        socket.emit("leave:subscription", userId);
      };
    }
  }, [socket, userId, fetchSubscriptionData]); // Added fetchSubscriptionData to dependencies

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansResponse = await axiosAdmin.get("/get-subscription-plan");
        setPlans(plansResponse.data.planData || []);
      } catch (err) {
        setErrorPlans(
          "Failed to load subscription plans. Please try again later."
        );
        console.error("Error fetching subscription plans:", err);
      } finally {
        setLoadingPlans(false);
      }
    };

    const fetchHistory = async () => {
      try {
        const historyResponse = await axiosUser.get(
          `/subscription-history/${userId}`
        );
        setHistory(historyResponse.data.history || []);
      } catch (err) {
        console.error("Error fetching subscription history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    const fetchCurrentSubscription = async () => {
      try {
        const currentResponse = await axiosUser.get(
          `/current-subscription/${userId}`
        );
        setCurrentSubscription(currentResponse.data.current || null);
      } catch (err) {
        console.error("Error fetching current subscription:", err);
      } finally {
        setLoadingCurrent(false);
      }
    };

    if (userId) {
      fetchPlans();
      fetchHistory();
      fetchCurrentSubscription();
    }
  }, [userId]);

  const handleSubscribeClick = (planId: string) => {
    setSelectedPlanId(planId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSubscribe = async () => {
    if (selectedPlanId) {
      setIsConfirmModalOpen(false);
      await handleSubscribe(selectedPlanId);
    }
  };

  const handleSubscribe = async (planId: string) => {
    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const selectedPlan = plans.find((plan) => plan._id === planId);
      if (!selectedPlan) throw new Error("Selected plan not found");

      const response = await axiosSubscription.post(`/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: { userId, planId },
      });

      const data = response.data;

      if (response.status !== 200) {
        throw new Error(data.message || "Failed to initialize payment");
      }

      const options: any = {
        key: RAZORPAY_KEY_ID,
        amount: data.amount.toString(),
        currency: data.currency,
        name: "NextWay",
        description: `Subscription to ${selectedPlan.name}`,
        image: "/logo.png",
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await axiosSubscription.post(`/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (verifyResponse.data.success) {
              toast.success("Subscription successful");
            } else {
              toast.error(
                "Subscription verification failed. Please try again."
              );
            }
          } catch (err: any) {
            console.error("Error verifying payment:", err);
            toast.error("Payment verification failed. Please try again.");
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone,
        },
        notes: {
          planId: planId,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      console.error("Error subscribing to plan:", err);
      toast.error("Failed to subscribe to the plan. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      if (!currentSubscription?.subscriptionId) {
        toast.error("No active subscription found");
        return;
      }

      await axiosSubscription.delete(
        `/cancel/${currentSubscription.subscriptionId}`
      );
      setIsCancelModalOpen(false);
      toast.success("Cancellation request submitted");

      await fetchSubscriptionData();
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 min-h-[calc(100vh-16rem)] bg-[#000000]">
      <section>
        <h1 className="text-3xl font-bold mb-6">Current Subscription</h1>
        {loadingCurrent ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
          </div>
        ) : errorCurrent ? (
          <Card className="bg-[#1E1E1E] text-white mb-12">
            <CardContent className="p-6">
              <p className="text-center text-red-500">{errorCurrent}</p>
            </CardContent>
          </Card>
        ) : currentSubscription ? (
          <Card className="bg-[#1E1E1E] text-white mb-12 max-w-2xl mx-auto border border-[#2D2D2D]">
            <CardContent className="p-8">
              <div className="flex items-center justify-between gap-3 mb-6">
                <h3 className="text-2xl font-semibold">
                  {currentSubscription.planName}
                </h3>
                {currentSubscription.status === "active" && (
                  <Button
                    variant="destructive"
                    className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
                    onClick={() => setIsCancelModalOpen(true)}
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#A0A0A0]" />
                  <p>
                    Start Date:{" "}
                    <span className="font-medium">
                      {new Date(
                        currentSubscription.startDate
                      ).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#A0A0A0]" />
                  <p>
                    End Date:{" "}
                    <span className="font-medium">
                      {new Date(
                        currentSubscription.endDate
                      ).toLocaleDateString()}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#A0A0A0]" />
                  <p>
                    Period:{" "}
                    <span className="font-medium">
                      {currentSubscription.period}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[#A0A0A0]" />
                  <p>
                    Price:{" "}
                    <span className="font-medium">
                      ₹{currentSubscription.price}
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#1E1E1E] text-white mb-12">
            <CardContent className="p-6">
              <p className="text-center text-[#A0A0A0]">
                You are not currently subscribed.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>
        {loadingPlans ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-[#494691]" />
          </div>
        ) : errorPlans ? (
          <Card className="bg-[#1E1E1E] text-white mb-12">
            <CardContent className="p-6">
              <p className="text-center text-red-500">{errorPlans}</p>
            </CardContent>
          </Card>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => {
              const isCurrentPlan = currentSubscription?.planName === plan.name;
              return (
                <Card
                  key={plan._id}
                  className={`${
                    isCurrentPlan
                      ? "bg-[#1b1938] border-2 border-gray-600"
                      : "bg-[#1E1E1E]"
                  } text-white border border-[#2D2D2D]`}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{plan.name}</span>
                      <span className="text-xl font-bold">₹{plan.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="h-4 w-4 text-[#A0A0A0]" />
                      <span>Period: {plan.period}</span>
                    </div>
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSubscribeClick(plan._id)}
                      className={`w-full ${
                        isCurrentPlan
                          ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                          : "bg-[#4F46E5] hover:bg-[#6366F1]"
                      } text-white`}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? "Current Plan" : "Subscribe"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-[#1E1E1E] text-white mb-12">
            <CardContent className="p-6">
              <p className="text-center text-[#A0A0A0]">
                No subscription plans are currently available.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Subscription History</h2>
        {loadingHistory ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-[#4F46E5]" />
          </div>
        ) : errorHistory ? (
          <Card className="bg-[#1E1E1E] text-white">
            <CardContent className="p-6">
              <p className="text-center text-red-500">{errorHistory}</p>
            </CardContent>
          </Card>
        ) : history.length > 0 ? (
          <Card className="bg-[#1E1E1E]">
            <CardContent>
              <Table className="border-[#2D2D2D]">
                <TableHeader>
                  <TableRow className="border-b border-[#2D2D2D] text-white">
                    <TableHead className="text-[#A0A0A0]">Plan Name</TableHead>
                    <TableHead className="text-[#A0A0A0]">Start Date</TableHead>
                    <TableHead className="text-[#A0A0A0]">End Date</TableHead>
                    <TableHead className="text-[#A0A0A0]">Period</TableHead>
                    <TableHead className="text-[#A0A0A0]">Price</TableHead>
                    <TableHead className="text-[#A0A0A0]">Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow
                      key={item.user_id}
                      className="border-b border-[#2D2D2D] text-white"
                    >
                      <TableCell>{item.planName}</TableCell>
                      <TableCell>
                        {new Date(item.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(item.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{item.period}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>{item.createdType}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-[#1E1E1E] text-white">
            <CardContent className="p-6">
              <p className="text-center text-[#A0A0A0]">
                No subscription history.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#1E1E1E] text-white border border-[#2D2D2D]">
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription className="text-[#A0A0A0]">
              Are you sure you want to subscribe to this plan?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent text-white border-[#4F46E5] hover:bg-[#2D2D2D]"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#4F46E5] hover:bg-[#6366F1] text-white"
              onClick={handleConfirmSubscribe}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#1E1E1E] text-white border border-[#2D2D2D]">
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription className="text-[#A0A0A0]">
              Are you sure you want to cancel your subscription? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="bg-transparent text-white border-[#4F46E5] hover:bg-[#2D2D2D]"
              onClick={() => setIsCancelModalOpen(false)}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
              onClick={handleCancelSubscription}
            >
              Yes, Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Subscriptions;
