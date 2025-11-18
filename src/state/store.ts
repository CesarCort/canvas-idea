import { create } from 'zustand';
import {
  StoreState,
  CustomNode,
  Board,
  NodeType,
  QuestionNodeData,
  SummaryNodeData,
  PitchNodeData,
  ImagesNodeData,
} from '@/types';
import {
  loadBoards,
  saveBoards,
  loadConfig,
  saveConfig,
  loadCurrentBoardId,
  saveCurrentBoardId,
} from '@/lib/storage';
import { generateText, generateImagePrompt, generateImages, buildContextFromText } from '@/lib/api/openrouter';
import { generateId, getInputNodes, getNodeText } from '@/lib/utils';
import { SYSTEM_PROMPTS } from '@/lib/constants';

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  boards: loadBoards(),
  currentBoardId: loadCurrentBoardId(),
  nodes: [],
  edges: [],
  config: loadConfig(),

  // React Flow actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },

  updateNode: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    }));
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    }));
  },

  addEdge: (edge) => {
    set((state) => ({
      edges: [...state.edges, edge],
    }));
  },

  deleteEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }));
  },

  // Board management
  createBoard: (name) => {
    const newBoard: Board = {
      id: generateId(),
      name,
      nodes: [],
      edges: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedBoards = [...state.boards, newBoard];
      saveBoards(updatedBoards);
      saveCurrentBoardId(newBoard.id);

      return {
        boards: updatedBoards,
        currentBoardId: newBoard.id,
        nodes: [],
        edges: [],
      };
    });
  },

  saveBoard: () => {
    const { currentBoardId, boards, nodes, edges } = get();
    if (!currentBoardId) return;

    const updatedBoards = boards.map((board) =>
      board.id === currentBoardId
        ? {
            ...board,
            nodes,
            edges,
            updatedAt: new Date().toISOString(),
          }
        : board
    );

    saveBoards(updatedBoards);
    set({ boards: updatedBoards });
  },

  loadBoard: (boardId) => {
    const { boards } = get();
    const board = boards.find((b) => b.id === boardId);

    if (board) {
      set({
        currentBoardId: board.id,
        nodes: board.nodes,
        edges: board.edges,
      });
      saveCurrentBoardId(board.id);
    }
  },

  deleteBoard: (boardId) => {
    set((state) => {
      const updatedBoards = state.boards.filter((b) => b.id !== boardId);
      saveBoards(updatedBoards);

      const newCurrentBoardId =
        state.currentBoardId === boardId
          ? updatedBoards[0]?.id || null
          : state.currentBoardId;

      saveCurrentBoardId(newCurrentBoardId);

      return {
        boards: updatedBoards,
        currentBoardId: newCurrentBoardId,
        nodes: newCurrentBoardId
          ? updatedBoards.find((b) => b.id === newCurrentBoardId)?.nodes || []
          : [],
        edges: newCurrentBoardId
          ? updatedBoards.find((b) => b.id === newCurrentBoardId)?.edges || []
          : [],
      };
    });
  },

  renameBoard: (boardId, name) => {
    set((state) => {
      const updatedBoards = state.boards.map((board) =>
        board.id === boardId
          ? { ...board, name, updatedAt: new Date().toISOString() }
          : board
      );
      saveBoards(updatedBoards);
      return { boards: updatedBoards };
    });
  },

  // Config management
  updateConfig: (configUpdate) => {
    set((state) => {
      const newConfig = { ...state.config, ...configUpdate };
      saveConfig(newConfig);
      return { config: newConfig };
    });
  },

  // AI generation actions
  generateAnswer: async (questionNodeId) => {
    const { nodes, edges, config, updateNode } = get();
    const questionNode = nodes.find((n) => n.id === questionNodeId);

    if (!questionNode || questionNode.type !== NodeType.QUESTION) {
      throw new Error('Invalid question node');
    }

    const questionData = questionNode.data as QuestionNodeData;

    // Get input nodes for context
    const inputNodes = getInputNodes(questionNodeId, nodes, edges);
    const context = buildContextFromText(inputNodes.map(getNodeText));

    if (!context) {
      throw new Error('No context available. Please connect a text source node.');
    }

    try {
      updateNode(questionNodeId, { status: 'loading' });

      const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPTS.ANSWER },
        {
          role: 'user' as const,
          content: `Context:\n${context}\n\nQuestion: ${questionData.question}`,
        },
      ];

      const answer = await generateText(config, messages);

      // Create answer node
      const answerNode: CustomNode = {
        id: generateId(),
        type: NodeType.ANSWER,
        position: {
          x: questionNode.position.x + 400,
          y: questionNode.position.y,
        },
        data: {
          label: 'Answer',
          status: 'done',
          answer,
          questionId: questionNodeId,
        },
      };

      // Add answer node and edge
      set((state) => ({
        nodes: [...state.nodes, answerNode],
        edges: [
          ...state.edges,
          {
            id: generateId(),
            source: questionNodeId,
            target: answerNode.id,
          },
        ],
      }));

      updateNode(questionNodeId, { status: 'done' });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      updateNode(questionNodeId, { status: 'error', errorMessage });
      throw error;
    }
  },

  generateSummary: async (summaryNodeId) => {
    const { nodes, edges, config, updateNode } = get();
    const summaryNode = nodes.find((n) => n.id === summaryNodeId);

    if (!summaryNode || summaryNode.type !== NodeType.SUMMARY) {
      throw new Error('Invalid summary node');
    }

    const summaryData = summaryNode.data as SummaryNodeData;

    // Get input nodes for context
    const inputNodes = getInputNodes(summaryNodeId, nodes, edges);
    const context = buildContextFromText(inputNodes.map(getNodeText));

    if (!context) {
      throw new Error('No context available. Please connect at least one node.');
    }

    try {
      updateNode(summaryNodeId, { status: 'loading' });

      const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPTS.SUMMARY },
        {
          role: 'user' as const,
          content: `Create ${summaryData.bulletCount} concise bullet points summarizing the following content:\n\n${context}`,
        },
      ];

      const summary = await generateText(config, messages);

      updateNode(summaryNodeId, { status: 'done', summary });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      updateNode(summaryNodeId, { status: 'error', errorMessage });
      throw error;
    }
  },

  generatePitch: async (pitchNodeId) => {
    const { nodes, edges, config, updateNode } = get();
    const pitchNode = nodes.find((n) => n.id === pitchNodeId);

    if (!pitchNode || pitchNode.type !== NodeType.PITCH) {
      throw new Error('Invalid pitch node');
    }

    const pitchData = pitchNode.data as PitchNodeData;

    // Get input nodes for context
    const inputNodes = getInputNodes(pitchNodeId, nodes, edges);
    const context = buildContextFromText(inputNodes.map(getNodeText));

    if (!context) {
      throw new Error('No context available. Please connect at least one node.');
    }

    try {
      updateNode(pitchNodeId, { status: 'loading' });

      const systemPrompt =
        pitchData.pitchType === 'short'
          ? SYSTEM_PROMPTS.PITCH_SHORT
          : SYSTEM_PROMPTS.PITCH_DETAILED;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        {
          role: 'user' as const,
          content: `Create a pitch based on the following content:\n\n${context}`,
        },
      ];

      const pitch = await generateText(config, messages);

      updateNode(pitchNodeId, { status: 'done', pitch });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      updateNode(pitchNodeId, { status: 'error', errorMessage });
      throw error;
    }
  },

  generateImages: async (imagesNodeId) => {
    const { nodes, edges, config, updateNode } = get();
    const imagesNode = nodes.find((n) => n.id === imagesNodeId);

    if (!imagesNode || imagesNode.type !== NodeType.IMAGES) {
      throw new Error('Invalid images node');
    }

    const imagesData = imagesNode.data as ImagesNodeData;

    // If no prompt, try to generate one from context
    let prompt = imagesData.prompt;

    if (!prompt) {
      const inputNodes = getInputNodes(imagesNodeId, nodes, edges);
      const context = buildContextFromText(inputNodes.map(getNodeText));

      if (context) {
        try {
          updateNode(imagesNodeId, { status: 'loading' });

          const messages = [
            { role: 'system' as const, content: SYSTEM_PROMPTS.IMAGE_PROMPT },
            {
              role: 'user' as const,
              content: `Based on this content, create a detailed visual prompt:\n\n${context}`,
            },
          ];

          prompt = await generateImagePrompt(config, messages);
          updateNode(imagesNodeId, { prompt });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
          updateNode(imagesNodeId, { status: 'error', errorMessage });
          throw error;
        }
      } else {
        throw new Error('No prompt or context available for image generation.');
      }
    }

    try {
      updateNode(imagesNodeId, { status: 'loading' });

      const imageUrls = await generateImages(
        config,
        prompt,
        imagesData.imageCount
      );

      updateNode(imagesNodeId, { status: 'done', imageUrls });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      updateNode(imagesNodeId, { status: 'error', errorMessage });
      throw error;
    }
  },
}));
