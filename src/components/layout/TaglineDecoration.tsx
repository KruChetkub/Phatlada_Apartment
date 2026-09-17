import React from 'react';

export const TaglineDecoration: React.FC = () => {
  return (
    <div className="relative mt-3 px-4 pb-2 text-center">
      <p className="font-hand text-[13px] tracking-wide text-white/85 rotate-[-4deg] select-none">
        “ บริหารหอพัก ให้เป็นเรื่องง่าย ด้วยเทคโนโลยี ”
      </p>
      {/* Decorative mountain SVG */}
      <div className="mt-2 flex justify-center opacity-40">
        <svg
          viewBox="0 0 200 40"
          className="h-7 w-auto text-emerald-300 fill-current"
          aria-hidden="true"
        >
          <path d="M0,40 L35,16 L65,30 L105,8 L145,26 L175,14 L200,40 Z" />
          <path d="M20,40 L50,22 L85,34 L125,18 L160,32 L190,20 L200,40 Z" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};

