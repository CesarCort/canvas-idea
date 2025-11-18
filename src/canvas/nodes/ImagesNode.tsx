import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ImagesNodeData } from '@/types';
import { useStore } from '@/state/store';
import './NodeBase.css';

export const ImagesNode: React.FC<NodeProps<ImagesNodeData>> = ({ id, data }) => {
  const { updateNode, deleteNode, generateImages } = useStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      await generateImages(id);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="custom-node" style={{ width: 450 }}>
        <button
          className="delete-button"
          onClick={() => deleteNode(id)}
          title="Delete node"
        >
          ✕
        </button>

        <Handle
          type="target"
          position={Position.Left}
          id="input"
          style={{ background: 'var(--accent-primary)' }}
        />

        <div className="node-header">
          <h4 className="node-title">🖼️ Images</h4>
          <span className={`node-status ${data.status}`}>{data.status}</span>
        </div>

        <div className="node-body">
          <div className="node-field">
            <label>Visual Prompt</label>
            <textarea
              value={data.prompt}
              onChange={(e) => updateNode(id, { prompt: e.target.value })}
              placeholder="Describe the image you want to generate..."
              rows={3}
            />
          </div>

          <div className="node-field">
            <label>Number of Images (1-6)</label>
            <input
              type="number"
              min="1"
              max="6"
              value={data.imageCount}
              onChange={(e) =>
                updateNode(id, {
                  imageCount: Math.min(Math.max(parseInt(e.target.value) || 1, 1), 6),
                })
              }
            />
          </div>

          {data.imageUrls && data.imageUrls.length > 0 ? (
            <>
              <div className="images-grid">
                {data.imageUrls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Generated ${index + 1}`}
                    className="image-thumbnail"
                    onClick={() => setSelectedImage(url)}
                  />
                ))}
              </div>
              <div className="node-actions">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="small"
                >
                  Regenerate
                </button>
              </div>
            </>
          ) : (
            <div className="node-actions">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="primary"
              >
                {isGenerating ? 'Generating...' : 'Generate Images'}
              </button>
            </div>
          )}

          {data.errorMessage && (
            <div className="node-error">{data.errorMessage}</div>
          )}
        </div>
      </div>

      {/* Image viewer modal */}
      {selectedImage && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedImage(null)}
          style={{ zIndex: 2000 }}
        >
          <img
            src={selectedImage}
            alt="Full size"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              borderRadius: 'var(--radius-lg)',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
