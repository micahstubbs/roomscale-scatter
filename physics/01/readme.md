an e-sports simulation targeting the [HTC Vive](https://en.wikipedia.org/wiki/HTC_Vive)

take the Vive controllers and tap one of the spheres.  watch those beautiful collisions!

hat-tip to [@donrmccurdy](https://twitter.com/donrmccurdy) for packaging up the very nice [aframe-physics-system](https://github.com/donmccurdy/aframe-physics-system)

to enjoy this experience on the Vive, follow the instructions at [https://webvr.info/](https://webvr.info/) to download and install an experimental browser build that supports WebVR.  from there, click the `Enter VR` HMD icon on the bottom right corner of the browser window to enter the scene.  

for reference, this experience was developed on the `Aug 29 2016` version `55.0.2842.0` [build](https://drive.google.com/drive/u/1/folders/0BzudLt22BqGRQUExYzVoLU5VT2c) of Chromium with the flags `--enable-webvr` and `--enable-gamepad-extensions`

to explore the scene on a 2D screen, [open in a new tab](http://bl.ocks.org/micahstubbs/raw/bef97f728381aca3f803a585581e7dbd) and then hold the `S` key until the scatterplot and legend come into view.  from there you can navigate using the `W A S D` keys and look by clicking and dragging with the mouse

this block is a fork of the [roomscale scatterplot](http://bl.ocks.org/micahstubbs/bef97f728381aca3f803a585581e7dbd) block which in turn is an iteration on the [#aframevr](https://twitter.com/search?q=%23aframevr) + [#d3js](https://twitter.com/search?q=%23d3js) [Iris Graph](http://bl.ocks.org/bryik/1a4d7eab9512400de3c03086f03016c8) from [@bryik_ws](https://twitter.com/bryik_ws)

for more A-Frame + D3 experiments 
search for `aframe` on blockbuilder search
[http://blockbuilder.org/search#text=aframe](http://blockbuilder.org/search#text=aframe)

## Roadmap

- Vive controller haptic feedback on each controller-sphere collision
- flashing walls (on collision, or perhaps to the beat)
- a beat
- sounds on collision
- proper pool cues
- octohedron starting layout for balls
- pockets
- wall a-boxes that derive their dimensions from the component dimesions properties
- a nice green felt material for skeumorphic mode
- a rectangular solid play area, like a billiards table extruded into three-D
- turn-based multiplayer
- crafting system
- realistic water
- snooker mode