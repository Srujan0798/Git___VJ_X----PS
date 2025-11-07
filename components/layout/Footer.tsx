import React from 'react';
import { MiniMap, useReactFlow } from 'reactflow';
import { NodeType, AppNode } from '../../types';
import { ZoomInIcon, ZoomOutIcon, FitViewIcon, HelpCircleIcon } from '../icons/Icons';

interface FooterProps {
    collaborationStatus: 'connected' | 'disconnected';
}

const nodeColor = (node: AppNode) => {
    switch(node.type) {
        case NodeType.Database: return '#3B82F6'; // blue-500
        case NodeType.Note: return '#F59E0B'; // amber-500
        case NodeType.LiveFeed: return '#10B981'; // emerald-500
        case NodeType.Chart: return '#8B5CF6'; // violet-500
        case NodeType.AIAnalysis: return '#6B7280'; // slate-500
        case NodeType.Api: return '#6B7280'; // slate-500
        default: return '#64748b';
    }
};

const FooterButton: React.FC<{ onClick?: () => void; children: React.ReactNode; 'aria-label': string }> = ({ onClick, children, 'aria-label': ariaLabel }) => (
    <button
        onClick={onClick}
        className="p-2 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        aria-label={ariaLabel}
    >
        {children}
    </button>
);


const Footer: React.FC<FooterProps> = ({ collaborationStatus }) => {
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    return (
        <footer className="absolute bottom-0 left-0 w-full h-16 bg-slate-900/50 backdrop-blur-md border-t border-slate-700/50 z-20 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2 bg-slate-800/50 rounded-lg p-1">
                <FooterButton onClick={() => zoomIn({ duration: 300 })} aria-label="Zoom In">
                    <ZoomInIcon />
                </FooterButton>
                <FooterButton onClick={() => zoomOut({ duration: 300 })} aria-label="Zoom Out">
                    <ZoomOutIcon />
                </FooterButton>
                 <FooterButton onClick={() => fitView({ duration: 300 })} aria-label="Fit View">
                    <FitViewIcon />
                </FooterButton>
            </div>

            <div className="flex-1 flex justify-center text-sm text-slate-500 capitalize">
                Status: {collaborationStatus}
            </div>

            <div className="flex items-center space-x-2">
                <div className="w-40 h-12 bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700">
                    <MiniMap nodeColor={nodeColor} pannable zoomable />
                </div>
                <FooterButton aria-label="Help">
                    <HelpCircleIcon />
                </FooterButton>
            </div>
        </footer>
    );
};

export default Footer;