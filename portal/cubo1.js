function reporte(id) {
  //console.log("entrando a generar reporte");
  //console.log(currentDepartment + ' ' + currentMunicipio + ' ' +currentMunicipioId);
  var url =
    "https://arcgis-web.url.edu.gt/incyt/api/sosagua/getalertsdetailreport" +
    "?id=" + id;

  $.get(url, function (data, status) {
    //console.log("Data: " + data + "\nStatus: " + status);
    if (data.length > 0) {
      console.log("desplegamos grid");
      //console.log(data[0].twitjson);
      fillTable(data);
    } else {
      alert("No hay datos disponibles");
    }
  });
}


function fillTable(data) {
  console.log(data);
  var table = document.getElementById("tableInfo");
  var tableTitle = document.getElementById("tableTitle");
  tableTitle.innerHTML = "Reportes Municipales de Agua";
  table.innerHTML = "";
  table.innerHTML =
    "<thead>" +
    "   <tr>" +
    "    <th scope='col'>Nombre</th>" +
    "    <th scope='col'>Texto</th>" +
    "    <th scope='col'>Fecha</th>" +
    "    <th scope='col'>Fuente</th>" +
    "  </tr>" +
    "</thead>  ";

  for (var i = 0; i < data.length; i++) {
    console.log(JSON.parse(data[i].textjson));
    var atributos = ({ name, text, created_at, source } = JSON.parse(data[i].textjson));
    var myDate;

    if(isNaN(atributos.created_at)){
      console.log(atributos.created_at + " is not a number ");
      myDate = atributos.created_at;
     }else{
      console.log(atributos.created_at + " is a number ");
      myDate = new Date(1000 * atributos.created_at);
      console.log(myDate);
     }
    
    //console.log(atributos);

    // IM WEBSITE ANSEHEN
    var row = table.insertRow(i + 1);
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var cell3 = row.insertCell(3);
    cell0.innerHTML = atributos.name;
    cell1.innerHTML = atributos.text;
    cell2.innerHTML = myDate;//atributos.created_at;
    cell3.innerHTML = atributos.source;
  }
}
$(document).ready(function () {
  // console.log("Pagina cargada correctamente");
  const queryString = window.location.search;
  // console.log(queryString);
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  const municipio = urlParams.get("municipio");
  const departamento = urlParams.get("departamento");
  document.getElementById("tituloPrincipal").innerHTML =
    departamento + " " + municipio;
  //cargamos los datos detallados
  reporte(id);
});
