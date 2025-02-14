import React, { useContext } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './Header.css';
import { employerLoginContext } from '../../contexts/employerLoginContext';
import { freelancerLoginContext } from '../../contexts/freelancerLoginContext';

function Header() {
  const { currentFreelancer, logoutFreelancer, freelancerLoginStatus } = useContext(freelancerLoginContext);
  const { currentEmployee, logoutEmployer, EmployeeLoginStatus } = useContext(employerLoginContext);

  const navigate = useNavigate();
  const location = useLocation();

  const isFreelancer = freelancerLoginStatus;
  const isEmployer = EmployeeLoginStatus;
  const currentUser = isFreelancer ? currentFreelancer : isEmployer ? currentEmployee : null;
  const logoutUser = isFreelancer ? logoutFreelancer : isEmployer ? logoutEmployer : null;
  const userLoginStatus = isFreelancer || isEmployer;


  const freelancerDashboardPath = '/freelancerdashboard';
  const employerDashboardPath = '/employerdashboard';
  const isOnDashboard = location.pathname === freelancerDashboardPath || location.pathname === employerDashboardPath;

  const handleLogout = () => {
    if (logoutUser) {
      logoutUser();  
      navigate('/login'); 
    }
  };

  const navigateToDash=()=>{
    if(currentUser.userType=='Employer'){
      navigate('/employerdashboard')
    }
    else{
      navigate('/freelancerdashboard')
    }
  }

  return (
    <div className='head'>
      <div className="logo">
        <img 
          src="https://cdn2.iconfinder.com/data/icons/project-management-26/48/30-strategy-256.png" 
          height={40} 
          width={50} 
          alt="Logo" 
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <div className="auth-buttons">
        {!userLoginStatus ? (  
          <>
            <button onClick={() => navigate('/login')} className="login">Login</button>
            <button onClick={() => navigate('/register')} className="signup">Signup</button>
          </>
        ) : (  
          <>
            <span className="username">{currentUser?.username}</span>  { }
            {!isOnDashboard && <button onClick={navigateToDash} className='logout'>DashBoard</button>}
            <button onClick={handleLogout} className="logout">Logout</button>
            
          </>
        )}
      </div>
    </div>
  );
}

export default Header;