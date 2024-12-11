import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { postJob } from "@/redux/Actions/companyActions";
import { toast } from "sonner";
import { UseSelector } from "react-redux";
import { RootState } from "@/redux/store";

const JobPostSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  skillsRequired: Yup.array()
    .of(Yup.string())
    .min(1, "At least one skill is required"),
  employmentType: Yup.string()
    .oneOf(["Full-Time", "Part-Time", "Contract", "Internship", "Freelance"])
    .required("Required"),
  experienceLevel: Yup.string()
    .oneOf(["Entry", "Mid", "Senior", "Director"])
    .required("Required"),
  educationRequired: Yup.string(),
  jobFunction: Yup.string(),
  keywords: Yup.array().of(Yup.string()),
  salaryRange: Yup.object({
    min: Yup.number().required("Required"),
    max: Yup.number()
      .required("Required")
      .moreThan(Yup.ref("min"), "Max salary must be greater than min salary"),
  }),
  location: Yup.string().required("Required"),
  remote: Yup.boolean(),
  benefits: Yup.array().of(Yup.string()),
  applicationDeadline: Yup.date(),
  jobStatus: Yup.string()
    .oneOf(["open", "closed", "draft"])
    .required("Required"),
});

export function NewJobForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const userId = useSelector(
    (state: RootState) => state.user.userInfo?.user_id
  );
  console.log(userId);
  const initialValues = {
    title: "",
    description: "",
    skillsRequired: [],
    employmentType: "",
    experienceLevel: "",
    educationRequired: "",
    jobFunction: "",
    keywords: [],
    salaryRange: { min: 0, max: 0 },
    location: "",
    remote: false,
    benefits: [],
    applicationDeadline: "",
    jobStatus: "open",
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      console.log(values);

      const result = await dispatch(
        postJob({ jobData: values, userId })
      ).unwrap();
      console.log(`result in handleSubmit - ${result.success}`);

      setSubmitting(false);
      toast.success(result.message);
      setTimeout(() => {
        navigate("/recruiter/job-post-list");
      }, 1500);
    } catch (error: any) {
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 p-6 ml-64">
      <h1 className="text-3xl font-bold text-white">Post a New Job</h1>
      <Card className="bg-[#0f1117] border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={JobPostSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">
                    Job Title
                  </Label>
                  <Field
                    name="title"
                    as={Input}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.title && touched.title && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.title}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Job Description
                  </Label>
                  <Field
                    name="description"
                    as={Textarea}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                  {errors.description && touched.description && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employmentType" className="text-gray-300">
                      Employment Type
                    </Label>
                    <Field name="employmentType">
                      {({ field }: any) => (
                        <Select
                          onValueChange={(value) =>
                            setFieldValue("employmentType", value)
                          }
                        >
                          <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select employment type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {[
                              "Full-Time",
                              "Part-Time",
                              "Contract",
                              "Internship",
                              "Freelance",
                            ].map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    {errors.employmentType && touched.employmentType && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.employmentType}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="experienceLevel" className="text-gray-300">
                      Experience Level
                    </Label>
                    <Field name="experienceLevel">
                      {({ field }: any) => (
                        <Select
                          onValueChange={(value) =>
                            setFieldValue("experienceLevel", value)
                          }
                        >
                          <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            {["Entry", "Mid", "Senior", "Director"].map(
                              (level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                    {errors.experienceLevel && touched.experienceLevel && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.experienceLevel}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="educationRequired" className="text-gray-300">
                    Education Required
                  </Label>
                  <Field
                    name="educationRequired"
                    as={Input}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="jobFunction" className="text-gray-300">
                    Job Function
                  </Label>
                  <Field
                    name="jobFunction"
                    as={Input}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salaryRange.min" className="text-gray-300">
                      Minimum Salary
                    </Label>
                    <Field
                      name="salaryRange.min"
                      as={Input}
                      type="number"
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                    {errors.salaryRange?.min && touched.salaryRange?.min && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.salaryRange.min}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="salaryRange.max" className="text-gray-300">
                      Maximum Salary
                    </Label>
                    <Field
                      name="salaryRange.max"
                      as={Input}
                      type="number"
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                    {errors.salaryRange?.max && touched.salaryRange?.max && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.salaryRange.max}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-gray-300">
                      Location
                    </Label>
                    <Field
                      name="location"
                      as={Input}
                      className="mt-1 bg-gray-800 border-gray-700 text-white"
                    />
                    {errors.location && touched.location && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Field name="remote" type="checkbox">
                      {({ field }: any) => (
                        <Checkbox
                          id="remote"
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            setFieldValue("remote", checked)
                          }
                          className="bg-gray-800 border-gray-700 text-primary-600 focus:ring-primary-500"
                        />
                      )}
                    </Field>
                    <Label htmlFor="remote" className="text-gray-300">
                      Remote
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="skillsRequired" className="text-gray-300">
                    Skills Required (comma-separated)
                  </Label>
                  <Field name="skillsRequired">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                        onChange={(e) =>
                          setFieldValue(
                            "skillsRequired",
                            e.target.value
                              .split(",")
                              .map((skill) => skill.trim())
                          )
                        }
                      />
                    )}
                  </Field>
                  {errors.skillsRequired && touched.skillsRequired && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.skillsRequired}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="keywords" className="text-gray-300">
                    Keywords (comma-separated)
                  </Label>
                  <Field name="keywords">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                        onChange={(e) =>
                          setFieldValue(
                            "keywords",
                            e.target.value
                              .split(",")
                              .map((keyword) => keyword.trim())
                          )
                        }
                      />
                    )}
                  </Field>
                </div>

                <div>
                  <Label htmlFor="benefits" className="text-gray-300">
                    Benefits (comma-separated)
                  </Label>
                  <Field name="benefits">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        className="mt-1 bg-gray-800 border-gray-700 text-white"
                        onChange={(e) =>
                          setFieldValue(
                            "benefits",
                            e.target.value
                              .split(",")
                              .map((benefit) => benefit.trim())
                          )
                        }
                      />
                    )}
                  </Field>
                </div>

                <div>
                  <Label
                    htmlFor="applicationDeadline"
                    className="text-gray-300"
                  >
                    Application Deadline
                  </Label>
                  <Field
                    name="applicationDeadline"
                    type="date"
                    as={Input}
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="jobStatus" className="text-gray-300">
                    Job Status
                  </Label>
                  <Field name="jobStatus">
                    {({ field }: any) => (
                      <Select
                        onValueChange={(value) =>
                          setFieldValue("jobStatus", value)
                        }
                      >
                        <SelectTrigger className="mt-1 bg-gray-800 border-gray-700 text-white">
                          <SelectValue placeholder="Select job status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {["open", "closed", "draft"].map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  {errors.jobStatus && touched.jobStatus && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.jobStatus}
                    </div>
                  )}
                </div>

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => console.log("Cancel clicked")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Job"}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}
