import React, { useState } from "react";
import { employerLoginContext } from "./employerLoginContext";

function EmployerLoginStore({ children }) {
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [employeeLoginStatus, setEmployeeLoginStatus] = useState(false);
    const [err, setErr] = useState("");

    async function loginEmployee(userCred) {
        try {
            // Fetch the list of employers
            let res = await fetch("http://localhost:3000/employerList");
            if (!res.ok) throw new Error("Failed to fetch employer details");

            let employers = await res.json();

            // Find the employer with matching credentials
            const employer = employers.find(
                (emp) =>
                    emp.fullName === userCred.username && emp.password === userCred.password
            );

            if (!employer) {
                setCurrentEmployee(null);
                setEmployeeLoginStatus(false);
                setErr("Invalid Username or Password");
            } else {
                setCurrentEmployee(employer);
                setEmployeeLoginStatus(true);
                setErr("");
            }
        } catch (error) {
            console.error("Login Error:", error);
            setErr("Something went wrong. Please try again.");
        }
    }

    function logoutEmployee() {
        setCurrentEmployee(null);
        setEmployeeLoginStatus(false);
        setErr("");
    }

    return (
        <employerLoginContext.Provider
            value={{ loginEmployee, logoutEmployee, employeeLoginStatus, err, currentEmployee }}
        >
            {children}
        </employerLoginContext.Provider>
    );
}

export default EmployerLoginStore;