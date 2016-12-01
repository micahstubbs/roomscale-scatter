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
    },
    line0Position: {
      type: 'string'
    },
    line1Position: {
      type: 'string'
    },
    line2Position: {
      type: 'string'
    }
  },
  /**
   * Called once when component is attached. Generally for initial setup.
   */
  update() {
    // entity attributes
    const el = this.el;
    const options = this.data;
    const line0Text = options.line0Text;
    const line1Text = options.line1Text;
    const line2Text = options.line2Text;
    const line0Position = options.line0Position;
    const line1Position = options.line1Position;
    const line2Position = options.line2Position;

    const titleEntity = d3.select(el)
      .append('a-entity') 
      .attr('class', 'title')
      .attr('position', '0 2 -1.8')
      .attr('rotation', '35 0 0');

    // line0
    titleEntity
      .append('a-entity')
      .attr('position', line0Position)
      .append('a-entity')
        .attr('bmfont-text', `text: ${line0Text}`);

    // line1
    titleEntity
      .append('a-entity')
      .attr('position', line1Position)
      .append('a-entity')
        .attr('bmfont-text', `text: ${line1Text}`);

    // line2
    titleEntity
      .append('a-entity')
      .attr('position', line2Position)
      .append('a-entity')
        .attr('bmfont-text', `text: ${line2Text}`);
  }
});