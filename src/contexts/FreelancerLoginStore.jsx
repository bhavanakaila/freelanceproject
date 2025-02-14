import React, { useState } from "react";
import { freelancerLoginContext } from "./freelancerLoginContext";
import { useEffect } from "react";

function freelancerLoginStore({ children }) {
    const [currentFreelancer, setCurrentFreelancer] = useState(null);
    const [freelancerLoginStatus, setFreelancerLoginStatus] = useState(false);
    const [err, setErr] = useState("");

    // const loginFreelancer=(user)=>{
    //     // fetch("http://localhost:3000/freelancerList")
    //     // .then((res)=>res.json())
    //     // .then((data)=>{
    //     //     const freelancer=data.find(free=>free.fullName ===user.username && free.password ===user.password);
    //     //     if (!freelancer) {
    //     //         setCurrentFreelancer(null);
    //     //         setFreelancerLoginStatus(false);
    //     //         setErr("Invalid Username or Password");
    //     //       } else {
    //     //         setCurrentFreelancer(freelancer);
    //     //         setFreelancerLoginStatus(true);
    //     //         setErr("");
    //     //       }
    //     // });
       
    // };
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
    
    async function fetchFreelancer() {
        if (!currentFreelancer?.id) return;
        try {
          const res = await fetch(`http://localhost:3000/freelancerList/${currentFreelancer.id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch from freelancers");
          }
          const data = await res.json();
        
          setCurrentFreelancer(data);
        } catch (err) {
          setErr(err.message);
        }
      }
    
      fetchFreelancer();
    
    const logoutFreelancer = () => {
        setCurrentFreelancer(null);
        setFreelancerLoginStatus(false);
        setErr("");
    };

    return (
        <freelancerLoginContext.Provider
            value={{currentFreelancer,freelancerLoginStatus,loginFreelancer,logoutFreelancer,setCurrentFreelancer,err}}>
            {children}
        </freelancerLoginContext.Provider>
    );
}

export default freelancerLoginStore;