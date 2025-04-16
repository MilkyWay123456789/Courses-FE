import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddRoleModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newRole: { name: string; description: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddRole: (e: React.FormEvent) => void;
  triggerButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpen,
  setIsOpen,
  newRole,
  handleInputChange,
  handleAddRole,
  triggerButtonRef,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Lấy vị trí và kích thước của button trigger
      const button = triggerButtonRef.current;
      if (button) {
        const buttonRect = button.getBoundingClientRect();
        const modal = modalRef.current;
        
        if (modal) {
          // Thiết lập vị trí ban đầu (trùng với button)
          modal.style.position = 'fixed';
          modal.style.left = `${buttonRect.left}px`;
          modal.style.top = `${buttonRect.top}px`;
          modal.style.width = `${buttonRect.width}px`;
          modal.style.height = `${buttonRect.height}px`;
          modal.style.transformOrigin = 'top left';
          
          // Kích hoạt hiển thị và animation
          setIsVisible(true);
          
          // Delay một chút để đảm bảo CSS áp dụng trước khi animation
          setTimeout(() => {
            modal.style.transition = 'all 0.3s ease-out';
            modal.style.left = '50%';
            modal.style.top = '50%';
            modal.style.transform = 'translate(-50%, -50%)';
            modal.style.width = '100%';
            modal.style.maxWidth = '28rem';
            modal.style.height = 'auto';
            modal.style.minHeight = '20rem';
          }, 10);
        }
      }
    } else {
      const modal = modalRef.current;
      if (modal && triggerButtonRef.current) {
        const buttonRect = triggerButtonRef.current.getBoundingClientRect();
        
        // Thiết lập animation đóng
        modal.style.transition = 'all 0.3s ease-in';
        modal.style.left = `${buttonRect.left}px`;
        modal.style.top = `${buttonRect.top}px`;
        modal.style.width = `${buttonRect.width}px`;
        modal.style.height = `${buttonRect.height}px`;
        
        // Sau khi animation hoàn tất thì ẩn modal
        setTimeout(() => setIsVisible(false), 300);
      }
    }
  }, [isOpen, triggerButtonRef]);

  if (!isVisible && !isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal content */}
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl p-6 overflow-hidden"
        style={{
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Thêm Role mới</h2>
        <form onSubmit={handleAddRole}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên Role
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={newRole.name}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={newRole.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="px-4 py-2"
            >
              Hủy
            </Button>
            <Button type="submit" className="px-4 py-2">
              Thêm
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddRoleModal;