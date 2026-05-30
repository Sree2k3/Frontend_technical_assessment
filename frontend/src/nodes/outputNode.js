import { FileOutput } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
    title="Output"
    info="Represents the final result returned from the pipeline."
    icon={FileOutput}
      accent="#f97316"
      fields={[
        {
          name: 'outputName',
          label: 'Name',
          defaultValue: (nodeId) => nodeId.replace('customOutput-', 'output_'),
        },
        {
          name: 'outputType',
          label: 'Type',
          type: 'select',
          defaultValue: 'Text',
          options: [
            'Text',
            { value: 'File', label: 'Image' },
          ],
        },
      ]}
      handles={[
        { type: 'target', position: 'left', id: 'value' },
      ]}
    />
  );
};
