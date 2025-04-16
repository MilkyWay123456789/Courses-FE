'use client';

import { 
  useState, 
  ReactElement, 
  ReactNode, 
  Children, 
  cloneElement,
  JSXElementConstructor 
} from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: string;
  children: ReactNode;
  onClick?: () => void;
}

export function Select({ value, onValueChange, children, className = '' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Tìm child phù hợp với giá trị được chọn
  const selectedChild = Children.toArray(children).find(
    (child) => {
      const element = child as ReactElement<SelectItemProps, JSXElementConstructor<any>>;
      return element.props.value === value;
    }
  );

  return (
    <div className={`relative ${className}`}>
      <button
        className="w-full border rounded-md px-3 py-2 text-sm text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {(selectedChild as ReactElement<SelectItemProps>)?.props.children || 'Chọn...'}
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          {Children.map(children, (child) => {
            const element = child as ReactElement<SelectItemProps, JSXElementConstructor<any>>;
            return cloneElement(element, {
              onClick: () => {
                onValueChange(element.props.value);
                setIsOpen(false);
              }
            });
          })}
        </div>
      )}
    </div>
  );
}

export function SelectItem({ value, children, onClick }: SelectItemProps) {
  return (
    <div 
      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
}