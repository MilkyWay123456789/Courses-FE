interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
  
    return (
      <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Xác nhận xóa
        </h3>
        <p className="text-gray-600 mb-6 text-center">
          Bạn có chắc chắn muốn xóa vai trò này không?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
    );
  };
  
  export default ConfirmDeleteModal;
  