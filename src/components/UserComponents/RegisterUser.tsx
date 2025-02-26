import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import {
  googleLoginUserAct,
  registerUserAct,
} from "../../redux/Actions/userActions";
import { toast } from "sonner";
import { ApiError } from "@/Utils/interface";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
import MainBg from "../../../public/Main-Bg.jpg";

const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
    .required("First Name is required"),
  lastName: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces")
    .required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const RegisterUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        localStorage.setItem("register-email", values.email);
        const result = await dispatch(registerUserAct(values));
        console.log(result);

        if (result?.success) {
          console.log("Successsssss");
          toast.success(result?.message);
          navigate("/otp");
        } else {
          console.log("Errorrrrrrrrr");

          toast.error(result?.message);
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
        console.error(error);
      }
    },
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const credential = credentialResponse.credential;
      const res = await dispatch(googleLoginUserAct(credential)).unwrap();
      const result = res?.userData;
      if (result) {
        if (result?.isBlocked) {
          toast.error("Currently, you are restricted from accessing the site.");
          return;
        }
        toast.success("Google Authentication Successful");
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);
      }
    } catch (error: any) {
      const err = error as ApiError;
      toast.error(err.message || "Google authentication failed");
    }
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
        <div className="flex justify-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#FFFFFF]">Next</span>
            <span className="text-2xl font-bold text-[#4F46E5]">Way</span>
          </div>
        </div>

        {/* Form box */}
        <div className="bg-[#1E1E1E] bg-opacity-50 p-6 rounded-lg border-2 border-[#4F46E5] shadow-lg shadow-[#4F46E5]/50">
          <h1 className="mb-4 text-center text-xl font-semibold text-[#4F46E5]">
            Sign Up
          </h1>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="firstName"
                id="firstName"
                className="w-full text-[#FFFFFF] py-1.5 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Enter your first name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <div className="text-[#EF4444] text-xs mt-0.5">
                  {formik.errors.firstName}
                </div>
              ) : null}
            </div>
            <div>
              <input
                type="text"
                name="lastName"
                id="lastName"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Enter your last name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.lastName}
                </div>
              ) : null}
            </div>
            <div>
              <input
                type="email"
                name="email"
                id="email"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Enter your email"
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
              <input
                type="tel"
                name="phone"
                id="phone"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Enter your phone number (10 digits)"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>
            <div>
              <input
                type="password"
                name="password"
                id="password"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Confirm your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-[#A0A0A0]">
                Already have an account?{" "}
                <a
                  onClick={() => navigate("/login")}
                  className="text-[#60A5FA] hover:underline cursor-pointer"
                >
                  Sign in here
                </a>
              </p>
              <button
                type="submit"
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] px-4 py-1.5 rounded-md"
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#4B5563]"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#1E1E1E] px-4 text-sm text-[#A0A0A0] font-medium">
                OR
              </span>
            </div>
          </div>
          <div className="mt-6">
            <div className="flex justify-center">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google sign up failed");
                  }}
                />
              </GoogleOAuthProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;
