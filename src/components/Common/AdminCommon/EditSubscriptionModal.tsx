import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { FeatureRegistry } from "@/enums/features";
import { useFormik } from "formik";
import * as Yup from "yup";

interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isBlocked: boolean;
  createdAt: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.number()
    .required("Price is required")
    .positive("Price must be positive"),
  period: Yup.string().required("Period is required"),
  features: Yup.array().of(Yup.string()),
});

export const EditSubscriptionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: SubscriptionPlan) => void;
  plan: SubscriptionPlan | null;
}> = ({ isOpen, onClose, onSubmit, plan }) => {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [period, setPeriod] = useState("");
//   const [features, setFeatures] = useState<string[]>([]);
  const [isFeatureDropdownOpen, setIsFeatureDropdownOpen] = useState(false);
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
      period: "",
      features: [] as string[],
    },
    validationSchema,
    onSubmit: (values) => {
      if (plan) {
        onSubmit({
          ...plan,
          name: values.name,
          price: Number(values.price),
          period: values.period,
          features: values.features,
        });
      }
      formik.resetForm();
      onClose();
    },
  });

  useEffect(() => {
    if (plan) {
      formik.setValues({
        name: plan.name,
        price: plan.price.toString(),
        period: plan.period,
        features: plan.features,
      });
    }
  }, [plan, formik.setValues]);

//   useEffect(() => {
//     if (plan) {
//       const correctPrice = plan.price.toString();
//       setName(plan.name);
//       setPrice(correctPrice);
//       setPeriod(plan.period);
//       setFeatures(plan.features);
//     }
//   }, [plan]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const newErrors: { [key: string]: string } = {};

//     if (!name.trim()) newErrors.name = "Name is required";
//     if (!price.trim()) newErrors.price = "Price is required";
//     if (!period) newErrors.period = "Period is required";
//     if (features.length === 0)
//       newErrors.features = "At least one feature is required";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     if (plan) {
//       onSubmit({
//         ...plan,
//         name,
//         price: Number(price),
//         period,
//         features,
//       });
//     }
//   };

  const addFeature = (feature: string) => {
    if (!formik.values.features.includes(feature)) {
      formik.setFieldValue("features", [...formik.values.features, feature]);
    }
    formik.setFieldTouched("features", true);
    setIsFeatureDropdownOpen(false);
  };

  const removeFeature = (featureToRemove: string) => {
    formik.setFieldValue(
      "features",
      formik.values.features.filter((feature) => feature !== featureToRemove)
    );
    formik.setFieldTouched("features", true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gray-800 text-white p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Subscription Plan
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...formik.getFieldProps("name")}
                className="w-full text-black"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR)</Label>
              <Input
                id="price"
                type="number"
                {...formik.getFieldProps("price")}
                className="w-full text-black"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-red-500 text-sm">{formik.errors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Period</Label>
              <Select
                value={formik.values.period}
                onValueChange={(value) => formik.setFieldValue("period", value)}
              >
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">weekly</SelectItem>
                  <SelectItem value="monthly">monthly</SelectItem>
                  <SelectItem value="yearly">yearly</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.period && formik.errors.period && (
                <p className="text-red-500 text-sm">{formik.errors.period}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setIsFeatureDropdownOpen(!isFeatureDropdownOpen)
                  }
                  className="w-full text-black justify-start text-left font-normal"
                >
                  Add Features
                </Button>
                {isFeatureDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
                    <div className="py-1">
                      {Object.entries(FeatureRegistry).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700"
                          onClick={() => addFeature(key)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {formik.touched.features && formik.errors.features && (
                <p className="text-red-500 text-sm">{formik.errors.features}</p>
              )}
            </div>
            {formik.values.features.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Features:</Label>
                <div className="space-y-2">
                  {formik.values.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded-md"
                    >
                      <span>
                        {
                          FeatureRegistry[
                            feature as keyof typeof FeatureRegistry
                          ]
                        }
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(feature)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Update Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    // <Dialog open={isOpen} onOpenChange={onClose}>
    //   <DialogContent className="sm:max-w-[500px] bg-gray-800 text-white p-6">
    //     <DialogHeader>
    //       <DialogTitle className="text-xl font-bold">
    //         Edit Subscription Plan
    //       </DialogTitle>
    //     </DialogHeader>
    //     <form onSubmit={handleSubmit} className="space-y-6">
    //       <div className="space-y-4">
    //         <div className="space-y-2">
    //           <Label htmlFor="name">Name</Label>
    //           <Input
    //             id="name"
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //             className="w-full text-black"
    //             required
    //           />
    //           {errors.name && (
    //             <p className="text-red-500 text-sm">{errors.name}</p>
    //           )}
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="price">Price (INR)</Label>
    //           <Input
    //             id="price"
    //             type="number"
    //             value={price}
    //             onChange={(e) => setPrice(e.target.value)}
    //             className="w-full text-black"
    //             required
    //           />
    //           {errors.price && (
    //             <p className="text-red-500 text-sm">{errors.price}</p>
    //           )}
    //         </div>
    //         <div className="space-y-2">
    //           <Label htmlFor="period">Period</Label>
    //           <Select value={period} onValueChange={setPeriod}>
    //             <SelectTrigger className="w-full text-black">
    //               <SelectValue placeholder="Select a period" />
    //             </SelectTrigger>
    //             <SelectContent>
    //               <SelectItem value="weekly">weekly</SelectItem>
    //               <SelectItem value="monthly">monthly</SelectItem>

    //               <SelectItem value="yearly">yearly</SelectItem>
    //             </SelectContent>
    //           </Select>
    //           {errors.period && (
    //             <p className="text-red-500 text-sm">{errors.period}</p>
    //           )}
    //         </div>
    //         <div className="space-y-2">
    //           <Label>Features</Label>
    //           <div className="relative">
    //             <Button
    //               type="button"
    //               variant="outline"
    //               onClick={() =>
    //                 setIsFeatureDropdownOpen(!isFeatureDropdownOpen)
    //               }
    //               className="w-full text-black justify-start text-left font-normal"
    //             >
    //               Add Features
    //             </Button>
    //             {isFeatureDropdownOpen && (
    //               <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
    //                 <div className="py-1">
    //                   {Object.entries(FeatureRegistry).map(([key, value]) => (
    //                     <button
    //                       key={key}
    //                       type="button"
    //                       className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700"
    //                       onClick={() => addFeature(key)}
    //                     >
    //                       {value}
    //                     </button>
    //                   ))}
    //                 </div>
    //               </div>
    //             )}
    //           </div>
    //           {errors.features && (
    //             <p className="text-red-500 text-sm">{errors.features}</p>
    //           )}
    //         </div>
    //         {features.length > 0 && (
    //           <div className="space-y-2">
    //             <Label>Selected Features:</Label>
    //             <div className="space-y-2">
    //               {features.map((feature) => (
    //                 <div
    //                   key={feature}
    //                   className="flex items-center justify-between bg-gray-700 px-3 py-2 rounded-md"
    //                 >
    //                   <span>
    //                     {
    //                       FeatureRegistry[
    //                         feature as keyof typeof FeatureRegistry
    //                       ]
    //                     }
    //                   </span>
    //                   <Button
    //                     type="button"
    //                     variant="ghost"
    //                     size="sm"
    //                     onClick={() => removeFeature(feature)}
    //                     className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
    //                   >
    //                     Remove
    //                   </Button>
    //                 </div>
    //               ))}
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //       <DialogFooter>
    //         <Button type="submit" className="bg-red-600 hover:bg-red-700">
    //           Update Plan
    //         </Button>
    //       </DialogFooter>
    //     </form>
    //   </DialogContent>
    // </Dialog>
  );
};
