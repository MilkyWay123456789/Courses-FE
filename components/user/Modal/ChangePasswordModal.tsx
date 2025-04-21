import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { changePassword } from '@/service/user.service';

interface ChangePasswordModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  newUser: { name: string; email: string; password: string; role: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleChangePassword: (e: React.FormEvent) => void;
  triggerButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  setIsOpen,
  newUser,
  handleInputChange,
  handleChangePassword,
  triggerButtonRef,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const button = triggerButtonRef.current;
      const modal = modalRef.current;

      if (button && modal) {
        const buttonRect = button.getBoundingClientRect();
        modal.style.position = 'fixed';
        modal.style.left = `${buttonRect.left}px`;
        modal.style.top = `${buttonRect.top}px`;
        modal.style.width = `${buttonRect.width}px`;
        modal.style.height = `${buttonRect.height}px`;
        modal.style.transformOrigin = 'top right';
        modal.style.opacity = '0';

        setIsVisible(true);

        setTimeout(() => {
          modal.style.transition = 'all 0.3s ease-out';
          modal.style.left = '50%';
          modal.style.top = '50%';
          modal.style.transform = 'translate(-50%, -50%)';
          modal.style.width = '100%';
          modal.style.maxWidth = '28rem';
          modal.style.height = 'auto';
          modal.style.minHeight = '20rem';
          modal.style.opacity = '1';
        }, 10);
      }
    } else {
      const modal = modalRef.current;
      const button = triggerButtonRef.current;

      if (modal && button) {
        const buttonRect = button.getBoundingClientRect();
        modal.style.transition = 'all 0.3s ease-in';
        modal.style.left = `${buttonRect.left}px`;
        modal.style.top = `${buttonRect.top}px`;
        modal.style.width = `${buttonRect.width}px`;
        modal.style.height = `${buttonRect.height}px`;

        setTimeout(() => setIsVisible(false), 300);
      }
    }
  }, [isOpen, triggerButtonRef]);

  if (!isVisible && !isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fade-in border border-gray-300">
        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Cập nhật user
        </h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Tên người dùng
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              value={newUser.name}
              onChange={handleInputChange}
              className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="text"
              id="email"
              name="email"
              value={newUser.email}
              onChange={handleInputChange}
              className="w-full bg-gray-100 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
              Mật khẩu
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-800 mb-2">
              Mật khẩu mới
            </label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" onClick={() => setIsOpen(false)} variant="outline" className="px-4 py-2">
              Hủy
            </Button>
            <Button type="submit" className="px-4 py-2">
              Cập nhật
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
