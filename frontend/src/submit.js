// submit.js

import { useState } from 'react';
import { CheckCircle2, CircleDot, GitBranch, SendHorizontal, X } from 'lucide-react';
import { useStore } from './store';

export const SubmitButton = ({ pipelineName }) => {
    const [pipelineResult, setPipelineResult] = useState(null);
    const [submitError, setSubmitError] = useState('');
    const nodes = useStore((state) => state.nodes);
    const edges = useStore((state) => state.edges);

    const closeDialog = () => {
        setPipelineResult(null);
        setSubmitError('');
    };

    const handleSubmit = async () => {
        try {
            setSubmitError('');

            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nodes,
                    edges,
                }),
            });

            if (!response.ok) {
                throw new Error('Pipeline parsing request failed.');
            }

            const result = await response.json();
            setPipelineResult(result);
        } catch {
            setSubmitError('Unable to submit pipeline. Please make sure the backend server is running.');
        }
    };

    return (
        <>
            <div className="submit-panel">
                <button className="submit-panel__button" type="button" onClick={handleSubmit}>
                    <SendHorizontal size={16} />
                    Submit
                </button>
            </div>

            {(pipelineResult || submitError) && (
                <div className="pipeline-result-dialog" role="dialog" aria-modal="true" aria-labelledby="pipeline-result-title">
                    <div className="pipeline-result-dialog__card">
                        <button className="pipeline-result-dialog__close" type="button" onClick={closeDialog} aria-label="Close pipeline analysis">
                            <X size={16} />
                        </button>

                        <div className="pipeline-result-dialog__header">
                            <span className="pipeline-result-dialog__icon">
                                <CheckCircle2 size={28} />
                            </span>
                            <div>
                                <span>Pipeline Analysis</span>
                                <h2 id="pipeline-result-title">
                                    {submitError ? 'Submission failed' : `${pipelineName} summary ready`}
                                </h2>
                            </div>
                        </div>

                        {submitError ? (
                            <p className="pipeline-result-dialog__error">{submitError}</p>
                        ) : (
                            <div className="pipeline-result-dialog__stats">
                                <div className="pipeline-result-dialog__stat">
                                    <CircleDot size={18} />
                                    <span>Nodes</span>
                                    <strong>{pipelineResult.num_nodes}</strong>
                                </div>
                                <div className="pipeline-result-dialog__stat">
                                    <GitBranch size={18} />
                                    <span>Edges</span>
                                    <strong>{pipelineResult.num_edges}</strong>
                                </div>
                                <div className="pipeline-result-dialog__stat">
                                    <CheckCircle2 size={18} />
                                    <span>Is DAG</span>
                                    <strong>{pipelineResult.is_dag ? 'Yes' : 'No'}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
