import { FileInput } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
    title="Input"
    info="Accepts external user data and starts the pipeline flow."
    icon={FileInput}
    accent="#22c55e"
      fields={[
        {
          name: 'inputName',
          label: 'Name',
          defaultValue: (nodeId) => nodeId.replace('customInput-', 'input_'),
        },
        {
          name: 'inputType',
          label: 'Type',
          type: 'select',
          defaultValue: 'Text',
          options: ['Text', 'File'],
        },
      ]}
      handles={[
        { type: 'source', position: 'right', id: 'value' },
      ]}
    />
  );
};
