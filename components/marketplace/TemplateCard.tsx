import React, { useState } from 'react';
import { Template } from '../../services/templateService';
import { StarIcon } from '../icons/Icons';
import TemplatePreviewModal from './TemplatePreviewModal';
import { useWeb3Store } from '../../hooks/useWeb3';
import { useStore } from '../../store/useStore';
import { useViewStore } from '../../store/useViewStore';
import { templateService } from '../../services/templateService';
import { analyticsService } from '../../services/analyticsService';

const TemplateCard: React.FC<{ template: Template }> = ({ template }) => {
  const [showPreview, setShowPreview] = useState(false);
  const { setWorkspace, triggerFitView } = useStore(state => ({ setWorkspace: state.setWorkspace, triggerFitView: state.triggerFitView }));
  const { navigateToWorkspace } = useViewStore();
  const { authToken, account } = useWeb3Store(state => ({ authToken: state.authToken, account: state.account }));

  const handleUseTemplate = async (templateId: string) => {
    if (!authToken || !account) return;
    try {
        const structure = await templateService.useTemplate(authToken, templateId);
        setWorkspace(structure.nodes, structure.edges);
        analyticsService.trackTemplateUsed(template.id, template.name);
        triggerFitView();
        navigateToWorkspace(templateId);
    } catch (err) {
        console.error("Failed to use template", err);
    }
  };

  return (
    <>
      <div className="bg-slate-800/50 rounded-lg shadow-lg hover:shadow-sky-500/10 border border-slate-700/50 hover:border-sky-500 transition-all duration-300 overflow-hidden group flex flex-col">
        <div 
          className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden cursor-pointer"
          onClick={() => setShowPreview(true)}
        >
          {template.is_featured && (
            <div className="absolute top-2 right-2 bg-amber-500 text-slate-900 px-2 py-0.5 rounded-full text-xs font-semibold flex items-center">
              <StarIcon /> <span className="ml-1">Featured</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
              Preview Template
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-base text-slate-100 flex-1 group-hover:text-sky-400">
              {template.name}
            </h3>
            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full ml-2">
              {template.category}
            </span>
          </div>
          <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-grow">
            {template.description}
          </p>
          <div className="flex items-center justify-between text-sm text-slate-400 mb-4 border-t border-slate-700 pt-3">
            <div className="flex items-center space-x-3">
                <div className="flex items-center"><StarIcon /><span className="ml-1 font-medium">{template.rating}</span></div>
                <div className="flex items-center"><span className="text-xs">Downloads:</span><span className="ml-1 font-medium">{template.downloads}</span></div>
            </div>
            <span className="text-xs font-mono">
              {template.node_count} nodes
            </span>
          </div>
          <button
            onClick={() => handleUseTemplate(template.id)}
            className="w-full bg-sky-600/80 text-white py-2 rounded-lg hover:bg-sky-600 transition-colors font-medium text-sm"
          >
            Use This Template
          </button>
        </div>
      </div>

      {showPreview && (
        <TemplatePreviewModal
          template={template}
          onClose={() => setShowPreview(false)}
          onUse={handleUseTemplate}
        />
      )}
    </>
  );
};

export default TemplateCard;
