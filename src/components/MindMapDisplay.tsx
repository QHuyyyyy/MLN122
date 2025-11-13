import { useMemo } from 'react';
import type {
    Node,
    Edge
} from 'reactflow';
import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

interface MindmapNode {
    id: string;
    name: string;
    children?: MindmapNode[];
}

interface MindmapResponse {
    topic: string;
    nodes: MindmapNode[];
}

interface MindMapDisplayProps {
    data: MindmapResponse | null;
    className?: string;
}

const generateNodesAndEdges = (data: MindmapResponse) => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let nodeId = 0;
    const nodeWidth = 200;
    const verticalSpacing = 180;
    const horizontalSpacing = 250;

    const calculateTreeWidth = (node: MindmapNode): number => {
        if (!node.children || node.children.length === 0) {
            return nodeWidth;
        }
        const childrenWidth = node.children.reduce((sum, child) => {
            return sum + calculateTreeWidth(child);
        }, 0);
        return Math.max(nodeWidth, childrenWidth + (node.children.length - 1) * horizontalSpacing);
    };

    const traverse = (node: MindmapNode, parentId: string | null, level: number, xOffset: number) => {
        const currentNodeId = node.id || `node-${nodeId++}`;
        const yOffset = level * verticalSpacing;

        nodes.push({
            id: currentNodeId,
            data: { label: node.name },
            position: { x: xOffset - nodeWidth / 2, y: yOffset },
            style: {
                background: getNodeColor(level),
                color: '#fff',
                border: '2px solid rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '12px 8px',
                fontSize: '13px',
                fontWeight: '600',
                width: `${nodeWidth}px`,
                height: 'auto',
                minHeight: '60px',
                textAlign: 'center',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        });

        if (parentId) {
            edges.push({
                id: `edge-${parentId}-${currentNodeId}`,
                source: parentId,
                target: currentNodeId,
                animated: true,
                style: { stroke: '#3b82f6', strokeWidth: 2 }
            });
        }

        if (node.children && node.children.length > 0) {
            const childrenWidth = node.children.reduce((sum, child) => {
                return sum + calculateTreeWidth(child);
            }, 0);
            const totalChildWidth = childrenWidth + (node.children.length - 1) * horizontalSpacing;
            const startX = xOffset - totalChildWidth / 2;

            let currentX = startX;
            node.children.forEach((child: MindmapNode) => {
                const childTreeWidth = calculateTreeWidth(child);
                traverse(child, currentNodeId, level + 1, currentX + childTreeWidth / 2);
                currentX += childTreeWidth + horizontalSpacing;
            });
        }
    };

    if (data.nodes && data.nodes.length > 0) {
        traverse(data.nodes[0], null, 0, 0);
    }

    return { nodes, edges };
};

const getNodeColor = (level: number): string => {
    const colors = [
        '#3b82f6', // Blue for root
        '#8b5cf6', // Purple
        '#ec4899', // Pink
        '#f59e0b', // Amber
        '#10b981', // Emerald
        '#06b6d4'  // Cyan
    ];
    return colors[level % colors.length];
};

function MindMapDisplayContent({ data }: { data: MindmapResponse | null }) {
    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => data ? generateNodesAndEdges(data) : { nodes: [], edges: [] },
        [data]
    );

    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, , onEdgesChange] = useEdgesState(initialEdges);

    if (initialNodes.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
                Nhập dữ liệu để tạo mindmap
            </div>
        );
    }

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
        >
            <Background color="#aaa" gap={16} />
            <Controls />
            <MiniMap />
        </ReactFlow>
    );
}

export default function MindMapDisplay({ data, className }: MindMapDisplayProps) {
    return (
        <div className={`w-full h-full relative ${className}`}>
            {data ? (
                <MindMapDisplayContent data={data} />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Nhập dữ liệu để tạo mindmap
                </div>
            )}
        </div>
    );
}
