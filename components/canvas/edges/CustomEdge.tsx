import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, EdgeProps } from 'reactflow';
import { ThreadData } from '../../../types';

const CustomEdge: React.FC<EdgeProps<ThreadData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const importance = data?.importance || 'normal';
  const isAnimated = data?.animated || false;
  const lineType = data?.lineType || 'solid';

  // Determine edge styling based on importance
  const getEdgeStyle = () => {
    const baseStyle = {
      strokeWidth: 2,
      stroke: '#64748B', // slate-500
      ...style
    };

    switch (importance) {
      case 'critical':
        return {
          ...baseStyle,
          stroke: '#EF4444', // red-500
          strokeWidth: 4,
          filter: 'drop-shadow(0 0 4px #EF4444)'
        };
      case 'high':
        return {
          ...baseStyle,
          stroke: '#F59E0B', // amber-500
          strokeWidth: 3
        };
      case 'low':
        return {
          ...baseStyle,
          stroke: '#475569', // slate-600
          strokeWidth: 1,
          opacity: 0.8
        };
      default: // normal
        return baseStyle;
    }
  };

  const getStrokeDasharray = () => {
    switch (lineType) {
      case 'dotted':
        return '2,4';
      case 'dashed':
        return '10,5';
      default: // solid
        return 'none';
    }
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...getEdgeStyle(),
          strokeDasharray: getStrokeDasharray(),
          animation: isAnimated ? 'dashdraw 0.5s linear infinite' : 'none',
          ...(isAnimated && { strokeDashoffset: 20 })
        }}
      />
      <EdgeLabelRenderer>
        {data?.label && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all'
            }}
            className="nodrag nopan bg-slate-800 text-slate-300 text-xs font-semibold px-2 py-0.5 rounded-md border border-slate-700"
          >
            {data.label}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

export default CustomEdge;