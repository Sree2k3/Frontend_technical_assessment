import { useState } from 'react';
import { Activity, Check, CircleDot, Edit3, GitBranch, Layers3 } from 'lucide-react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { useStore } from './store';

function App() {
  const [theme, setTheme] = useState('light');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [pipelineName, setPipelineName] = useState('Pipeline canvas');
  const [draftPipelineName, setDraftPipelineName] = useState('Pipeline canvas');
  const [isEditingPipelineName, setIsEditingPipelineName] = useState(false);
  const nodeCount = useStore((state) => state.nodes.length);
  const edgeCount = useStore((state) => state.edges.length);
  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((currentValue) => !currentValue);
  };

  const startEditingPipelineName = () => {
    setDraftPipelineName(pipelineName);
    setIsEditingPipelineName(true);
  };

  const savePipelineName = () => {
    const nextPipelineName = draftPipelineName.trim();

    if (nextPipelineName) {
      setPipelineName(nextPipelineName);
    }

    setIsEditingPipelineName(false);
  };

  const handlePipelineNameKeyDown = (event) => {
    if (event.key === 'Enter') {
      savePipelineName();
    }

    if (event.key === 'Escape') {
      setDraftPipelineName(pipelineName);
      setIsEditingPipelineName(false);
    }
  };

  return (
    <div className={`app-shell app-shell--${theme} ${isSidebarCollapsed ? 'app-shell--sidebar-collapsed' : ''}`}>
      <PipelineToolbar
        isDarkMode={isDarkMode}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleTheme={toggleTheme}
        onToggleSidebar={toggleSidebar}
      />
      <main className="workflow-canvas">
        <header className="workflow-topbar">
          <div className="workflow-topbar__title">
            <span className="workflow-topbar__icon">
              <Layers3 size={18} />
            </span>
            <div className="workflow-topbar__title-copy">
              <span>Workflow Builder</span>
              <div className="workflow-topbar__name-row">
                {isEditingPipelineName ? (
                  <input
                    className="workflow-topbar__name-input"
                    value={draftPipelineName}
                    onBlur={savePipelineName}
                    onChange={(event) => setDraftPipelineName(event.target.value)}
                    onKeyDown={handlePipelineNameKeyDown}
                    autoFocus
                  />
                ) : (
                  <strong>{pipelineName}</strong>
                )}
                <button
                  className="workflow-topbar__edit"
                  type="button"
                  onClick={isEditingPipelineName ? savePipelineName : startEditingPipelineName}
                  aria-label={isEditingPipelineName ? 'Save pipeline name' : 'Rename pipeline'}
                >
                  {isEditingPipelineName ? <Check size={14} /> : <Edit3 size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="workflow-topbar__stats" aria-label="Pipeline summary">
            <span>
              <CircleDot size={14} />
              {nodeCount} nodes
            </span>
            <span>
              <GitBranch size={14} />
              {edgeCount} edges
            </span>
            <span>
              <Activity size={14} />
              Draft
            </span>
          </div>
        </header>
        <PipelineUI isDarkMode={isDarkMode} />
        <SubmitButton pipelineName={pipelineName} />
      </main>
    </div>
  );
}

export default App;
