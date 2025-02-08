import React, { useState, useContext, useEffect } from "react";
import { employerLoginContext } from "../../contexts/employerLoginContext";
import "./EmployerProfile.css";

const EmployerProfile = () => {
  const { user, updateUser } = useContext(employerLoginContext);
  const [isEditing, setIsEditing] = useState(false);
  const [employerDetails, setEmployerDetails] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    companyName: "",
    address: "",
    website: "",
  });

  // Fetch employer details from db.json (mock API call)
  useEffect(() => {
    // Replace this with your actual API call to fetch data
    const fetchEmployerDetails = async () => {
      try {
        const response = await fetch("http://localhost:3000/employerList"); // Replace with your API endpoint
        const data = await response.json();
        const employer = data.find((emp) => emp.fullName === user.username); // Assuming user.id is available
        if (employer) {
          setEmployerDetails({
            fullName: employer.fullName,
            email: employer.email,
            mobileNumber: employer.mobileNumber,
            companyName: employer.companyName || "",
            address: employer.address || "",
            website: employer.website || "",
          });
        }
      } catch (error) {
        console.error("Error fetching employer details:", error);
      }
    };

    fetchEmployerDetails();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployerDetails({ ...employerDetails, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    updateUser(employerDetails); // Update context with new details
    // Add logic to save data to backend if needed
  };

  return (
    <div className="profile-container">
      {/* Left Section (1/3) */}
      <div className="left-section">
        <div className="profile-picture">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="profile-image"
          />
        </div>
        <button onClick={() => setIsEditing(true)} className="edit-button">
          Edit Profile
        </button>
      </div>

      {/* Right Section (2/3) */}
      <div className="right-section">
        <h1>Employer Profile</h1>
        {isEditing ? (
          <div className="edit-form">
            <label>
              Full Name:
              <input
                type="text"
                name="fullName"
                value={employerDetails.fullName || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={employerDetails.email || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <label>
              Mobile Number:
              <input
                type="text"
                name="mobileNumber"
                value={employerDetails.mobileNumber || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <label>
              Company Name:
              <input
                type="text"
                name="companyName"
                value={employerDetails.companyName || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={employerDetails.address || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <label>
              Website:
              <input
                type="url"
                name="website"
                value={employerDetails.website || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <>
            <p>
              <strong>Full Name:</strong> {employerDetails.fullName || "Not Provided"}
            </p>
            <p>
              <strong>Email:</strong> {employerDetails.email || "Not Provided"}
            </p>
            <p>
              <strong>Mobile Number:</strong> {employerDetails.mobileNumber || "Not Provided"}
            </p>
            <p>
              <strong>Company Name:</strong> {employerDetails.companyName || "Not Provided"}
            </p>
            <p>
              <strong>Address:</strong> {employerDetails.address || "Not Provided"}
            </p>
            <p>
              <strong>Website:</strong> {employerDetails.website || "Not Provided"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerProfile;