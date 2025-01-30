import type React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dateTime: string, message: string) => void;
  type: "schedule" | "postpone" | "cancel" | "reopen";
}

interface FormValues {
  date: string;
  time: string;
  message: string;
}

export function InterviewModal({
  isOpen,
  onClose,
  onSubmit,
  type,
}: InterviewModalProps) {
  // Helper function to check if time is within business hours
  const isBusinessHours = (time: string) => {
    const [hours] = time.split(":").map(Number);
    return hours >= 9 && hours < 18;
  };

  // Initial form values
  const initialValues: FormValues = {
    date: "",
    time: "",
    message: "",
  };

  // Validation schema
  const validationSchema = Yup.object().shape({
    date:
      type !== "cancel"
        ? Yup.string()
            .required("Date is required")
            .test("future", "Date must be in the future", (value) => {
              if (!value) return false;
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return selectedDate >= today;
            })
        : Yup.string(),
    time:
      type !== "cancel"
        ? Yup.string()
            .required("Time is required")
            .test(
              "business-hours",
              "Time must be between 9 AM and 6 PM",
              (value) => {
                if (!value) return false;
                return isBusinessHours(value);
              }
            )
        : Yup.string(),
    message: Yup.string()
      .required("Message is required")
      .min(10, "Message must be at least 10 characters")
      .max(500, "Message must not exceed 500 characters"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const dateTime = type === "cancel" ? "" : `${values.date}T${values.time}`;
      onSubmit(dateTime, values.message);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>
            {type === "schedule" && "Schedule Interview"}
            {type === "postpone" && "Postpone Interview"}
            {type === "cancel" && "Cancel Interview"}
            {type === "reopen" && "Reopen Interview"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {type !== "cancel" && (
            <>
              <div>
                <label htmlFor="date">Date</label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  className={`text-gray-900 ${
                    formik.touched.date && formik.errors.date
                      ? "border-red-500"
                      : ""
                  }`}
                  {...formik.getFieldProps("date")}
                />
                {formik.touched.date && formik.errors.date && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.date}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="time">Time</label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  className={`text-gray-900 ${
                    formik.touched.time && formik.errors.time
                      ? "border-red-500"
                      : ""
                  }`}
                  {...formik.getFieldProps("time")}
                />
                {formik.touched.time && formik.errors.time && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.time}
                  </div>
                )}
              </div>
            </>
          )}
          <div>
            <label htmlFor="message">Message</label>
            <Textarea
              id="message"
              name="message"
              className={`text-gray-900 ${
                formik.touched.message && formik.errors.message
                  ? "border-red-500"
                  : ""
              }`}
              {...formik.getFieldProps("message")}
            />
            {formik.touched.message && formik.errors.message && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.message}
              </div>
            )}
          </div>
          <div className="text-right">
            <Button
              type="submit"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              {type === "schedule" && "Schedule"}
              {type === "postpone" && "Postpone"}
              {type === "cancel" && "Cancel"}
              {type === "reopen" && "Reopen"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
