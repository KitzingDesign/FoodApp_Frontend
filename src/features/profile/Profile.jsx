import { useGetUserQuery } from "../users/usersApiSlice";
import { selectCurrentUserId, logOut } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import styles from "./profile.module.css";
import Button from "../../UI/Button";
import ProfileIcon from "/public/profile"; // Ensure this is the correct path for your ProfileIcon
import { Link } from "react-router-dom";
import { useUpdateUserMutation } from "../users/usersApiSlice";
import { useLogoutMutation, useDeleteMutation } from "../auth/authApiSlice";

// Function to calculate the number of days since the account was created
const calculateDaysSince = (dateString) => {
  const createdDate = new Date(dateString);
  const today = new Date();
  const diffInTime = today - createdDate;
  return Math.floor(diffInTime / (1000 * 3600 * 24));
};

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const userId = Number(useSelector(selectCurrentUserId));
  const { data: user, error, isLoading } = useGetUserQuery(Number(userId));

  //Api hooks
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteMutation();

  // State for form inputs
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const fileInputRef = useRef(); // Create a reference for the file input

  // Use useEffect to set initial state from user data
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      if (user.profile_picture) {
        setFileUrl(user.profile_picture); // Set the existing profile picture URL
      }
    }
  }, [user]);

  // Handlers for input changes
  const handleFirstNameInput = (e) => setFirstName(e.target.value);
  const handleLastNameInput = (e) => setLastName(e.target.value);

  // Handler for image file input
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setFileUrl(URL.createObjectURL(file)); // Update the preview URL
    }
  };

  // Placeholder for form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrMsg("");

    const userFormData = new FormData();
    userFormData.append("first_name", firstName);
    userFormData.append("last_name", lastName);
    userFormData.append("user_id", userId);
    userFormData.append("profile_picture", fileUrl);

    // Append the image if available
    if (imgFile) {
      userFormData.append("image", imgFile);
    }

    // Debugging: iterate over the FormData to check the entries
    for (let [key, value] of userFormData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const newUser = await updateUser({ userId, userFormData }).unwrap();
    } catch (err) {
      setErrMsg("Failed to update User");
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logOut());
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount(userId).unwrap();
      dispatch(logOut());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // Loading state
  if (isLoading) return <p>Loading...</p>;

  // Error handling
  if (error) return <p>Error: {error.message}</p>;

  // Ensure user data is available
  if (!user) return <p>No user found.</p>;

  // Calculate the number of days since the account was created
  const daysSinceCreated = calculateDaysSince(user.created_at);

  return (
    <div className={styles.upperContainer}>
      <Button
        size="small"
        variant="outlineRed"
        className={styles.deleteButton}
        onClick={handleDeleteAccount}
      >
        Delete Account{" "}
      </Button>
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.headerContainer}>
          <div className={styles.titleContainer}>
            <div
              className={styles.imgContainer}
              onClick={() => fileInputRef.current.click()}
            >
              {/* Render uploaded image or default profile icon */}
              {fileUrl ? (
                <img
                  src={fileUrl}
                  alt="Profile"
                  className={styles.profileImage}
                />
              ) : (
                <ProfileIcon />
              )}
              {/* File input for image upload */}
              <input
                type="file"
                ref={fileInputRef}
                name="image"
                onChange={handleImageUpload}
                style={{ display: "none" }} // Hide the file input
                id="imageUpload" // Optional ID for accessibility
              />
            </div>
            <div>
              <h2>
                {user.first_name} {user.last_name}
              </h2>
              <p>{user.email}</p>
            </div>
          </div>
          <div className={styles.logout}>
            <Button
              size="small"
              destination="/"
              variant="outlineRed"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
        <div className={styles.accountContainer}>
          <div>
            <h3>Edit Account</h3>
            <p>🌮 You've been a MMMer for {daysSinceCreated} days 🌮</p>
          </div>
          <div className={styles.divider} />
        </div>
        <div className={styles.form}>
          <div className={styles.inputContainer}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={handleFirstNameInput}
              autoComplete="off"
              className={styles.input}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={handleLastNameInput}
              className={styles.input}
            />
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.button}>
              {" "}
              Update Profile{" "}
            </button>
            {/* <Button type="submit" variant="fill" size="medium">
              Update Profile
            </Button> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
