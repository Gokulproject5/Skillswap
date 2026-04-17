import { CgClose } from 'react-icons/cg';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 z-50  flex  items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl mt-22 bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-700">{title}</h1>
          <button onClick={onClose} className="hover:bg-gray-100 text-2xl p-2 text-gray-800 hover:text-red-400 rounded-full transition-colors">
            <CgClose />
          </button>
        </div>
        
        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};


export default Modal