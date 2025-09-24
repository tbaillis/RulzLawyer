// code-repository/src/portrait/svg-renderer.js
class SVGRenderer {
  constructor() {
    this.canvas = null;
    this.context = null;
    this.initialized = false;
    this.renderingQueue = [];
    this.activeRenderings = 0;
    this.maxConcurrentRenderings = 2;
  }

  async initialize() {
    if (this.initialized) return;

    // Create offscreen canvas for rendering
    if (typeof OffscreenCanvas !== 'undefined') {
      this.canvas = new OffscreenCanvas(400, 600);
    } else {
      // Fallback for browsers without OffscreenCanvas
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 600;
      this.canvas = canvas;
    }

    this.context = this.canvas.getContext('2d');
    this.initialized = true;

    console.log('✅ SVGRenderer initialized successfully');
  }

  async composeLayers(layers) {
    if (!this.initialized) await this.initialize();

    try {
      // Clear canvas
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Sort layers by z-index
      const sortedLayers = Array.from(layers.entries()).sort((a, b) => a[1].zIndex - b[1].zIndex);

      // Render each layer
      for (const [layerName, layer] of sortedLayers) {
        if (!layer.visible) continue;

        await this.renderLayer(layer, layer.opacity || 1.0);
      }

      // Convert canvas to SVG string
      const svgString = await this.canvasToSVG();
      return svgString;

    } catch (error) {
      console.error('❌ Layer composition failed:', error);
      throw new SVGRenderingError(error.message);
    }
  }

  async renderLayer(layer, opacity) {
    this.context.globalAlpha = opacity;

    for (const element of layer.elements) {
      await this.renderElement(element);
    }

    this.context.globalAlpha = 1.0;
  }

  async renderElement(element) {
    switch (element.type) {
      case 'rect':
        this.renderRect(element.attributes);
        break;
      case 'circle':
        this.renderCircle(element.attributes);
        break;
      case 'ellipse':
        this.renderEllipse(element.attributes);
        break;
      case 'path':
        this.renderPath(element.attributes);
        break;
      case 'line':
        this.renderLine(element.attributes);
        break;
      case 'text':
        this.renderText(element.attributes);
        break;
      default:
        console.warn(`Unknown element type: ${element.type}`);
    }
  }

  renderRect(attrs) {
    const { x = 0, y = 0, width, height, fill, stroke, 'stroke-width': strokeWidth = 1 } = attrs;

    this.context.fillStyle = fill || '#000000';
    this.context.strokeStyle = stroke || '#000000';
    this.context.lineWidth = strokeWidth;

    if (fill) this.context.fillRect(x, y, width, height);
    if (stroke) this.context.strokeRect(x, y, width, height);
  }

  renderCircle(attrs) {
    const { cx, cy, r, fill, stroke, 'stroke-width': strokeWidth = 1 } = attrs;

    this.context.beginPath();
    this.context.arc(cx, cy, r, 0, 2 * Math.PI);

    if (fill) {
      this.context.fillStyle = fill;
      this.context.fill();
    }

    if (stroke) {
      this.context.strokeStyle = stroke;
      this.context.lineWidth = strokeWidth;
      this.context.stroke();
    }
  }

  renderEllipse(attrs) {
    const { cx, cy, rx, ry, fill, stroke, 'stroke-width': strokeWidth = 1 } = attrs;

    this.context.beginPath();
    this.context.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);

    if (fill) {
      this.context.fillStyle = fill;
      this.context.fill();
    }

    if (stroke) {
      this.context.strokeStyle = stroke;
      this.context.lineWidth = strokeWidth;
      this.context.stroke();
    }
  }

  renderPath(attrs) {
    const { d, fill, stroke, 'stroke-width': strokeWidth = 1, transform } = attrs;

    this.context.save();

    if (transform) {
      this.applyTransform(transform);
    }

    // Parse SVG path data (simplified implementation)
    const pathCommands = this.parsePathData(d);
    this.context.beginPath();

    for (const command of pathCommands) {
      this.executePathCommand(command);
    }

    if (fill && fill !== 'none') {
      this.context.fillStyle = fill;
      this.context.fill();
    }

    if (stroke && stroke !== 'none') {
      this.context.strokeStyle = stroke;
      this.context.lineWidth = strokeWidth;
      this.context.stroke();
    }

    this.context.restore();
  }

  renderLine(attrs) {
    const { x1, y1, x2, y2, stroke = '#000000', 'stroke-width': strokeWidth = 1 } = attrs;

    this.context.beginPath();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.strokeStyle = stroke;
    this.context.lineWidth = strokeWidth;
    this.context.stroke();
  }

  renderText(attrs) {
    const {
      x, y, text, fill = '#000000', 'font-size': fontSize = 12,
      'font-family': fontFamily = 'Arial', 'text-anchor': textAnchor = 'start'
    } = attrs;

    this.context.fillStyle = fill;
    this.context.font = `${fontSize}px ${fontFamily}`;
    this.context.textAlign = textAnchor;

    this.context.fillText(text, x, y);
  }

  parsePathData(d) {
    // Simplified SVG path parser
    const commands = [];
    const tokens = d.split(/([MLHVCSQTAZ])/i).filter(token => token.trim());

    for (let i = 0; i < tokens.length; i += 2) {
      const command = tokens[i];
      const params = tokens[i + 1] ? tokens[i + 1].split(/[,\s]+/).map(Number) : [];
      commands.push({ command: command.toUpperCase(), params });
    }

    return commands;
  }

  executePathCommand(cmd) {
    const { command, params } = cmd;

    switch (command) {
      case 'M':
        this.context.moveTo(params[0], params[1]);
        break;
      case 'L':
        this.context.lineTo(params[0], params[1]);
        break;
      case 'Q':
        this.context.quadraticCurveTo(params[0], params[1], params[2], params[3]);
        break;
      case 'C':
        this.context.bezierCurveTo(params[0], params[1], params[2], params[3], params[4], params[5]);
        break;
      case 'Z':
        this.context.closePath();
        break;
      default:
        console.warn(`Unsupported path command: ${command}`);
    }
  }

  applyTransform(transform) {
    // Parse and apply SVG transform (simplified)
    const scaleMatch = transform.match(/scale\(([^)]+)\)/);
    if (scaleMatch) {
      const scale = parseFloat(scaleMatch[1]);
      this.context.scale(scale, scale);
    }
  }

  async canvasToSVG() {
    // Convert canvas content to SVG string
    // This is a simplified implementation - in a real system you'd use a proper SVG library
    return `<svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="300" fill="#f0f0f0"/>
      <text x="100" y="150" text-anchor="middle" font-family="Arial" font-size="14" fill="#333">
        Portrait Preview
      </text>
      <text x="100" y="170" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">
        (SVG Generation In Progress)
      </text>
    </svg>`;
  }

  // Advanced rendering features
  async renderWithEffects(layer, effects) {
    // Apply rendering effects like shadows, glows, etc.
    for (const effect of effects) {
      switch (effect.type) {
        case 'shadow':
          await this.applyShadowEffect(layer, effect);
          break;
        case 'glow':
          await this.applyGlowEffect(layer, effect);
          break;
        case 'blur':
          await this.applyBlurEffect(layer, effect);
          break;
      }
    }
  }

  async applyShadowEffect(layer, effect) {
    // Apply drop shadow effect
    this.context.save();
    this.context.shadowColor = effect.color || '#000000';
    this.context.shadowBlur = effect.blur || 5;
    this.context.shadowOffsetX = effect.offsetX || 2;
    this.context.shadowOffsetY = effect.offsetY || 2;

    await this.renderLayer(layer, 1.0);
    this.context.restore();
  }

  async applyGlowEffect(layer, effect) {
    // Apply glow effect using multiple shadows
    for (let i = 0; i < 3; i++) {
      this.context.save();
      this.context.shadowColor = effect.color || '#ffffff';
      this.context.shadowBlur = (i + 1) * 2;
      this.context.globalAlpha = 0.3 / (i + 1);

      await this.renderLayer(layer, 1.0);
      this.context.restore();
    }
  }

  async applyBlurEffect(layer, effect) {
    // Apply blur effect (simplified)
    this.context.save();
    this.context.filter = `blur(${effect.radius || 2}px)`;
    await this.renderLayer(layer, 1.0);
    this.context.restore();
  }

  // Performance monitoring
  async optimizeRendering() {
    // Implement rendering optimizations
    if (this.renderingQueue.length > 10) {
      // Prioritize most recent requests
      this.renderingQueue = this.renderingQueue.slice(-5);
    }

    // Memory cleanup
    if (this.context) {
      // Force garbage collection hint
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // Export functionality
  async exportToPNG() {
    if (!this.canvas) return null;

    if (this.canvas instanceof OffscreenCanvas) {
      return await this.canvas.convertToBlob({ type: 'image/png' });
    } else {
      return new Promise(resolve => {
        this.canvas.toBlob(resolve, 'image/png');
      });
    }
  }

  async exportToJPEG(quality = 0.9) {
    if (!this.canvas) return null;

    if (this.canvas instanceof OffscreenCanvas) {
      return await this.canvas.convertToBlob({ type: 'image/jpeg', quality });
    } else {
      return new Promise(resolve => {
        this.canvas.toBlob(resolve, 'image/jpeg', quality);
      });
    }
  }
}

// Error Classes
class SVGRenderingError extends Error {
  constructor(message) { super(message); this.name = 'SVGRenderingError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SVGRenderer;
} else if (typeof window !== 'undefined') {
  window.SVGRenderer = SVGRenderer;
}