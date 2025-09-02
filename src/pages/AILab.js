
/**
 * AI Lab Component
 *
 * This component serves as a container for the AI media analysis features.
 * It provides a consistent UI wrapper around the AIFeatures component with
 * a header that displays the available media types (image, audio, video).
 *
 * The component uses the same styling as the PostForm component to maintain
 * consistency across the application.
 */

import { Image as ImageIcon, Mic, Video, Zap } from 'lucide-react';
import AIFeatures from './AIFeatures';

/**
 * AILab component for media analysis functionality
 * @returns {JSX.Element} The AILab component
 */
const AILab = () => {
  return (
    <div className="overflow-hidden shadow-sm" style={{backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)'}}>
      <div className="w-full">
        {/* Header section with title and media type indicators */}
        <div className="flex items-center justify-between px-6 py-4" style={{borderBottom: '1px solid var(--border-color)'}}>
          {/* Title with lightning bolt icon */}
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-full" style={{backgroundColor: 'var(--text-primary)'}}>
              <Zap className="w-4 h-4" style={{color: 'var(--bg-primary)'}} />
            </div>
            <span className="font-medium" style={{color: 'var(--text-primary)'}}>AI Media Analysis</span>
          </div>

          {/* Media type indicators */}
          <div className="flex items-center gap-4">
            {/* Image type indicator */}
            <div className="flex items-center gap-1.5 text-gray-700 text-xs">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Image</span>
            </div>

            {/* Audio type indicator */}
            <div className="flex items-center gap-1.5 text-gray-700 text-xs">
              <Mic className="w-3.5 h-3.5" />
              <span>Audio</span>
            </div>

            {/* Video type indicator */}
            <div className="flex items-center gap-1.5 text-gray-700 text-xs">
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </div>
          </div>
        </div>

        {/* Main content - AIFeatures component */}
        <div className="w-full">
          <AIFeatures />
        </div>
      </div>
    </div>
  );
};

export default AILab;