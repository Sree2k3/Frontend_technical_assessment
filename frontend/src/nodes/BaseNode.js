import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Handle, Position } from 'reactflow';
import { Info, X } from 'lucide-react';
import { useStore } from '../store';

const positionMap = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

const resolveValue = (value, id) => {
  if (typeof value === 'function') {
    return value(id);
  }

  return value;
};

export const BaseNode = ({
  id,
  data,
  title,
  description,
  info,
  icon: Icon,
  accent,
  fields = [],
  handles = [],
  children,
  width,
}) => {
  const [infoTooltipPosition, setInfoTooltipPosition] = useState(null);
  const updateNodeField = useStore((state) => state.updateNodeField);
  const deleteNode = useStore((state) => state.deleteNode);

  const getFieldValue = (field) => {
    if (data?.[field.name] !== undefined) {
      return data[field.name];
    }

    return resolveValue(field.defaultValue, id) ?? '';
  };

  const handleFieldChange = (fieldName) => (event) => {
    updateNodeField(id, fieldName, event.target.value);
  };

  const nodeStyle = {
    ...(width ? { width } : {}),
    ...(accent ? { '--node-accent': accent } : {}),
  };

  const infoText = info ?? description ?? `${title} node used in the pipeline workflow.`;
  const showInfoTooltip = (event) => {
    const buttonBounds = event.currentTarget.getBoundingClientRect();
    const tooltipHalfWidth = 105;

    setInfoTooltipPosition({
      left: Math.min(
        Math.max(buttonBounds.left + buttonBounds.width / 2, tooltipHalfWidth),
        window.innerWidth - tooltipHalfWidth
      ),
      top: Math.max(buttonBounds.top - 10, 76),
      isDarkMode: Boolean(document.querySelector('.app-shell--dark')),
    });
  };

  const hideInfoTooltip = () => {
    setInfoTooltipPosition(null);
  };

  return (
    <div className="pipeline-node" style={nodeStyle}>
      {handles.map((handle) => (
        <Handle
          key={`${handle.type}-${handle.id}`}
          type={handle.type}
          position={positionMap[handle.position]}
          id={`${id}-${handle.id}`}
          style={handle.style}
        />
      ))}

      <div className="pipeline-node__header">
        {Icon && (
          <span className="pipeline-node__icon">
            <Icon size={15} />
          </span>
        )}
        <span className="pipeline-node__title">{title}</span>
        <div className="pipeline-node__actions">
          <button
            aria-label={`Information about ${title}`}
            className="pipeline-node__action pipeline-node__action--info nodrag"
            onBlur={hideInfoTooltip}
            onFocus={showInfoTooltip}
            onMouseEnter={showInfoTooltip}
            onMouseLeave={hideInfoTooltip}
            type="button"
          >
            <Info size={14} />
          </button>
          <button
            aria-label={`Delete ${title}`}
            className="pipeline-node__action pipeline-node__action--delete nodrag"
            onClick={() => deleteNode(id)}
            type="button"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {description && (
        <p className="pipeline-node__description">{description}</p>
      )}

      {fields.length > 0 && (
        <div className="pipeline-node__fields">
          {fields.map((field) => (
            <label className="pipeline-node__field" key={field.name}>
              <span>{field.label}</span>
              {field.type === 'select' ? (
                <select
                  value={getFieldValue(field)}
                  onChange={handleFieldChange(field.name)}
                >
                  {field.options.map((option) => {
                    const optionValue = option.value ?? option;
                    const optionLabel = option.label ?? option;

                    return (
                      <option key={optionValue} value={optionValue}>
                        {optionLabel}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  type={field.type ?? 'text'}
                  value={getFieldValue(field)}
                  onChange={handleFieldChange(field.name)}
                />
              )}
            </label>
          ))}
        </div>
      )}

      {children}

      {infoTooltipPosition && createPortal(
        <span
          className={`pipeline-node__info-popover pipeline-node__info-popover--portal${infoTooltipPosition.isDarkMode ? ' pipeline-node__info-popover--dark' : ''}`}
          role="tooltip"
          style={{
            left: infoTooltipPosition.left,
            top: infoTooltipPosition.top,
          }}
        >
          {infoText}
        </span>,
        document.body
      )}
    </div>
  );
};
