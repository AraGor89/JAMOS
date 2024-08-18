import * as Yup from "yup";

export const signupValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least 8 characters, one letter, and one number"
    ),
  partnerEmail: Yup.string()
    .email("Invalid email")
    .test(
      "different-email",
      "Partner email must be different",
      function (value) {
        const email = this.resolve(Yup.ref("email"));
        return value !== email;
      }
    ),

  // photo: Yup.mixed()
  //   .test("fileSize", "File size is too large", (value) => {
  //     return value ? value.size <= 1024 * 1024 : true;
  //   })
  //   .test("fileType", "Unsupported file type", (value) => {
  //     return value ? ["image/jpeg", "image/png"].includes(value.type) : true;
  //   })
});

export const emailValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export const resetPassValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least 8 characters, one letter, and one number"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export const signinValidationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
      "Password must contain at least 8 characters, one letter, and one number"
    ),
});

export const addCharacteristicValidationSchema = Yup.object().shape({
  character: Yup.string()
    .required("Character Name is required")
    .trim()
    .min(2, "Character Name is too short")
    .max(20, " Character Name is too long"),
  value: Yup.number()
    .required("Characteristic Value is required")
    .min(0, "Must be greater than or equal to 0")
    .max(100, "Must be less than or equal to 100")
    .typeError("Characteristic Value must be a number") // Custom type error message
    .test(
      "is-valid-number",
      "Characteristic Value must be a valid number",
      (value) => !isNaN(value)
    ),
});
