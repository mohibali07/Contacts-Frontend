import React from 'react';
import { Phone, Mail, MapPin, MoreHorizontal } from 'lucide-react';

const ContactCard = ({ contact }) => {
  return (
    <div className="group bg-white rounded-3xl p-6 border border-gray-100 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:border-gray-200 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-50 mb-4 flex items-center justify-center text-xl font-bold text-gray-900 border-4 border-white shadow-sm group-hover:scale-105 transition-transform duration-300">
          {contact.first_name[0]}{contact.last_name[0]}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          {contact.title} {contact.first_name} {contact.last_name}
        </h3>
        <p className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {contact.designation || 'Team Member'}
        </p>
      </div>

      <div className="space-y-3 pt-6 border-t border-gray-50">
        <div className="flex items-center gap-3 text-sm group/item">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-gray-900 group-hover/item:text-white transition-colors duration-200">
            <Phone className="h-4 w-4" />
          </div>
          <span className="text-gray-600 font-medium">{contact.phone}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm group/item">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-gray-900 group-hover/item:text-white transition-colors duration-200">
            <Mail className="h-4 w-4" />
          </div>
          <span className="text-gray-600 font-medium truncate">{contact.email}</span>
        </div>

        <div className="flex items-center gap-3 text-sm group/item">
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover/item:bg-gray-900 group-hover/item:text-white transition-colors duration-200">
            <MapPin className="h-4 w-4" />
          </div>
          <span className="text-gray-600 font-medium truncate">{contact.city}, {contact.country}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
