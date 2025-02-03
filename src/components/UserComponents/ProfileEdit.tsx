import type React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { axiosUser } from "@/Utils/axiosUtil";
import { toast } from "sonner";
import { updateUserProfile } from "@/API/userAPI";
import Header from "../Common/UserCommon/Header";
import Footer from "../Common/UserCommon/Footer";

interface Experience {
  jobTitle: string;
  company: string;
  location: string;
  startDate: Date | string;
  endDate: Date | string | null;
  responsibilities: string[];
}

interface Education {
  degree: string;
  institution: string;
  fieldOfStudy: string;
  startDate: Date | string;
  endDate: Date | string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  preferredLocation: string;
  preferredRoles: string[];
  salaryExpectation: number;
  remoteWork: boolean;
  willingToRelocate: boolean;
  skills: string[];
  experience: Experience[];
  education: Education[];
  portfolioLink: string;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
});

const initialValues: UserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  preferredLocation: "",
  preferredRoles: [],
  salaryExpectation: 0,
  remoteWork: false,
  willingToRelocate: false,
  skills: [],
  experience: [],
  education: [],
  portfolioLink: "",
};

const JobUserProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user_id = useSelector(
    (state: RootState) => state.user.userInfo?.user_id
  );

  const formik = useFormik<UserProfile>({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Form is submitting with values:", values);
      setSubmitting(true);
      try {
        console.log("Dispatching updateUserProfile");
        const response = await updateUserProfile(user_id, values);
        console.log("Update response:", response);
        if (response && response.success) {
          toast.success("Profile updated successfully");
          setTimeout(() => {
            navigate("../profile");
          }, 1500);
        } else {
          toast.error("Error occurred while updating profile");
        }
      } catch (error: any) {
        console.error("Error updating profile:", error);
        toast.error(
          error.response?.data?.message ||
            "An unexpected error occurred. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user_id) return;

      try {
        setLoading(true);
        const response = await axiosUser.get(`/user-profile/${user_id}`);
        const userData = response.data.userProfile;
        console.log("Fetched user data:", userData);
        formik.setValues({
          ...initialValues,
          ...userData,
          experience: userData.experience || [],
          education: userData.education || [],
          preferredRoles: userData.preferredRoles || [],
          skills: userData.skills || [],
        });
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch profile data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user_id, formik.setValues]);

  useEffect(() => {
    if (formik.values.experience && formik.values.experience.length > 0) {
      const formattedExperience = formik.values.experience.map((exp) => ({
        ...exp,
        startDate: exp.startDate
          ? new Date(exp.startDate).toISOString().split("T")[0]
          : "",
        endDate: exp.endDate
          ? new Date(exp.endDate).toISOString().split("T")[0]
          : "",
      }));
      if (
        JSON.stringify(formattedExperience) !==
        JSON.stringify(formik.values.experience)
      ) {
        formik.setFieldValue("experience", formattedExperience);
      }
    }
    if (formik.values.education && formik.values.education.length > 0) {
      const formattedEducation = formik.values.education.map((edu) => ({
        ...edu,
        startDate: edu.startDate
          ? new Date(edu.startDate).toISOString().split("T")[0]
          : "",
        endDate: edu.endDate
          ? new Date(edu.endDate).toISOString().split("T")[0]
          : "",
      }));
      if (
        JSON.stringify(formattedEducation) !==
        JSON.stringify(formik.values.education)
      ) {
        formik.setFieldValue("education", formattedEducation);
      }
    }
  }, [formik.values.experience, formik.values.education, formik.setFieldValue]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <Card className="bg-[#1E1E1E] text-white border border-[#2D2D2D]">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.firstName}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.lastName}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.phone}
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  Current Location
                </label>
                <Input
                  id="location"
                  name="location"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] text-white border border-[#2D2D2D]">
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  Bio
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  Skills (comma-separated)
                </label>
                <Input
                  id="skills"
                  name="skills"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.skills.join(", ")}
                  onChange={(e) => {
                    const skillsArray = e.target.value
                      .split(",")
                      .map((skill) => skill.trim());
                    formik.setFieldValue("skills", skillsArray);
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] text-white border border-[#2D2D2D]">
            <CardHeader>
              <CardTitle>Job Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="preferredLocation"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  Preferred Location
                </label>
                <Input
                  id="preferredLocation"
                  name="preferredLocation"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.preferredLocation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div>
                <label
                  htmlFor="preferredRoles"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  Preferred Roles (comma-separated)
                </label>
                <Input
                  id="preferredRoles"
                  name="preferredRoles"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.preferredRoles.join(", ")}
                  onChange={(e) => {
                    const rolesArray = e.target.value
                      .split(",")
                      .map((role) => role.trim());
                    formik.setFieldValue("preferredRoles", rolesArray);
                  }}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div>
                <label
                  htmlFor="salaryExpectation"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  Salary Expectation (per year)
                </label>
                <Input
                  id="salaryExpectation"
                  name="salaryExpectation"
                  type="number"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.salaryExpectation}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remoteWork"
                  checked={formik.values.remoteWork}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("remoteWork", checked)
                  }
                />
                <label
                  htmlFor="remoteWork"
                  className="text-sm font-medium text-[#A0A0A0]"
                >
                  Open to Remote Work
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="willingToRelocate"
                  checked={formik.values.willingToRelocate}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue("willingToRelocate", checked)
                  }
                />
                <label
                  htmlFor="willingToRelocate"
                  className="text-sm font-medium text-[#A0A0A0]"
                >
                  Willing to Relocate
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] text-white border border-[#2D2D2D]">
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formik.values.experience.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <Input
                    name={`experience[${index}].jobTitle`}
                    placeholder="Job Title"
                    className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    value={exp.jobTitle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <Input
                    name={`experience[${index}].company`}
                    placeholder="Company"
                    className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    value={exp.company}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <Input
                    name={`experience[${index}].location`}
                    placeholder="Location"
                    className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    value={exp.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="flex space-x-2">
                    <Input
                      name={`experience[${index}].startDate`}
                      type="date"
                      placeholder="Start Date"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                      value={
                        exp.startDate
                          ? new Date(exp.startDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <Input
                      name={`experience[${index}].endDate`}
                      type="date"
                      placeholder="End Date"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                      value={
                        exp.endDate
                          ? new Date(exp.endDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  <Textarea
                    name={`experience[${index}].responsibilities`}
                    placeholder="Responsibilities"
                    className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    value={exp.responsibilities.join(", ")}
                    onChange={(e) => {
                      const responsibilitiesArray = e.target.value
                        .split(",")
                        .map((resp) => resp.trim());
                      formik.setFieldValue(
                        `experience[${index}].responsibilities`,
                        responsibilitiesArray
                      );
                    }}
                    onBlur={formik.handleBlur}
                  />
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  formik.setFieldValue("experience", [
                    ...formik.values.experience,
                    {
                      jobTitle: "",
                      company: "",
                      location: "",
                      startDate: "",
                      endDate: "",
                      responsibilities: [],
                    },
                  ])
                }
                className="mt-2 bg-[#4F46E5] hover:bg-[#6366F1] text-white"
              >
                Add Experience
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] text-white border border-[#2D2D2D]">
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formik.values.education.map((edu, index) => (
                <div key={index} className="space-y-2">
                  <Input
                    name={`education[${index}].degree`}
                    placeholder="Degree"
                    className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    value={edu.degree}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <Input
                    name={`education[${index}].institution`}
                    placeholder="Institution"
                    className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    value={edu.institution}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <Input
                    name={`education[${index}].fieldOfStudy`}
                    placeholder="Field of Study"
                    className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    value={edu.fieldOfStudy}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="flex space-x-2">
                    <Input
                      name={`education[${index}].startDate`}
                      type="date"
                      placeholder="Start Date"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                      value={
                        edu.startDate
                          ? new Date(edu.startDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <Input
                      name={`education[${index}].endDate`}
                      type="date"
                      placeholder="End Date"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                      value={
                        edu.endDate
                          ? new Date(edu.endDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={() =>
                  formik.setFieldValue("education", [
                    ...formik.values.education,
                    {
                      degree: "",
                      institution: "",
                      fieldOfStudy: "",
                      startDate: "",
                      endDate: "",
                    },
                  ])
                }
                className="mt-2 bg-[#4F46E5] hover:bg-[#6366F1] text-white"
              >
                Add Education
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#1E1E1E] text-white border border-[#2D2D2D]">
            <CardHeader>
              <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label
                  htmlFor="portfolioLink"
                  className="block text-sm font-medium text-[#A0A0A0]"
                >
                  Portfolio Link
                </label>
                <Input
                  id="portfolioLink"
                  name="portfolioLink"
                  type="url"
                  className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                  value={formik.values.portfolioLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.portfolioLink &&
                  formik.errors.portfolioLink && (
                    <div className="text-red-500 text-xs mt-1">
                      {formik.errors.portfolioLink}
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("../profile")}
              className="bg-transparent text-white border-[#4F46E5] hover:bg-[#2D2D2D]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#4F46E5] hover:bg-[#6366F1] text-white"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default JobUserProfileEdit;
