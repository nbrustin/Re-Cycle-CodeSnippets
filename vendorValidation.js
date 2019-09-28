import * as Yup from "yup";

let vendorValidationSchema = Yup.object().shape({
  name: Yup.string()
    .max(100, "Name cannot exceed 100 characters")
    .required("Name is required"),
  description: Yup.string()
    .max(4000, "Description cannot exceed 4000 characters")
    .required("Description is required"),
  headline: Yup.string()
    .max(200, "Headline cannot exceed 200 characters")
    .required("Headline is required"),
  primaryImageId: Yup.string()
    .max(2000, "Url cannot exceed 2000 characters")
    .required("Url is required")
});

export default { vendorValidationSchema };
