import React, { useState } from "react";
import { freelancerLoginContext } from "./freelancerLoginContext";

function FreelancerLoginStore({ children }) {
    const [currentFreelancer, setCurrentFreelancer] = useState(null);
    const [freelancerLoginStatus, setFreelancerLoginStatus] = useState(false);
    const [err, setErr] = useState("");

    async function loginFreelancer(userCred) {
        try {
            // Fetch the list of freelancers
            let res = await fetch("http://localhost:3000/freelancerList");
            if (!res.ok) throw new Error("Failed to fetch freelancer details");

            let freelancers = await res.json();

            // Find the freelancer with matching credentials
            const freelancer = freelancers.find(
                (free) =>
                    free.fullName === userCred.username &&
                    free.password === userCred.password
            );

            if (!freelancer) {
                setCurrentFreelancer(null);
                setFreelancerLoginStatus(false);
                setErr("Invalid Username or Password");
            } else {
                setCurrentFreelancer(freelancer);
                setFreelancerLoginStatus(true);
                setErr("");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setErr("Something went wrong. Please try again.");
        }
    }

    function logoutFreelancer() {
        setCurrentFreelancer(null);
        setFreelancerLoginStatus(false);
        setErr("");
    }

    return (
        <freelancerLoginContext.Provider
            value={{
                loginFreelancer,
                logoutFreelancer,
                freelancerLoginStatus,
                err,
                currentFreelancer,
            }}
        >
            {children}
        </freelancerLoginContext.Provider>
    );
}

export default FreelancerLoginStore;