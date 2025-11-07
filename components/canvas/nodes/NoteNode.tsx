import React, { useCallback } from 'react';
import { NodeProps } from 'reactflow';
import { StickyNoteIcon } from '../../icons/Icons';
import { AppNode } from '../../../types';
import { useStore } from '../../../store/useStore';
import NodeWrapper from './NodeWrapper';

const NoteNode: React.FC<NodeProps<AppNode['data']>> = ({ id, data }) => {
  const updateNodeData = useStore(state => state.updateNodeData);

  const onChange = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { text: evt.target.value });
  }, [id, updateNodeData]);

  return (
    <NodeWrapper id={id} data={data} icon={<StickyNoteIcon />} isColorable={true}>
      <div className="w-64 p-1">
        <textarea
          defaultValue={data.text}
          onChange={onChange}
          className="w-full h-24 p-2 bg-slate-800 text-slate-200 text-sm rounded-b-md focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
        />
      </div>
    </NodeWrapper>
  );
};

export default React.memo(NoteNode);