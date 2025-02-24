import { useState } from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as Yup from "yup";
import { loginCompanyAct } from "@/redux/Actions/companyActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import MainBg from "../../../public/Main-Bg.jpg";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function LoginUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [notVerifiedModalOpen, setNotVerifiedModalOpen] = useState(false);
  const [verifiedMessage, setVerifiedMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        const { email, password } = values;
        const result = await dispatch(
          loginCompanyAct({ email, password })
        ).unwrap();
        console.log("onsubmit");

        console.log(result);

        if (result) {
          if (result.userData.isBlocked) {
            toast.error(
              "Currently, you are restricted from accessing the site."
            );
            return;
          }
          if (result.userData.isVerified === "reject") {
            setVerifiedMessage(
              "Sorry!!! Your account has been rejected by Admin"
            );
            setNotVerifiedModalOpen(true);
            return;
          }
          // if (result.userData.isVerified === "pending") {
          //   setVerifiedMessage(
          //     "Your account is still verifying by admin. Please come and check again later"
          //   );
          //   setNotVerifiedModalOpen(true);
          //   return;
          // }
          toast.success(result.message);
          setTimeout(() => {
            navigate("../dashboard");
          }, 1500);
        }
      } catch (error: any) {
        toast.error(
          error.message || "An unexpected error occurred. Please try again."
        );
        console.error(error);
      }
    },
  });

  const goToForgotPassword = () => {
    navigate("../forgot-password");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#121212] relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={MainBg}
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#121212] bg-opacity-70"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-[#FFFFFF]">Next</span>
            <span className="text-3xl font-bold text-[#4F46E5]">Way</span>
            <span className="text-3sm font-bold text-[#4F46E5]">Company</span>
          </div>
        </div>

        {/* Login box */}
        <div className="bg-[#1E1E1E] bg-opacity-50 p-8 rounded-lg border-2 border-[#4F46E5] shadow-lg shadow-[#4F46E5]/50">
          <h1 className="mb-6 text-center text-2xl font-semibold text-[#4F46E5]">
            Login
          </h1>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#E0E0E0] mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full px-3 py-2 text-[#FFFFFF] bg-[#2D2D2D] border-2 border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#E0E0E0] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full px-3 py-2 text-[#FFFFFF] bg-[#2D2D2D] border-2 border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-[#60A5FA]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  onClick={goToForgotPassword}
                  className="text-[#60A5FA] hover:underline cursor-pointer"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-[#E0E0E0]">
              Don't have an account?{" "}
              <a
                onClick={() => navigate("../register")}
                className="text-[#60A5FA] hover:underline cursor-pointer"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
      <Dialog
        open={notVerifiedModalOpen}
        onOpenChange={() => setNotVerifiedModalOpen(false)}
      >
        <DialogContent className="bg-[#2D2D2D] text-[#FFFFFF] border-[#4F46E5]">
          <DialogHeader>
            <DialogTitle>Account Verification</DialogTitle>
            <DialogDescription className="text-[#A0A0A0]">
              {verifiedMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setNotVerifiedModalOpen(false)}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-[#FFFFFF]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
