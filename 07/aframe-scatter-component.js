AFRAME.registerComponent('graph', {
  schema: {
    csv: {
      type: 'string'
    },
    id: {
      type: 'int',
      default: '0'
    },
    width: {
      type: 'number',
      default: 1
    },
    height: {
      type: 'number',
      default: 1
    },
    depth: {
      type: 'number',
      default: 1
    },
    xLabelText: {
      type: 'string'
    },
    yLabelText: {
      type: 'string'
    },
    zLabelText: {
      type: 'string'
    },
    xLabelTextScale: {
      type: 'string',
      default: '1 1 1'
    },
    yLabelTextScale: {
      type: 'string',
      default: '1 1 1'
    },
    zLabelTextLineScale: {
      type: 'string',
      default: '1 1 1'
    },
    colorVariable: {
      type: 'string'
    },
    colorVariableDomain: {
      type: 'array'
    },
    colors: {
      type: 'array'
    },
    xVariable: {
      type: 'string'
    },
    yVariable: {
      type: 'string'
    },
    zVariable: {
      type: 'string'
    },
    xScaleType: {
      type: 'string',
      default: 'linear'
    },
    yScaleType: {
      type: 'string',
      default: 'linear'
    },
    zScaleType: {
      type: 'string',
      default: 'linear'
    },
    xScaleLogDomainMin: {
      type: 'string',
      default: '1e-1'
    },
    yScaleLogDomainMin: {
      type: 'string',
      default: '1e-1'
    },
    zScaleLogDomainMin: {
      type: 'string',
      default: '1e-1'
    }
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  update() {
    // Entity data
    const el = this.el;
    const object3D = el.object3D;
    const options = this.data;

    const width = options.width;
    const height = options.height;
    const depth = options.depth;
    
    const xLabelText = options.xLabelText;
    const yLabelText = options.yLabelText;
    const zLabelText = options.zLabelText;

    const xLabelTextScale = options.xLabelTextScale;
    const yLabelTextScale = options.yLabelTextScale;
    const zLabelTextScale = options.zLabelTextScale;

    const xScaleType = options.xScaleType;
    const yScaleType = options.yScaleType;
    const zScaleType = options.zScaleType;

    const xScaleLogDomainMin = options.xScaleLogDomainMin;
    const yScaleLogDomainMin = options.yScaleLogDomainMin;
    const zScaleLogDomainMin = options.zScaleLogDomainMin;

    const colorVariable = options.colorVariable;

    let colors;
    if (
      typeof options.colors !== 'undefined' &&
      options.colors.length > 0
      ) {
      colors = options.colors;
    } else {
      colors = d3.schemeCategory10;
    }
    console.log('colors', colors);

    const xVariable = options.xVariable;
    const yVariable = options.yVariable;
    const zVariable = options.zVariable;
    console.log('xVariable', xVariable);
    console.log('yVariable', yVariable);
    console.log('zVariable', zVariable);

    // These will be used to set the range of the axes' scales
    const xRange = [0, width];
    const yRange = [0, height];
    const zRange = [0, -depth];

    /**
     * Create origin point.
     * This gives a solid reference point for scaling data.
     * It is positioned at the vertex of the left grid and bottom grid (towards the front).
     */
    const originPointPosition = `${-width / 2} 0 ${depth / 2}`;
    const originPointID = `originPoint${options.id}`;

    d3.select(el).append('a-entity')
      .attr('id', originPointID)
      .attr('position', originPointPosition);

    // Create graphing area out of three textured planes
    const grid = gridMaker(width, height, depth);
    object3D.add(grid);

    // Label axes
    // TODO: add a text measuring function
    // then measure label text length
    // the use that length to
    // sprogrammatically position labels
    const xLabelPosition = `0.2 -0.1 0.1'`;
    const xLabelRotation = `-45 0 0`;
    d3.select(`#${originPointID}`)
      .append('a-entity')
      .attr('id', 'x')
      .attr('bmfont-text', `text: ${xLabelText}`)
      .attr('position', xLabelPosition)
      .attr('rotation', xLabelRotation)
      .attr('scale', xLabelTextScale);

    const yLabelPosition = `${width + 0.12} 0.2 ${-depth + 0.08}`;
    const yLabelRotation = `0 -30 90`;
    d3.select(`#${originPointID}`)
      .append('a-entity')
      .attr('id', 'y')
      .attr('bmfont-text', `text: ${yLabelText}`)
      .attr('position', yLabelPosition)
      .attr('rotation', yLabelRotation)
      .attr('scale', yLabelTextScale);

    const zLabelPosition = `${width + 0.03} 0.03 ${-depth + 0.27}`;
    const zLabelRotation = `-45 -90 0`;
    d3.select(`#${originPointID}`)
      .append('a-entity')
      .attr('id', 'z')
      .attr('bmfont-text', `text: ${zLabelText}`)
      .attr('position', zLabelPosition)
      .attr('rotation', zLabelRotation)
      .attr('scale', zLabelTextScale);

    if (options.csv) {
      /* Plot data from CSV */
      const originPoint = d3.select(`#originPoint${options.id}`);

      // create color scale for points
      const colorScale = d3.scaleOrdinal()
        .range(colors);

      // Convert CSV data from string to number
      d3.csv(options.csv, data => {
        // allow user to specify colorVariableDomain
        // to control sort order of legend items
        let colorVariableDomain;
        if (
          typeof options.colorVariableDomain !== 'undefined' &&
          options.colorVariableDomain.length > 0
        ) {
          colorVariableDomain = options.colorVariableDomain;
        } else {
          colorVariableDomain = data.map(d => d[colorVariable]).filter(onlyUnique);
        } 
        colorScale.domain(colorVariableDomain);
        console.log('colorVariableDomain', colorVariableDomain);

        data.forEach(d => {
          d[xVariable] = Number(d[xVariable]);
          d[yVariable] = Number(d[yVariable]);
          d[zVariable] = Number(d[zVariable]);
          d.color = colorScale(d[colorVariable]);
        });
        plotData(data);
      });

      function plotData (data) {
        //
        // Scale x values
        //
        const xExtent = d3.extent(data, d => d[xVariable]);
        let xScale;
        switch (xScaleType) {
          case 'linear':
            xScale = d3.scaleLinear()
              .domain(xExtent)
              .range([xRange[0], xRange[1]])
              .clamp('true');
            break;
          case 'log':
            xScale = d3.scaleLog()
              .domain([Number(xScaleLogDomainMin), d3.max(data, d => d[xVariable])])
              .range([xRange[0], xRange[1]])
              .clamp('true');
            break;
        }

        //
        // Scale y values
        //
        const yExtent = d3.extent(data, d => d[yVariable]);
        let yScale;
        switch (yScaleType) {
          case 'linear':
            yScale = d3.scaleLinear()
              .domain(yExtent)
              .range([yRange[0], yRange[1]])
              .clamp('true');
            break;
          case 'log':
            yScale = d3.scaleLog()
              .domain([Number(yScaleLogDomainMin), d3.max(data, d => d[yVariable])])
              .range([yRange[0], yRange[1]])
              .clamp('true');
            break;
        }

        //
        // Scale z values
        //
        const zExtent = d3.extent(data, d => d[zVariable]);
        let zScale;
        switch (zScaleType) {
          case 'linear':
            zScale = d3.scaleLinear()
              .domain(zExtent)
              .range([zRange[0], zRange[1]])
              .clamp('true');
            break;
          case 'log':
            zScale = d3.scaleLog()
              .domain([Number(zScaleLogDomainMin), d3.max(data, d => d[zVariable])])
              .range([zRange[0], zRange[1]])
              .clamp('true');
            break;
        }

        // TODO: trigger this mousenter event when a Vive controller
        // collides with a data point sphere
        // 
        // Append data to graph and attach event listeners
        originPoint.selectAll('a-sphere')
          .data(data)
          .enter()
          .append('a-sphere')
          .attr('radius', 0.03)
          .attr('color', d => d.color)
          .attr('position', d => `${xScale(d[xVariable])} ${yScale(d[yVariable])} ${zScale(d[zVariable])}`)
          .on('mouseenter', mouseEnter);

        /**
         * Event listener adds and removes data labels.
         * "this" refers to sphere element of a given data point.
         */
        function mouseEnter () {
          // Get data
          const data = this.__data__;

          // Get width of graphBox (needed to set label position)
          const graphBoxEl = this.parentElement.parentElement;
          const graphBoxData = graphBoxEl.components.graph.data;
          const graphBoxWidth = graphBoxData.width;

          // Look for an existing label
          const oldLabel = d3.select('#tempDataLabel');
          const oldLabelParent = oldLabel.select(function () { return this.parentNode; });

          // Look for an existing beam
          const oldBeam = d3.select('#tempDataBeam');
          
          // Look for an existing background
          const oldBackground = d3.select('#tempDataBackground');

          const labelMakerOptions = {
            xLabelText,
            yLabelText,
            zLabelText,
            xVariable,
            yVariable,
            zVariable
          }

          // If there is no existing label, make one
          if (oldLabel[0][0] === null) {
            labelMaker(this, graphBoxWidth, labelMakerOptions);
          } else {
            // Remove old label
            oldLabel.remove();
            // Remove beam
            oldBeam.remove();
            // Remove background
            oldBackground.remove();
            // Create new label
            labelMaker(this, graphBoxWidth, labelMakerOptions);
          }
        }
      };
    }
  }
});

/* HELPER FUNCTIONS */

/**
 * planeMaker() creates a plane given width and height (kind of).
 *  It is used by gridMaker().
 */
function planeMaker (horizontal, vertical) {
  // Controls texture repeat for U and V
  const uHorizontal = horizontal * 4;
  const vVertical = vertical * 4;

  // Load a texture, set wrap mode to repeat
  const texture = new THREE.TextureLoader()
    .load('https://cdn.rawgit.com/bryik/aframe-scatter-component/master/assets/grid.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  texture.repeat.set(uHorizontal, vVertical);

  // Create material and geometry
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  const geometry = new THREE.PlaneGeometry(horizontal, vertical);

  return new THREE.Mesh(geometry, material);
}

/**
 * gridMaker() creates a graphing box given width, height, and depth.
 * The textures are also scaled to these dimensions.
 *
 * There are many ways this function could be improved or done differently
 * e.g. buffer geometry, merge geometry, better reuse of material/geometry.
 */
function gridMaker (width, height, depth) {
  const grid = new THREE.Object3D();

  // AKA bottom grid
  const xGrid = planeMaker(width, depth);
  xGrid.rotation.x = 90 * (Math.PI / 180);
  grid.add(xGrid);

  // AKA far grid
  const yPlane = planeMaker(width, height);
  yPlane.position.y = (0.5) * height;
  yPlane.position.z = (-0.5) * depth;
  grid.add(yPlane);

  // AKA side grid
  const zPlane = planeMaker(depth, height);
  zPlane.position.x = (-0.5) * width;
  zPlane.position.y = (0.5) * height;
  zPlane.rotation.y = 90 * (Math.PI / 180);
  grid.add(zPlane);

  return grid;
}

/**
 * labelMaker() creates a label for a given data point and graph height.
 * dataEl - A data point's element.
 * graphBoxWidth - The width of the graph.
 */
function labelMaker (dataEl, graphBoxWidth, options) {
  const dataElement = d3.select(dataEl);
  // Retrieve original data
  const dataValues = dataEl.__data__;

  const xVariable = options.xVariable;
  const yVariable = options.yVariable;
  const zVariable = options.zVariable;

  // Create individual x, y, and z labels using original data values
  // round to 1 decimal space (should use d3 format for consistency later)
  const xPointText = `${xLabelText}: ${dataValues[xVariable]}\n \n`;
  const yPointText = `${yLabelText}: ${dataValues[yVariable]}\n \n`;
  const zPointText = `${zLabelText}: ${dataValues[zVariable]}`;
  const pointText = `text: ${xPointText}${yPointText}${zPointText}`;

  // Position label right of graph
  const padding = 0.2;
  const sphereXPosition = dataEl.getAttribute('position').x;
  const labelXPosition = (graphBoxWidth + padding) - sphereXPosition;
  const labelPosition = `${labelXPosition} -0.43 0`;

  // Add pointer
  const beamWidth = labelXPosition;
  // The beam's pivot is in the center
  const beamPosition = `${labelXPosition - (beamWidth / 2)}0 0`;
  dataElement.append('a-box')
    .attr('id', 'tempDataBeam')
    .attr('height', '0.01')
    .attr('width', beamWidth)
    .attr('depth', '0.01')
    .attr('color', 'purple')
    .attr('position', beamPosition);

  // Add label
  dataElement.append('a-entity')
    .attr('id', 'tempDataLabel')
    .attr('bmfont-text', pointText)
    .attr('position', labelPosition);
  
  const backgroundPosition = `${labelXPosition + 1.15} 0.02 -0.1`;
  // Add background card
  dataElement.append('a-plane')
    .attr('id', 'tempDataBackground')
    .attr('width', '2.3')
    .attr('height', '1.3')
    .attr('color', '#ECECEC')
    .attr('position', backgroundPosition);
}

/**
 * onlyUnique() tests if values in an array are unique
 */
function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}