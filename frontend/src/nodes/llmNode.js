import { Sparkles } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
    title="LLM"
    description="This is a LLM."
    info="Processes incoming data with a language model and returns generated output."
    icon={Sparkles}
      accent="#a855f7"
      handles={[
        { type: 'target', position: 'left', id: 'system', style: { top: `${100 / 3}%` } },
        { type: 'target', position: 'left', id: 'prompt', style: { top: `${200 / 3}%` } },
        { type: 'source', position: 'right', id: 'response' },
      ]}
    />
  );
};
