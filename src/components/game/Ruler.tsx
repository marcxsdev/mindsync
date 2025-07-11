"use client";
import { useState, useRef, useCallback } from "react";

interface RulerProps {
  initialPosition?: number;
  width?: number;
  height?: number;
  onChange?: (position: number) => void;
  disabled?: boolean;
}

const Ruler = ({
  initialPosition = 50,
  width = 1046,
  height = 237,
  onChange,
  disabled = false,
}: RulerProps) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(
    (clientX: number) => {
      if (!rulerRef.current) return;

      const { left, width: rulerWidth } =
        rulerRef.current.getBoundingClientRect();
      const offsetX = clientX - left;
      const borderRadius = 40;
      const margin = (borderRadius / rulerWidth) * 100;
      const clampedX = Math.min(
        Math.max(borderRadius, offsetX),
        rulerWidth - borderRadius
      );
      const newPosition =
        ((clampedX - borderRadius) / (rulerWidth - 2 * borderRadius)) * 100;

      setPosition(newPosition);
      onChange?.(newPosition);
    },
    [onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      e.preventDefault();
      setIsDragging(true);
      updatePosition(e.clientX);

      const handleMouseMove = (e: MouseEvent) => {
        updatePosition(e.clientX);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [disabled, updatePosition]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      let newPosition = position;
      const step = 1;

      switch (e.key) {
        case "ArrowLeft":
          newPosition = Math.max(0, position - step);
          break;
        case "ArrowRight":
          newPosition = Math.min(100, position + step);
          break;
        case "Home":
          newPosition = 0;
          break;
        case "End":
          newPosition = 100;
          break;
        default:
          return;
      }

      e.preventDefault();
      setPosition(newPosition);
      onChange?.(newPosition);
    },
    [disabled, position, onChange]
  );

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div
        ref={rulerRef}
        className={`
          relative rounded-[40px] bg-gradient-to-r from-[#1E90FF] via-[#FF7F50] to-[#FF4500]
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${isDragging ? "cursor-grabbing" : ""}
        `}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          overflow: "hidden",
        }}
        onMouseDown={handleMouseDown}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        aria-label="Posição na régua"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <div
          className={`
            absolute top-0 bottom-0 w-[10px] bg-white rounded-full 
            shadow-[0_0_10px_rgba(255,255,255,0.7)]
            transition-transform duration-75 ease-out ${
              isDragging ? "cursor-grabbing" : "cursor-pointer"
            }
          `}
          style={{
            left: `${position}%`,
            transform: "translateX(-50%)",
          }}
        />
      </div>
    </div>
  );
};

export default Ruler;
