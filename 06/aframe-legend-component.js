AFRAME.registerComponent('legend', {
  schema: {
    csv: {
      type: 'string'
    },
    colorVariable: {
      type: 'string'
    },
    colorVariableDomain: {
      type: 'array'
    },
    colors: {
      type: 'array'
    }
  },
  /**
   * Called once when component is attached. Generally for initial setup.
   */
  update() {
    // entity attributes
    const el = this.el;
    const options = this.data;
    const colorVariable = options.colorVariable;

    let colors;
    if (typeof options.colors !== 'undefined') {
      colors = options.colors;
    } else {
      colors = d3.schemeCategory10;
    }
    console.log('colors', colors);

    const colorScale = d3.scaleOrdinal()
      .range(colors);

    const legendEntity = d3.select(el)
      .append('a-entity')
      .attr('class', 'legend')
      .attr('position', '1.4 0.5 -1.5')
      .attr('rotation', '0 -45 0')
      .attr('scale', '0.8 0.8 0.8');

    d3.csv(options.csv, data => {
      // allow user to specify colorVariableDomain
      // to control sort order of legend items
      let colorVariableDomain;
      if (typeof options.colorVariableDomain !== 'undefined') {
        colorVariableDomain = options.colorVariableDomain;
      } else {
        colorVariableDomain = data.map(d => d[colorVariable]).filter(onlyUnique);
      } 
      colorScale.domain(colorVariableDomain);

      // draw legend text and a legend icon
      // for all colorVariableDomain values
      legendEntity
        .selectAll('.legendItem')
        .data(colorVariableDomain)
        .enter().append('a-entity')
          .attr('position', (d, i) => `0 ${(colorVariableDomain.length - i - 1) * 0.5} 0`)
          .attr('bmfont-text', d => `text: ${d}; color: ${colorScale(d)}`)
          .append('a-sphere')
            .attr('radius', '0.03')
            .attr('position', '-0.1 0.05 0')
            .attr('color', d => colorScale(d));
    })
  }
});

/**
 * onlyUnique() tests if values in an array are unique
 */
function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}