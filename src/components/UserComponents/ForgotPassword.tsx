import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../redux/store";
import {
  forgotPasswordEmailAct,
  forgotPasswordOTPAct,
  forgotPasswordResetAct,
} from "@/redux/Actions/userActions";
import { resentOtp } from "@/API/userAPI";

const TIMER_DURATION = 60 * 1000; // 60 seconds in milliseconds

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  otp: Yup.string().length(4, "OTP must be 4 digits"),
  newPassword: Yup.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "Passwords must match"
  ),
});

const ForgotPasswordForm: React.FC = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndUpdateTimer = () => {
      const startTimeStr = localStorage.getItem("otpTimerStart");
      if (startTimeStr) {
        const startTime = parseInt(startTimeStr, 10);
        const now = Date.now();
        const elapsedTime = now - startTime;

        if (elapsedTime < TIMER_DURATION) {
          setTimeLeft(Math.ceil((TIMER_DURATION - elapsedTime) / 1000));
        } else {
          localStorage.removeItem("otpTimerStart");
          setTimeLeft(0);
        }
      } else {
        setTimeLeft(0);
      }
    };

    checkAndUpdateTimer();

    const timer = setInterval(checkAndUpdateTimer, 1000);

    return () => clearInterval(timer);
  }, []);

  const startTimer = () => {
    const startTime = Date.now();
    localStorage.setItem("otpTimerStart", startTime.toString());
    setTimeLeft(TIMER_DURATION / 1000);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        if (!otpSent) {
          const result = await dispatch(forgotPasswordEmailAct(values.email));
          if (result?.success) {
            toast.success(result?.message);
            setOtpSent(true);
            startTimer();
          } else {
            toast.error(result?.message);
          }
        } else if (!otpVerified) {
          const result = await dispatch(forgotPasswordOTPAct(values.otp));
          if (result?.success) {
            toast.success(result.message);
            setOtpVerified(true);
          } else {
            toast.error(result?.message);
          }
        } else {
          const result = await dispatch(
            forgotPasswordResetAct(values.email, values.newPassword)
          );

          if (result?.success) {
            toast.success(result.message);
            setTimeout(() => {
              navigate("../login");
            }, 1500);
          } else {
            toast.error(result?.message);
          }
        }
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.");
        console.error(error);
      }
    },
  });

  const getFieldStyle = (fieldName: string) => {
    const baseStyle =
      "w-full px-3 py-2 text-white bg-transparent border-2 rounded-md outline-none focus:ring-2";
    const activeStyle = "border-red-500 focus:ring-red-500";
    const inactiveStyle = "border-gray-500 text-gray-500 cursor-not-allowed";

    if (fieldName === "email" && !otpSent) return `${baseStyle} ${activeStyle}`;
    if (fieldName === "otp" && otpSent && !otpVerified)
      return `${baseStyle} ${activeStyle}`;
    if (
      (fieldName === "newPassword" || fieldName === "confirmPassword") &&
      otpVerified
    )
      return `${baseStyle} ${activeStyle}`;
    return `${baseStyle} ${inactiveStyle}`;
  };

  const handleResendOtp = async () => {
    try {
      const result = await resentOtp(formik.values.email);

      if (result?.success) {
        toast.success("OTP resent successfully");
        startTimer();
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://as2.ftcdn.net/v2/jpg/08/10/92/69/1000_F_810926942_LcXpqYlTiWNcNntJpVTh8nr510jnZniK.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-white">Next</span>
            <span className="text-3xl font-bold text-red-600">Way</span>
          </div>
        </div>

        <div className="bg-black bg-opacity-50 p-8 rounded-lg border-2 border-red-500 shadow-lg shadow-red-500/50">
          <h1 className="mb-6 text-center text-2xl font-semibold text-red-600">
            Forgot Password
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
                className={getFieldStyle("email")}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={otpSent}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-white mb-1"
              >
                Enter OTP
              </label>
              <div className="flex space-x-2">
                {[0, 1, 2, 3].map((index) => (
                  <input
                    key={index}
                    name={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    className={`w-12 h-12 text-center ${getFieldStyle("otp")}`}
                    value={formik.values.otp[index] || ""}
                    onChange={(e) => {
                      const newOtp = formik.values.otp.split("");
                      newOtp[index] = e.target.value;
                      formik.setFieldValue("otp", newOtp.join(""));
                      if (e.target.value && e.target.nextSibling) {
                        (e.target.nextSibling as HTMLInputElement).focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Backspace" &&
                        !e.currentTarget.value &&
                        e.currentTarget.previousSibling
                      ) {
                        e.preventDefault();
                        (
                          e.currentTarget.previousSibling as HTMLInputElement
                        ).focus();
                      }
                    }}
                    disabled={!otpSent || otpVerified}
                  />
                ))}
              </div>
              {formik.touched.otp && formik.errors.otp ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.otp}
                </div>
              ) : null}
              {otpSent && !otpVerified && (
                <div className="mt-2">
                  {timeLeft && timeLeft > 0 ? (
                    <p className="text-white text-sm">
                      Resend OTP in {timeLeft} seconds
                    </p>
                  ) : (
                    <button
                      type="button"
                      className="text-red-600 hover:underline text-sm"
                      onClick={handleResendOtp}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-white mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  className={getFieldStyle("newPassword")}
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!otpVerified}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-red-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={!otpVerified}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.newPassword}
                </div>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={getFieldStyle("confirmPassword")}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!otpVerified}
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
              >
                {!otpSent
                  ? "Send OTP"
                  : !otpVerified
                  ? "Verify OTP"
                  : "Reset Password"}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-white">
              Remember your password?{" "}
              <a
                onClick={() => navigate("../login")}
                className="text-red-600 hover:underline cursor-pointer"
              >
                Login here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
