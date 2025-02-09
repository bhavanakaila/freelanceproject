import React, { useState, useEffect, useContext } from 'react';
import './FreelancerDashboard.css';
import { useForm } from 'react-hook-form';
import { FaUserCircle } from "react-icons/fa";
import { employerLoginContext } from '../../contexts/employerLoginContext';

function FreelancerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset,setValue } = useForm();
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadedProfile, setUploadedProfile] = useState(null);
  // Sample Freelancer Data (Fetched from JSON)
  const [freelancer,setFreelancer] = useState( {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
  });

  const handleEditClick = () => {
    setShowEditModal(true);
    setValue("name", freelancer.name);
    setValue("email", freelancer.email);
    setValue("phone", freelancer.phone);
  };
  const onSubmit = (data) => {
    console.log("Profile Data:", data);
    setShowModal(false);
    setFreelancer(data);
    setUploadedProfile(data);
    setShowEditModal(false);
    reset();
  };

  const { JobListing } = useContext(employerLoginContext);

  const [searchQuery, setSearchQuery] = useState('');

// Filter jobs based on search query
const filteredJobs = Array.isArray(JobListing)
  ? JobListing.filter(job =>
      job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.status.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];
  // JobListing.forEach(job => {
  //   console.log(job.companyname, job.jobTitle, job.status, job.pay);
  // });

  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    skills: ['React', 'Node.js', 'Photoshop'],
    experience: '5 years',
    portfolio: 'https://example.com',
    role: 'Freelancer',
  });


  const applyToJob = jobId => {
    const job = jobs.find(job => job.id === jobId);
    if (job) {
      setAppliedJobs([...appliedJobs, { ...job, status: 'Waiting for Response' }]);
    }
  };

  const handleRoleChange = e => {
    setUserProfile({ ...userProfile, role: e.target.value });
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <ul>
          <li className={selectedOption === 'dashboard' ? 'active' : ''} onClick={() => setSelectedOption('dashboard')}>Dashboard</li>
          <li className={selectedOption === 'profile' ? 'active' : ''} onClick={() => setSelectedOption('profile')}>Profile</li>
          <li className={selectedOption === 'applied-jobs' ? 'active' : ''} onClick={() => setSelectedOption('applied-jobs')}>Applied Jobs</li>
          {userProfile.role === 'Employer' && (
            <li className={selectedOption === 'create-job' ? 'active' : ''} onClick={() => setSelectedOption('create-job')}>Create Job</li>
          )}
        </ul>
      </div>
      <div className="main-content">
      {selectedOption === 'dashboard' && (
  <section className="job-listings">
    <h2>Job Listings</h2>
    {/* Search Input */}
    <div className="search-container">
      <input
        type="text"
        placeholder="Search jobs by title, company, or status..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
    </div>
    <div className="joblist">
      {filteredJobs.length === 0 ? (
        <p>No jobs found matching your search criteria.</p>
      ) : (
        filteredJobs.map(job => (
          <div key={job.id} className="job-card">
            <h3>Role: {job.jobTitle}</h3>
            <p className='fs-5 fst-normal'>Company: {job.companyname}</p>
            <p className='fs-5 fst-normal'>Status: {job.status}</p>
            <p className='fs-5 fst-normal'>Pay: {job.pay}</p>
            <button onClick={() => applyToJob(job.id)}>Apply Now</button>
          </div>
        ))
      )}
    </div>
  </section>
)}

    {selectedOption === 'profile' && (
      <section className="profile ">
        <h2>User Profile</h2>
        <div className="basic flex border rounded bg-white">
      {/* User Profile Image */}
      <div className='usericon'> <FaUserCircle size={140}/> </div>
      {/* Freelancer Basic Details */}
      <div className="flex-grow">
        <p><strong>Name:</strong> {freelancer.name}</p>
        <p><strong>Email:</strong> {freelancer.email}</p>
        <p><strong>Phone:</strong> {freelancer.phone}</p>
        <button onClick={handleEditClick} className="editbt">Edit Profile</button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="editmodal flex bg-opacity-50">
          <div className="edit bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className=" mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register("name")}
                className="w-full p-2 border rounded"
                placeholder="Name"
              />
              <input
                {...register("email")}
                className="w-full p-2 border rounded"
                placeholder="Email"
              />
              <input
                {...register("phone")}
                className="w-full p-2 border rounded"
                placeholder="Phone"
              />

              <div className="editb">
                <button type="button"onClick={() => setShowEditModal(false)} className="editbtn">Cancel</button>
                <button type="submit"className="editbtn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    <div className="upload border rounded">
              {uploadedProfile ? (
                <div className="uploaded-details border rounded p-4">
                  <h3>Uploaded Profile Details</h3>
                  <p><strong>Name:</strong> {uploadedProfile.name}</p>
                  <p><strong>Email:</strong> {uploadedProfile.email}</p>
                  <p><strong>Work Experience:</strong> {uploadedProfile.workExperience} years</p>
                  <p><strong>Skills:</strong> {uploadedProfile.skills}</p>
                  <p><strong>GitHub:</strong> <a href={uploadedProfile.github} target="_blank" rel="noopener noreferrer">{uploadedProfile.github}</a></p>
                  <p><strong>Past Companies:</strong> {uploadedProfile.pastCompanies}</p>
                  <p><strong>Description:</strong> {uploadedProfile.description}</p>
                  <div className="action d-flex">
                    <button onClick={() => setShowModal(true)} className="editbtn">Edit</button>
                    <button onClick={() => setUploadedProfile(null)} className="deletebtn">Delete</button>
                  </div>
                </div>
              ) : (
                <div className="uploadp">
                  <button onClick={() => setShowModal(true)} className="uploadprofile">Upload Your Profile +</button>
                </div>
              )}

      {/* Modal */}
      {showModal && (
                <div className="uploadmodal">
                  <div className="upload-details">
                    <h2>Upload Your Profile</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <input
                        {...register("name")}
                        defaultValue={uploadedProfile ? uploadedProfile.name : ''}
                        className="w-full p-2 border rounded"
                        placeholder="Name"
                      />
                      <input
                        {...register("email")}
                        defaultValue={uploadedProfile ? uploadedProfile.email : ''}
                        className="w-full p-2 border rounded"
                        placeholder="Email"
                      />
                      <input
                        {...register("workExperience")}
                        defaultValue={uploadedProfile ? uploadedProfile.workExperience : ''}
                        className="w-full p-2 border rounded"
                        placeholder="Work Experience (Years)"
                        type="number"
                      />
                      <input
                        {...register("skills")}
                        defaultValue={uploadedProfile ? uploadedProfile.skills : ''}
                        className="w-full p-2 border rounded"
                        placeholder="Skills (Comma separated)"
                      />
                      <input
                        {...register("github")}
                        defaultValue={uploadedProfile ? uploadedProfile.github : ''}
                        className="w-full p-2 border rounded"
                        placeholder="GitHub Profile Link"
                      />
                      <input
                        {...register("pastCompanies")}
                        defaultValue={uploadedProfile ? uploadedProfile.pastCompanies : ''}
                        className="w-full p-2 border rounded"
                        placeholder="Past Worked Companies"
                      />
                      <textarea
                        {...register("description")}
                        defaultValue={uploadedProfile ? uploadedProfile.description : ''}
                        className="w-full p-2 border rounded"
                        placeholder="Describe yourself"
                      />
                      <div className="editb">
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="editbtn">Cancel</button>
                        <button type="submit" className="editbtn">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
        {selectedOption === 'applied-jobs' && (
          <section className="applied-jobs">
            <h2>Applied Jobs</h2>
            {appliedJobs.length === 0 ? <p>You haven't applied to any jobs yet.</p> : appliedJobs.map((job, index) => (
              <div key={index} className="applied-job-card">
                <h3>{job.title}</h3>
                <p>Status: {job.status}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

export default FreelancerDashboard;
