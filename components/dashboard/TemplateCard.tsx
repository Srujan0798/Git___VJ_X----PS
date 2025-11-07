import React from 'react';
import { Template } from '../../services/templateService';
import { useStore } from '../../store/useStore';
import { useViewStore } from '../../store/useViewStore';
import { templateService } from '../../services/templateService';
import { useWeb3Store } from '../../hooks/useWeb3';
import { analyticsService } from '../../services/analyticsService';

interface TemplateCardProps {
  template: Template;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
    const { setWorkspace, triggerFitView } = useStore(state => ({ setWorkspace: state.setWorkspace, triggerFitView: state.triggerFitView }));
    const { navigateToWorkspace } = useViewStore();
    const { authToken, account } = useWeb3Store(state => ({ authToken: state.authToken, account: state.account }));

    const handleUseTemplate = async () => {
        if (!authToken || !account) return;
        try {
            const structure = await templateService.useTemplate(authToken, template.id);
            setWorkspace(structure.nodes, structure.edges);
            analyticsService.trackTemplateUsed(template.id, template.name);
            triggerFitView();
            navigateToWorkspace(template.id);
        } catch (err) {
            console.error("Failed to use template", err);
        }
    }

  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg hover:shadow-violet-500/10 border border-slate-700/50 hover:border-violet-500 transition-all p-6 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-slate-200">{template.name}</h3>
        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
          {template.category}
        </span>
      </div>
      <p className="text-sm text-slate-400 mb-4 flex-grow">{template.description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
        <div className="flex items-center">
          {/* Rating can be added if service provides it */}
          {/* <span className="text-yellow-500">★</span>
          <span className="text-sm ml-1 text-slate-300">{template.rating || 'N/A'}</span> */}
          <span className="text-xs text-slate-500">{template.downloads} downloads</span>
        </div>
        <button onClick={handleUseTemplate} className="text-sm font-semibold text-sky-400 hover:text-sky-300">
          Use Template &rarr;
        </button>
      </div>
    </div>
  );
}

export default TemplateCard;
