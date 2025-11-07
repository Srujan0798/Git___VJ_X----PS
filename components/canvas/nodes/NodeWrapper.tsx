import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { AppNodeData } from '../../../types';
import { getThemeStyles, NodeTheme, THEMES } from '../../../utils/themeUtils';
import { useStore } from '../../../store/useStore';
import { PaletteIcon } from '../../icons/Icons';

interface NodeWrapperProps {
    id: string;
    data: AppNodeData;
    icon: React.ReactNode;
    children: React.ReactNode;
    hasTargetHandle?: boolean;
    hasSourceHandle?: boolean;
    headerControls?: React.ReactNode;
    isColorable?: boolean;
}

const themeCycle: NodeTheme[] = ['sky', 'pink', 'green', 'amber', 'violet', 'slate'];

const NodeWrapper: React.FC<NodeWrapperProps> = ({ 
    id, 
    data, 
    icon, 
    children, 
    hasTargetHandle = true, 
    hasSourceHandle = true,
    headerControls,
    isColorable = false,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const updateNodeData = useStore(state => state.updateNodeData);
    const theme = getThemeStyles(data.colorTheme);

    const handleColorCycle = () => {
        const currentTheme = data.colorTheme || 'slate';
        const currentIndex = themeCycle.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themeCycle.length;
        updateNodeData(id, { colorTheme: themeCycle[nextIndex] });
    };

    return (
        <div 
            className={`bg-slate-800 border-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ${theme.borderColor} ${theme.ringColor} ${theme.shadowColor}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`relative flex items-center p-2 rounded-t-md ${theme.headerBg}`}>
                {icon}
                <strong className={`ml-2 ${theme.textColor}`}>{data.title}</strong>
                <div className="flex items-center ml-auto">
                    {isHovered && isColorable && (
                        <button 
                            onClick={handleColorCycle} 
                            className="p-1 rounded-full text-slate-400 hover:bg-slate-600 hover:text-white transition-colors mr-1"
                            aria-label="Cycle node color"
                        >
                            <PaletteIcon />
                        </button>
                    )}
                    {headerControls}
                </div>
            </div>
            {children}
            {hasSourceHandle && <Handle type="source" position={Position.Right} className={`!${theme.handleColor} w-3 h-3`} />}
            {hasTargetHandle && <Handle type="target" position={Position.Left} className="!bg-slate-400 w-3 h-3" />}
        </div>
    );
};

export default NodeWrapper;