import React, { useState } from "react";
import { freelancerLoginContext } from "./freelancerLoginContext";
import { useEffect } from "react";

function freelancerLoginStore({ children }) {
    const [currentFreelancer, setCurrentFreelancer] = useState(null);
    const [freelancerLoginStatus, setFreelancerLoginStatus] = useState(false);
    const [err, setErr] = useState("");
    const [profileListing,setProfileListing]=useState("");

    async function loginFreelancer(user) {
        fetch("http://localhost:3000/freelancerList")
      .then((res) => res.json())
      .then((data) => {
        const freelancer = data.find(emp => emp.fullName === user.username && emp.password === user.password);
        console.log(freelancer);
        if (!freelancer) {
          setCurrentFreelancer(null);
          setFreelancerLoginStatus(false);
          setErr("Invalid Username or Password");
        } else {
          setCurrentFreelancer(freelancer);
          setFreelancerLoginStatus(true);
          setErr("");
        }
      });
    }
    
    useEffect(() => {
        console.log("Freelancer login status updated:", freelancerLoginStatus);
    }, [freelancerLoginStatus]);
    
    useEffect(()=>{
      async function fetchUsers(){
        try{
          let res= await fetch('http://localhost:3000/freelancerList');

          if(!res.ok){
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          let freelancerList=await res.json();
          const allProfiles = freelancerList.flatMap(user => user.profileList || []);
          setProfileListing(allProfiles);
          console.log("allProfiles",allProfiles);
        }
        catch(error){
          console.log("There is an error while fetching data")
        }
      }
      fetchUsers();
    },[]);
    
    const logoutFreelancer = () => {
        setCurrentFreelancer(null);
        setFreelancerLoginStatus(false);
        setErr("");
    };

    return (
        <freelancerLoginContext.Provider
            value={{currentFreelancer,freelancerLoginStatus,loginFreelancer,logoutFreelancer,setCurrentFreelancer,profileListing,err}}>
            {children}
        </freelancerLoginContext.Provider>
    );
}

export default freelancerLoginStore;