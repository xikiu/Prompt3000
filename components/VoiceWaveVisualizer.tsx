import React from 'react';

interface VoiceWaveVisualizerProps {
  isRecording: boolean;
  duration?: number;
}

export const VoiceWaveVisualizer: React.FC<VoiceWaveVisualizerProps> = ({ isRecording, duration = 0 }) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800">
      <div className="flex items-center space-x-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isRecording ? 'bg-rose-500 animate-pulse' : 'bg-zinc-600'
          }`}
        />
        <span className="text-xs font-mono font-medium text-zinc-300">
          {isRecording ? `Recording (${formatTime(duration)})` : 'Microphone ready'}
        </span>
      </div>

      <div className="flex items-center space-x-1 h-5">
        {[
          'animate-wave-1',
          'animate-wave-2',
          'animate-wave-3',
          'animate-wave-4',
          'animate-wave-2',
          'animate-wave-3',
          'animate-wave-1',
        ].map((animClass, idx) => (
          <span
            key={idx}
            className={`w-0.5 rounded-full transition-all ${
              isRecording ? `bg-zinc-100 ${animClass}` : 'h-1 bg-zinc-700'
            }`}
            style={{
              height: isRecording ? undefined : '3px',
            }}
          />
        ))}
      </div>
    </div>
  );
};
