import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { getToken, clearUser } from "../helper/user";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Modal from "./DeleteAccountModal"; // Import the Modal component

function ProfileView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const token = getToken();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/signin", { state: { redirectTo: location.pathname } });
    }
  }, [navigate, location]);

  useEffect(() => {
    // Fetch user data from API
    axios
      .get("http://127.0.0.1:8000/api/user-profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setUserProfile(response.data);
      })
      .catch((error) => console.log(error));
  }, [token]);

  const initialValues = {
    name: userProfile.name || "",
    username: userProfile.username || "",
    email: userProfile.email || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Enter name"),
    username: Yup.string().required("Enter username"),
    email: Yup.string().required("Enter email").email("Enter valid email"),
  });

  const onSubmit = (values, { setErrors }) => {
    axios
      .put("http://127.0.0.1:8000/api/user-profile/", values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Profile updated successfully!", response.data);
        setUserProfile(values); // Update userProfile state with new values
        setIsEditing(false); // Switch back to view mode
      })
      .catch((error) => {
        // Check for username already exists error
        if (
          error.response &&
          error.response.data &&
          error.response.data.username
        ) {
          setErrors({ username: error.response.data.username });
        } else {
          console.log(error);
        }
      });
  };

  const handleDeleteAccount = () => {
    axios
      .delete("http://127.0.0.1:8000/api/user-profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        console.log("Account deleted successfully!");
        setModalOpen(false);
        clearUser();
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="profile-center user-profile-background"   >
      <div className="container">
        <h2>User Profile</h2>
        {!isEditing ? (
          <div>
            <p>
              <strong>Name:</strong> {userProfile.name}
            </p>
            <p>
              <strong>Username:</strong> {userProfile.username}
            </p>
            <p>
              <strong>Email:</strong> {userProfile.email}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-secondary"
            >
              Edit
            </button>
            <Link to="/change-password" className="btn btn-warning ml-2">
              Change Password
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="delete-account-button"
            >
              Delete Account
            </button>

            {/* Modal for delete account confirmation */}
            <Modal
             
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              onDelete={handleDeleteAccount} // Call delete when user confirms
            >
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
            </Modal>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {(formik) => (
              <Form>
                <div className="form-group">
                  <label>Name</label>
                  <Field
                    name="name"
                    className={
                      formik.touched.name && formik.errors.name
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    type="text"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <Field
                    name="username"
                    className={
                      formik.touched.username && formik.errors.username
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    type="text"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <Field
                    name="email"
                    className={
                      formik.touched.email && formik.errors.email
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    type="text"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
}

export default ProfileView;
