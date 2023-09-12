import OBR, { buildCurve } from "@owlbear-rodeo/sdk";

const FOW_ID = "com.armindoflores.fogofwar";
const ID = "com.whatever.import";

export function importFog(import_data_str, import_dpi_str, error_element) {

  error_element.innerText = '';
  let import_data, import_dpi;
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
		  .points([{x: import_data.walls[i].c[0]*scale, y: import_data.walls[i].c[1]*scale}, {x:import_data.walls[i].c[2]*scale,y:import_data.walls[i].c[3]*scale}])
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
