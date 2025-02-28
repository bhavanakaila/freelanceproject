import React, { useState, useEffect, useContext } from "react";
import { employerLoginContext } from '../../contexts/employerLoginContext';
import { freelancerLoginContext } from "../../contexts/freelancerLoginContext";
import { useForm } from "react-hook-form";
import "./EmployerDashboard.css";
import { FaRegUser } from "react-icons/fa";

function EmployerDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const { currentEmployee, setCurrentEmployee } = useContext(employerLoginContext);
  const [isEditing, setIsEditing] = useState(false);
  const {profileListing} = useContext(freelancerLoginContext)
  const [selectedFreelancer,setSelectedFreelancer]=useState(null)
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    if (activeSection === "profile" && currentEmployee) {
      setValue("fullName", currentEmployee?.fullName || "");
      setValue("email", currentEmployee?.email || "");
      setValue("mobileNumber", currentEmployee?.mobileNumber || "");
      setValue("companyname", currentEmployee?.companyname || "");
      setValue("location", currentEmployee?.location || "");
    }
  }, [activeSection, currentEmployee, setValue]);

  const onSubmitProfile = async (data) => {
    if (!currentEmployee?.id) {
      console.error("Employer ID is missing");
      return;
    }
  
    try {
      // Fetch the current employer data
      const response = await fetch(`http://localhost:3000/employerList/${currentEmployee.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch current employer data");
      }
      const existingData = await response.json();
  
      // Create an updated employer object with only the profile fields
      const updatedEmployer = {
        ...existingData, // Keep existing data
        fullName: data.fullName, // Update profile fields
        email: data.email,
        mobileNumber: data.mobileNumber,
        companyname: data.companyname,
        location: data.location,
      };
  
      // Update the employer entry in the database
      const updateResponse = await fetch(`http://localhost:3000/employerList/${currentEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployer),
      });
  
      if (!updateResponse.ok) {
        throw new Error("Failed to update employer profile");
      }
  
      const updatedEmployerData = await updateResponse.json();
      setCurrentEmployee(updatedEmployerData); // Update state
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const [formData, setFormData] = useState({
    companyname: "",
    jobTitle: "",
    status: "Active",
    pay: "",
  });

  const handleViewProfile = (freelancer) => {
    setSelectedFreelancer(freelancer);
  };

  const handleCloseProfile = () => {
    setSelectedFreelancer(null);
  };
  const filteredFreelancers = profileListing.filter((freelancer) => {
    const query = searchQuery.toLowerCase();
    return (
      freelancer.fullName.toLowerCase().includes(query) ||
      freelancer.pastCompanies?.toLowerCase().includes(query) ||
      freelancer.skills?.toLowerCase().includes(query)
    );
  });
  //job listing
   const [jobPostings, setJobPostings] = useState([]);
  async function jobListing(jobdetails) {
    let res = await fetch(`http://localhost:3000/employerList/${currentEmployee.id}`);
    let data = await res.json();

    if (!data.joblist) {
      data.joblist = [];
    }

    data.joblist.push(jobdetails);

    res = await fetch(`http://localhost:3000/employerList/${currentEmployee.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const res = await fetch(`http://localhost:3000/employerList/${currentEmployee.id}`);
        const data = await res.json();

        if (data.joblist) {
          setJobPostings(data.joblist);
        } else {
          setJobPostings([]);
        }
      } catch (error) {
        console.error("Error fetching job postings:", error);
      }
    };

    if (currentEmployee?.id) {
      fetchJobPostings();
    }
  }, [currentEmployee]);

  const handlePostJob = async () => {
    const newJob = {
      id: Date.now(),
      companyname: formData.companyname,
      jobTitle: formData.jobTitle,
      status: formData.status,
      pay: formData.pay,
      employerId: currentEmployee.id,
    };

    setJobPostings((prev) => [...prev, newJob]);
    setFormData({ companyname: formData.companyname, jobTitle: "", status: "Active", pay: "" });

    await jobListing(newJob);
  };

  const deleteJob = async (jobId) => {
    try {
      let res = await fetch(`http://localhost:3000/employerList/${currentEmployee.id}`);
      let data = await res.json();

      data.joblist = data.joblist.filter((job) => job.id !== jobId);

      await fetch(`http://localhost:3000/employerList/${currentEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setJobPostings(data.joblist);
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleUpdateApplicationStatus = async (jobId, freelancerId, status) => {
    try {
      // Fetch the current employer data
      const employerRes = await fetch(`http://localhost:3000/employerList/${currentEmployee.id}`);
      const employerData = await employerRes.json();
  
      // Find the job and update the application status in the employer's joblist
      const updatedJobList = employerData.joblist.map((job) => {
        if (job.id === jobId) {
          const updatedApplications = job.applications.map((application) => {
            if (application.freelancerId === freelancerId) {
              return { ...application, status }; // Update the status
            }
            return application;
          });
          return { ...job, applications: updatedApplications };
        }
        return job;
      });
  
      // Update the employer's data in the database
      const updatedEmployer = { ...employerData, joblist: updatedJobList };
      const updateEmployerResponse = await fetch(`http://localhost:3000/employerList/${currentEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployer),
      });
  
      if (!updateEmployerResponse.ok) {
        throw new Error("Failed to update employer data");
      }
  
      // Fetch the freelancer's data
      const freelancerRes = await fetch(`http://localhost:3000/freelancerList/${freelancerId}`);
      const freelancerData = await freelancerRes.json();
  
      // Update the status in the freelancer's appliedJobs array
      const updatedAppliedJobs = freelancerData.appliedJobs.map((job) => {
        if (job.jobId === jobId) {
          return { ...job, status }; // Update the status
        }
        return job;
      });
  
      // Update the freelancer's data in the database
      const updatedFreelancer = { ...freelancerData, appliedJobs: updatedAppliedJobs };
      const updateFreelancerResponse = await fetch(`http://localhost:3000/freelancerList/${freelancerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFreelancer),
      });
  
      if (!updateFreelancerResponse.ok) {
        throw new Error("Failed to update freelancer data");
      }
  
      // Update the local state for job postings
      setJobPostings(updatedJobList);
  
      alert("Application status updated successfully!");
    } catch (error) {
      console.error("Error updating application status:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Employer Dashboard</h2>
        <ul>
          <li
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            Dashboard
          </li>
          <li
            className={activeSection === "jobPostings" ? "active" : ""}
            onClick={() => setActiveSection("jobPostings")}
          >
            Job Postings
          </li>
          <li
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notifications")}
          >
            Notifications
          </li>
          <li
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </li>
        </ul>
      </div>

      <div className="main-content">
      {activeSection === "dashboard" && (
          <div className="freelancer-profiles">
            <h3>Freelancer Profiles</h3>
            <div className="search-bar">
              <input type="text" placeholder="Search freelancers..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button>Search</button>
            </div>
            <div className="freelancer-list">
            {filteredFreelancers.map((freelancer, index) => (
                <div key={index} className="freelancer-card">
                  <div className="usericon">
                    <FaRegUser size={70} />
                  </div>
                  <div className="freelancer-card-right">
                    <h4>{freelancer.fullName}</h4>
                    <p>{freelancer.description}</p>
                    <button onClick={() => handleViewProfile(freelancer)}>View Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {selectedFreelancer && (
          <div className="freelancer-profile-modal">
            <div className="modal-content">
              <h3>{selectedFreelancer.fullName}</h3>
              <p><strong>Email:</strong> {selectedFreelancer.email}</p>
              <p><strong>Work Experience:</strong> {selectedFreelancer.workExperience} years</p>
              <p><strong>Skills:</strong> {selectedFreelancer.skills}</p>
              <p><strong>GitHub:</strong> <a href={selectedFreelancer.github} target="_blank" rel="noopener noreferrer">{selectedFreelancer.github}</a></p>
              <p><strong>Past Companies:</strong> {selectedFreelancer.pastCompanies}</p>
              <p><strong>Description:</strong> {selectedFreelancer.description}</p>
              <button onClick={handleCloseProfile}>Close</button>
            </div>
          </div>
        )}

        {activeSection === "jobPostings" && (
          <div className="job-postings">
            <h3>Job Postings</h3>
            <form onSubmit={handleSubmit(handlePostJob)} className="mb-6 space-y-4">
              <div>
                <label className="block font-medium">Company Name:</label>
                <input
                  {...register("companyname", { required: "Company name is required" })}
                  value={formData.companyname}
                  onChange={(e) => setFormData({ ...formData, companyname: e.target.value })}
                  className="border p-2 w-full"
                />
                {errors.companyname && <p className="text-red-500">{errors.companyname.message}</p>}
              </div>

              <div>
                <label className="block font-medium">Job Title:</label>
                <input
                  {...register("jobTitle", { required: "Job title is required" })}
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="border p-2 w-full"
                />
                {errors.jobTitle && <p className="text-red-500">{errors.jobTitle.message}</p>}
              </div>

              <div>
                <label className="block font-medium">Status:</label>
                <select
                  {...register("status", { required: "Status is required" })}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="border p-2 w-full"
                >
                  <option value="Active">Active</option>
                  <option value="Closed">Closed</option>
                </select>
                {errors.status && <p className="text-red-500">{errors.status.message}</p>}
              </div>

              <div>
                <label className="block font-medium">Pay:</label>
                <input
                  type="number"
                  {...register("pay", { required: "Pay is required", min: 1 })}
                  value={formData.pay}
                  onChange={(e) => setFormData({ ...formData, pay: e.target.value })}
                  className="border p-2 w-full"
                />
                {errors.pay && <p className="text-red-500">{errors.pay.message}</p>}
              </div>

              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Post Job
              </button>
            </form>

            <div>
              <h3 className="text-xl font-bold">Your Job Listings</h3>
              {jobPostings.length === 0 ? (
                <p className="text-gray-500">No job postings yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {jobPostings.map((job) => (
                    <li key={job.id} className="border p-3 rounded shadow">
                      <p><strong>Company:</strong> {job.companyname}</p>
                      <p><strong>Role:</strong> {job.jobTitle}</p>
                      <p><strong>Status:</strong> {job.status}</p>
                      <p><strong>Pay:</strong> {job.pay}</p>
                      <button onClick={() => deleteJob(job.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

{activeSection === "notifications" && (
  <div className="notifications">
    <h3>Freelancer Applications</h3>
    {jobPostings.length === 0 ? (
      <p>No job postings yet.</p>
    ) : (
      jobPostings.map((job) => (
        <div key={job.id} className="job-application">
          <h4>{job.jobTitle} - {job.companyname}</h4>
          {job.applications && job.applications.length > 0 ? (
            job.applications.map((application) => (
              <div key={application.freelancerId} className="application-card">
                <p><strong>Freelancer Name:</strong> {application.fullName}</p>
                <p><strong>Email:</strong> {application.email}</p>
                <p><strong>Skills:</strong> {application.skills}</p>
                <p><strong>Experience:</strong> {application.experience} years</p>
                <p><strong>Rate:</strong> ${application.rate}/hr</p>
                <p><strong>Availability:</strong> {application.availability}</p>
                <p><strong>Status:</strong> {application.status}</p>
                <div className="status-actions">
                  <button
                    onClick={() => handleUpdateApplicationStatus(job.id, application.freelancerId, "Accepted")}
                    className={application.status === "Accepted" ? "active" : ""}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateApplicationStatus(job.id, application.freelancerId, "Rejected")}
                    className={application.status === "Rejected" ? "active" : ""}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdateApplicationStatus(job.id, application.freelancerId, "Pending")}
                    className={application.status === "Pending" ? "active" : ""}
                  >
                    Pending
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No applications for this job yet.</p>
          )}
        </div>
      ))
    )}
  </div>
)}

        {activeSection === "profile" && (
          <div className="employer-profile">
            <h3>Employer Profile</h3>
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmitProfile)} className="profile-form">
                <div className="form-group">
                  <label>Name:</label>
                  <input type="text" {...register("fullName")} />
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input type="email" {...register("email")} />
                </div>
                <div className="form-group">
                  <label>Mobile:</label>
                  <input type="text" {...register("mobileNumber")} />
                </div>
                <div className="form-group">
                  <label>Company:</label>
                  <input type="text" {...register("companyname")} />
                </div>
                <div className="form-group">
                  <label>Location:</label>
                  <input type="text" {...register("location")} />
                </div>
               <div className="d-flex editbuttn">
               <button type="submit">Save</button>
               <button type="button" onClick={() => { reset(); setIsEditing(false); }}>Cancel</button>
               </div>
              </form>
            ) : (
              <div className="profile-details">
                <p><strong>Name:</strong> {currentEmployee?.fullName}</p>
                <p><strong>Email:</strong> {currentEmployee?.email}</p>
                <p><strong>Mobile:</strong> {currentEmployee?.mobileNumber}</p>
                <p><strong>Company:</strong> {currentEmployee?.companyname || "Not provided"}</p>
                <p><strong>Location:</strong> {currentEmployee?.location || "Not provided"}</p>
                <button onClick={() => setIsEditing(true)}>Edit Profile</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;