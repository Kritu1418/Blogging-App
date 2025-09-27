import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Sundar design ke liye inline styles
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
    alignSelf: 'flex-start', // Button ko left mein rakhega
  }
};

const Create = () => {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    image: '', // Image URL ke liye
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
      // Backend ke /blog/create route par data bhej rahe hain
      const response = await axios.post('http://localhost:5000/blog/create', formData, {
        withCredentials: true // Ye login token bhejne ke liye zaroori hai
      });

      if (response.status === 201) {
        toast.success("Blog published successfully! ✨");
        // 2 second baad dashboard par wapas bhej do
        setTimeout(() => {
          navigate('/homeblog');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
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
          <Link to="/homeblog" style={styles.backLink} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = '#888'}>
            ← Back to Dashboard
          </Link>
        </header>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="title" style={styles.label}>Catchy Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., My Journey with MERN Stack"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="summary" style={styles.label}>Quick Summary</label>
            <input
              type="text"
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              style={styles.input}
              placeholder="A short, exciting summary of your blog"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="image" style={styles.label}>Cover Image URL</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              style={styles.input}
              placeholder="https://example.com/image.png"
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="content" style={styles.label}>Your Story</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              style={{...styles.input, ...styles.textarea}}
              placeholder="Write your blog content here..."
              required
            ></textarea>
          </div>
          <button type="submit" disabled={loading} style={styles.button}
                  onMouseOver={e => e.target.style.opacity = 0.8}
                  onMouseOut={e => e.target.style.opacity = 1}>
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
