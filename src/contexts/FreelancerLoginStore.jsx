import React, { useState } from "react";
import { freelancerLoginContext } from "./freelancerLoginContext";

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
        try {
            console.log(user);
            let res = await fetch(`http://localhost:3000/freelancerList?fullName=${user.username}&password=${user.password}`);
            
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
    
            let userlist = await res.json();
            console.log("userlist",userlist);
            if(userlist.length1!=0){
                setCurrentFreelancer(userlist);
                setFreelancerLoginStatus(true);
                setErr("");
            }
    
            return userlist; // Return the result so the calling function can use it.
        } catch (error) {
            console.error("Error logging in:", error);
            return null; // Handle errors gracefully
        }
    }
    
    const logoutFreelancer = () => {
        setCurrentFreelancer(null);
        setFreelancerLoginStatus(false);
        setErr("");
    };

    return (
        <freelancerLoginContext.Provider
            value={{currentFreelancer,freelancerLoginStatus,loginFreelancer,logoutFreelancer,err}}>
            {children}
        </freelancerLoginContext.Provider>
    );
}

export default freelancerLoginStore;