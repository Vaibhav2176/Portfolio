import React, { useState } from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSend, 
  FiMessageSquare, 
  FiDownload, 
  FiCopy, 
  FiCheck, 
  FiCheckCircle, 
  FiAlertCircle 
} from 'react-icons/fi';
import { personalInfo } from '../data/portfolioData';
import ContactCanvas3D from './ContactCanvas3D';
import './Contact.css';

/**
 * Contact Component
 * Refined communication terminal matching the portfolio's midnight-blue (#060a14) aesthetic.
 * 
 * Features:
 * - 3D atmospheric transmission node in negative space with ContactCanvas3D
 * - Concise, sophisticated section introduction ("Let's build something meaningful.")
 * - Direct communication channels with 1-click email copy & verified tel: dialing
 * - Live availability status banner ("Replies as soon as possible")
 * - Equal-height dual card architecture with balanced vertical flex layout
 * - Hardened serverless contact form with honeypot spam protection & pre-validation
 * - Strict accessibility compliance (ARIA labels, high contrast, visible focus rings)
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '' // Honeypot field for bot deterrence
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(personalInfo.email);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2500);
      } else {
        // Fallback for browsers or headless contexts lacking clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = personalInfo.email;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2500);
      }
    } catch (_err) {
      // Fallback: allow normal mailto interaction
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    // Client-side pre-validation
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus({ 
        type: 'error', 
        message: 'Please fill in all required fields (name, email, and message).' 
      });
      return;
    }

    if (trimmedName.length < 2) {
      setStatus({ type: 'error', message: 'Name must be at least 2 characters long.' });
      return;
    }

    if (trimmedMessage.length < 10) {
      setStatus({ type: 'error', message: 'Message must be at least 10 characters long.' });
      return;
    }

    setLoading(true);

    // Use relative endpoint by default to work seamlessly on Vercel and local Vite proxy
    const API_URL = import.meta.env.VITE_API_URL || "";
    const endpoint = `${API_URL}/api/contact`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          website: formData.website // Honeypot
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: 'Thank you! Your message was received successfully. I will get back to you promptly.' 
        });
        // Clear inputs on verified success only
        setFormData({ name: '', email: '', message: '', website: '' });
      } else {
        // Show sanitized server error; never clear user input on failure
        const errorMsg = data.error || data.message || 'Failed to deliver message. Please contact via email directly.';
        setStatus({ type: 'error', message: errorMsg });
      }
    } catch (_error) {
      // Network failure or offline; preserve input so user doesn't lose text
      setStatus({ 
        type: 'error', 
        message: `Could not connect to the contact server. Please reach out directly at ${personalInfo.email}` 
      });
    } finally {
      setLoading(false);
    }
  };

  const cleanPhoneLink = `tel:${personalInfo.phone.replace(/[\s()-]/g, '')}`;

  return (
    <section 
      id="contact" 
      className="contact-editorial-section section" 
      aria-label="Contact and Inquiries"
    >
      {/* 3D Atmospheric Background Canvas */}
      <ContactCanvas3D />

      {/* Atmospheric Radial Blooms */}
      <div className="contact-background-blooms" aria-hidden="true">
        <div className="contact-ambient-bloom-left" />
        <div className="contact-ambient-bloom-right" />
      </div>

      <div className="container contact-content-container">
        
        {/* ===================================================================
            SECTION HEADER & INTRODUCTORY COPY
            =================================================================== */}
        <div className="contact-section-header">
          <div className="section-eyebrow-group">
            <span className="eyebrow-label">GET IN TOUCH</span>
            <div className="eyebrow-divider" aria-hidden="true" />
          </div>
          <h2 className="section-title">
            Let's build something meaningful.
          </h2>
          <p className="section-description">
            Open to software engineering opportunities, interesting technical challenges, and meaningful collaborations.
          </p>
        </div>

        <div className="contact-container">
          
          {/* =================================================================
              LEFT COLUMN: DIRECT CHANNELS & TELEMETRY
              ================================================================= */}
          <div className="contact-info card">
            {/* Luminous Top Accent Beam */}
            <div className="contact-card-top-beam beam-cyan" aria-hidden="true" />

            {/* Live Availability Telemetry Badge */}
            <div className="contact-availability-banner">
              <div className="availability-pulse-container" aria-hidden="true">
                <span className="availability-pulse-ring" />
                <span className="availability-pulse-core" />
              </div>
              <div className="availability-text-group">
                <span className="availability-status font-mono">Available for Roles &amp; Collaborations</span>
                <span className="availability-response font-mono text-xs">Replies as soon as possible</span>
              </div>
            </div>

            <div className="contact-info-header">
              <h3 className="contact-card-title font-heading">Direct Channels</h3>
              <p className="contact-card-subtitle">
                Reach out directly via email or telephone, message on WhatsApp for rapid communication, or download my verified resume.
              </p>
            </div>
            
            <div className="info-items">
              
              {/* Email Item with 1-Click Copy Action */}
              <div className="info-item">
                <div className="info-icon icon-accent-cyan" aria-hidden="true">
                  <FiMail />
                </div>
                <div className="info-item-content">
                  <div className="info-item-topline">
                    <h4>Primary Email</h4>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="btn-copy-chip font-mono text-xs"
                      aria-label="Copy email address to clipboard"
                      title="Copy email to clipboard"
                    >
                      {copiedEmail ? (
                        <>
                          <FiCheck className="text-emerald" aria-hidden="true" />
                          <span className="text-emerald">Copied!</span>
                        </>
                      ) : (
                        <>
                          <FiCopy aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <a 
                    href={`mailto:${personalInfo.email}`} 
                    className="info-link font-mono"
                    title={`Send email directly to ${personalInfo.email}`}
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>
              
              {/* Phone with functional tel: link */}
              <div className="info-item">
                <div className="info-icon icon-accent-blue" aria-hidden="true">
                  <FiPhone />
                </div>
                <div className="info-item-content">
                  <h4>Direct Phone</h4>
                  <a 
                    href={cleanPhoneLink}
                    className="info-link font-mono"
                    title={`Call ${personalInfo.phone}`}
                  >
                    {personalInfo.phone}
                  </a>
                </div>
              </div>
              
              {/* Location Item */}
              <div className="info-item">
                <div className="info-icon icon-accent-emerald" aria-hidden="true">
                  <FiMapPin />
                </div>
                <div className="info-item-content">
                  <h4>Engineering Base</h4>
                  <span className="info-text">{personalInfo.location}</span>
                  <span className="info-subtext font-mono text-xs">Open to Remote &amp; Global Relocation</span>
                </div>
              </div>

            </div>

            {/* Quick Action Buttons inside Info Card */}
            <div className="contact-quick-actions">
              <a 
                href={personalInfo.whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary contact-action-btn font-mono"
                aria-label="Open WhatsApp conversation in new tab"
              >
                <FiMessageSquare className="btn-icon text-cyan" aria-hidden="true" /> 
                <span>Chat on WhatsApp</span>
              </a>

              <a 
                href={personalInfo.resumePdf} 
                download="Vaibhav_Amulani_Resume.pdf"
                className="btn btn-secondary contact-action-btn font-mono"
                aria-label="Download Vaibhav Amulani Resume PDF"
              >
                <FiDownload className="btn-icon text-blue" aria-hidden="true" /> 
                <span>Latest Resume (PDF)</span>
              </a>
            </div>
          </div>

          {/* =================================================================
              RIGHT COLUMN: MESSAGE DISPATCH INTERFACE
              ================================================================= */}
          <div className="contact-form-wrapper card">
            {/* Luminous Top Accent Beam */}
            <div className="contact-card-top-beam beam-blue" aria-hidden="true" />

            <div className="form-header-group">
              <div className="form-heading-row">
                <h3 className="form-heading font-heading">Send a Direct Message</h3>
                <span className="security-tag font-mono text-xs">
                  TLS Encrypted
                </span>
              </div>
              <p className="form-subtitle">
                Delivered directly to my primary verified inbox with zero third-party tracking.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              
              {/* Invisible honeypot field for bot spam detection */}
              <div className="visually-hidden" aria-hidden="true">
                <label htmlFor="contact-website">Leave this field blank</label>
                <input
                  id="contact-website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              {/* Input Fields */}
              <div className="form-inputs-grid">
                <div className="form-group">
                  <label htmlFor="contact-name" className="form-label font-mono">
                    Your Name <span className="required-star">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    maxLength={100}
                    required
                    className="form-control"
                    aria-required="true"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email" className="form-label font-mono">
                    Email Address <span className="required-star">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    maxLength={254}
                    required
                    className="form-control"
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="form-group form-message-group">
                <div className="form-label-row">
                  <label htmlFor="contact-message" className="form-label font-mono">
                    Message <span className="required-star">*</span>
                  </label>
                  <span className="char-counter font-mono text-xs">
                    {formData.message.length} / 5000
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell me about the opportunity, project, or technical challenge..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  maxLength={5000}
                  required
                  className="form-control resize-vertical"
                  aria-required="true"
                ></textarea>
              </div>

              {/* Status Alerts */}
              {status.message && (
                <div 
                  className={`form-status ${status.type}`} 
                  role="status" 
                  aria-live="polite"
                >
                  <div className="status-icon-wrapper" aria-hidden="true">
                    {status.type === 'success' ? (
                      <FiCheckCircle className="status-alert-icon" />
                    ) : (
                      <FiAlertCircle className="status-alert-icon" />
                    )}
                  </div>
                  <span className="status-message-text">{status.message}</span>
                </div>
              )}

              {/* Submit Action */}
              <div className="form-actions-row">
                <button 
                  type="submit" 
                  className={`btn btn-primary submit-btn font-mono ${loading ? 'btn-loading' : ''}`}
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? (
                    <>
                      <span className="btn-spinner" aria-hidden="true" />
                      <span>Dispatching Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <FiSend className="btn-icon" aria-hidden="true" />
                    </>
                  )}
                </button>

                <span className="form-security-note font-mono text-xs">
                  Direct dispatch to verified inbox · Anti-spam active
                </span>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
