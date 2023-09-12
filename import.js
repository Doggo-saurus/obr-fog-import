import OBR, { buildCurve } from "@owlbear-rodeo/sdk";

const FOW_ID = "com.armindoflores.fogofwar";
const ID = "com.whatever.import";

export async function updateMaps(map_align) {
  const maps = await OBR.scene.items.getItems((item) => item.layer === "MAP");
  const map_map = {};
  for(var i = 0; i < maps.length; i++) {
    let map_opt = map_align.querySelector('#map-'+maps[i].id);
    if (map_opt === null) {
      map_opt = document.createElement('option');
      map_opt.id = 'map-' + maps[i].id;
      map_opt.value = maps[i].id;
      map_opt.innerText = maps[i].name;
      map_align.appendChild(map_opt);
    }
    map_map[maps[i].id] = maps[i].name;
  }

  let map_opts = map_align.querySelectorAll('option');
  for(var i = 0; i < map_opts.length; i++) {
    if (map_map[map_opts[i].value] === undefined) {
      map_align.removeChild(map_opts[i]);
//      console.log("Removing "+ map_opts[i].value);
    }
  }
};

export async function importFog(import_data_str, import_dpi_str, import_map_align, error_element) {

  error_element.innerText = '';
  let import_data, import_dpi;

  let import_map;
  let offset_x = 0, offset_y = 0;

  // getItems for the uuid of the map, offset the points accordingly (after dpi scaling)
  if (import_map_align !== "") {
    import_map = await OBR.scene.items.getItems([import_map_align]);
    if (import_map.length > 0) {
      offset_x = import_map[0].position.x;
      offset_y = import_map[0].position.y;
    }
  }

  try {
    import_data = JSON.parse(import_data_str);
    import_dpi = parseInt(import_dpi_str);

    if (Number.isNaN(import_dpi) || import_dpi <= 0) {
      throw new Error("Invalid DPI");
    }

    if (!import_data.walls || import_data.walls.length === 0) {
      throw new Error("No walls found");
    }
  } catch (e) {
    error_element.innerText = e.toString();
    return;
  }

  // console.log(import_data, import_dpi);

  // 150/72 = 2.0833333333333
  const obr_dpi = 72;
  const scale = import_dpi / obr_dpi;
  const walls = [];

  let total_imported = 0;

  for (var i = 0; i < import_data.walls.length; i++) {
    const line = buildCurve()
      .tension(0)
		  .points([{x: import_data.walls[i].c[0]*scale + offset_x, y: import_data.walls[i].c[1]*scale + offset_y}, {x:import_data.walls[i].c[2]*scale + offset_x,y:import_data.walls[i].c[3]*scale + offset_y}])
      .fillColor("#000000")
      .fillOpacity(0)
      .layer("DRAWING")
      .name("Vision Line (Line)")
      .closed(false)
      .build();
    line.visible = false;
    line.metadata[`${FOW_ID}/isVisionLine`] = true;

	  walls.push(line);

	  if (walls.length > 50) {
      total_imported += walls.length;
      OBR.scene.items.addItems(walls);
      walls.length = 0;
	  }
  }

  if (walls.length > 0) {
    total_imported += walls.length;
    OBR.scene.items.addItems(walls);
  }

  error_element.innerText = 'Finished importing '+ total_imported + ' walls!';
};
