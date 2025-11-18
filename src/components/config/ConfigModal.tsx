import React, { useState } from 'react';
import { useStore } from '@/state/store';
import { TEXT_MODELS, IMAGE_MODELS } from '@/lib/constants';
import './ConfigModal.css';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose }) => {
  const { config, updateConfig } = useStore();
  const [showApiKey, setShowApiKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="apiKey">OpenRouter API Key</label>
            <div className="api-key-input">
              <input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => updateConfig({ apiKey: e.target.value })}
                placeholder="sk-or-v1-..."
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="small"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className="help-text">
              Your API key is stored locally in your browser and sent only to OpenRouter.
              Get your key at{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
              >
                openrouter.ai/keys
              </a>
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="textModel">Text Model</label>
            <select
              id="textModel"
              value={config.textModel}
              onChange={(e) => updateConfig({ textModel: e.target.value })}
            >
              {TEXT_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="imageModel">Image Model</label>
            <select
              id="imageModel"
              value={config.imageModel}
              onChange={(e) => updateConfig({ imageModel: e.target.value })}
            >
              {IMAGE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="temperature">
              Temperature: {config.temperature.toFixed(2)}
            </label>
            <input
              id="temperature"
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) =>
                updateConfig({ temperature: parseFloat(e.target.value) })
              }
            />
            <p className="help-text">
              Higher values make output more random, lower values more focused.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="maxTokensText">Max Tokens for Text (optional)</label>
            <input
              id="maxTokensText"
              type="number"
              min="100"
              max="8000"
              value={config.maxTokensText || ''}
              onChange={(e) =>
                updateConfig({
                  maxTokensText: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="2000"
            />
            <p className="help-text">
              Maximum length of generated text responses.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="maxTokensImage">Max Tokens for Images (optional)</label>
            <input
              id="maxTokensImage"
              type="number"
              min="100"
              max="8000"
              value={config.maxTokensImage || ''}
              onChange={(e) =>
                updateConfig({
                  maxTokensImage: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              placeholder="1000"
            />
            <p className="help-text">
              Maximum tokens for image prompt generation.
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="apiBaseUrl">API Base URL</label>
            <input
              id="apiBaseUrl"
              type="text"
              value={config.apiBaseUrl}
              onChange={(e) => updateConfig({ apiBaseUrl: e.target.value })}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleSave} className="primary">
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
