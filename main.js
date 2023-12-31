import './style.css'
import { importFog, updateMaps } from './import.js'
import OBR from "@owlbear-rodeo/sdk";

document.querySelector('#app').innerHTML = `
  <div>
    <h2>Dynamic Fog Import!</h2> 
    <div>
      <p>Foundry JSON Import<br/>(Dungeon Alchemist)</p>
      <p>
      <textarea id="import_data" style="width:200px;height:100px;"></textarea>
      </p>
      <p>DPI <input id="import_dpi" type="text" value="150" size="1" maxlength="4"></p>
      <p>Map Alignment <select id="map_align"><option selected>Loading..</option></select></p>
      <button id="import" type="button">Import!</button>
      <p id="error_text"></p>
    </div>
  </div>
`

//setupCounter(document.querySelector('#counter'))
OBR.onReady(() => {
  document.querySelector('#import').addEventListener("click", () => importFog(document.querySelector("#import_data").value, document.querySelector("#import_dpi").value, document.querySelector("#map_align").value, document.querySelector("#error_text")));
  updateMapTimeout(3000);
});

function updateMapTimeout(timeout) {
  setTimeout(() => {
    try {
      updateMaps(document.querySelector('#map_align'));
      updateMapTimeout(10000);
    } catch {

    }
  }, timeout);
}