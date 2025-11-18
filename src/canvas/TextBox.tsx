import React, { useState } from 'react';
import './TextBox.css';

export interface TextBoxData {
  id: string;
  x: number;
  y: number;
  content: string;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
}

interface TextBoxProps {
  data: TextBoxData;
  onUpdate: (id: string, updates: Partial<TextBoxData>) => void;
  onDelete: (id: string) => void;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const TextBox: React.FC<TextBoxProps> = ({ data, onUpdate, onDelete, selected, onSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - data.x,
      y: e.clientY - data.y,
    });
    onSelect(data.id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      onUpdate(data.id, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <div
      className={`text-box ${selected ? 'selected' : ''}`}
      style={{
        left: data.x,
        top: data.y,
      }}
      onMouseDown={handleMouseDown}
      onClick={() => onSelect(data.id)}
    >
      {selected && (
        <div className="text-box-toolbar">
          <select
            value={data.fontSize}
            onChange={(e) => onUpdate(data.id, { fontSize: Number(e.target.value) })}
            onClick={(e) => e.stopPropagation()}
          >
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
            <option value={18}>18px</option>
            <option value={20}>20px</option>
            <option value={24}>24px</option>
            <option value={28}>28px</option>
            <option value={32}>32px</option>
          </select>

          <input
            type="color"
            value={data.color}
            onChange={(e) => onUpdate(data.id, { color: e.target.value })}
            onClick={(e) => e.stopPropagation()}
            title="Text color"
          />

          <button
            className={data.fontWeight === 'bold' ? 'active' : ''}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(data.id, { fontWeight: data.fontWeight === 'bold' ? 'normal' : 'bold' });
            }}
            title="Bold"
          >
            <strong>B</strong>
          </button>

          <button
            className={data.fontStyle === 'italic' ? 'active' : ''}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(data.id, { fontStyle: data.fontStyle === 'italic' ? 'normal' : 'italic' });
            }}
            title="Italic"
          >
            <em>I</em>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(data.id);
            }}
            className="delete"
            title="Delete"
          >
            ✕
          </button>
        </div>
      )}

      <textarea
        value={data.content}
        onChange={(e) => onUpdate(data.id, { content: e.target.value })}
        placeholder="Type your text here..."
        style={{
          fontSize: `${data.fontSize}px`,
          color: data.color,
          fontWeight: data.fontWeight,
          fontStyle: data.fontStyle,
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
