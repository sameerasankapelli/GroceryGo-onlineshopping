import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600">Have questions? We'd love to hear from you!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                  <p className="text-gray-600">sameerasankapelli@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                  <p className="text-gray-600">+91 6302347685</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Visit Us</h3>
                  <p className="text-gray-600">Guntur, Andhra Pradesh 522001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
