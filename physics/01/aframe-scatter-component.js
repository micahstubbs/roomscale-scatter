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
    }
  },

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  update: function () {
    // Entity data
    var el = this.el;
    var object3D = el.object3D;
    var data = this.data;

    var width = data.width;
    var height = data.height;
    var depth = data.depth;

    // These will be used to set the range of the axes' scales
    var xRange = [0 + 0.1, width - 0.1];
    var yRange = [0 + 0.1, height - 0.1];
    var zRange = [0 - 0.1, -depth + 0.1];

    // var xRange = [0, width];
    // var yRange = [0, height];
    // var zRange = [0, -depth];

    /**
     * Create origin point.
     * This gives a solid reference point for scaling data.
     * It is positioned at the vertex of the left grid and bottom grid (towards the front).
     */
    var originPointPosition = (-width / 2) + ' 0 ' + (depth / 2);
    var originPointID = 'originPoint' + data.id;

    d3.select(el).append('a-entity')
                 .attr('id', originPointID)
                 .attr('position', originPointPosition);

    // Create graphing area out of three textured planes
    // var grid = gridMaker(width, height, depth);
    // object3D.add(grid);

    // Label axes
    // TODO: add a text measuring function
    // then measure label text length
    // the use that length to
    // sprogrammatically position labels
    // var xLabelPosition = '0.2' + ' ' + '-0.1' + ' ' + '0.1';
    // var xLabelRotation = '-45' + ' ' + '0' + ' ' + '0';
    // d3.select('#' + originPointID)
    //   .append('a-entity')
    //   .attr('id', 'x')
    //   .attr('bmfont-text', 'text: Sepal Length (cm)')
    //   .attr('position', xLabelPosition)
    //   .attr('rotation', xLabelRotation);
    // var yLabelPosition = (width + 0.12) + ' ' + '0.2' + ' ' + (-depth + 0.08);
    // var yLabelRotation = '0' + ' ' + '-30' + ' ' + '90';
    // d3.select('#' + originPointID)
    //   .append('a-entity')
    //   .attr('id', 'y')
    //   .attr('bmfont-text', 'text: Petal Length (cm)')
    //   .attr('position', yLabelPosition)
    //   .attr('rotation', yLabelRotation);
    // var zLabelPosition = (width + 0.03) + ' ' + '0.03' + ' ' + (-depth + 0.27);
    // var zLabelRotation = '-45' + ' ' + '-90' + ' ' + '0';
    // d3.select('#' + originPointID)
    //   .append('a-entity')
    //   .attr('id', 'z')
    //   .attr('bmfont-text', 'text: Sepal Width (cm)')
    //   .attr('position', zLabelPosition)
    //   .attr('rotation', zLabelRotation);

    // generate some random data
    data.csv = [];
    const colors = [ 'red', 'green', 'blue'];
    // set the number of spheres in the scene
    for (let i = 0; i < 48; i++) {
      data.csv.push({
        xV: Math.random(),
        yV: Math.random(),
        zV: Math.random(),
        color: colors[Math.floor(Math.random() * 3)]
      })
    }
    console.log('random data.csv', data.csv);


    if (data.csv) {
      /* Plot data from CSV */

      var originPoint = d3.select('#originPoint' + data.id);

      // Needed to assign species a color
      var cScale = d3.scaleOrdinal()
      	.domain([
           "red",
           "blue",
           "green"
         ])
      	.range([
         '#d62728', // red
         '#2ca02c', // green
         '#1f77b4' // blue
         ]);

      // Convert CSV data from string to number
      // d3.csv(data.csv, function (data) {
      // 	data.forEach(function (d) {
      // 	  d.color = cScale(d.color)
      // 	});
      //   plotData(data);
      // });

      const plotDataOptions = {
        xVariable: 'xV',
        yVariable: 'yV',
        zVariable: 'zV',
        colorVariable: 'color'
      }
      plotData(data.csv, plotDataOptions);

      function plotData(data, options) {
        const xVariable = options.xVariable;
        const yVariable = options.yVariable;
        const zVariable = options.zVariable;
        const colorVariable = options.colorVariable;

        // Scale x, y, and z values
        var xExtent = d3.extent(data, function (d) { return d[xVariable]; });
        var xScale = d3.scaleLinear()
                       .domain(xExtent)
                       .range([xRange[0], xRange[1]])
                       .clamp('true');

        var yExtent = d3.extent(data, function (d) { return d[yVariable]; });
        var yScale = d3.scaleLinear()
                       .domain(yExtent)
                       .range([yRange[0], yRange[1]]);

        var zExtent = d3.extent(data, function (d) { return d[zVariable] });
        var zScale = d3.scaleLinear()
                       .domain(zExtent)
                       .range([zRange[0], zRange[1]]);

        // Append data to graph and attach event listeners
        originPoint.selectAll('a-sphere')
                   .data(data)
                   .enter()
                   .append('a-sphere')
                   .attr('radius', 0.05)
                   .attr('color', function(d) {
                     return d.color;
                   })
                   .attr('position', function (d) {
                     return xScale(d[xVariable]) + ' ' + yScale(d[yVariable]) + ' ' + zScale(d[zVariable]);
                   })
                   .attr('dynamic-body', '')
                   .classed('throwable', true)
                   .on('mouseenter', mouseEnter);

        /**
         * Event listener adds and removes data labels.
         * "this" refers to sphere element of a given data point.
         */
        function mouseEnter () {
        	// Get data
        	var data = this.__data__;

          // Get width of graphBox (needed to set label position)
          var graphBoxEl = this.parentElement.parentElement;
          var graphBoxData = graphBoxEl.components.graph.data;
          var graphBoxWidth = graphBoxData.width;

          // Look for an existing label
          var oldLabel = d3.select('#tempDataLabel');
          var oldLabelParent = oldLabel.select(function () { return this.parentNode; });

          // Look for an existing beam
          var oldBeam = d3.select('#tempDataBeam');
          
      	// Look for an existing background
        var oldBackground = d3.select('#tempDataBackground');

          // If there is no existing label, make one
          if (oldLabel[0][0] === null) {
            labelMaker(this, graphBoxWidth);
          } else {
            // Remove old label
            oldLabel.remove();
            // Remove beam
            oldBeam.remove();
            // Remove background
	          oldBackground.remove();
            // Create new label
            labelMaker(this, graphBoxWidth);
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
  var uHorizontal = horizontal * 4;
  var vVertical = vertical * 4;

  // Load a texture, set wrap mode to repeat
  var texture = new THREE.TextureLoader().load('https://cdn.rawgit.com/bryik/aframe-scatter-component/master/assets/grid.png');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  texture.repeat.set(uHorizontal, vVertical);

  // Create material and geometry
  var material = new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide});
  var geometry = new THREE.PlaneGeometry(horizontal, vertical);

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
  var grid = new THREE.Object3D();

  // AKA bottom grid
  var xGrid = planeMaker(width, depth);
  xGrid.rotation.x = 90 * (Math.PI / 180);
  grid.add(xGrid);

  // AKA far grid
  var yPlane = planeMaker(width, height);
  yPlane.position.y = (0.5) * height;
  yPlane.position.z = (-0.5) * depth;
  grid.add(yPlane);

  // AKA side grid
  var zPlane = planeMaker(depth, height);
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
  const xVariable = options.xVariable;
  const yVariable = options.yVariable;
  const zVariable = options.zVariable;
  const xLabel = options.xVariable;
  const yLabel = options.yVariable;
  const zLabel = options.zVariable;

  var dataElement = d3.select(dataEl);
  // Retrieve original data
  var dataValues = dataEl.__data__;

  // Create individual x, y, and z labels using original data values
  // round to 1 decimal space (should use d3 format for consistency later)
  var xLabelText = 'xLabel: ' + dataValues[xVariable] + '\n \n';
  var yLabelText = 'yLabel: ' + dataValues[yVariable] + '\n \n';
  var zLabelText = 'zLabel: ' + dataValues[zVariable];
  var labelText = 'text: ' + xLabelText + yLabelText + zLabelText;

  // Position label right of graph
  var padding = 0.2;
  var sphereXPosition = dataEl.getAttribute('position').x;
  var labelXPosition = (graphBoxWidth + padding) - sphereXPosition;
  var labelPosition = labelXPosition + ' -0.43 0';

  // Add pointer
  var beamWidth = labelXPosition;
  // The beam's pivot is in the center
  var beamPosition = (labelXPosition - (beamWidth / 2)) + '0 0';
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
             .attr('bmfont-text', labelText)
             .attr('position', labelPosition);
  
	var backgroundPosition = (labelXPosition + 1.15) + ' 0.02 -0.1';
  // Add background card
  dataElement.append('a-plane')
  					 .attr('id', 'tempDataBackground')
  					 .attr('width', '2.3')
  					 .attr('height', '1.3')
  					 .attr('color', '#ECECEC')
  					 .attr('position', backgroundPosition);
}