import React, { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { OTPVerifyAct } from "@/redux/Actions/userActions";
import { AppDispatch } from "@/redux/store";
import userAPIs from "@/API/userAPIs";
import { ApiError } from "@/Utils/interface";

const TIMER_DURATION = 60 * 1000; // 60 seconds in milliseconds

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^[0-9]{4}$/, "OTP must be 4 digits")
    .required("OTP is required"),
});

function OtpVerify() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const email: string | null = localStorage.getItem("register-email");
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkAndUpdateTimer = () => {
      const startTimeStr = localStorage.getItem("userOtpTimerStart");
      if (startTimeStr) {
        const startTime = parseInt(startTimeStr, 10);
        const now = Date.now();
        const elapsedTime = now - startTime;

        if (elapsedTime < TIMER_DURATION) {
          setTimeLeft(Math.ceil((TIMER_DURATION - elapsedTime) / 1000));
        } else {
          localStorage.removeItem("userOtpTimerStart");
          setTimeLeft(0);
          clearInterval(timer);
        }
      } else if (timeLeft === null) {
        // Start the timer if it's not already running
        startTimer();
      }
    };

    checkAndUpdateTimer();

    if (timeLeft && timeLeft > 0) {
      timer = setInterval(checkAndUpdateTimer, 1000);
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const startTimer = () => {
    localStorage.removeItem("userOtpTimerStart");
    const startTime = Date.now();
    localStorage.setItem("userOtpTimerStart", startTime.toString());
    setTimeLeft(TIMER_DURATION / 1000);
  };

  const formik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: OtpSchema,
    onSubmit: async (values) => {
      try {
        const result = await dispatch(OTPVerifyAct(values.otp));
        console.log(result);

        if (result?.success) {
          toast.success(result?.message);
          localStorage.removeItem("register-email");
          setTimeout(() => {
            navigate("../login");
          }, 1500);
        } else {
          console.log("Error occurred");
          toast.error(result?.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
  });

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      formik.setFieldValue("otp", newOtp.join(""));
      if (value.length === 1 && index < 3) {
        inputRefs[index + 1].current!.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1].current!.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      console.log("Resend OTP");

      const email: string | null = localStorage.getItem("register-email");
      const result = await userAPIs.resentOtp(email);
      toast.success(result.data.message);
      localStorage.removeItem("otpTimerStart");
      startTimer();
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.message);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#121212] relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://as2.ftcdn.net/v2/jpg/08/10/92/69/1000_F_810926942_LcXpqYlTiWNcNntJpVTh8nr510jnZniK.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-[#121212] bg-opacity-70"></div>
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-[#FFFFFF]">Next</span>
            <span className="text-3xl font-bold text-[#4F46E5]">Way</span>
            <span className="text-3sm font-bold text-[#4F46E5]">Seeker</span>
          </div>
        </div>

        <div className="bg-[#1E1E1E] bg-opacity-50 p-8 rounded-lg border-2 border-[#4F46E5] shadow-lg shadow-[#4F46E5]/50">
          <h1 className="mb-6 text-center text-2xl font-semibold text-[#4F46E5]">
            OTP Verification
          </h1>
          <p className="text-[#E0E0E0] text-center mb-6">
            Enter the 4-digit code which received on your email - {email}
          </p>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="flex justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  ref={inputRefs[index]}
                  className="w-16 h-16 text-[#FFFFFF] bg-[#2D2D2D] border-2 border-[#4B5563] rounded-md outline-none focus:ring-2 focus:ring-[#6366F1] text-center text-3xl"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
            {formik.touched.otp && formik.errors.otp ? (
              <div className="text-[#EF4444] text-xs mt-1 text-center">
                {formik.errors.otp}
              </div>
            ) : null}
            <div className="flex flex-col items-center space-y-4">
              <button
                type="submit"
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] px-6 py-2 rounded-md w-full"
              >
                Verify OTP
              </button>
              {timeLeft && timeLeft > 0 ? (
                <p className="text-[#E0E0E0] text-sm">
                  Resend OTP in {timeLeft} seconds
                </p>
              ) : (
                <button
                  type="button"
                  className="text-[#60A5FA] hover:underline text-sm"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
          <div className="mt-6 text-center">
            <a
              onClick={() => navigate("../register")}
              className="text-[#60A5FA] hover:underline text-sm cursor-pointer"
            >
              Back to Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerify;
