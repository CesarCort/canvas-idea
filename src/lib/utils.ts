import { CustomNode, CustomEdge, NodeType } from '@/types';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get connected input nodes for a given node
 */
export function getInputNodes(
  nodeId: string,
  nodes: CustomNode[],
  edges: CustomEdge[]
): CustomNode[] {
  const inputEdges = edges.filter((edge) => edge.target === nodeId);
  const inputNodeIds = inputEdges.map((edge) => edge.source);
  return nodes.filter((node) => inputNodeIds.includes(node.id));
}

/**
 * Get text content from a node based on its type
 */
export function getNodeText(node: CustomNode): string {
  switch (node.type) {
    case NodeType.TEXT_SOURCE:
      return (node.data as any).text || '';
    case NodeType.ANSWER:
      return (node.data as any).answer || '';
    case NodeType.SUMMARY:
      return (node.data as any).summary || '';
    case NodeType.PITCH:
      return (node.data as any).pitch || '';
    case NodeType.QUESTION:
      return (node.data as any).question || '';
    default:
      return '';
  }
}

/**
 * Validate if a connection is allowed between two node types
 */
export function isValidConnection(
  sourceType: string | undefined,
  targetType: string | undefined
): boolean {
  if (!sourceType || !targetType) return false;

  const validConnections: Record<string, string[]> = {
    [NodeType.TEXT_SOURCE]: [
      NodeType.QUESTION,
      NodeType.SUMMARY,
      NodeType.PITCH,
      NodeType.IMAGES,
    ],
    [NodeType.QUESTION]: [NodeType.ANSWER],
    [NodeType.ANSWER]: [
      NodeType.SUMMARY,
      NodeType.PITCH,
      NodeType.QUESTION,
    ],
    [NodeType.SUMMARY]: [
      NodeType.PITCH,
      NodeType.IMAGES,
      NodeType.QUESTION,
    ],
    [NodeType.PITCH]: [NodeType.IMAGES, NodeType.QUESTION],
    [NodeType.IMAGES]: [],
  };

  return validConnections[sourceType]?.includes(targetType) || false;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
