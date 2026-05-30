import {
  Database,
  Filter,
  GitBranch,
  Globe2,
  Shuffle,
} from 'lucide-react';
import { BaseNode } from './BaseNode';

export const inputNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Input"
    info="Accepts external user data and starts the pipeline flow."
    accent="#22c55e"
    fields={[
      {
        name: 'label',
        label: 'Label',
        defaultValue: 'Input Data',
      },
    ]}
    handles={[{ type: 'source', position: 'right', id: 'output' }]}
  />
)


export const FilterNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Filter"
    info="Filters incoming records based on a condition."
    icon={Filter}
    accent="#14b8a6"
    fields={[
      {
        name: 'condition',
        label: 'Condition',
        defaultValue: 'status === "active"',
      },
    ]}
    handles={[
      { type: 'target', position: 'left', id: 'input' },
      { type: 'source', position: 'right', id: 'filtered' },
    ]}
  />
);

export const TransformNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Transform"
    info="Changes incoming data by summarizing, normalizing, or extracting fields."
    icon={Shuffle}
    accent="#6366f1"
    fields={[
      {
        name: 'operation',
        label: 'Operation',
        type: 'select',
        defaultValue: 'Summarize',
        options: ['Summarize', 'Normalize', 'Extract'],
      },
    ]}
    handles={[
      { type: 'target', position: 'left', id: 'input' },
      { type: 'source', position: 'right', id: 'output' },
    ]}
  />
);

export const ApiRequestNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="API Request"
    info="Calls an external API and passes the response to the next node."
    icon={Globe2}
    accent="#06b6d4"
    width={300}
    fields={[
      {
        name: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: 'GET',
        options: ['GET', 'POST', 'PUT', 'DELETE'],
      },
      {
        name: 'url',
        label: 'URL',
        defaultValue: 'https://api.example.com',
      },
    ]}
    handles={[
      { type: 'target', position: 'left', id: 'payload' },
      { type: 'source', position: 'right', id: 'response' },
    ]}
  />
);

export const ConditionNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Condition"
    info="Splits the workflow into true and false paths based on a rule."
    icon={GitBranch}
    accent="#eab308"
    fields={[
      {
        name: 'rule',
        label: 'Rule',
        defaultValue: 'score > 0.8',
      },
    ]}
    handles={[
      { type: 'target', position: 'left', id: 'input' },
      { type: 'source', position: 'right', id: 'true', style: { top: '35%' } },
      { type: 'source', position: 'right', id: 'false', style: { top: '70%' } },
    ]}
  />
);

export const DatabaseNode = ({ id, data }) => (
  <BaseNode
    id={id}
    data={data}
    title="Database"
    info="Reads or writes records from a selected database table."
    icon={Database}
    accent="#f43f5e"
    fields={[
      {
        name: 'collection',
        label: 'Table',
        defaultValue: 'customers',
      },
      {
        name: 'action',
        label: 'Action',
        type: 'select',
        defaultValue: 'Read',
        options: ['Read', 'Insert', 'Update'],
      },
    ]}
    handles={[
      { type: 'target', position: 'left', id: 'query' },
      { type: 'source', position: 'right', id: 'records' },
    ]}
  />
);
