import { AtSign } from 'lucide-react';
import React from 'react';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactSupportModal: React.FC<ContactSupportModalProps> = ({ isOpen, onClose }) => {
  console.log("Modal Open:", isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Contact Support</h2>
        <p>If you have any issues, please reach out to:</p>
        <ul className="mt-2 mb-4 space-y-2">
          <li className="flex items-center space-x-2">
            <AtSign size={16} />
            <span>harrydamian@ecorp.com</span>
          </li>
          <li className="flex items-center space-x-2">
            <AtSign size={16} />
            <span>alfredohernandez@ecorp.com</span>
          </li>
        </ul>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ContactSupportModal;
