import type React from "react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
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
import ITSkills from "@/enums/skills";

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
  const [userData, setUserData] = useState<UserProfile>(initialValues);
  const user_id = useSelector(
    (state: RootState) => state.user.userInfo?.user_id
  );

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user_id) return;

      try {
        setLoading(true);
        const response = await axiosUser.get(`/user-profile/${user_id}`);
        const fetchedUserData = response.data.userProfile;
        console.log("Fetched user data:", fetchedUserData);
        setUserData({
          ...initialValues,
          ...fetchedUserData,
          experience: fetchedUserData.experience || [],
          education: fetchedUserData.education || [],
          preferredRoles: fetchedUserData.preferredRoles || [],
          skills: fetchedUserData.skills || [],
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
  }, [user_id]);

  const handleSubmit = async (values: UserProfile) => {
    try {
      console.log("Submitting profile update with values:", values);
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
    }
  };

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
        <Formik
          initialValues={userData}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form className="space-y-6">
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
                    <Field
                      as={Input}
                      id="firstName"
                      name="firstName"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-[#A0A0A0]"
                    >
                      Last Name
                    </label>
                    <Field
                      as={Input}
                      id="lastName"
                      name="lastName"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-[#A0A0A0]"
                    >
                      Email
                    </label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-[#A0A0A0]"
                    >
                      Phone Number
                    </label>
                    <Field
                      as={Input}
                      id="phone"
                      name="phone"
                      type="tel"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-[#A0A0A0]"
                    >
                      Current Location
                    </label>
                    <Field
                      as={Input}
                      id="location"
                      name="location"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
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
                    <Field
                      as={Textarea}
                      id="bio"
                      name="bio"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    />
                  </div>
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
                                value={skill}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                          Add Skill
                        </Button>
                      </div>
                    )}
                  </FieldArray>
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
                    <Field
                      as={Input}
                      id="preferredLocation"
                      name="preferredLocation"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    />
                  </div>
                  <FieldArray name="preferredRoles">
                    {({ push, remove }) => (
                      <div>
                        <label className="block text-sm font-medium text-[#A0A0A0] mb-2">
                          Preferred Roles
                        </label>
                        {values.preferredRoles.map((role, index) => (
                          <div
                            key={index}
                            className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-2"
                          >
                            <Field
                              as={Input}
                              name={`preferredRoles.${index}`}
                              value={role}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563] flex-grow"
                            />
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
                          Add Preferred Role
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                  <div>
                    <label
                      htmlFor="salaryExpectation"
                      className="block text-sm font-medium text-[#A0A0A0]"
                    >
                      Salary Expectation (per year)
                    </label>
                    <Field
                      as={Input}
                      id="salaryExpectation"
                      name="salaryExpectation"
                      type="number"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Field
                      as={Checkbox}
                      id="remoteWork"
                      name="remoteWork"
                      checked={values.remoteWork}
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="remoteWork"
                      className="text-sm font-medium text-[#A0A0A0]"
                    >
                      Open to Remote Work
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Field
                      as={Checkbox}
                      id="willingToRelocate"
                      name="willingToRelocate"
                      checked={values.willingToRelocate}
                      onChange={handleChange}
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
                  <FieldArray name="experience">
                    {({ push, remove }) => (
                      <div>
                        {values.experience.map((exp, index) => (
                          <div key={index} className="space-y-2 mb-4">
                            <Field
                              as={Input}
                              name={`experience[${index}].jobTitle`}
                              placeholder="Job Title"
                              className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                            />
                            <Field
                              as={Input}
                              name={`experience[${index}].company`}
                              placeholder="Company"
                              className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                            />
                            <Field
                              as={Input}
                              name={`experience[${index}].location`}
                              placeholder="Location"
                              className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                            />
                            <div className="flex space-x-2">
                              <Field
                                as={Input}
                                name={`experience[${index}].startDate`}
                                type="date"
                                placeholder="Start Date"
                                className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                              />
                              <Field
                                as={Input}
                                name={`experience[${index}].endDate`}
                                type="date"
                                placeholder="End Date"
                                className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                              />
                            </div>
                            <Field
                              as={Textarea}
                              name={`experience[${index}].responsibilities`}
                              placeholder="Responsibilities"
                              className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                            />
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() =>
                            push({
                              jobTitle: "",
                              company: "",
                              location: "",
                              startDate: "",
                              endDate: "",
                              responsibilities: [],
                            })
                          }
                          className="mt-2 bg-[#4F46E5] hover:bg-[#6366F1] text-white"
                        >
                          Add Experience
                        </Button>
                      </div>
                    )}
                  </FieldArray>
                </CardContent>
              </Card>

              <Card className="bg-[#1E1E1E] text-white border border-[#2D2D2D]">
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FieldArray name="education">
                    {({ push, remove }) => (
                      <div>
                        {values.education.map((edu, index) => (
                          <div key={index} className="space-y-2 mb-4">
                            <Field
                              as={Input}
                              name={`education[${index}].degree`}
                              placeholder="Degree"
                              className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                            />
                            <Field
                              as={Input}
                              name={`education[${index}].institution`}
                              placeholder="Institution"
                              className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                            />
                            <Field
                              as={Input}
                              name={`education[${index}].fieldOfStudy`}
                              placeholder="Field of Study"
                              className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                            />
                            <div className="flex space-x-2">
                              <Field
                                as={Input}
                                name={`education[${index}].startDate`}
                                type="date"
                                placeholder="Start Date"
                                className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                              />
                              <Field
                                as={Input}
                                name={`education[${index}].endDate`}
                                type="date"
                                placeholder="End Date"
                                className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                              />
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() =>
                            push({
                              degree: "",
                              institution: "",
                              fieldOfStudy: "",
                              startDate: "",
                              endDate: "",
                            })
                          }
                          className="mt-2 bg-[#4F46E5] hover:bg-[#6366F1] text-white"
                        >
                          Add Education
                        </Button>
                      </div>
                    )}
                  </FieldArray>
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
                    <Field
                      as={Input}
                      id="portfolioLink"
                      name="portfolioLink"
                      type="url"
                      className="mt-1 bg-[#2D2D2D] text-white border-[#4F46E5]"
                    />
                    <ErrorMessage
                      name="portfolioLink"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
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
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </main>
      <Footer />
    </div>
  );
};

export default JobUserProfileEdit;
