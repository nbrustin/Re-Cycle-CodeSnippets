import * as Yup from "yup";

let discountValidationSchema = Yup.object().shape({
  productId: Yup.number().required("Product Id is required"),
  couponCode: Yup.string()
    .max(20, "Coupon Code cannot exceed 20 characters")
    .required("Coupon Code is required"),
  title: Yup.string()
    .max(50, "Title cannot exceed 50 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(100, "Description cannot exceed 100 characters")
    .required("Description is required"),
  percentage: Yup.number()
    .min(1, "Discount must be 1% or greater")
    .required("Discount is required"),
  validFrom: Yup.date().required("Valid From is required"),
  validUntil: Yup.date().required("Valid Until is required")
});

export default discountValidationSchema;
