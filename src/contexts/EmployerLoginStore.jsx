import React, { useEffect, useState } from "react";
import { employerLoginContext } from "./employerLoginContext";

const EmployerLoginStore = ({ children }) => {
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [EmployeeLoginStatus, setEmployeeLoginStatus] = useState(false);
  const [err, setErr] = useState("");
  const [JobListing, setJobListing]=useState("");

  const loginEmployee = (user) => {
    fetch("http://localhost:3000/employerList")
      .then((res) => res.json())
      .then((data) => {
        const employer = data.find(emp => emp.fullName === user.username && emp.password === user.password);
        console.log(employer);
        if (!employer) {
          setCurrentEmployee(null);
          setEmployeeLoginStatus(false);
          setErr("Invalid Username or Password");
        } else {
          setCurrentEmployee(employer);
          setEmployeeLoginStatus(true);
          setErr("");
        }
      });
  };
  const logoutEmployer = () => {
    setCurrentEmployee(null);
    setEmployeeLoginStatus(false);
    setErr("");
  };

 useEffect(()=>{
  async function fetchUsers(){
    try{
      let res= await fetch('http://localhost:3000/employerList');

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    let userslist = await res.json();
    const allJobs = userslist.flatMap(user => user.joblist || []);
    console.log(allJobs);
    setJobListing(allJobs)
    }
    catch(error){
      console.log("There is an error while fetching data")
    }
  }
  fetchUsers();
 },[]);
  

  return (
    <employerLoginContext.Provider value={{ currentEmployee,setCurrentEmployee, EmployeeLoginStatus, loginEmployee,logoutEmployer,err,JobListing }}>
      {children}
    </employerLoginContext.Provider>
  );
};

export default EmployerLoginStore;