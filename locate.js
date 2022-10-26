count = 0;
fs2.readdirSync("./photos").forEach(file => {
    count++;
    setTimeout(function () {
    var req = request.post('https://labs.tib.eu/geoestimation/upload_file', function (err, resp, body) {
      if (err) {
        console.log('Error!');
      } else {
        //console.log(body);
        locate(JSON.parse(body).image_id, file);
  
      }
    });
    var form = req.form();
    form.append('file', fs2.createReadStream('./photos/' + file));
  
}, count * 5000);
  })
  
  async function locate(id, filename) {
    await fetch('https://labs.tib.eu/geoestimation/calc_output_dict/' + id);
    const scene = await fetch('https://labs.tib.eu/geoestimation/get_scene_prediction/' + id);
    var place = await scene.text();
    //console.log(JSON.parse(place));
  
  if(JSON.parse(place).predicted_scene_label == 'urban' || JSON.parse(place).predicted_scene_label == 'urban') {
  console.log(filename + ": " + JSON.parse(place).predicted_scene_label);
    const coords = await fetch('https://labs.tib.eu/geoestimation/get_geo_prediction/' + id + '/3');
    var res = await coords.text();
    var cells = JSON.parse(res).cells;
  var highProbN = 0;
  var highProb = 0;
    Object.keys(cells).forEach(key => {
      //console.log(cells[key]);
      //if(String(cells[key].prob).substring(0,1) > 7) {fs.appendFile('coords.csv', cells[key].lat + "," + cells[key].lng + ',red,circle,"Follower"\n', function (err) {if (err) throw err;}); }
      if(cells[key].prob > highProb) {
        highProbN = key;
        highProb = cells[key].prob
      }
    });
    fs.appendFile('coords.csv', cells[highProbN].lat + "," + cells[highProbN].lng + ',red,circle,"Follower"\n', function (err) {if (err) throw err;});
  }
  
  }
