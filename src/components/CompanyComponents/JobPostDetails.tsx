import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import ITSkills from "@/enums/skills";
import companyAPIs from "@/API/companyAPIs";
import { ApiError } from "@/Utils/interface";

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
  skills: string[];
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
  skills: Yup.array().of(Yup.string()).min(1, "At least one skill is needed"),
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

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await companyAPIs.getJobPost(jobId || "");
        setJob(response.data.jobPost);
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to fetch job details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJobDetails();
  }, [jobId]);

  const handleSubmit = async (values: IJobPost) => {
    try {
      const jobData = { ...values, _id: jobId };
      const response = await companyAPIs.createOrUpdateJobPost(jobData);

      toast.success("Job post updated successfully");
      setTimeout(() => {
        navigate("../job-post-list");
      }, 1500);
    } catch (error) {
      const err = error as ApiError;
      toast.error(
        err.message || "An unexpected error occurred. Please try again."
      );
      console.error("Error updating job post:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      try {
        const response = await companyAPIs.deleteJobPost(jobId);
        toast.success(response?.data.message);
        setTimeout(() => {
          navigate("../job-post-list");
        }, 1500);
      } catch (error) {
        const err = error as ApiError;
        toast.error(
          err.message || "An unexpected error occurred. Please try again."
        );
        console.error("Error deleting job:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-[#FFFFFF] text-center mt-8">Loading...</div>;
  }

  if (!job) {
    return <div className="text-[#FFFFFF] text-center mt-8">Job not found</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 ml-0 md:ml-64 bg-[#121212]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">
          Job Details
        </h1>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
          <Button
            className="bg-[#2D2D2D] text-[#FFFFFF] hover:bg-[#3D3D3D] w-full md:w-auto"
            onClick={() => navigate("../job-post-list")}
            variant="outline"
          >
            Back to Job List
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            className="bg-[#EF4444] hover:bg-[#DC2626] text-[#FFFFFF] w-full md:w-auto"
          >
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
            <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-[#A0A0A0]"
                  >
                    Job Title
                  </label>
                  <Field
                    as={Input}
                    id="title"
                    name="title"
                    className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-[#EF4444] text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-[#A0A0A0]"
                  >
                    Job Description
                  </label>
                  <Field
                    as={Textarea}
                    id="description"
                    name="description"
                    className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                    rows={4}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-[#EF4444] text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-[#A0A0A0]"
                  >
                    Location
                  </label>
                  <Field
                    as={Input}
                    id="location"
                    name="location"
                    className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                  />
                  <ErrorMessage
                    name="location"
                    component="div"
                    className="text-[#EF4444] text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="employmentType"
                    className="block text-sm font-medium text-[#A0A0A0]"
                  >
                    Employment Type
                  </label>
                  <Field name="employmentType">
                    {({ field }: { field: { value: string } }) => (
                      <Select
                      onValueChange={(value) =>
                        setFieldValue("employmentType", value)
                      }
                      defaultValue={field.value}
                      >
                      <SelectTrigger className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]">
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
                    className="text-[#EF4444] text-sm mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
              <CardHeader>
                <CardTitle>Salary Range</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label
                    htmlFor="salaryRange.min"
                    className="block text-sm font-medium text-[#A0A0A0]"
                  >
                    Minimum Salary
                  </label>
                  <Field
                    as={Input}
                    id="salaryRange.min"
                    name="salaryRange.min"
                    type="number"
                    className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                  />
                  <ErrorMessage
                    name="salaryRange.min"
                    component="div"
                    className="text-[#EF4444] text-sm mt-1"
                  />
                </div>
                <div>
                  <label
                    htmlFor="salaryRange.max"
                    className="block text-sm font-medium text-[#A0A0A0]"
                  >
                    Maximum Salary
                  </label>
                  <Field
                    as={Input}
                    id="salaryRange.max"
                    name="salaryRange.max"
                    type="number"
                    className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                  />
                  <ErrorMessage
                    name="salaryRange.max"
                    component="div"
                    className="text-[#EF4444] text-sm mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
              <CardHeader>
                <CardTitle>Skills, Responsibilities, and Perks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldArray name="skills">
                  {({ push, remove }) => (
                    <div>
                      <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                        Skills
                      </label>
                      {values.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-2"
                        >
                          <div className="relative w-full">
                            <Field
                              as={Input}
                              name={`skills.${index}`}
                              className="w-full bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                              placeholder="Enter a skill..."
                              autoComplete="off"
                            />
                            {skill &&
                              !Object.values(ITSkills).includes(
                                skill as ITSkills
                              ) && (
                                <div className="absolute z-10 w-full mt-1 bg-[#2D2D2D] border border-[#4B5563] rounded-md shadow-lg">
                                  {Object.values(ITSkills)
                                    .filter((s) =>
                                      s
                                        .toLowerCase()
                                        .includes(skill.toLowerCase())
                                    )
                                    .slice(0, 7)
                                    .map((suggestion) => (
                                      <div
                                        key={suggestion}
                                        className="px-4 py-2 cursor-pointer hover:bg-[#3D3D3D]"
                                        onClick={() => {
                                          const updatedSkills = [
                                            ...values.skills,
                                          ];
                                          updatedSkills[index] = suggestion;
                                          setFieldValue(
                                            "skills",
                                            updatedSkills
                                          );
                                        }}
                                      >
                                        {suggestion}
                                      </div>
                                    ))}
                                </div>
                              )}
                          </div>
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="destructive"
                            className="mt-2 md:mt-0"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF]"
                        onClick={() => push("")}
                        variant="outline"
                      >
                        Add Skills
                      </Button>
                    </div>
                  )}
                </FieldArray>
                <ErrorMessage
                  name="skills"
                  component="div"
                  className="text-[#EF4444] text-sm mt-1"
                />

                <FieldArray name="responsibilities">
                  {({ push, remove }) => (
                    <div>
                      <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                        Responsibilities
                      </label>
                      {values.responsibilities.map((_, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-2"
                        >
                          <Field
                            as={Input}
                            name={`responsibilities.${index}`}
                            className="bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563] flex-grow"
                          />
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="destructive"
                            className="bg-[#EF4444] hover:bg-[#DC2626] text-[#FFFFFF] mt-2 md:mt-0"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF]"
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
                  className="text-[#EF4444] text-sm mt-1"
                />

                <FieldArray name="perks">
                  {({ push, remove }) => (
                    <div>
                      <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                        Perks
                      </label>
                      {values.perks.map((_, index) => (
                        <div
                          key={index}
                          className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-2"
                        >
                          <Field
                            as={Input}
                            name={`perks.${index}`}
                            className="bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563] flex-grow"
                          />
                          <Button
                            type="button"
                            onClick={() => remove(index)}
                            variant="destructive"
                            className="bg-[#EF4444] hover:bg-[#DC2626] text-[#FFFFFF] mt-2 md:mt-0"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF]"
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

            <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
              <CardHeader>
                <CardTitle>Job Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Field name="status">
                    {({ field }: { field: { value: string } }) => (
                    <Select
                      onValueChange={(value) => setFieldValue("status", value)}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]">
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
                  className="text-[#EF4444] text-sm mt-1"
                />
              </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("../job-post-list")}
                className="bg-[#2D2D2D] text-[#FFFFFF] hover:bg-[#3D3D3D] w-full md:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF] w-full md:w-auto"
              >
                Save Changes
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
