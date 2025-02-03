import React, { useState, useContext } from "react";
import { employerLoginContext } from "../../contexts/employerLoginContext"
import "./EmployerProfile.css";

const EmployerProfile = () => {
  const { user, updateUser } = useContext(employerLoginContext);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateUser({ [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Add logic to save data to backend if needed
  };

  return (
    <div className="profile-container">
      {/* Banner Image */}
      <div className="banner">
        <img
          src="https://via.placeholder.com/1200x200"
          alt="Banner"
          className="banner-image"
        />
      </div>

      {/* Profile Picture */}
      <div className="profile-picture">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="profile-image"
        />
      </div>

      {/* Profile Details */}
      <div className="profile-details">
        <h1>Employer Profile</h1>
        {isEditing ? (
          <div className="edit-form">
            <label>
              Company Name:
              <input
                type="text"
                name="companyName"
                value={user.companyName || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={user.email || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="phone"
                value={user.phone || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={user.address || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <label>
              Website:
              <input
                type="url"
                name="website"
                value={user.website || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <>
            <p>
              <strong>Company Name:</strong> {user.companyName || "Not Provided"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "Not Provided"}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone || "Not Provided"}
            </p>
            <p>
              <strong>Address:</strong> {user.address || "Not Provided"}
            </p>
            <p>
              <strong>Website:</strong> {user.website || "Not Provided"}
            </p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployerProfile;