import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Loader2, Calendar, CheckCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RootState } from "@/redux/store";
import { axiosUser, axiosAdmin } from "@/Utils/axiosUtil";
import { toast } from "sonner";
import { loadRazorpay } from "@/Utils/loadRazorpay";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  duration: number; // in days
  features: string[];
}

interface SubscriptionHistory {
  _id: string;
  planName: string;
  startDate: string;
  endDate: string;
  price: number;
  isCurrent: boolean;
  status: "active" | "expired" | "cancelled";
}

interface CurrentSubscription {
  planName: string;
  startDate: string;
  endDate: string;
  price: number;
  status: "active" | "expired" | "cancelled";
}

const Subscriptions: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [history, setHistory] = useState<SubscriptionHistory[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<CurrentSubscription | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingCurrent, setLoadingCurrent] = useState(true);
  const [errorPlans, setErrorPlans] = useState<string | null>(null);
  const [errorHistory, setErrorHistory] = useState<string | null>(null);
  const [errorCurrent, setErrorCurrent] = useState<string | null>(null);

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const userId = userInfo?.user_id;
  const userName = `${userInfo?.firstName} ${userInfo?.lastName}`;
  const userEmail = userInfo?.email;
  const userPhone = userInfo?.phone;

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
        console.log("fetchHistory");

        const historyResponse = await axiosUser.get(
          `/subscription-history/${userId}`
        );
        console.log("historyResponse :", historyResponse);

        setHistory(historyResponse.data.history || []);
      } catch (err) {
        setErrorHistory(
          "Failed to load subscription history. Please try again later."
        );
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
        setErrorCurrent(
          "Failed to load current subscription. Please try again later."
        );
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

  const handleSubscribe = async (planId: string) => {
    console.log("handleSubscribe");

    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const selectedPlan = plans.find((plan) => plan._id === planId);
      if (!selectedPlan) throw new Error("Selected plan not found");

      // Create Razorpay order
      const orderResponse = await axiosUser.post(`/razorpay/create-order`, {
        planId,
        userId,
      });
      console.log(orderResponse);

      const { order } = orderResponse.data;

      console.log("order----", order);

      const options: any = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount.toString(),
        currency: order.currency,
        name: "Your Company Name",
        description: `Subscription to ${selectedPlan.name}`,
        image: "/logo.png",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment and create subscription
            console.log(
              "response.razorpay_signature",
              response.razorpay_signature
            );

            const verifyResponse = await axiosUser.post(
              `/subscribe/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId,
                planId,
              }
            );

            if (verifyResponse.data.success) {
              toast.success("Successfully subscribed to the plan");
              const historyResponse = await axiosUser.get(
                `/subscription-history/${userId}`
              );
              console.log(historyResponse.data.history);

              setHistory(historyResponse.data.history || []);
              const currentResponse = await axiosUser.get(
                `/current-subscription/${userId}`
              );
              console.log(currentResponse.data.current);

              setCurrentSubscription(currentResponse.data.current || null);
            } else {
              toast.error("Subscription failed. Please try again.");
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

  return (
    <main className="container mx-auto px-4 py-8 space-y-8 min-h-[calc(100vh-16rem)]">
      <section>
        <h1 className="text-3xl font-bold mb-6">Current Subscription</h1>
        {loadingCurrent ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : errorCurrent ? (
          <Card className="bg-gray-800 text-white mb-12">
            <CardContent className="p-6">
              <p className="text-center text-red-500">{errorCurrent}</p>
            </CardContent>
          </Card>
        ) : currentSubscription ? (
          <Card className="bg-gray-800 text-white mb-12 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl font-semibold">
                  {currentSubscription.planName}
                </h3>
                {/* <Badge
                  variant={
                    currentSubscription.status === "active"
                      ? "secondary"
                      : currentSubscription.status === "expired"
                      ? "destructive"
                      : "outline"
                  }
                  className="text-lg py-2 px-4"
                >
                  {currentSubscription.status}
                </Badge> */}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
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
                  <Calendar className="h-5 w-5 text-gray-400" />
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
                  <CreditCard className="h-5 w-5 text-gray-400" />
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
          <Card className="bg-gray-800 text-white mb-12">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">
                Currently you are not subscribed to any plan.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>
        {loadingPlans ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : errorPlans ? (
          <Card className="bg-gray-800 text-white mb-12">
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
                      ? "bg-gray-700 border-2 border-gray-600"
                      : "bg-gray-800"
                  } text-white`}
                >
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{plan.name}</span>
                      <span className="text-xl font-bold">₹{plan.price}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Duration: {plan.duration} days</span>
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
                      onClick={() => handleSubscribe(plan._id)}
                      className={`w-full ${
                        isCurrentPlan
                          ? "bg-gray-600 hover:bg-gray-600 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
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
          <Card className="bg-gray-800 text-white mb-12">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">
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
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : errorHistory ? (
          <Card className="bg-gray-800 text-white">
            <CardContent className="p-6">
              <p className="text-center text-red-500">{errorHistory}</p>
            </CardContent>
          </Card>
        ) : history.length > 0 ? (
          <Card className="bg-gray-800">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="text-white">
                    <TableHead className="text-white">Plan Name</TableHead>
                    <TableHead className="text-white">Start Date</TableHead>
                    <TableHead className="text-white">End Date</TableHead>
                    <TableHead className="text-white">Price</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item._id} className="text-white">
                      <TableCell>{item.planName}</TableCell>
                      <TableCell>
                        {new Date(item.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(item.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>
                        <Badge>
                          {item.isCurrent === true
                            ? "active"
                            : item.isCurrent === false
                            ? "expired"
                            : "cancelled"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-800 text-white">
            <CardContent className="p-6">
              <p className="text-center text-gray-400">
                You have no subscription history.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
};

export default Subscriptions;
