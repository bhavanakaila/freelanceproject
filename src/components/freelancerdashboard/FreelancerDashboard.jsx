import React, { useState, useEffect, useContext } from 'react';
import './FreelancerDashboard.css';
import { employerLoginContext } from '../../contexts/employerLoginContext';

function FreelancerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [filters, setFilters] = useState({ category: '', type: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  
  const { JobListing } = useContext(employerLoginContext);

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

  // useEffect(() => {
  //   const sampleJobs = [
  //     {
  //       id: 1,
  //       title: 'Web Developer Needed',
  //       description: 'Looking for a skilled web developer.',
  //       category: 'Web Development',
  //       skills: ['React', 'Node.js'],
  //       type: 'Remote',
  //       status: 'Open',
  //       postedDate: '2023-10-01',
  //     },
  //     {
  //       id: 2,
  //       title: 'Graphic Designer',
  //       description: 'Need a graphic designer for marketing materials.',
  //       category: 'Design',
  //       skills: ['Photoshop', 'Illustrator'],
  //       type: 'Part-Time',
  //       status: 'Open',
  //       postedDate: '2023-10-05',
  //     },
  //   ];
  //   setJobs(sampleJobs);
  //   setFilteredJobs(sampleJobs);
  // }, []);


  

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);



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
            <div className="joblist">
            {JobListing.length === 0 ? (
              <p>if any jobs posted will be shown here...</p>
            ) : (
              JobListing.map(job => (
                <div key={job.id} className="job-card">                  
                  <h3>{job.jobTitle}</h3>
                  <p className='fs-5 fst-normal'>{job.companyname}</p>
                  <p className='fs-5 fst-norma'>{job.status}</p>
                  <p className='fs-5 fst-norma'>{job.pay}</p>
                  <button onClick={() => applyToJob(job.id)}>Apply Now</button>
                </div>
              ))
            )}
            </div>
          </section>
        )}
        {selectedOption === 'profile' && (
          <section className="profile">
            <h2>User Profile</h2>
            <div className='details'>
            <p>Name: {userProfile.name}</p>
            <p>Skills: {userProfile.skills.join(', ')}</p>
            <p>Experience: {userProfile.experience}</p>
            <p>Portfolio: <a href={userProfile.portfolio}>{userProfile.portfolio}</a></p>
            <label>Role:</label>
            <select value={userProfile.role} onChange={handleRoleChange}>
              <option value="Freelancer">Freelancer</option>
              <option value="Employer">Employer</option>
            </select>
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
