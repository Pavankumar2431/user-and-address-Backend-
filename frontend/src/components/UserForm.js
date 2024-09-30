// UserForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './UserForm.css'; // Import the CSS file

const UserForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState({ name: '', address: '' });
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ name: '', address: '' }); // Reset errors
    setSuccess('');

    // Simple validation
    let formIsValid = true;
    const newErrors = { name: '', address: '' };

    if (!name) {
      newErrors.name = 'Name is required';
      formIsValid = false;
    }

    if (!address) {
      newErrors.address = 'Address is required';
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      try {
        const response = await axios.post('https://user-and-address-backend.onrender.com/register', {
          name,
          address,
        });
        setSuccess(response.data.message);
        setName('');
        setAddress('');
      } catch (error) {
        setErrors({ ...newErrors, server: 'Error registering user' });
      }
    }
  };

  return (
    <div className="container">
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit} className="form-section">
        <div className="form-group">
          <label className="label" htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="text-danger">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label className="label" htmlFor="address">Address</label>
          <textarea
            className="form-control"
            id="address"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
          {errors.address && <div className="text-danger">{errors.address}</div>}
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Register
        </button>
        {errors.server && <div className="text-danger mt-3">{errors.server}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </form>
    </div>
  );
};

export default UserForm;
