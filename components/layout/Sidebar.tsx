import React from 'react';
import { NodeType } from '../../types';
import { DatabaseIcon, TvIcon, BarChartIcon, StickyNoteIcon, SparklesIcon, ApiIcon, TemplateIcon } from '../icons/Icons';
import { useViewStore } from '../../store/useViewStore';

interface SidebarItemProps {
    type?: NodeType;
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    isDraggable?: boolean;
}

const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
};

const SidebarItem: React.FC<SidebarItemProps> = ({ type, label, icon, onClick, isDraggable = true }) => (
    <div
        className={`flex items-center p-3 mb-3 bg-slate-700/50 rounded-lg ${isDraggable ? 'cursor-grab' : 'cursor-pointer'} hover:bg-sky-500/30 hover:ring-2 hover:ring-sky-500 transition-all duration-200`}
        onDragStart={(event) => isDraggable && type && onDragStart(event, type)}
        draggable={isDraggable}
        onClick={onClick}
    >
        {icon}
        <span className="ml-3 font-medium">{label}</span>
    </div>
);


const Sidebar = () => {
    const { navigateToMarketplace } = useViewStore();

    return (
        <aside className="w-64 p-4 bg-slate-800/60 backdrop-blur-md border-r border-slate-700 z-10 pt-24">
            <h2 className="text-lg font-semibold mb-4 text-slate-300">Add Nodes</h2>
            <SidebarItem type={NodeType.Database} label="Database" icon={<DatabaseIcon />} />
            <SidebarItem type={NodeType.LiveFeed} label="Live Feed" icon={<TvIcon />} />
            <SidebarItem type={NodeType.Chart} label="Chart" icon={<BarChartIcon />} />
            <SidebarItem type={NodeType.Note} label="Note" icon={<StickyNoteIcon />} />
            <SidebarItem type={NodeType.AIAnalysis} label="AI Analysis" icon={<SparklesIcon />} />
            <SidebarItem type={NodeType.Api} label="API Connector" icon={<ApiIcon />} />
            
            <div className="my-4 border-t border-slate-700"></div>

            <h2 className="text-lg font-semibold mb-4 text-slate-300">Library</h2>
            <SidebarItem 
                label="Templates" 
                icon={<TemplateIcon />} 
                isDraggable={false}
                onClick={navigateToMarketplace}
            />
        </aside>
    );
};

export default Sidebar;