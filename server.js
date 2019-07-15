// =======================
// get the packages we need ============
// =======================
var express = require('express');
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var sql = require('seriate');

require('dotenv').config();

app.use(cors()); // allow cross domain

// =======================
// configuration =========
// =======================
var port = process.env.PORT;

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

// use morgan to log requests to the console
app.use(morgan('dev'));

// SQL Server and database
var sqlConfig = {
  'server': process.env.DB_SERVER,
  'user': process.env.DB_USER,
  'password': process.env.DB_PASSWORD,
  'database': process.env.DB_DATABASE
};

sql.setDefault(sqlConfig);

// =======================
// routes ================
// =======================
// basic route
app.get('/', function (req, res) {
  res.send('Hello! The API is at /api');
});

var apiRoutes = express.Router();

// route to test endpoint (POST /api/test)
apiRoutes.post('/test', function (req, res) {
  var testParam = req.body.testparam;
  console.log(testParam);
  res.send('Length: ' + testParam.length.toString());
});

// route to retrieve contacts (POST /api/getcontacts)
apiRoutes.post('/getcontacts', function (req, res) {
  var totalRec = req.body.totalrec;
  sql.execute({
    procedure: 'fetchNumber',
    params: {
      totalRec: {
        type: sql.INT,
        val: totalRec
      }
    }
  }).then(function (results) {
    var telArray = (results[0])[0];
    var tel = [];
    telArray.forEach(function (element) {
      tel.push(element.telMobile);
    }, this);
    console.log('Get contacts success');
    res.status(200).json({ success: 'true', data: tel });
  }, function (err) {
    console.error('Something bad happened:', err);
    res.status(400).json({ success: 'false' });
  });
});

// route to update contacts (POST /api/updatecontacts)
apiRoutes.post('updatecontacts', function (req, res) {
  var telNumbers = req.body.telnumbers;
  sql.execute({
    procedure: 'updateNumber',
    params: {
      telNumbers: {
        type: sql.NVARCHAR,
        val: telNumbers
      }
    }
  }).then(function (results) {
    console.log('Update contacts success');
    res.status(200).json({ success: 'true' });
  }, function (err) {
    console.error('Something bad happened:', err);
    res.status(400).json({ success: 'false' });
  });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at port ' + port);