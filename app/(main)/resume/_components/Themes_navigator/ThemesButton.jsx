import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Stars, X, ExternalLink } from 'lucide-react';

const ThemesButton = ({ themesUrl = "https://sensai-themes.vercel.app/" }) => {
  const [showModal, setShowModal] = useState(false);

  const handleExploreThemes = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleOpenInNewTab = () => {
    window.open(themesUrl, '_blank', 'noopener,noreferrer');
    setShowModal(false);
  };

  const handleOpenInSameWindow = () => {
    window.location.href = themesUrl;
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                Craft Smarter Resumes
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Stars className="w-5 h-5 text-purple-400" />
              </div>
            </h3>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            Launch <b>SensAI - THEMES</b> : 
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={handleOpenInNewTab}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-slate-800 via-blue-700 to-blue-500 hover:from-slate-900 hover:via-blue-800 hover:to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-400/20 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <ExternalLink className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Open in New Tab</span>
            </Button>
            
            <Button
              onClick={handleOpenInSameWindow}
              variant="outline"
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 py-3 rounded-lg transition-all duration-200 cursor-pointer"
            >
              Open in Same Window
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleExploreThemes}
      className="flex items-center gap-2 px-6 py-3 text-base font-semibold  relative overflow-hidden group cursor-pointer"
      variant="premium"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-400/20 to-cyan-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <Stars className="w-5 h-5 relative z-10" />
      <span className="relative z-10">Explore THEMES</span>
    </Button>
  );
};

export default ThemesButton;