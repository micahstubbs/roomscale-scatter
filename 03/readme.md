this iteration sizes the scatterplot to start at about the floor and go to about human height (~2 meters)

next: nice text positioning for roomscale VR

---

This is a proof-of-concept 3D visualization of [Fisher's Iris data set](https://en.wikipedia.org/wiki/Iris_flower_data_set). There is a lot of room for improvement, but it's neat to "walk" around the plot with the **WASD keys** and highlight data points using the **mouse**. An HMD friendly variant could be created by swapping out the mouse-cursor component for a standard [gaze-cursor](https://aframe.io/docs/0.3.0/components/cursor.html) (for Google Cardboard) or [vive-cursor](https://github.com/bryik/aframe-vive-cursor-component) (for HTC Vive).

It was built using a customized version of the [aframe-scatter-component](aframe-scatter-component). The component source is hidden because the code is a bit long and gory, check the [Gist](https://gist.github.com/bryik/1a4d7eab9512400de3c03086f03016c8#file-hidden-aframe-scatter-component-js) if you must.

*Note*: click the display once before trying to move with WASD.
