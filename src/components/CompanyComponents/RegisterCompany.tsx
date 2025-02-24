import React, { useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { registerCompanyAct } from "../../redux/Actions/companyActions";
import { toast } from "sonner";
import MainBg from "../../../public/Main-Bg.jpg";

const FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUPPORTED_FORMATS = ["application/pdf"];

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
  certificate: Yup.mixed()
    .test(
      "fileSize",
      "File is too large",
      (value) => value && value instanceof File && value.size <= FILE_SIZE
    )
    .test(
      "fileType",
      "Unsupported file format",
      (value) =>
        value &&
        value instanceof File &&
        SUPPORTED_FORMATS.includes((value as File).type)
    ),
});

const RegisterCompany: React.FC = () => {
  const [fileName, setFileName] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      certificate: null as File | null,
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        console.log("values in onSubmit", values);

        localStorage.setItem("register-email", values.email);
        // const formData = new FormData();
        // Object.keys(values).forEach((key) => {
        //   if (key === "certificate" && values.certificate) {
            
        //     formData.append(key, values.certificate);
        //   } else {
        //     formData.append(key, values[key as keyof typeof values] as string);
        //   }
        // });
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
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("certificate", file);
      setFileName(file.name);
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
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-[#FFFFFF]">Next</span>
            <span className="text-3xl font-bold text-[#4F46E5]">Way</span>
            <span className="text-3sm font-bold text-[#4F46E5]">Company</span>
          </div>
        </div>

        {/* Form box */}
        <div className="bg-[#1E1E1E] bg-opacity-50 p-8 rounded-lg border-2 border-[#4F46E5] shadow-lg shadow-[#4F46E5]/50">
          <h1 className="mb-6 text-center text-2xl font-semibold text-[#4F46E5]">Company Sign Up</h1>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div>
              
              <input
                type="text"
                name="name"
                id="name"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Enter company name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-[#EF4444] text-xs mt-1">{formik.errors.name}</div>
              ) : null}
            </div>
            <div>
              
              <input
                type="email"
                name="email"
                id="email"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Enter email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-[#EF4444] text-xs mt-1">{formik.errors.email}</div>
              ) : null}
            </div>
            <div>
              
              <input
                type="tel"
                name="phone"
                id="phone"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Enter phone number (10 digits)"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-[#EF4444] text-xs mt-1">{formik.errors.phone}</div>
              ) : null}
            </div>
            <div>
              
              <input
                type="password"
                name="password"
                id="password"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-[#EF4444] text-xs mt-1">{formik.errors.password}</div>
              ) : null}
            </div>
            <div>
              
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                placeholder="Confirm password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="text-[#EF4444] text-xs mt-1">{formik.errors.confirmPassword}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="certificate" className="block text-sm font-medium text-[#E0E0E0] mb-1">
                Certificate (Add company cerificate for validation)
              </label>
              <input
                type="file"
                id="certificate"
               name="certificate"
               
                accept=".pdf"
                className="w-full text-[#FFFFFF] py-2 px-3 bg-[#2D2D2D] border border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1]"
                onChange={handleFileChange}
              />
              {fileName && <p className="text-[#E0E0E0] text-xs mt-1">Selected file: {fileName}</p>}
              {formik.touched.certificate && formik.errors.certificate ? (
                <div className="text-[#EF4444] text-xs mt-1">{formik.errors.certificate as string}</div>
              ) : null}
            </div>
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-[#A0A0A0]">
                Already have a company account?{" "}
                <a onClick={() => navigate("../login")} className="text-[#60A5FA] hover:underline cursor-pointer">
                  Sign in here
                </a>
              </p>
              <button type="submit" className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] px-4 py-2 rounded-md">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
};

export default RegisterCompany;
