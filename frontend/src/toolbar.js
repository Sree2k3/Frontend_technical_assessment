// toolbar.js

import { useState } from 'react';
import {
    Braces,
    ChevronDown,
    Database,
    FileInput,
    FileOutput,
    Filter,
    GitBranch,
    Globe2,
    PanelLeftClose,
    PanelLeftOpen,
    Moon,
    Shuffle,
    Sparkles,
    Sun,
    Type,
} from 'lucide-react';
import { DraggableNode } from './draggableNode';

const nodeGroups = [
    {
        title: 'Core',
        icon: Braces,
        nodes: [
            { type: 'customInput', label: 'Input', description: 'Pipeline entry point', icon: FileInput },
            { type: 'llm', label: 'LLM', description: 'Model processing step', icon: Sparkles },
            { type: 'customOutput', label: 'Output', description: 'Pipeline result target', icon: FileOutput },
            { type: 'text', label: 'Text', description: 'Reusable text prompt', icon: Type },
        ],
    },
    {
        title: 'Logic',
        icon: GitBranch,
        nodes: [
            { type: 'filter', label: 'Filter', description: 'Keep matching data', icon: Filter },
            { type: 'condition', label: 'Condition', description: 'Branch by rule', icon: GitBranch },
        ],
    },
    {
        title: 'Data',
        icon: Database,
        nodes: [
            { type: 'transform', label: 'Transform', description: 'Modify incoming data', icon: Shuffle },
            { type: 'apiRequest', label: 'API Request', description: 'Call an external service', icon: Globe2 },
            { type: 'database', label: 'Database', description: 'Read or write records', icon: Database },
        ],
    },
];

export const PipelineToolbar = ({
    isDarkMode,
    isSidebarCollapsed,
    onToggleTheme,
    onToggleSidebar,
}) => {
    const [openGroups, setOpenGroups] = useState({
        Core: true,
        Logic: true,
        Data: true,
    });

    const toggleGroup = (groupTitle) => {
        setOpenGroups((currentGroups) => ({
            ...currentGroups,
            [groupTitle]: !currentGroups[groupTitle],
        }));
    };

    return (
        <aside className="pipeline-sidebar">
            <div className="pipeline-sidebar__header">
                <div>
                    <span className="pipeline-sidebar__eyebrow">Workflows</span>
                    <h1>Tools</h1>
                </div>
                <div className="pipeline-sidebar__actions">
                    <button
                        className="icon-button"
                        type="button"
                        onClick={onToggleSidebar}
                        aria-label={isSidebarCollapsed ? 'Expand tools sidebar' : 'Collapse tools sidebar'}
                        title={isSidebarCollapsed ? 'Expand tools sidebar' : 'Collapse tools sidebar'}
                    >
                        {isSidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
                    </button>
                    <button
                        className="icon-button"
                        type="button"
                        onClick={onToggleTheme}
                        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
                    </button>
                </div>
            </div>

            <div className="node-palette">
                {nodeGroups.map((group) => {
                    const GroupIcon = group.icon;
                    const isOpen = openGroups[group.title];

                    return (
                        <section className="node-group" key={group.title}>
                            <button
                                className="node-group__toggle"
                                type="button"
                                onClick={() => toggleGroup(group.title)}
                                aria-expanded={isOpen}
                                data-tooltip={group.title}
                            >
                                <span className="node-group__title">
                                    <GroupIcon size={15} />
                                    {group.title}
                                </span>
                                <ChevronDown
                                    className={`node-group__chevron ${isOpen ? 'node-group__chevron--open' : ''}`}
                                    size={16}
                                />
                            </button>

                            <div className={`node-group__items ${isOpen ? 'node-group__items--open' : ''}`}>
                                {group.nodes.map((node) => (
                                    <DraggableNode
                                        key={node.type}
                                        type={node.type}
                                        label={node.label}
                                        description={node.description}
                                        icon={node.icon}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
        </aside>
    );
};
