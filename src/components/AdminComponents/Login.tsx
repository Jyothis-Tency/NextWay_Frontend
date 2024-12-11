import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginAdminAct } from "@/redux/Actions/adminActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
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
          loginAdminAct({ email, password })
        ).unwrap();

        if (result) {
          toast.success(result.message || "Login successful!");
          setTimeout(() => {
            navigate("../dashboard");
          }, 1500);
        }
      } catch (error: any) {
        // Handle errors returned by rejectWithValue
        toast.error(error || "An unexpected error occurred. Please try again.");
        console.error(error);
      }
    },
  });

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
          alt="Admin Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gray-900 bg-opacity-70"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-white">Next</span>
            <span className="text-3xl font-bold text-blue-500">Gig</span>
            <span className="text-xl font-bold text-blue-500">Admin</span>
          </div>
        </div>

        {/* Login box */}
        <div className="bg-gray-800 bg-opacity-50 p-8 rounded-lg border-2 border-blue-500 shadow-lg shadow-blue-500/50">
          <h1 className="mb-6 text-center text-2xl font-semibold text-blue-500">
            Admin Login
          </h1>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full px-3 py-2 text-white bg-gray-700 border-2 border-blue-500 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full px-3 py-2 text-white bg-gray-700 border-2 border-blue-500 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            {/* <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-white"
              >
                Remember me
              </label>
            </div> */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
              >
                Sign In
              </button>
            </div>
          </form>
          {/* <div className="mt-6 text-center">
            <p className="text-sm text-white">
              If you're having trouble accessing your account, please contact
              the system administrator.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
