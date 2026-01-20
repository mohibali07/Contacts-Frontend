import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Calendar, User, Phone, Mail, MapPin, CreditCard, ChevronLeft } from 'lucide-react';
import { COUNTRIES, STATES, CITIES } from '../../utils/mockData';

const ContactForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: 'Mr.',
    first_name: '',
    last_name: '',
    gender: 'Male',
    cnic: '',
    dob_solar: '',
    email: '',
    phone: '',
    is_whatsapp: false,
    country_id: '',
    state_id: '',
    city_id: '',
    address: '',
  });

  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (formData.country_id) {
      setAvailableStates(STATES[formData.country_id] || []);
      setAvailableCities([]);
    } else {
      setAvailableStates([]);
      setAvailableCities([]);
    }
  }, [formData.country_id]);

  useEffect(() => {
    if (formData.state_id) {
      setAvailableCities(CITIES[formData.state_id] || []);
    } else {
      setAvailableCities([]);
    }
  }, [formData.state_id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCNICChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 13) value = value.slice(0, 13);
    if (value.length > 12) {
      value = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12)}`;
    } else if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    setFormData(prev => ({ ...prev, cnic: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setTimeout(() => {
      navigate('/contacts');
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/contacts')}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Contact' : 'Add Contact'}</h1>
            <p className="text-gray-500 text-sm">Create a new contact profile</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/contacts')}
            className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-black font-medium transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Profile
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Personal Info Card */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <User className="h-4 w-4" />
            </div>
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Title</label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
              >
                <option>Mr.</option>
                <option>Ms.</option>
                <option>Mrs.</option>
                <option>Dr.</option>
              </select>
            </div>
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
                placeholder="e.g. Ali"
                required
              />
            </div>
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
                placeholder="e.g. Khan"
                required
              />
            </div>
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">CNIC</label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleCNICChange}
                className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
                placeholder="35202-1234567-1"
                maxLength={15}
              />
            </div>
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob_solar"
                value={formData.dob_solar}
                onChange={handleChange}
                className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Info Card */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <Phone className="h-4 w-4" />
              </div>
              Contact Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="space-y-3">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
                    placeholder="+92 300 1234567"
                  />
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      name="is_whatsapp"
                      checked={formData.is_whatsapp}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-black focus:ring-black border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">This number is on WhatsApp</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-3xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <MapPin className="h-4 w-4" />
              </div>
              Location
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Country</label>
                  <select
                    name="country_id"
                    value={formData.country_id}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
                  >
                    <option value="">Select...</option>
                    {COUNTRIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">State</label>
                  <select
                    name="state_id"
                    value={formData.state_id}
                    onChange={handleChange}
                    className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
                    disabled={!formData.country_id}
                  >
                    <option value="">Select...</option>
                    {availableStates.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">City</label>
                <select
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
                  disabled={!formData.state_id}
                >
                  <option value="">Select...</option>
                  {availableCities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Street Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all py-3"
                  placeholder="House #, Street, Block..."
                />
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default ContactForm;
