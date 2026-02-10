'use client';

import { Smile, Briefcase, Users, Heart } from 'lucide-react';

interface ToneSelectorProps {
  onToneSelect: (tone: string) => void;
  selectedTone: string;
}

const tones = [
  { 
    id: 'friendly', 
    name: 'ودّي', 
    icon: Smile, 
    selectedBorder: 'border-blue-500',
    selectedBg: 'bg-blue-50',
    selectedIcon: 'text-blue-600',
    selectedText: 'text-blue-700'
  },
  { 
    id: 'professional', 
    name: 'احترافي', 
    icon: Briefcase,
    selectedBorder: 'border-purple-500',
    selectedBg: 'bg-purple-50',
    selectedIcon: 'text-purple-600',
    selectedText: 'text-purple-700'
  },
  { 
    id: 'formal', 
    name: 'رسمي', 
    icon: Users,
    selectedBorder: 'border-gray-500',
    selectedBg: 'bg-gray-50',
    selectedIcon: 'text-gray-600',
    selectedText: 'text-gray-700'
  },
  { 
    id: 'casual', 
    name: 'عفوي', 
    icon: Heart,
    selectedBorder: 'border-pink-500',
    selectedBg: 'bg-pink-50',
    selectedIcon: 'text-pink-600',
    selectedText: 'text-pink-700'
  },
];

export default function ToneSelector({ onToneSelect, selectedTone }: ToneSelectorProps) {
  return (
    <div className="card">
      <h3 className="font-bold text-lg mb-4 text-center">اختر أسلوب الرسالة</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {tones.map((tone) => {
          const Icon = tone.icon;
          const isSelected = selectedTone === tone.id;
          
          return (
            <button
              key={tone.id}
              onClick={() => onToneSelect(tone.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? `${tone.selectedBorder} ${tone.selectedBg} shadow-lg scale-105`
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <Icon 
                className={`w-8 h-8 mx-auto mb-2 ${
                  isSelected ? tone.selectedIcon : 'text-gray-400'
                }`} 
              />
              <span className={`text-sm font-medium ${
                isSelected ? tone.selectedText : 'text-gray-600'
              }`}>
                {tone.name}
              </span>
            </button>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        الأسلوب يؤثر على صياغة الرسائل
      </p>
    </div>
  );
}
