import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { getToken, clearUser } from "../helper/user";
import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getToken();

  // Password validation schema
  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/signin", { state: { redirectTo: location.pathname } });
    }
  }, [navigate, location]);

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    const data = {
      password: values.newPassword,
    };

    axios
      .put("http://127.0.0.1:8000/api/user-profile/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Password changed successfully!", response.data);
        clearUser();
        navigate("/signin");
      })
      .catch((error) => {
        console.log(error);
        setErrors({ apiError: "Failed to change password. Please try again." });
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="container" style={{padding:"200px"}}>
      

     
      <h2>Change Password</h2>
      <Formik
        initialValues={{ newPassword: "", confirmPassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors }) => (
          <Form>
            {errors.apiError && (
              <div className="text-danger">{errors.apiError}</div>
            )}
            <div className="form-group">
              <label>New Password</label>
              <Field
                type="password"
                name="newPassword"
                className="form-control"
              />
              <ErrorMessage
                name="newPassword"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <Field
                type="password"
                name="confirmPassword"
                className="form-control"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-danger"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Change Password
            </button>
          </Form>
        )}
      </Formik>
    </div>
    
  );
}

export default ChangePassword;
