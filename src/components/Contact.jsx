import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorMsg = data.message ? `${data.step} Error: ${data.message}` : (data.error || 'Something went wrong.');
        setStatus({ type: 'error', message: errorMsg });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to connect to the server.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section bg-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="section-header">
            <h2 className="section-title">
              <span className="gradient-text">Get In Touch</span>
            </h2>
            <div className="section-line"></div>
          </div>

          <div className="contact-container">
            <div className="contact-info glass-panel">
              <h3>Let's talk about everything!</h3>
              <p>Feel free to reach out to me for any inquiries, collaborations, or just to say hi.</p>
              
              <div className="info-items">
                <div className="info-item">
                  <div className="info-icon">
                    <FiMail />
                  </div>
                  <div>
                    <h4>Email</h4>
                    <span>vaibhav2176a@gmail.com</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <FiPhone />
                  </div>
                  <div>
                    <h4>Phone</h4>
                    <span>+91 7024057876</span>
                  </div>
                </div>
                
                <div className="info-item">
                  <div className="info-icon">
                    <FiMapPin />
                  </div>
                  <div>
                    <h4>Location</h4>
                    <span>Bhopal, India</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-wrapper glass-panel">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-control font-mono"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-control font-mono"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="form-control resize-none font-mono"
                  ></textarea>
                </div>
                {status.message && (
                  <div className={`form-status ${status.type}`}>
                    {status.message}
                  </div>
                )}
                <button 
                  type="submit" 
                  className={`btn btn-primary submit-btn ${loading ? 'btn-loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'} <FiSend className="btn-icon" />
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
