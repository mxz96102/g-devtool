# G Devtool
> A devtool for @antv/g in chrome, it's still WIP, you can load it in unpack way;

## Quick Start

### Import unpacked plugin

1. Open the Extension Management page by navigating to chrome://extensions.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the Load unpacked button and select the 'devtool' directory.

### Connect with G Canvas;

```javascript
// init window hook
window.__g_instances__ = [];

var canvas = new Canvas({...blablabla});

window.__g_instances__.push(canvas);

```

### Using devtool

After these steps, the tab 'AntV G' should show in devtools' tab, select it and choose a canvas



