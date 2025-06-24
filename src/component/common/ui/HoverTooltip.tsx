import React, { useState, useRef } from 'react';

interface HoverTooltipProps {
  children: React.ReactNode;
  items: string[];
  maxVisible?: number;
}

const HoverTooltip = ({
  children,
  items,
  maxVisible = 2,
}: HoverTooltipProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  if (items.length <= maxVisible) {
    return <>{children}</>;
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 280; // Approximate tooltip width
    const tooltipHeight = Math.min(items.length * 25 + 60, 300); // Approximate height with max
    
    let x = rect.left + rect.width / 2 - tooltipWidth / 2;
    let y = rect.bottom + 8;

    // Adjust horizontal position if tooltip goes off screen
    if (x < 8) x = 8;
    if (x + tooltipWidth > window.innerWidth - 8) {
      x = window.innerWidth - tooltipWidth - 8;
    }

    // Adjust vertical position if tooltip goes off screen
    if (y + tooltipHeight > window.innerHeight - 8) {
      y = rect.top - tooltipHeight - 8;
    }

    setTooltipPosition({ x, y });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div className="relative">
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="cursor-help"
        >
          {children}
        </div>
      </div>
      
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="fixed z-[9999] p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl border border-slate-600"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            width: '280px',
            maxHeight: '300px',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="font-medium mb-2 text-slate-200">All items ({items.length}):</div>
          <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700">
            {items.map((item, index) => (
              <div key={index} className="flex items-start gap-2 py-1">
                <span className="w-1 h-1 bg-white rounded-full mt-1.5 flex-shrink-0"></span>
                <span className="text-slate-100 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
       
        </div>
      )}
    </>
  );
};

export default HoverTooltip;