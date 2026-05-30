// draggableNode.js
import { useState } from 'react';

export const DraggableNode = ({ type, label, description, icon: Icon }) => {
    const [tooltipPosition, setTooltipPosition] = useState(null);

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const showTooltip = (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        left: rect.right + 12,
        top: rect.top + rect.height / 2,
      });
    };
  
    return (
      <>
        <div
          className={`draggable-node draggable-node--${type}`}
          data-tooltip={label}
          title={label}
          onMouseEnter={showTooltip}
          onMouseLeave={() => setTooltipPosition(null)}
          onDragStart={(event) => onDragStart(event, type)}
          onDragEnd={(event) => {
            event.target.style.cursor = 'grab';
            setTooltipPosition(null);
          }}
          draggable
        >
          <span className="draggable-node__icon">
            {Icon && <Icon size={18} />}
          </span>
          <span className="draggable-node__copy">
            <strong>{label}</strong>
            {description && <small>{description}</small>}
          </span>
        </div>
        {tooltipPosition && (
          <span
            className="draggable-node-tooltip"
            style={{
              left: tooltipPosition.left,
              top: tooltipPosition.top,
            }}
          >
            {label}
          </span>
        )}
      </>
    );
  };
  
