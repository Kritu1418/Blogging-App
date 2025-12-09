import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 🔥 Backend base URL (Render)
const API = "https://blogging-app-d14y.onrender.com";

// UI styles
const styles = {
  dashboard: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#1a1a1a',
    color: '#f0f0f0',
    minHeight: '100vh',
  },
  navbar: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #333',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navBrand: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    color: '#00aaff',
    letterSpacing: '1px',
  },
  navLinks: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  navButton: {
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
  createButton: {
    backgroundColor: '#00aaff',
    color: '#1a1a1a',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: '#ff4d4d',
    border: '1px solid #ff4d4d',
  },
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    borderBottom: '1px solid #333',
    paddingBottom: '1rem',
    marginBottom: '2rem',
  },
  blogGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  blogCard: {
    backgroundColor: '#242424',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
    transition: 'transform 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    padding: '1.5rem',
    flexGrow: 1,
  },
  cardTitle: {
    margin: '0 0 0.75rem 0',
    fontSize: '1.4rem',
    color: '#00aaff',
  },
  cardSummary: {
    color: '#ccc',
    lineHeight: '1.6',
    flexGrow: 1,
  },
  cardFooter: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: '1rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardAuthor: {
    fontSize: '0.9rem',
    color: '#888',
  },
  cardActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
  },
  noBlogs: {
    textAlign: 'center',
    marginTop: '5rem',
    color: '#888',
  }
};

// Icons
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00aaff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff4d4d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔥 Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${API}/blog/all`, {
          withCredentials: true
        });
        setBlogs(response.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        toast.error("Could not fetch your blogs.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // 🔥 Delete blog
  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`${API}/blog/${blogId}`, {
        withCredentials: true
      });

      setBlogs(blogs.filter(blog => blog._id !== blogId));
      toast.success("Blog post deleted successfully!");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Could not delete the blog post.");
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={styles.dashboard}>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />

      <nav style={styles.navbar}>
        <Link to="/homeblog" style={styles.navBrand}>Its Blogs</Link>
        <div style={styles.navLinks}>
          <Link to="/create-blog" style={{...styles.navButton, ...styles.createButton}}>
            + Create Post
          </Link>
          <button onClick={handleLogout} style={{...styles.navButton, ...styles.logoutButton}}>
            Logout
          </button>
        </div>
      </nav>

      <div style={styles.container}>
        <header style={styles.header}>
          <h1>Your Dashboard</h1>
          <p>Manage your creative space.</p>
        </header>

        {loading ? (
          <p style={{textAlign: 'center', fontSize: '1.2rem'}}>Loading your masterpieces...</p>
        ) : blogs.length > 0 ? (
          <div style={styles.blogGrid}>
            {blogs.map(blog => (
              <div key={blog._id} style={styles.blogCard}>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>{blog.title}</h3>
                  <p style={styles.cardSummary}>{blog.summary}</p>
                </div>

                <div style={styles.cardFooter}>
                  <small style={styles.cardAuthor}>By {blog.author?.email || "Unknown"}</small>

                  <div style={styles.cardActions}>
                    <button
                      style={styles.actionButton}
                      onClick={() => navigate(`/edit-blog/${blog._id}`)}
                    >
                      <EditIcon />
                    </button>

                    <button
                      style={styles.actionButton}
                      onClick={() => handleDelete(blog._id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noBlogs}>
            <h2>Your canvas is empty!</h2>
            <p>Click ‘Create Post’ to write your first blog.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
