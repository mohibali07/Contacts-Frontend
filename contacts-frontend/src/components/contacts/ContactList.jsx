import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, SlidersHorizontal } from 'lucide-react';
import ContactCard from './ContactCard';

const MOCK_CONTACTS = [
  {
    id: 1,
    first_name: 'Ali',
    last_name: 'Khan',
    title: 'Mr.',
    email: 'ali.khan@example.com',
    phone: '+92 300 1234567',
    city: 'Lahore',
    country: 'Pakistan',
    designation: 'Senior Developer'
  },
  {
    id: 2,
    first_name: 'Sara',
    last_name: 'Ahmed',
    title: 'Ms.',
    email: 'sara.ahmed@example.com',
    phone: '+92 321 7654321',
    city: 'Karachi',
    country: 'Pakistan',
    designation: 'Product Manager'
  },
  {
    id: 3,
    first_name: 'John',
    last_name: 'Doe',
    title: 'Mr.',
    email: 'john.doe@example.com',
    phone: '+1 555 0123',
    city: 'New York',
    country: 'USA',
    designation: 'Director'
  },
  {
    id: 4,
    first_name: 'Fatima',
    last_name: 'Zahra',
    title: 'Ms.',
    email: 'fatima.z@example.com',
    phone: '+92 333 9876543',
    city: 'Islamabad',
    country: 'Pakistan',
    designation: 'UX Designer'
  },
];

const ContactList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredContacts = MOCK_CONTACTS.filter(contact =>
    contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Contacts</h1>
          <p className="text-gray-500 font-medium">Manage your team and connections</p>
        </div>
        <button
          onClick={() => navigate('/contacts/add')}
          className="bg-gray-900 hover:bg-black text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg shadow-gray-200 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add New Contact
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-xl focus:outline-none focus:bg-gray-50 transition-all text-gray-900 placeholder-gray-400 font-medium"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors">
            <SlidersHorizontal className="h-5 w-5" />
            <span>Sort</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredContacts.map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
      
      {filteredContacts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No contacts found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ContactList;
