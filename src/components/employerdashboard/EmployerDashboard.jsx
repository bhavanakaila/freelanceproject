import React, { useState } from "react";
import "./EmployerDashboard.css";

const EmployerDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Dummy data for freelancers and job postings
  const freelancers = [
    {
      id: 1,
      name: "John Doe",
      skills: ["React", "Node.js", "UI/UX"],
      experience: "5 years",
      hourlyRate: "$50",
      rating: 4.8,
      portfolio: "https://example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      skills: ["Python", "Data Analysis", "Machine Learning"],
      experience: "3 years",
      hourlyRate: "$40",
      rating: 4.5,
      portfolio: "https://example.com",
    },
  ];

  const jobPostings = [
    { id: 1, title: "React Developer Needed", status: "Active" },
    { id: 2, title: "Data Analyst Project", status: "Filled" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
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
            className={activeSection === "freelancers" ? "active" : ""}
            onClick={() => setActiveSection("freelancers")}
          >
            Freelancer Profiles
          </li>
          <li
            className={activeSection === "jobPostings" ? "active" : ""}
            onClick={() => setActiveSection("jobPostings")}
          >
            Job Postings
          </li>
          <li
            className={activeSection === "shortlisted" ? "active" : ""}
            onClick={() => setActiveSection("shortlisted")}
          >
            Shortlisted Freelancers
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeSection === "dashboard" && (
          <div className="dashboard-overview">
            <h3>Dashboard Overview</h3>
            <div className="metrics">
              <div className="metric">
                <h4>Active Projects</h4>
                <p>3</p>
              </div>
              <div className="metric">
                <h4>Shortlisted Freelancers</h4>
                <p>5</p>
              </div>
              <div className="metric">
                <h4>Job Postings</h4>
                <p>2</p>
              </div>
            </div>

            {/* Freelancer Profiles in Dashboard */}
            <div className="freelancer-profiles">
              <h3>Freelancer Profiles</h3>
              <div className="freelancer-list">
                {freelancers.map((freelancer) => (
                  <div key={freelancer.id} className="freelancer-card">
                    <h4>{freelancer.name}</h4>
                    <p>Skills: {freelancer.skills.join(", ")}</p>
                    <p>Experience: {freelancer.experience}</p>
                    <p>Hourly Rate: {freelancer.hourlyRate}</p>
                    <p>Rating: {freelancer.rating}</p>
                    <a href={freelancer.portfolio} target="_blank" className='carda' rel="noopener noreferrer">
                      View Portfolio
                    </a>
                    <button className='shortbtn'>Shortlist</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "freelancers" && (
          <div className="freelancer-profiles">
            <h3>Freelancer Profiles</h3>
            <div className="search-bar">
              <input type="text" placeholder="Search freelancers..." />
              <button>Search</button>
            </div>
            <div className="freelancer-list">
              {freelancers.map((freelancer) => (
                <div key={freelancer.id} className="freelancer-card">
                  <h4>{freelancer.name}</h4>
                  <p>Skills: {freelancer.skills.join(", ")}</p>
                  <p>Experience: {freelancer.experience}</p>
                  <p>Hourly Rate: {freelancer.hourlyRate}</p>
                  <p>Rating: {freelancer.rating}</p>
                  <a href={freelancer.portfolio} target="_blank" rel="noopener noreferrer">
                    View Portfolio
                  </a>
                  <button>Shortlist</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "jobPostings" && (
          <div className="job-postings">
            <h3>Job Postings</h3>
            <div className="job-list">
              {jobPostings.map((job) => (
                <div key={job.id} className="job-card">
                  <h4>{job.title}</h4>
                  <p>Status: {job.status}</p>
                  <button>Edit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "shortlisted" && (
          <div className="shortlisted-freelancers">
            <h3>Shortlisted Freelancers</h3>
            <div className="freelancer-list">
              {freelancers.map((freelancer) => (
                <div key={freelancer.id} className="freelancer-card">
                  <h4>{freelancer.name}</h4>
                  <p>Skills: {freelancer.skills.join(", ")}</p>
                  <button>Message</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;