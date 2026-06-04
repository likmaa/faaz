import React from 'react';

export default function Card({ children, className = '', hover = true }) {
  return (
    <div className={`bg-white rounded-lg border shadow-sm overflow-hidden ${hover ? 'hover:shadow-md transition-shadow' : ''} ${className}`}>
      {children}
    </div>
  );
}

Card.Image = function CardImage({ src, alt = '', className = '' }) {
  return (
    <div className={`w-full aspect-video bg-gray-200 overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

Card.Body = function CardBody({ children, className = '' }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

Card.Title = function CardTitle({ children, className = '' }) {
  return <h3 className={`font-semibold text-lg mb-2 ${className}`}>{children}</h3>;
};

Card.Text = function CardText({ children, className = '', lines = 3 }) {
  return <p className={`text-sm text-gray-600 line-clamp-${lines} ${className}`}>{children}</p>;
};

Card.Footer = function CardFooter({ children, className = '' }) {
  return <div className={`px-4 py-3 bg-gray-50 border-t ${className}`}>{children}</div>;
};
