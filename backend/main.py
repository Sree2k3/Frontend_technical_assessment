from typing import Any, Dict, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelineRequest(BaseModel):
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []


def is_directed_acyclic_graph(nodes, edges):
    node_ids = {node.get("id") for node in nodes if node.get("id")}
    adjacency_list = {node_id: [] for node_id in node_ids}
    incoming_edge_counts = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")

        if source not in node_ids or target not in node_ids:
            continue

        adjacency_list[source].append(target)
        incoming_edge_counts[target] += 1

    queue = [node_id for node_id, count in incoming_edge_counts.items() if count == 0]
    visited_count = 0

    while queue:
        current_node = queue.pop(0)
        visited_count += 1

        for next_node in adjacency_list[current_node]:
            incoming_edge_counts[next_node] -= 1

            if incoming_edge_counts[next_node] == 0:
                queue.append(next_node)

    return visited_count == len(node_ids)


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    return {
        'num_nodes': len(pipeline.nodes),
        'num_edges': len(pipeline.edges),
        'is_dag': is_directed_acyclic_graph(pipeline.nodes, pipeline.edges),
    }
