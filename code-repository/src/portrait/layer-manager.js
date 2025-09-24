// code-repository/src/portrait/layer-manager.js
class LayerManager {
  constructor() {
    this.layers = new Map();
    this.layerOrder = [
      'background',
      'body',
      'clothing',
      'armor',
      'head',
      'hair',
      'facial-hair',
      'beard',
      'pointed-ears',
      'slightly-pointed-ears',
      'large-ears',
      'prominent-teeth',
      'facial-tattoos',
      'tribal-tattoos',
      'large-eyes',
      'curly-hair',
      'pointed-nose',
      'accessories',
      'weapons',
      'shields'
    ];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Initialize layer containers
    this.layerOrder.forEach(layerName => {
      this.layers.set(layerName, {
        elements: [],
        visible: true,
        opacity: 1.0,
        zIndex: this.layerOrder.indexOf(layerName)
      });
    });

    this.initialized = true;
    console.log('✅ LayerManager initialized successfully');
  }

  async createDefaultLayers(template) {
    const layers = new Map();

    // Create layers based on template
    template.layers.forEach(layerName => {
      layers.set(layerName, {
        name: layerName,
        elements: [],
        properties: {},
        zIndex: this.layerOrder.indexOf(layerName)
      });
    });

    // Initialize base layers with default elements
    await this.initializeBaseLayers(layers, template);

    return layers;
  }

  async initializeBaseLayers(layers, template) {
    // Background layer
    if (layers.has('background')) {
      layers.get('background').elements.push({
        type: 'rect',
        attributes: {
          x: 0,
          y: 0,
          width: 200,
          height: 300,
          fill: '#f0f0f0'
        }
      });
    }

    // Body layer
    if (layers.has('body')) {
      const bodyElement = this.createBodyElement(template.base);
      layers.get('body').elements.push(bodyElement);
    }

    // Head layer
    if (layers.has('head')) {
      const headElement = this.createHeadElement(template.base);
      layers.get('head').elements.push(headElement);
    }

    // Initialize race-specific layers
    await this.initializeRacialLayers(layers, template);
  }

  createBodyElement(baseTemplate) {
    const bodyShapes = {
      athletic: 'M75,120 Q100,100 125,120 L125,200 Q100,220 75,200 Z',
      slender: 'M80,120 Q100,105 120,120 L120,200 Q100,215 80,200 Z',
      stocky: 'M70,120 Q100,110 130,120 L130,200 Q100,230 70,200 Z',
      muscular: 'M65,120 Q100,95 135,120 L135,200 Q100,240 65,200 Z',
      nimble: 'M85,120 Q100,115 115,120 L115,190 Q100,200 85,190 Z'
    };

    return {
      type: 'path',
      attributes: {
        d: bodyShapes[baseTemplate.body.shape] || bodyShapes.athletic,
        fill: '#DEB887',
        stroke: '#8B7355',
        'stroke-width': 1
      }
    };
  }

  createHeadElement(baseTemplate) {
    const headShapes = {
      oval: 'M85,40 Q100,20 115,40 L115,80 Q100,100 85,80 Z',
      round: 'M85,35 Q100,15 115,35 L115,85 Q100,105 85,85 Z',
      square: 'M80,35 L120,35 L120,85 L80,85 Z'
    };

    const sizeMultipliers = {
      small: 0.8,
      medium: 1.0,
      large: 1.2
    };

    const multiplier = sizeMultipliers[baseTemplate.head.size] || 1.0;

    return {
      type: 'path',
      attributes: {
        d: headShapes[baseTemplate.head.shape] || headShapes.oval,
        fill: '#DEB887',
        stroke: '#8B7355',
        'stroke-width': 1,
        transform: `scale(${multiplier})`
      }
    };
  }

  async initializeRacialLayers(layers, template) {
    // Pointed ears for elves
    if (layers.has('pointed-ears')) {
      layers.get('pointed-ears').elements.push({
        type: 'path',
        attributes: {
          d: 'M82,50 Q78,45 82,55 M118,50 Q122,45 118,55',
          stroke: '#DEB887',
          'stroke-width': 2,
          fill: 'none'
        }
      });
    }

    // Slightly pointed ears for half-elves
    if (layers.has('slightly-pointed-ears')) {
      layers.get('slightly-pointed-ears').elements.push({
        type: 'path',
        attributes: {
          d: 'M84,50 Q82,47 84,53 M116,50 Q118,47 116,53',
          stroke: '#DEB887',
          'stroke-width': 1.5,
          fill: 'none'
        }
      });
    }

    // Large ears for gnomes
    if (layers.has('large-ears')) {
      layers.get('large-ears').elements.push({
        type: 'ellipse',
        attributes: {
          cx: 80,
          cy: 55,
          rx: 8,
          ry: 12,
          fill: '#DEB887',
          stroke: '#8B7355',
          'stroke-width': 1
        }
      }, {
        type: 'ellipse',
        attributes: {
          cx: 120,
          cy: 55,
          rx: 8,
          ry: 12,
          fill: '#DEB887',
          stroke: '#8B7355',
          'stroke-width': 1
        }
      });
    }

    // Prominent teeth for half-orcs
    if (layers.has('prominent-teeth')) {
      layers.get('prominent-teeth').elements.push({
        type: 'path',
        attributes: {
          d: 'M95,70 L98,75 L102,70 M98,70 L101,75 L105,70',
          stroke: '#FFFFFF',
          'stroke-width': 2,
          fill: 'none'
        }
      });
    }

    // Large eyes for halflings
    if (layers.has('large-eyes')) {
      // Eyes are part of head, but we can enhance them here
      console.log('Large eyes layer initialized');
    }

    // Pointed nose for gnomes
    if (layers.has('pointed-nose')) {
      layers.get('pointed-nose').elements.push({
        type: 'path',
        attributes: {
          d: 'M100,60 L98,68 L102,68 Z',
          fill: '#CD853F',
          stroke: '#8B7355',
          'stroke-width': 1
        }
      });
    }
  }

  async integrateEquipmentLayers(portrait, equipmentLayers) {
    // Add equipment layers to the portrait
    for (const [layerName, layerData] of equipmentLayers) {
      if (this.layers.has(layerName)) {
        const existingLayer = this.layers.get(layerName);
        existingLayer.elements.push(...layerData.elements);
      } else {
        // Create new layer if it doesn't exist
        this.layers.set(layerName, {
          elements: layerData.elements,
          visible: true,
          opacity: 1.0,
          zIndex: this.layerOrder.indexOf(layerName) || 999
        });
      }
    }

    return portrait;
  }

  async addLayerElement(layerName, element) {
    if (!this.layers.has(layerName)) {
      this.layers.set(layerName, {
        elements: [],
        visible: true,
        opacity: 1.0,
        zIndex: this.layerOrder.indexOf(layerName) || 999
      });
    }

    this.layers.get(layerName).elements.push(element);
  }

  async removeLayerElement(layerName, elementIndex) {
    const layer = this.layers.get(layerName);
    if (layer && layer.elements[elementIndex]) {
      layer.elements.splice(elementIndex, 1);
    }
  }

  async updateLayerProperty(layerName, property, value) {
    const layer = this.layers.get(layerName);
    if (layer) {
      layer[property] = value;
    }
  }

  getLayer(layerName) {
    return this.layers.get(layerName);
  }

  getAllLayers() {
    return Array.from(this.layers.entries()).sort((a, b) => a[1].zIndex - b[1].zIndex);
  }

  async clearLayer(layerName) {
    const layer = this.layers.get(layerName);
    if (layer) {
      layer.elements = [];
    }
  }

  async reorderLayers() {
    // Ensure layers are in correct z-index order
    const sortedLayers = Array.from(this.layers.entries()).sort((a, b) => a[1].zIndex - b[1].zIndex);
    this.layers = new Map(sortedLayers);
  }

  // Utility method to create SVG elements
  createSVGElement(type, attributes) {
    return {
      type: type,
      attributes: attributes
    };
  }

  // Method to export layers as SVG
  async exportToSVG() {
    let svgContent = '<svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">';

    const sortedLayers = this.getAllLayers();

    for (const [layerName, layer] of sortedLayers) {
      if (!layer.visible) continue;

      svgContent += `<g id="${layerName}" opacity="${layer.opacity}">`;

      for (const element of layer.elements) {
        svgContent += this.elementToSVGString(element);
      }

      svgContent += '</g>';
    }

    svgContent += '</svg>';
    return svgContent;
  }

  elementToSVGString(element) {
    let attributes = '';
    for (const [key, value] of Object.entries(element.attributes)) {
      attributes += ` ${key}="${value}"`;
    }
    return `<${element.type}${attributes}/>`;
  }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LayerManager;
} else if (typeof window !== 'undefined') {
  window.LayerManager = LayerManager;
}