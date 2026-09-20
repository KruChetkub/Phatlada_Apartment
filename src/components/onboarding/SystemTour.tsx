import React, { useEffect, useState, useRef } from 'react';
import { useSystemTour } from '../../contexts/SystemTourContext';
import { Sparkles, ArrowRight, ArrowLeft, X, Compass, CheckCircle2 } from 'lucide-react';

export const SystemTour: React.FC = () => {
  const {
    isTourOpen,
    currentStepIndex,
    currentStep,
    totalSteps,
    showWelcomeModal,
    startTour,
    closeTour,
    nextStep,
    prevStep,
    skipTour,
    dismissWelcomeModal,
  } = useSystemTour();

  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Update target bounding rect when step changes or on window resize/scroll
  useEffect(() => {
    if (!isTourOpen || !currentStep) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const el = document.querySelector(currentStep.targetSelector);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      } else {
        setTargetRect(null);
      }
    };

    // Immediate update + slight delay for scroll completion
    updateRect();
    const timer = setTimeout(updateRect, 150);

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    const el = document.querySelector(currentStep.targetSelector);
    if (el && 'ResizeObserver' in window) {
      resizeObserverRef.current = new ResizeObserver(updateRect);
      resizeObserverRef.current.observe(el);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [isTourOpen, currentStep, currentStepIndex]);

  // Keyboard navigation (Escape, ArrowRight, ArrowLeft)
  useEffect(() => {
    if (!isTourOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeTour();
      } else if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTourOpen, closeTour, nextStep, prevStep]);

  // 1. Welcome Modal for First-time Users
  if (showWelcomeModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-line text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide">
              ยินดีต้อนรับสู่ Phatlada
            </span>
            <h3 className="text-xl font-bold text-ink">
              ระบบจัดการหอพัก...ให้ง่ายขึ้น
            </h3>
            <p className="text-xs text-ink-secondary leading-relaxed px-2">
              เพื่อความคุ้นเคยในการใช้งาน ขอแนะนำทัวร์ระบบสั้น ๆ ทีละขั้นตอน
              ครอบคลุมตั้งแต่หน้าหลัก ห้องพัก จดมิเตอร์ จนถึงการเงินและการตั้งค่า
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              onClick={startTour}
              className="flex-1 inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02]"
            >
              <Compass className="h-4 w-4" />
              <span>เริ่มทัวร์แนะนำระบบ</span>
            </button>
            <button
              onClick={dismissWelcomeModal}
              className="px-4 py-2.5 bg-bg text-ink-secondary hover:text-ink text-xs font-medium rounded-xl hover:bg-surface border border-line transition"
            >
              ข้ามไปก่อน
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Active Tour Overlay & Tooltip
  if (!isTourOpen || !currentStep) {
    return null;
  }

  // Calculate tooltip placement coordinates
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const cardWidth = Math.min(340, typeof window !== 'undefined' ? window.innerWidth - 32 : 320);

  let tooltipStyle: React.CSSProperties = {};

  if (targetRect && !isMobile) {
    // Desktop: Place tooltip to the right of the target element (or below if tight)
    const top = Math.max(16, Math.min(window.innerHeight - 260, targetRect.top - 10));
    const left = Math.min(window.innerWidth - cardWidth - 20, targetRect.right + 16);
    tooltipStyle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
      zIndex: 60,
    };
  } else {
    // Mobile or element not found: Center at bottom
    tooltipStyle = {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${cardWidth}px`,
      zIndex: 60,
    };
  }

  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto">
      {/* Dark overlay backdrop with click-to-close */}
      <div
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={closeTour}
        aria-hidden="true"
      />

      {/* Target Highlight Cutout Frame */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            top: `${targetRect.top - 4}px`,
            left: `${targetRect.left - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
            zIndex: 55,
          }}
          className="rounded-xl ring-4 ring-primary ring-offset-2 ring-offset-black/50 pointer-events-none transition-all duration-300 shadow-[0_0_25px_rgba(30,58,138,0.5)] animate-pulse"
        />
      )}

      {/* Floating Tour Tooltip Card */}
      <div
        style={tooltipStyle}
        className="bg-white border border-line rounded-2xl p-4 sm:p-5 shadow-2xl transition-all duration-300 animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[11px] font-bold">
              {currentStepIndex + 1}
            </span>
            <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
              ขั้นตอนที่ {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>

          <button
            onClick={skipTour}
            className="rounded-lg p-1 text-ink-muted hover:text-ink hover:bg-bg transition"
            title="ข้ามทัวร์ทั้งหมด"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <h4 className="text-sm font-bold text-ink mb-1.5">{currentStep.title}</h4>
        <p className="text-xs text-ink-secondary leading-relaxed mb-4">
          {currentStep.description}
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-line/60">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className={`inline-flex items-center space-x-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition ${
              currentStepIndex === 0
                ? 'opacity-30 cursor-not-allowed text-ink-muted'
                : 'text-ink-secondary hover:text-ink hover:bg-bg'
            }`}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>ย้อนกลับ</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={skipTour}
              className="text-[11px] text-ink-muted hover:text-ink transition px-1.5 py-1"
            >
              ข้าม
            </button>
            <button
              onClick={nextStep}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition hover:scale-105"
            >
              {isLastStep ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>เข้าใจแล้ว / เริ่มใช้งาน</span>
                </>
              ) : (
                <>
                  <span>ถัดไป</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

