import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { axiosCompany } from "@/Utils/axiosUtil";
import { createOrUpdateJobPost, deleteJobPost } from "@/API/companyAPI";
import { toast } from "sonner";

interface IJobPost {
  _id: string;
  title: string;
  description: string;
  location: string;
  employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";
  salaryRange: {
    min: number;
    max: number;
  };
  requirements: string[];
  responsibilities: string[];
  perks: string[];
  status: "open" | "closed" | "paused";
  createdAt: string;
  updatedAt: string;
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Job title is required"),
  description: Yup.string().required("Job description is required"),
  location: Yup.string().required("Location is required"),
  employmentType: Yup.string()
    .oneOf(["Full-time", "Part-time", "Contract", "Internship"])
    .required("Employment type is required"),
  salaryRange: Yup.object().shape({
    min: Yup.number()
      .positive("Minimum salary must be positive")
      .required("Minimum salary is required"),
    max: Yup.number()
      .positive("Maximum salary must be positive")
      .moreThan(Yup.ref("min"), "Maximum salary must be greater than minimum")
      .required("Maximum salary is required"),
  }),
  requirements: Yup.array()
    .of(Yup.string())
    .min(1, "At least one requirement is needed"),
  responsibilities: Yup.array()
    .of(Yup.string())
    .min(1, "At least one responsibility is needed"),
  perks: Yup.array().of(Yup.string()),
  status: Yup.string()
    .oneOf(["open", "closed", "paused"])
    .required("Status is required"),
});

export function JobPostDetails() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<IJobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  console.log(jobId);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const job_id = jobId;
        console.log(job_id);

        const response = await axiosCompany.get(`get-job-post/${job_id}`);
        console.log(response);

        setJob(response.data.jobPost);
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJobDetails();
  }, [jobId]);

  const handleSubmit = async (values: IJobPost) => {
    try {
      const _id = jobId;
      const jobData = { ...values, _id };
      const response = await createOrUpdateJobPost(jobData);
      if (response?.success) {
        console.log("Job post updated successfully:", response?.message);
        toast.success("Job post updated successfully:");
        setTimeout(() => {
          navigate("../job-post-list");
        }, 1500);
      }
      //   await axiosCompany.put(`update-job/${jobId}`, values);
      //   navigate("/job-list");
    } catch (error: any) {
      console.error("Error updating job:", error);
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
      console.error("Error creating job post:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        const response = await deleteJobPost(jobId);
        if (response?.success) {
          console.log("Job post updated successfully:", response?.message);
          toast.success(response?.message);
          setTimeout(() => {
            navigate("../job-post-list");
          }, 1500);
        }
      } catch (error: any) {
        toast.error(
          error.message || "An unexpected error occurred. Please try again."
        );
        console.error("Error deleting job:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-8">Loading...</div>;
  }

  if (!job) {
    return <div className="text-white text-center mt-8">Job not found</div>;
  }

  return (
    <div className="space-y-6 p-6 ml-64">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Job Details</h1>
        <div className="space-x-4">
          <Button
            className="text-black"
            onClick={() => navigate("../job-post-list")}
            variant="outline"
          >
            Back to Job List
          </Button>
          <Button onClick={handleDelete} variant="destructive">
            Delete Job
          </Button>
        </div>
      </div>
      <Formik
        initialValues={job}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="space-y-6">
            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Job Title
                  </label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    className="mt-1 bg-gray-700 text-white"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Job Description
                  </label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    className="mt-1 bg-gray-700 text-white"
                    rows={4}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Location
                  </label>
                  <Field
                    as={Input}
                    id="location"
                    name="location"
                    className="mt-1 bg-gray-700 text-white"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="employmentType"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Employment Type
                  </label>
                  <Field name="employmentType">
                    {({ field }: any) => (
                      <Select
                        onValueChange={(value) =>
                          setFieldValue("employmentType", value)
                        }
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="mt-1 bg-gray-700 text-white">
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="employmentType"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>Salary Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="salaryRange.min"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Minimum Salary
                  </label>
                  <Field
                    as={Input}
                    id="salaryRange.min"
                    name="salaryRange.min"
                    type="number"
                    className="mt-1 bg-gray-700 text-white"
                  />
                  <ErrorMessage
                    name="salaryRange.min"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="salaryRange.max"
                    className="block text-sm font-medium text-gray-400"
                  >
                    Maximum Salary
                  </label>
                  <Field
                    as={Input}
                    id="salaryRange.max"
                    name="salaryRange.max"
                    type="number"
                    className="mt-1 bg-gray-700 text-white"
                  />
                  <ErrorMessage
                    name="salaryRange.max"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>Requirements, Responsibilities, and Perks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldArray name="requirements">
                  {({ push, remove }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Requirements
                      </label>
                      {values.requirements.map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <Field
                            as={Input}
                            name={`requirements.${index}`}
                            className="bg-gray-700 text-white"
                          />
                          <Button
                            type="button"
                            className=""
                            onClick={() => remove(index)}
                            variant="destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="text-black"
                        onClick={() => push("")}
                        variant="outline"
                      >
                        Add Requirement
                      </Button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage
                  name="requirements"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <FieldArray name="responsibilities">
                  {({ push, remove }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Responsibilities
                      </label>
                      {values.responsibilities.map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <Field
                            as={Input}
                            name={`responsibilities.${index}`}
                            className="bg-gray-700 text-white"
                          />
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="text-black"
                        onClick={() => push("")}
                        variant="outline"
                      >
                        Add Responsibility
                      </Button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage
                  name="responsibilities"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />

                <FieldArray name="perks">
                  {({ push, remove }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Perks
                      </label>
                      {values.perks.map((_, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <Field
                            as={Input}
                            name={`perks.${index}`}
                            className="bg-gray-700 text-white"
                          />
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="destructive"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="text-black"
                        onClick={() => push("")}
                        variant="outline"
                      >
                        Add Perk
                      </Button>
                    </div>
                  )}
                </FieldArray>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 text-white">
              <CardHeader>
                <CardTitle>Job Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Field name="status">
                  {({ field }: any) => (
                    <Select
                      onValueChange={(value) => setFieldValue("status", value)}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-gray-700 text-white">
                        <SelectValue placeholder="Select job status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/job-list")}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
