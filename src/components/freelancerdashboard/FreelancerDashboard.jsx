import React, { useState, useEffect } from 'react';
import './FreelancerDashboard.css';

const FreelancerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [filters, setFilters] = useState({ category: '', type: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Add a role field to the user's profile
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    skills: ['React', 'Node.js', 'Photoshop'],
    experience: '5 years',
    portfolio: 'https://example.com',
    role: 'Freelancer', // Default role is Freelancer
  });

  // Simulate fetching jobs
  useEffect(() => {
    const sampleJobs = [
      {
        id: 1,
        title: 'Web Developer Needed',
        description: 'Looking for a skilled web developer to build a responsive website.',
        category: 'Web Development',
        skills: ['React', 'Node.js'],
        type: 'Remote',
        status: 'Open',
        postedDate: '2023-10-01',
      },
      {
        id: 2,
        title: 'Graphic Designer',
        description: 'Need a graphic designer for creating marketing materials.',
        category: 'Design',
        skills: ['Photoshop', 'Illustrator'],
        type: 'Part-Time',
        status: 'Open',
        postedDate: '2023-10-05',
      },
    ];
    setJobs(sampleJobs);
    setFilteredJobs(sampleJobs);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = jobs;
    if (filters.category) {
      filtered = filtered.filter((job) => job.category === filters.category);
    }
    if (filters.type) {
      filtered = filtered.filter((job) => job.type === filters.type);
    }
    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [filters, jobs]);

  // Apply sorting
  useEffect(() => {
    let sorted = [...filteredJobs];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
    } else if (sortBy === 'alphabetical') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    setFilteredJobs(sorted);
  }, [sortBy]);

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Simulate applying to a job
  const applyToJob = (jobId) => {
    const job = jobs.find((job) => job.id === jobId);
    if (job) {
      setAppliedJobs([...appliedJobs, { ...job, status: 'Waiting for Response' }]);
    }
  };

  // Handle role change in profile
  const handleRoleChange = (e) => {
    setUserProfile({ ...userProfile, role: e.target.value });
  };

  // Render content based on selected sidebar option
  const renderContent = () => {
    switch (selectedOption) {
      case 'dashboard':
        return (
          <section className="job-listings">
            <h2>Job Listings</h2>

            {/* Filters */}
            <div className="filters">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
              </select>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="Remote">Remote</option>
                <option value="Part-Time">Part-Time</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="sorting">
              <label>Sort By:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>

            {/* Job Listings */}
            {currentJobs.length === 0 ? (
              <div className="no-jobs">
                <p>No jobs match your filters.</p>
              </div>
            ) : (
              <div className="jobs">
                {currentJobs.map((job) => (
                  <div key={job.id} className="job-card">
                    <h3>{job.title}</h3>
                    <p>{job.description}</p>
                    <div className="tags">
                      <span>{job.category}</span>
                      {job.skills.map((skill, index) => (
                        <span key={index}>{skill}</span>
                      ))}
                    </div>
                    <p>Job Type: {job.type}</p>
                    <p>Status: {job.status}</p>
                    <button onClick={() => applyToJob(job.id)}>Apply Now</button>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="pagination">
              {Array.from({ length: Math.ceil(filteredJobs.length / jobsPerPage) }, (_, i) => (
                <button key={i + 1} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              ))}
            </div>
          </section>
        );

      case 'profile':
        return (
          <section className="profile">
            <h2>User Profile</h2>
            <p>Name: {userProfile.name}</p>
            <p>Skills: {userProfile.skills.join(', ')}</p>
            <p>Experience: {userProfile.experience}</p>
            <p>Portfolio: <a href={userProfile.portfolio}>{userProfile.portfolio}</a></p>
            <label>Role:</label>
            <select value={userProfile.role} onChange={handleRoleChange}>
              <option value="Freelancer">Freelancer</option>
              <option value="Employer">Employer</option>
            </select>
          </section>
        );

      case 'applied-jobs':
        return (
          <section className="applied-jobs">
            <h2>Applied Jobs</h2>
            {appliedJobs.length === 0 ? (
              <p>You haven't applied to any jobs yet.</p>
            ) : (
              <div className="applied-jobs-list">
                {appliedJobs.map((job, index) => (
                  <div key={index} className="applied-job-card">
                    <h3>{job.title}</h3>
                    <p>Status: {job.status}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        );

      case 'create-job':
        return (
          <section className="create-job">
            <h2>Create Job Post</h2>
            <form>
              <label>Job Title:</label>
              <input type="text" placeholder="Enter job title" />
              <label>Description:</label>
              <textarea placeholder="Enter job description"></textarea>
              <label>Category:</label>
              <input type="text" placeholder="Enter category" />
              <label>Skills Required:</label>
              <input type="text" placeholder="Enter skills (comma separated)" />
              <button type="submit">Post Job</button>
            </form>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li
            className={selectedOption === 'dashboard' ? 'active' : ''}
            onClick={() => setSelectedOption('dashboard')}
          >
            Dashboard
          </li>
          <li
            className={selectedOption === 'profile' ? 'active' : ''}
            onClick={() => setSelectedOption('profile')}
          >
            Profile
          </li>
          <li
            className={selectedOption === 'applied-jobs' ? 'active' : ''}
            onClick={() => setSelectedOption('applied-jobs')}
          >
            Applied Jobs
          </li>
          {userProfile.role === 'Employer' && (
            <li
              className={selectedOption === 'create-job' ? 'active' : ''}
              onClick={() => setSelectedOption('create-job')}
            >
              Create Job
            </li>
          )}
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default FreelancerDashboard;