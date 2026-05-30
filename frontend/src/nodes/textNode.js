import { useEffect, useMemo } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import { Type } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

const DEFAULT_TEXT = '{{input}}';
const MIN_NODE_WIDTH = 220;
const MAX_NODE_WIDTH = 480;
const MIN_TEXTAREA_HEIGHT = 70;
const MAX_TEXTAREA_HEIGHT = 260;
const VARIABLE_PATTERN = /{{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*}}/g;
const RESERVED_WORDS = new Set([
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'export',
  'extends',
  'finally',
  'for',
  'function',
  'if',
  'import',
  'in',
  'instanceof',
  'let',
  'new',
  'return',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
]);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getTextDimensions = (text) => {
  const lines = text.split('\n');
  const longestLineLength = Math.max(...lines.map((line) => line.length), 1);
  const width = clamp(longestLineLength * 7 + 78, MIN_NODE_WIDTH, MAX_NODE_WIDTH);
  const charactersPerLine = Math.max(Math.floor((width - 40) / 7), 1);
  const visualLineCount = lines.reduce((count, line) => {
    return count + Math.max(Math.ceil(line.length / charactersPerLine), 1);
  }, 0);
  const textareaHeight = clamp(
    visualLineCount * 22 + 28,
    MIN_TEXTAREA_HEIGHT,
    MAX_TEXTAREA_HEIGHT
  );

  return { width, textareaHeight };
};

const getVariableNames = (text) => {
  const variableNames = new Set();
  const matches = text.matchAll(VARIABLE_PATTERN);

  for (const match of matches) {
    const variableName = match[1];

    if (!RESERVED_WORDS.has(variableName)) {
      variableNames.add(variableName);
    }
  }

  return Array.from(variableNames);
};

const getVariableHandleTop = (index, total) => {
  if (total === 1) {
    return '58%';
  }

  const start = 42;
  const end = 82;
  const top = start + ((end - start) * index) / (total - 1);

  return `${top}%`;
};

export const TextNode = ({ id, data }) => {
  const updateNodeInternals = useUpdateNodeInternals();
  const updateNodeField = useStore((state) => state.updateNodeField);
  const text = data?.text ?? DEFAULT_TEXT;
  const { width, textareaHeight } = useMemo(() => getTextDimensions(text), [text]);
  const variableNames = useMemo(() => getVariableNames(text), [text]);
  const variableKey = variableNames.join('|');
  const handles = useMemo(() => {
    const variableHandles = variableNames.map((variableName, index) => ({
      type: 'target',
      position: 'left',
      id: `variable-${variableName}`,
      style: { top: getVariableHandleTop(index, variableNames.length) },
    }));

    return [
      ...variableHandles,
      { type: 'source', position: 'right', id: 'output' },
    ];
  }, [variableNames]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [id, updateNodeInternals, variableKey]);

  const handleTextChange = (event) => {
    updateNodeField(id, 'text', event.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      info="Stores reusable text or prompt content for the workflow."
      icon={Type}
      accent="#0ea5e9"
      width={width}
      handles={handles}
    >
      <label className="text-node-editor">
        <span>Text</span>
        <textarea
          className="text-node-editor__textarea nodrag nowheel"
          onChange={handleTextChange}
          style={{ height: textareaHeight }}
          value={text}
        />
      </label>
      {variableNames.length > 0 && (
        <div className="text-node-variables">
          <span>Variables</span>
          <div className="text-node-variables__list">
            {variableNames.map((variableName) => (
              <span className="text-node-variables__chip" key={variableName}>
                {variableName}
              </span>
            ))}
          </div>
        </div>
      )}
    </BaseNode>
  );
};
