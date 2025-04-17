import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddRoleModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newRole: { name: string; description: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleAddRole: (e: React.FormEvent) => void;
  handleUpdateRole: (e: React.FormEvent) => void; 
  mode: 'add' | 'edit';
  triggerButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpen,
  setIsOpen,
  newRole,
  handleInputChange,
  handleAddRole,
  handleUpdateRole,
  mode,
  triggerButtonRef,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const button = triggerButtonRef.current;
      if (button) {
        const buttonRect = button.getBoundingClientRect();
        const modal = modalRef.current;
  
        if (modal) {
          modal.style.position = 'fixed';
          modal.style.left = `${buttonRect.left}px`;
          modal.style.top = `${buttonRect.top}px`;
          modal.style.width = `${buttonRect.width}px`;
          modal.style.height = `${buttonRect.height}px`;
          modal.style.transformOrigin = 'top right';
          modal.style.opacity = '0';
  
          setIsVisible(true);
  
          // Delay một chút để modal có thể hiển thị trước khi animation
          setTimeout(() => {
            modal.style.transition = 'all 0.3s ease-out';
            modal.style.left = '50%';
            modal.style.top = '50%';
            modal.style.transform = 'translate(-50%, -50%)'; // Trung tâm modal giữa màn hình
            modal.style.width = '100%';
            modal.style.maxWidth = '28rem';
            modal.style.height = 'auto';
            modal.style.minHeight = '20rem';
            modal.style.opacity = '1'; // Làm modal hiển thị
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
      {/* Modal content */}
      <div
        ref={modalRef}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in border border-gray-300">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {mode === 'edit' ? 'Chỉnh sửa Vai Trò' : 'Thêm Vai Trò Mới'}
          </h2>
          <form onSubmit={mode === 'edit' ? handleUpdateRole : handleAddRole}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên Vai Trò
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={newRole.name}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Mô Tả Vai Trò
              </label>
              <Input
                type="text"
                id="description"
                name="description"
                value={newRole.description}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" onClick={() => setIsOpen(false)} variant="outline" className="px-4 py-2">
                Hủy
              </Button>
              <Button type="submit" className="px-4 py-2">
                {mode === 'edit' ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddRoleModal;