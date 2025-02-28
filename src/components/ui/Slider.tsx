'use client';

import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  onChange: (value: [number, number]) => void;
}

export const Slider = ({ min, max, value, step = 1, onChange }: SliderProps) => {
  const [dragging, setDragging] = useState<'min' | 'max' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const thumbMinRef = useRef<HTMLDivElement>(null);
  const thumbMaxRef = useRef<HTMLDivElement>(null);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const getValue = (percentage: number) => {
    const rawValue = ((percentage / 100) * (max - min)) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  };

  const handleMouseDown = (event: React.MouseEvent, handle: 'min' | 'max') => {
    event.preventDefault();
    setDragging(handle);
  };

  const handleTouchStart = (event: React.TouchEvent, handle: 'min' | 'max') => {
    event.preventDefault();
    setDragging(handle);
  };

  const handleMove = (clientX: number) => {
    if (!dragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
    const newValue = getValue(percentage);

    let newValues: [number, number] = [...value] as [number, number];

    if (dragging === 'min') {
      newValues[0] = Math.min(newValue, value[1] - step);
    } else {
      newValues[1] = Math.max(newValue, value[0] + step);
    }

    onChange(newValues);
  };

  const handleMouseMove = (event: MouseEvent) => {
    handleMove(event.clientX);
  };

  const handleTouchMove = (event: TouchEvent) => {
    handleMove(event.touches[0].clientX);
  };

  const handleEnd = () => {
    setDragging(null);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragging, value]);

  const percentageMin = getPercentage(value[0]);
  const percentageMax = getPercentage(value[1]);

  return (
    <div className="relative w-full pt-6 pb-6" ref={sliderRef}>
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-boulangerie-500 rounded-full"
          style={{
            left: `${percentageMin}%`,
            right: `${100 - percentageMax}%`
          }}
        />
      </div>

      <div
        ref={thumbMinRef}
        tabIndex={0}
        role="slider"
        aria-valuenow={value[0]}
        aria-valuemin={min}
        aria-valuemax={value[1]}
        aria-orientation="horizontal"
        onMouseDown={(e) => handleMouseDown(e, 'min')}
        onTouchStart={(e) => handleTouchStart(e, 'min')}
        className={`absolute top-[50%] -translate-y-1/2 -ml-2 w-4 h-4 bg-boulangerie-600 border-2 border-white rounded-full shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-boulangerie-500 focus:ring-offset-2`}
        style={{ left: `${percentageMin}%` }}
      >
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-700">
          {value[0].toFixed(2)}€
        </span>
      </div>

      <div
        ref={thumbMaxRef}
        tabIndex={0}
        role="slider"
        aria-valuenow={value[1]}
        aria-valuemin={value[0]}
        aria-valuemax={max}
        aria-orientation="horizontal"
        onMouseDown={(e) => handleMouseDown(e, 'max')}
        onTouchStart={(e) => handleTouchStart(e, 'max')}
        className={`absolute top-[50%] -translate-y-1/2 -mr-2 w-4 h-4 bg-boulangerie-600 border-2 border-white rounded-full shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-boulangerie-500 focus:ring-offset-2`}
        style={{ left: `${percentageMax}%` }}
      >
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-700">
          {value[1].toFixed(2)}€
        </span>
      </div>
    </div>
  );
};