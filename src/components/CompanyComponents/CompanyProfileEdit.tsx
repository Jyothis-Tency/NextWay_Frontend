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
import { axiosMain } from "@/Utils/axiosUtil";
import { toast } from "sonner";
import { updateCompanyProfile } from "@/redux/Actions/companyActions";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Company name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  website: Yup.string().url("Invalid URL"),
  description: Yup.string().max(
    500,
    "Description must be 500 characters or less"
  ),
  industry: Yup.string(),
  companySize: Yup.number().positive("Company size must be a positive number"),
  location: Yup.string(),
  socialLinks: Yup.object().shape({
    linkedin: Yup.string().url("Invalid LinkedIn URL"),
    twitter: Yup.string().url("Invalid Twitter URL"),
    facebook: Yup.string().url("Invalid Facebook URL"),
  }),
});

const initialValues = {
  name: "",
  email: "",
  phone: "",
  website: "",
  description: "",
  industry: "",
  companySize: 0,
  location: "",
  socialLinks: {
    linkedin: "",
    twitter: "",
    facebook: "",
  },
};

const CompanyProfileEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(true);
  const company_id = useSelector(
    (state: RootState) => state.company.companyInfo?.company_id
  );

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await dispatch(
          updateCompanyProfile(company_id, values)
        );
        console.log("Company updated successfully:", response);
        if (response.success === true) {
          toast.success("Company profile updated successfully");
          setTimeout(() => {
            navigate("../profile");
          }, 1500);
        } else {
          toast.error("Error occurred while updating company");
        }
      } catch (error: any) {
        toast.error(
          error.response?.data?.message ||
            "An unexpected error occurred. Please try again."
        );
        console.error("Error updating company:", error);
      }
    },
  });

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!company_id) return;

      try {
        setLoading(true);
        const response = await axiosMain.get(
          `/company/get-company/${company_id}`
        );
        console.log(response.data);

        const companyData = response.data.companyProfile;
        formik.setValues({
          ...initialValues,
          ...companyData,
          socialLinks: {
            ...initialValues.socialLinks,
            ...companyData.socialLinks,
          },
        });
      } catch (error: any) {
        console.error("Error fetching company data:", error);
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch company data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [company_id, formik.setValues]); // Added formik.setValues to dependencies

  if (loading) {
    return <div className="text-[#FFFFFF] text-center mt-8">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 ml-0 md:ml-64 bg-[#121212]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#FFFFFF]">
          Edit Company Profile
        </h1>
      </div>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Company Name
              </label>
              <Input
                id="name"
                name="name"
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.name}
                </div>
              ) : null}
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
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
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
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Website
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.website && formik.errors.website ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.website}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="industry"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Industry
              </label>
              <Input
                id="industry"
                name="industry"
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.industry}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.industry && formik.errors.industry ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.industry}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="companySize"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Company Size
              </label>
              <Input
                id="companySize"
                name="companySize"
                type="number"
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.companySize}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.companySize && formik.errors.companySize ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.companySize}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Location
              </label>
              <Input
                id="location"
                name="location"
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.location}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.location && formik.errors.location ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.location}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] text-[#FFFFFF] border-[#4B5563]">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="socialLinks.linkedin"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                LinkedIn
              </label>
              <Input
                id="socialLinks.linkedin"
                name="socialLinks.linkedin"
                type="url"
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.socialLinks.linkedin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.socialLinks?.linkedin &&
              formik.errors.socialLinks?.linkedin ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.socialLinks.linkedin}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="socialLinks.twitter"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Twitter
              </label>
              <Input
                id="socialLinks.twitter"
                name="socialLinks.twitter"
                type="url"
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.socialLinks.twitter}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.socialLinks?.twitter &&
              formik.errors.socialLinks?.twitter ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.socialLinks.twitter}
                </div>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="socialLinks.facebook"
                className="block text-sm font-medium text-[#A0A0A0]"
              >
                Facebook
              </label>
              <Input
                id="socialLinks.facebook"
                name="socialLinks.facebook"
                type="url"
                className="mt-1 bg-[#2D2D2D] text-[#FFFFFF] border-[#4B5563]"
                value={formik.values.socialLinks.facebook}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.socialLinks?.facebook &&
              formik.errors.socialLinks?.facebook ? (
                <div className="text-[#EF4444] text-xs mt-1">
                  {formik.errors.socialLinks.facebook}
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-4">
          <Button
            className="bg-[#EF4444] hover:bg-[#DC2626] text-[#FFFFFF]"
            type="button"
            variant="outline"
            onClick={() => navigate("../profile")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-[#FFFFFF]"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfileEdit;
