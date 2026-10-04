import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC<{ primaryColor?: string }> = ({ primaryColor = '#0ea5e9' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const velocity = useRef({ x: 0, y: 0 });

  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const touchQuery = window.matchMedia('(pointer: coarse)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setIsTouch(touchQuery.matches);
    setReducedMotion(motionQuery.matches);

    const handleTouchChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);

    touchQuery.addEventListener('change', handleTouchChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      touchQuery.removeEventListener('change', handleTouchChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (isTouch || reducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      const prevX = mousePos.current.x;
      const prevY = mousePos.current.y;
      
      mousePos.current = { x: e.clientX, y: e.clientY };
      
      velocity.current = {
        x: e.clientX - prevX,
        y: e.clientY - prevY
      };

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        let isInteractive = false;
        let isTextEntry = false;
        try {
          const isButton = !!target.closest('a, button, input[type="submit"], input[type="button"], select, [role="button"], .cursor-pointer, [data-cursor="hover"]');
          const isCard = !!target.closest('.card, .group, header, nav, footer');
          isInteractive = isButton || isCard;
          
          isTextEntry = !!target.closest(
            'input:not([type="submit"]):not([type="button"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]'
          );
        } catch {}

        setIsHovered(isInteractive && !isTextEntry);
        setIsInput(isTextEntry);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    const render = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.22;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.22;
      
      dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.8;
      dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.8;

      const tiltX = Math.max(-25, Math.min(25, -velocity.current.y * 0.8));
      const tiltY = Math.max(-25, Math.min(25, velocity.current.x * 0.8));
      
      velocity.current.x *= 0.85;
      velocity.current.y *= 0.85;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0px) translate(-50%, -50%) perspective(400px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0px) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isTouch, reducedMotion, isVisible, isHovered]);

  if (isTouch || reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none">
      {/* 1. Center Point (Fast moving) */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed top-0 left-0 rounded-full transition-opacity duration-300 ${
          isVisible && !isInput ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: isHovered ? '4px' : '6px',
          height: isHovered ? '4px' : '6px',
          backgroundColor: primaryColor,
          willChange: 'transform',
        }}
      />

      {/* 2. Futuristic 3D Ring (Smaller) */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed top-0 left-0 rounded-full border border-solid transition-all duration-200 ease-out flex items-center justify-center ${
          isVisible && !isInput ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: isHovered ? '40px' : isClicking ? '20px' : '28px',
          height: isHovered ? '40px' : isClicking ? '20px' : '28px',
          borderColor: isHovered ? primaryColor : `${primaryColor}aa`,
          backgroundColor: isHovered ? `${primaryColor}18` : 'transparent',
          boxShadow: isHovered
            ? `0 0 15px ${primaryColor}40, inset 0 0 10px ${primaryColor}20`
            : 'none',
          willChange: 'transform',
        }}
      >
        {/* Futuristic HUD Corner Crosshair Ticks when Hovered */}
        {isHovered && (
          <>
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-2 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
            <span
              className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-2 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
            <span
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-2 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
            <span
              className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-1 w-2 rounded-full"
              style={{ backgroundColor: primaryColor }}
            />
          </>
        )}
      </div>
    </div>
  );
};
