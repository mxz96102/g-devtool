/**
 * global instance and flag
 */

var panelInstance;
var itv;

function createPanelInstance() {
  if (panelInstance) {
    return;
  }

  chrome.devtools.inspectedWindow.eval(`!!(window.__g_instances__ && window.__g_instances__.length)`, function (gConnected, err) {
    if (!gConnected) {
      return;
    }

    clearInterval(itv)

    panelInstance = chrome.devtools.panels.create('AntV G', 'icons/32.png', 'panel.html', function (panel) {

    })

    chrome.runtime.sendMessage({
      isAntVG: true,
      disabled: false
    })

  })

}

createPanelInstance();

itv = setInterval(createPanelInstance, 1000)