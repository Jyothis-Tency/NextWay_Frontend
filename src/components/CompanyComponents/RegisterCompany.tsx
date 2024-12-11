import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { registerCompanyAct } from "../../redux/Actions/companyActions";
import { toast } from "sonner";

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters")
    .required("Company name is required"),
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

const RegisterCompany: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        localStorage.setItem("register-email", values.email);
        const result = await dispatch(registerCompanyAct(values));
        console.log(result);

        if (result?.success) {
          console.log("Success");
          toast.success(result?.message);
          navigate("../otp");
        } else {
          console.log("Error");
          toast.error(result?.message);
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
        console.error(error);
      }
    },
  });
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://as2.ftcdn.net/v2/jpg/08/10/92/69/1000_F_810926942_LcXpqYlTiWNcNntJpVTh8nr510jnZniK.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-white">Next</span>
            <span className="text-3xl font-bold text-red-600">Gig</span>
            <span className="text-3sm font-bold text-red-600">Company</span>
          </div>
        </div>

        {/* Form box */}
        <div className="bg-black bg-opacity-50 p-8 rounded-lg border-2 border-red-500 shadow-lg shadow-red-500/50">
          <h1 className="mb-6 text-center text-2xl font-semibold text-red-600">
            Company Sign Up
          </h1>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                name="name"
                className="w-full text-white py-2 px-3 bg-transparent border border-red-500 rounded-md outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Company Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.name}
                </div>
              ) : null}
            </div>
            <div>
              <input
                type="email"
                name="email"
                className="w-full text-white py-2 px-3 bg-transparent border border-red-500 rounded-md outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Email"
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
              <input
                type="tel"
                name="phone"
                className="w-full text-white py-2 px-3 bg-transparent border border-red-500 rounded-md outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Phone (10 digits)"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>
            <div>
              <input
                type="password"
                name="password"
                className="w-full text-white py-2 px-3 bg-transparent border border-red-500 rounded-md outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                className="w-full text-white py-2 px-3 bg-transparent border border-red-500 rounded-md outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-gray-400">
                Already have a company account?{" "}
                <a
                  onClick={() => navigate("../login")}
                  className="text-red-600 hover:underline"
                >
                  Sign in here
                </a>
              </p>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterCompany;
