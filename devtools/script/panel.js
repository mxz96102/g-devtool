const getGlobalInstanceScript = `
  (function () {
    var instances = window.__g_instances__;
    var gmap = {};
    var getCanvasRootGroup = function (canvas) {
      if (canvas.getRoot) {
        return canvas.getRoot().getChildren()
      } else if (canvas.getChildren) {
        return canvas.getChildren()
      }

      return []
    }
    window.__g_instances__.globalMap = gmap;
    var gInfo = [];
    function getGInstance (instance) {
      const ga = {}
      if (instance.getChildren && instance.getChildren()) {
        ga.children = instance.getChildren().map(function (p) {return getGInstance(p)})
      } 
        ga.hash = Math.random().toString(16).slice(-8);
        gmap[ga.hash] = instance;
        ga.id = instance.id || instance.get('id');
        ga.name = instance.name || instance.get('name');
        ga.type = instance.get('type') || instance.nodeName || 'group';
        return ga;
    }
    
  
    if (instances && instances.length) {
     gInfo = instances.map(
       function (instance) {return {
         type: 'renderer',
         name: 'renderer',
         nodeName: 'renderer',
         children: getCanvasRootGroup(instance).map(e => getGInstance(e))
       }}
     )
    } else {
      gInfo.length = 0
    }
    
    return gInfo;
  })()
`

var nowRectId;

var selectEl;

function setRect({
  width,
  height,
  top,
  left
}) {
  if (nowRectId) {
    chrome.devtools.inspectedWindow.eval(`document.getElementById("${nowRectId}").remove()`);
  } else {
    nowRectId = Math.random().toString(16).slice(-6);
  }

  chrome.devtools.inspectedWindow.eval(`(function(){
    const el = document.createElement('div');
    el.id = '${nowRectId}'
    document.body.appendChild(el);
    el.style.position = 'absolute';
    el.style.width = '${width}px';
    el.style.height = '${height}px';
    el.style.top = '${top}px';
    el.style.left = '${left}px';
    el.style.background = 'rgba(135, 59, 244, 0.5)';
    el.style.border = '1px solid rgb(135, 59, 244)';
    el.style.boxSizing = 'border-box'
  })()`)

}

function cleanRect() {
  if (nowRectId) {
    chrome.devtools.inspectedWindow.eval(`document.getElementById("${nowRectId}").remove()`)
  }
  nowRectId = undefined;
}



var showRect = (hash) => {
  chrome.devtools.inspectedWindow.eval(`(function () {
    var targetEl = window.__g_instances__.globalMap["${hash}"];
    if (targetEl.getBoundingClientRect) {
      return targetEl.getBoundingClientRect()
    } else {
      var bbox = targetEl.getCanvasBBox();
      var target = targetEl.getCanvas().getClientByPoint(bbox.x, bbox.y);

      bbox.left = target.x;
      bbox.top = target.y;

      return bbox;
    }
  })()
`, (result) => {
  setRect(result || {})
})
}

var lastSEl;

var getAttrs = (hash) => new Promise((res) => {
  if (hash) {
    chrome.devtools.inspectedWindow.eval(`
      window.__g_instances__.globalMap["${hash}"].attr()
    `, (result) => {
      res(result);
        chrome.devtools.inspectedWindow.eval(`
        $gElement = window.__g_instances__.globalMap["${hash}"]
      `)
    
      
    })
  } else {
    chrome.devtools.inspectedWindow.eval(`
    $gElement = undefined`)
    res()
  }
  
})

var updateAttrs = (hash, name, attrs, bb) =>  chrome.devtools.inspectedWindow.eval(`
window.__g_instances__.globalMap["${hash}"].attr("${name}", ${JSON.stringify(attrs)})
`)


chrome.devtools.inspectedWindow.eval(getGlobalInstanceScript, function (gInfo, err) {
  const container = document.getElementById('container');
  // container.innerHTML = '';
  // container.appendChild(generateByInstance(gInfo.instance));
  mount(gInfo, container, { showRect, getAttrs, cleanRect, updateAttrs })
})