import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { saveUser } from "../../helper/user";

function SignIn() {
  let navigate = useNavigate();
  const location = useLocation();
  const [requestResponse, setRequestResponse] = useState({
    textMessage: "",
    alertClass: "",
  });
  const initialValues = {
    username: "",
    password: "",
  };
  function onSubmit(values) {
    axios
      .post("http://127.0.0.1:8000/api/signin/", values)
      .then(
        (response) => {
          saveUser(values.username, response.data.access);
          const redirectTo = location.state?.redirectTo || "/";
          navigate(redirectTo);
        },
        (error) => {
          if (error.response && error.response.data) {
            const errorMessage = error.response.data.non_field_errors
              ? error.response.data.non_field_errors[0]
              : "An error occurred. Please try again.";
            setRequestResponse({
              textMessage: errorMessage,
              alertClass: "alert alert-danger",
            });
          }
        }
      )
      .catch((error) => console.log(error));
  }
  const validationSchema = Yup.object({
    username: Yup.string().required("enter username"),
    password: Yup.string()
      .required("enter password")
      .min(6, "password must be minimum of 6 characters"),
  });
  return (
    <div className="login-center" style={{ backgroundColor: "#f7f0f0" }}>
      <div className="container">
        <div className="row">
          <div className="one-fourth"></div>
          <div className="half">
            <div className="wrapper">
              <div className={requestResponse.alertClass} role="alert">
                {requestResponse.textMessage}
              </div>
              <h2>HELLO AGAIN!</h2>
              <br></br>
              {/* <h2>Login</h2>
              <hr style={{ marginBottom: "30px" }} /> */}
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnMount
                onSubmit={onSubmit}
              >
                {(formik) => {
                  return (
                    <Form>
                      <div className="form-group">
                        <label style={{ fontWeight: "600" }}>Username:</label>
                        <Field
                          type="text"
                          name="username"
                          className={
                            formik.touched.username && formik.errors.username
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          style={{ backgroundColor: "#f2f6f7" }}
                        />
                        <small className="text-danger">
                          <ErrorMessage name="username" />
                        </small>
                      </div>
                      <div className="form-group">
                        <label style={{ fontWeight: "600" }}>Password:</label>
                        <Field
                          type="password"
                          name="password"
                          className={
                            formik.touched.password && formik.errors.password
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          style={{ backgroundColor: "#f2f6f7" }}
                        />
                        <small className="text-danger">
                          <ErrorMessage name="password" />
                        </small>
                      </div>
                      <br />
                      <p className="text-center">
                        Don't have an account? Sign up{" "}
                        <Link to="/signup">here.</Link>
                      </p>
                      <Field
                        type="submit"
                        value="Login"
                        className="btn btn-primary btn-block"
                        disabled={!formik.isValid}
                      />
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
          <div className="one-fourth"></div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
