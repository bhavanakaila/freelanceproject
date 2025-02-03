import React, { useState, useContext } from "react";
import { freelancerLoginContext } from "../../contexts/freelancerLoginContext";
import "./FreelancerProfile.css";

const FreelancerProfile = () => {
  const { user, updateUser } = useContext(freelancerLoginContext);
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
        <h1>Freelancer Profile</h1>
        {isEditing ? (
          <div className="edit-form">
            <label>
              Full Name:
              <input
                type="text"
                name="fullName"
                value={user.fullName || ""}
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
              Skills:
              <input
                type="text"
                name="skills"
                value={user.skills || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <label>
              Portfolio:
              <input
                type="url"
                name="portfolio"
                value={user.portfolio || ""}
                onChange={handleInputChange}
                placeholder="Not Provided"
              />
            </label>
            <button onClick={handleSave}>Save</button>
          </div>
        ) : (
          <>
            <p>
              <strong>Full Name:</strong> {user.fullName || "Not Provided"}
            </p>
            <p>
              <strong>Email:</strong> {user.email || "Not Provided"}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone || "Not Provided"}
            </p>
            <p>
              <strong>Skills:</strong> {user.skills || "Not Provided"}
            </p>
            <p>
              <strong>Portfolio:</strong> {user.portfolio || "Not Provided"}
            </p>
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};

export default FreelancerProfile;