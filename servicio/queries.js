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
  database: 'sosagua',
  password: 'Guatemala1',
  port: 5432,
})



const getAlertsMaster = (request, response) => {
  //select departamen_1, municipi_1, point_x, point_y ,n.descripcion from cubo1 c, municipios m, necesidad n where m.id = c.municipio and n.id = c.necesidad
  pool.query('select distinct m.id, departamen_1, municipi_1, point_x, point_y from cubo1 c, municipios m where m.id = c.municipio ', (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    console.log('#SOSAGUA GET Method cubo1');
    response.status(200).json(results.rows)
  })
}

const getDepartamentos = (request, response) => {
  pool.query('select distinct departamen_1 from municipios order by departamen_1  ', (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    console.log('#SOSAGUA GET Method departamentos');
    response.status(200).json(results.rows)
  })
}

const getMunicipios = (request, response) => {
  pool.query('select * from  municipios  ', (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    console.log('#SOSGUATE GET Method Municipios');
    response.status(200).json(results.rows)
  })
}


const getNecesidad = (request, response) => {
  pool.query('select * from  necesidad  ', (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    console.log('#SOSAGUA GET Method SOS');
    response.status(200).json(results.rows)
  })
}



const createAlerts = (request, response) => {
      var jtxt = JSON.stringify(request.body);
      console.log(jtxt);
    let cadena = 'INSERT INTO fase1 (textjson) VALUES (\'' +  jtxt  +  '\')'  ;
    console.log(cadena);
  pool.query(cadena, (error, results) => {
    if (error) {
      response.status(500).send(`{'msg':'error'}`);
    }
    //response.status(201).send(`User added with ID: ${results.body}`);
    response.status(201).send(`{'msg':'OK'}`);
  })
}

const getAlertsDetail = (request, response) => {
  const id = request.query.id;
  pool.query('select n.*, c.mes, c.ano, c.contador from cubo1 c, necesidad n where c.necesidad = n.id and c.municipio = ' + id + ' order by mes, ano,necesidad,c.contador ', (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    //console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows)
  })
}


const getAlertsDetailReport = (request, response) => {
  const id = request.query.id;
  pool.query('select textjson from fase1 where municipio = ' + id + '  ', (error, results) => {
    if (error) {
      //throw error
      response.status(500).send(`{'msg':'error'}`);
    }
    //console.log('se han enviado todos los mensajes');
    response.status(200).json(results.rows)
  })
}


module.exports = {
  getAlertsMaster,
  getDepartamentos,
  getMunicipios,
  getNecesidad,
  getAlertsDetail,
  createAlerts,
  getAlertsDetailReport
}

