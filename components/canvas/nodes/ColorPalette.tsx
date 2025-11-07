import React from 'react';
import { useStore } from '../../../store/useStore';
import { NodeTheme } from '../../../utils/themeUtils';

const COLORS: { theme: NodeTheme, className: string }[] = [
    { theme: 'sky', className: 'bg-sky-500' },
    { theme: 'pink', className: 'bg-pink-500' },
    { theme: 'green', className: 'bg-emerald-500' },
    { theme: 'amber', className: 'bg-amber-500' },
    { theme: 'violet', className: 'bg-violet-500' },
];

interface ColorPaletteProps {
    nodeId: string;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ nodeId }) => {
    const updateNodeData = useStore(state => state.updateNodeData);

    const handleColorChange = (newTheme: NodeTheme) => {
        updateNodeData(nodeId, { colorTheme: newTheme });
    };
    
    return (
        <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center space-x-1.5 bg-slate-900/70 p-1 rounded-full">
            {COLORS.map(({ theme, className }) => (
                <button
                    key={theme}
                    onClick={() => handleColorChange(theme)}
                    className={`w-3.5 h-3.5 rounded-full ${className} hover:scale-125 transition-transform duration-150`}
                    aria-label={`Change theme to ${theme}`}
                />
            ))}
        </div>
    );
};

export default ColorPalette;
