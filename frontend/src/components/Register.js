import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Registration successful! Please log in.");
        navigate("/login"); // Redirect to the login page
      } else {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("A network error occurred. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <form
        className="col-6 mx-auto card p-3 shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2>Register</h2>
        <hr />

        <div className="mb-3">
          <label htmlFor="first_name" className="form-label">
            First Name
          </label>
          <input
            type="text"
            className="form-control"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="last_name" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            className="form-control"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Register;
