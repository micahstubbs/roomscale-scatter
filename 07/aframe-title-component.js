AFRAME.registerComponent('title', {
  schema: {
    line0Text: {
      type: 'string'
    },
    line1Text: {
      type: 'string'
    },
    line2Text: {
      type: 'string'
    }
  },
  /**
   * Called once when component is attached. Generally for initial setup.
   */
  update() {
    // entity attributes
    const data = this.data;
    const line0Text = data.line0Text;
    const line1Text = data.line1Text;
    const line2Text = data.line2Text;

    const titleEntity = d3.select('a-scene')
      .append('a-entity') 
      .attr('class', 'title')
      .attr('position', '0 2 -1.8')
      .attr('rotation', '35 0 0');

    // line0
    titleEntity
      .append('a-entity')
      .attr('position', '-0.8 0.6 0')
      .append('a-entity')
        .attr('bmfont-text', `text: ${line0Text}`);

    // line1
    titleEntity
      .append('a-entity')
      .attr('position', '-0.72 0.4 0')
      .append('a-entity')
        .attr('bmfont-text', `text: ${line1Text}`);

    // line2
    titleEntity
      .append('a-entity')
      .attr('position', '-0.45 0.2 0')
      .append('a-entity')
        .attr('bmfont-text', `text: ${line2Text}`);
  }
});