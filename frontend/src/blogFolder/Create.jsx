import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Backend Base URL (Render)
const API = "https://blogging-app-d14y.onrender.com";

const styles = {
  page: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#1a1a1a',
    color: '#f0f0f0',
    minHeight: '100vh',
    padding: '2rem',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#242424',
    padding: '2rem 3rem',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #333',
    paddingBottom: '1.5rem',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    color: '#00aaff',
    margin: 0,
  },
  backLink: {
    color: '#888',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontSize: '1rem',
    color: '#ccc',
  },
  input: {
    backgroundColor: '#333',
    border: '1px solid #444',
    color: '#f0f0f0',
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  textarea: {
    minHeight: '250px',
    resize: 'vertical',
  },
  button: {
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    backgroundColor: '#00aaff',
    color: '#1a1a1a',
    alignSelf: 'flex-start',
  }
};

const Create = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    image: '',
    content: ''
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/blog/create`,
        formData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success("Blog published successfully! ✨");
        setTimeout(() => navigate('/homeblog'), 2000);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />

      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Create Your Masterpiece</h1>
          <Link 
            to="/homeblog" 
            style={styles.backLink}
            onMouseOver={e => e.target.style.color = '#fff'}
            onMouseOut={e => e.target.style.color = '#888'}
          >
            ← Back to Dashboard
          </Link>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Catchy Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., My Journey with MERN Stack"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Quick Summary</label>
            <input
              type="text"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              style={styles.input}
              placeholder="Short summary"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Cover Image URL</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your Story</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              style={{ ...styles.input, ...styles.textarea }}
              placeholder="Write your blog content here..."
              required
            ></textarea>
          </div>

          <button 
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
