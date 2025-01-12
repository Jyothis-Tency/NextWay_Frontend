// import React, { useState, useEffect } from "react";
// import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// const SubscriptionManager = ({ userId, planId }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [subscription, setSubscription] = useState(null);
//   const [paymentProcessing, setPaymentProcessing] = useState(false);

//   // Load existing subscription details
//   useEffect(() => {
//     const fetchSubscription = async () => {
//       try {
//         const response = await fetch(`/api/subscriptions/status/${userId}`);
//         const data = await response.json();
//         if (data.subscription) {
//           setSubscription(data.subscription);
//         }
//       } catch (err) {
//         console.error("Error fetching subscription:", err);
//       }
//     };

//     fetchSubscription();
//   }, [userId]);

//   // Initialize Razorpay payment
//   const initializePayment = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch("/api/subscriptions/initialize", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, planId }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to initialize payment");
//       }

//       // Create Razorpay options
//       const options = {
//         key: data.key_id,
//         amount: data.amount,
//         currency: data.currency,
//         name: "Your Company Name",
//         description: "Subscription Payment",
//         order_id: data.orderId,
//         handler: async (response) => {
//           setPaymentProcessing(true);
//           try {
//             // Verify payment
//             const verifyResponse = await fetch("/api/subscriptions/verify", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_signature: response.razorpay_signature,
//               }),
//             });

//             const verifyData = await verifyResponse.json();

//             if (!verifyResponse.ok) {
//               throw new Error(
//                 verifyData.message || "Payment verification failed"
//               );
//             }

//             // Refresh subscription status
//             const subscriptionResponse = await fetch(
//               `/api/subscriptions/status/${userId}`
//             );
//             const subscriptionData = await subscriptionResponse.json();
//             setSubscription(subscriptionData.subscription);
//           } catch (err) {
//             setError(err.message);
//           } finally {
//             setPaymentProcessing(false);
//           }
//         },
//         prefill: {
//           name: "User Name", // You can pass user details here
//           email: "user@example.com",
//         },
//         theme: {
//           color: "#4f46e5",
//         },
//       };

//       // Initialize Razorpay
//       const rzp = new (window as any).Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cancel subscription
//   const handleCancel = async () => {
//     if (!subscription?.subscriptionId) return;

//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(
//         `/api/subscriptions/cancel/${subscription.subscriptionId}`,
//         {
//           method: "POST",
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to cancel subscription");
//       }

//       // Update subscription status
//       setSubscription((prev) => ({
//         ...prev,
//         status: "cancelled",
//         isCurrent: false,
//       }));
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (date: string) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="w-full max-w-md mx-auto p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Subscription Management</CardTitle>
//           <CardDescription>
//             Manage your subscription and payment details
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-4">
//               <AlertCircle className="h-4 w-4" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           {subscription && subscription.isCurrent && (
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <CheckCircle2 className="h-5 w-5 text-green-500" />
//                 <span className="font-medium">Active Subscription</span>
//               </div>

//               <div className="space-y-2">
//                 <p>
//                   <span className="font-medium">Plan:</span>{" "}
//                   {subscription.planName}
//                 </p>
//                 <p>
//                   <span className="font-medium">Status:</span>{" "}
//                   {subscription.status}
//                 </p>
//                 <p>
//                   <span className="font-medium">Start Date:</span>{" "}
//                   {formatDate(subscription.startDate)}
//                 </p>
//                 <p>
//                   <span className="font-medium">End Date:</span>{" "}
//                   {formatDate(subscription.endDate)}
//                 </p>
//                 <p>
//                   <span className="font-medium">Price:</span> ₹
//                   {subscription.price}
//                 </p>
//               </div>
//             </div>
//           )}
//         </CardContent>

//         <CardFooter className="flex justify-end space-x-4">
//           {(!subscription || !subscription.isCurrent) && (
//             <Button
//               onClick={initializePayment}
//               disabled={loading || paymentProcessing}
//             >
//               {loading || paymentProcessing ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 "Subscribe Now"
//               )}
//             </Button>
//           )}

//           {subscription?.isCurrent && subscription.status === "active" && (
//             <Button
//               variant="destructive"
//               onClick={handleCancel}
//               disabled={loading}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Cancelling...
//                 </>
//               ) : (
//                 "Cancel Subscription"
//               )}
//             </Button>
//           )}
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default SubscriptionManager;
