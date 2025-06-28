import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'candidate',
    education: '',
    experience: '',
    company_name: '',
    position: '',
    website: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert('Registered Successfully');
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="mb-4 px-3 py-2 border rounded w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="mb-4 px-3 py-2 border rounded w-full"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="mb-4 px-3 py-2 border rounded w-full"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="mb-4 px-3 py-2 border rounded w-full"
        >
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>

        {form.role === 'candidate' && (
          <>
            <input
              name="education"
              placeholder="Education"
              value={form.education}
              onChange={handleChange}
              className="mb-4 px-3 py-2 border rounded w-full"
            />
            <input
              name="experience"
              placeholder="Experience"
              value={form.experience}
              onChange={handleChange}
              className="mb-4 px-3 py-2 border rounded w-full"
            />
          </>
        )}

        {form.role === 'recruiter' && (
          <>
            <input
              name="company_name"
              placeholder="Company Name"
              value={form.company_name}
              onChange={handleChange}
              className="mb-4 px-3 py-2 border rounded w-full"
            />
            <input
              name="position"
              placeholder="Position"
              value={form.position}
              onChange={handleChange}
              className="mb-4 px-3 py-2 border rounded w-full"
            />
            <input
              name="website"
              placeholder="Website"
              value={form.website}
              onChange={handleChange}
              className="mb-4 px-3 py-2 border rounded w-full"
            />
          </>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full hover:bg-blue-700"
        >
          Register
        </button>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;