const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./queriessosguate');
const port = 3004;

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/incyt/api/sosagua', (request, response) => {
  response.json({ info: 'Node.js, Express, nginx  and Postgres API #SOSGUATE #SOSGUATEMALA ' })
})

app.get('/incyt/api/sosguate/getalertsmaster', db.getAlertsMaster)
//app.get('/incyt/api/sosguate/getalertsdetail', db.getAlertsDetail)
app.get('/incyt/api/sosguate/getalertsdetailreport', db.getAlertsDetailReport)
app.get('/incyt/api/sosguate/getdepartamentos', db.getDepartamentos)
app.get('/incyt/api/sosguate/getmunicipios', db.getMunicipios)
app.get('/incyt/api/sosguate/getnecesidad', db.getNecesidad)
app.post('/incyt/api/sosguate/createalerts', db.createAlerts)



app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})

