const express = require('express');
const exphbs  = require('express-handlebars');
const pg = require('pg');
const Pool = pg.Pool;

const app = express();
const PORT =  process.env.PORT || 3017;

const ElectricityMeters = require('./electricity-meters');

const connectionString = process.env.DATABASE_URL || 'postgresql://owethusotomela:owethusotomela@localhost:5432/topups_db';

const pool = new Pool({
    connectionString  
});

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const electricityMeters = ElectricityMeters(pool);

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/streets', async function(req, res){
	const streets = await electricityMeters.streets();
	const lowBalance = await electricityMeters.lowestBalanceMeter();
	const highBalance = await electricityMeters.highestBalanceStreet()
	console.log(highBalance);
	res.render('streets', {
		streets:streets,
		lowBalance:lowBalance,
		highBalance:highBalance

	});
})

app.get('/appliances', async function(req, res){
	const appliance = await electricityMeters.appliances();
	// console.log(appliance);
	res.render('appliances', {
		appliance
	})
})


app.get('/meter/:street_id', async function(req, res) {

	// use the streetMeters method in the factory function...
	// send the street id in as sent in by the URL parameter street_id - req.params.street_id

	// create  template called street_meters.handlebars
	// in there loop over all the meters and show them on the screen.
	// show the street number and name and the meter balance
	var street_id = req.params.street_id
	// console.log(street_id);
	var meters = await electricityMeters.streetMeters(street_id);
	console.log(meters);

	res.render('street_meters', {
		meters
	});
});

app.get('/meter/use/:meter_id', async function(req, res) {

	// show the current meter balance and select the appliance you are using electricity for
	res.render('use_electricity', {
		meters
	});
});

app.post('/meter/use/:meter_id', async function(req, res) {

	// update the meter balance with the usage of the appliance selected.
	res.render(`/meter/user/${req.params.meter_id}`);

});

app.get('/use_electricity', async function(req, res){
	var appliances = await electricityMeters.getAppliances()
	console.log(appliances)
	res.render('use_electricity',{
		appliances 
	});
})

app.get('/home', async function(req, res){
	res.redirect('/');
})

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function() {
	console.log(`App started on port ${PORT}`)
});