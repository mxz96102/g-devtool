const getGlobalInstanceScript = `
  (function () {
    var instances = window.__g_instances__;
    var gmap = {};
    window.__g_instances__.globalMap = gmap;
    var gInfo = [];
    function getGInstance (instance) {
      const ga = {}
      if (instance.children) {
        ga.children = instance.children.map(function (p) {return getGInstance(p)})
      } 
        ga.hash = Math.random().toString(16).slice(-8);
        gmap[ga.hash] = instance;
        ga.id = instance.id;
        ga.name = instance.name;
        ga.type = instance.type;
        ga.boundingBox = instance.getBoundingClientRect();
        ga.element = instance.getBoundingClientRect();
        ga.type = instance.nodeName;
        return ga;
    }
    
  
    if (instances && instances.length) {
     gInfo = instances.map(
       function (instance) {return getGInstance(instance.getRoot())}
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
    chrome.devtools.inspectedWindow.eval(`document.getElementById("${nowRectId}").remove()`)
  } else {
    nowRectId = Math.random().toString(16).slice(-6)
  }

  chrome.devtools.inspectedWindow.eval(`(function(){
    const el = document.createElement('div');
    el.id = '${nowRectId}'
    document.body.appendChild(el);
    el.style.position = 'fixed';
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
  chrome.devtools.inspectedWindow.eval(`
  window.__g_instances__.globalMap["${hash}"].getBoundingClientRect()
`, (result) => {
  setRect(result || {})
})
}

var lastSEl;

var getAttrs = (hash) => new Promise((res) => {
  if (hash) {
    chrome.devtools.inspectedWindow.eval(`
      window.__g_instances__.globalMap["${hash}"].attributes
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
  console.log(gInfo)
  mount(gInfo, container, { showRect, getAttrs, cleanRect, updateAttrs })
})