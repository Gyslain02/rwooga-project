// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import '@google/model-viewer';

interface ThreeDViewerProps {
  src: string;
  poster?: string;
  alt: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  src,
  poster,
  alt,
  autoRotate = true,
  cameraControls = true,
  className = '',
  style
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleLoad = () => setLoading(false);
    const handleError = () => {
      setLoading(false);
      setError(true);
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
    };
  }, [src]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-2xl ${className}`} style={style}>
        <div className="text-center p-4">
          <p className="text-gray-500 font-medium">3D Model Unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`} style={style}>
      {/* @ts-ignore */}
      <model-viewer
        ref={viewerRef}
        src={src}
        poster={poster}
        alt={alt}
        camera-controls={cameraControls}
        auto-rotate={autoRotate}
        shadow-intensity="1"
        exposure="1"
        camera-orbit="0deg 75deg 105%"
        field-of-view="30deg" // Flatter, more product-photo like look
        loading="eager"
        style={{ width: '100%', height: '100%', '--poster-color': 'transparent' } as React.CSSProperties}
      >
        <div slot="poster" className="absolute inset-0 flex items-center justify-center">
          {loading && (
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          )}
        </div>
      </model-viewer>
    </div>
  );
};

export default ThreeDViewer;
