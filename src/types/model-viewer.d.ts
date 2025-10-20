declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        'ar'?: boolean;
        'ar-modes'?: string;
        'shadow-intensity'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'rotation-per-second'?: string;
        'interaction-prompt'?: string;
        // Add any other specific attributes you use on model-viewer
      };
    }
  }
}

export {}; // This ensures the file is treated as a module