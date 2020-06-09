const Pool = require('pg').Pool
// const pool = new Pool({
//   user: 'postgres',
//   host: '172.17.250.12',
//   database: 'iotgis',
//   password: 'postgres2020!Incyt',
//   port: 5432,
// })

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sosguate',
  password: 'Guatemala1',
  port: 5432,
});



const getAlertsMaster = (request, response) => {
  // select m.departamento,m.municipio,m.point_x,m.point_y,count(*) from sosguate s, municipios m where s.municipio = m.id group by m.departamento,m.municipio,m.point_x,m.point_y
  var q = ' select m.departamento,m.municipio,m.point_x,m.point_y,count(*),m.id from sosguate s, municipios m where s.municipio = m.id group by m.departamento,m.municipio,m.point_x,m.point_y,m.id ' +
  " union " +
  " select departamento,municipio,pointx,pointy,count(*),municipioid  from sosguateportal group by departamento,municipio,pointx,pointy,municipioid "
  ;

  console.log(q);
  pool.query(q, (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    console.log('#SOSAGUA GET Method cubo1');
    response.status(200).json(results.rows);
  });
}

const getDepartamentos = (request, response) => {
  pool.query('select distinct departamen_1 from municipios order by departamen_1  ', (error, results) => {
    if (error) {
      response.status(500).send(`{'msg':'error'}`);
    }
    console.log('#SOSAGUA GET Method departamentos');
    response.status(200).json(results.rows);
  });
}

const getMunicipios = (request, response) => {
  pool.query('select * from  municipios  ', (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    console.log('#SOSGUATE GET Method Municipios');
    response.status(200).json(results.rows);
  });
}


const getNecesidad = (request, response) => {
  pool.query('select * from  tendencias  ', (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    console.log('#get tendencias proyecto #SOSGUATE GET Method SOS');
    response.status(200).json(results.rows);
  });
}



const createAlerts = (request, response) => {
      var jtxt = JSON.stringify(request.body);
      var points = request.body.coordinates.toString().replace(']',"").replace('[',"").split(',');
      var place = request.body.place.toString().replace(']',"").replace('[',"").split(',');
      var municipioid = request.body.locationId;
      //console.log(points[0],points[1]);
      //var {textjson,pointx,pointy,municipio} = request.body;      
      //console.log(jtxt);
    var cadena = "insert into sosguateportal (textjson,pointx,pointy,municipioid,departamento,municipio) values  ('" +
      jtxt  +  "','" + points[0] + "','" + points[1] +  "','" + municipioid + "','"+
      place[0] + "','" + place[1] +  "' )"  ;
    console.log(cadena);
  pool.query(cadena, (error, results) => {
    if (error) {
      response.status(500).send(`{'msg':'error'}`);
    }
    //response.status(201).send(`User added with ID: ${results.body}`);
    response.status(201).send(`{'msg':'OK'}`);
  });
}

/*
const getAlertsDetail = (request, response) => {
  var id = request.query.id;
  var q = 'select * from sosguate where municipio =  ' + id + ' order by fecha ';
  console.log(q);
  pool.query(q, (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    //console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows);
  });
}
*/

const getAlertsDetailReport = (request, response) => {
  var id = request.query.id;
  var q =  'select * from sosguate where municipio = ' + id ;
  console.log(q);
  pool.query(q, (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    //console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows);
  });
}


module.exports = {
  getAlertsMaster,
  getDepartamentos,
  getMunicipios,
  getNecesidad,
  createAlerts,
  getAlertsDetailReport
}

