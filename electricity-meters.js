// this is our
module.exports = function(pool) {

	// list all the streets the we have on records
	async function streets() {
		const streets = await pool.query(`select * from street`);
		return streets.rows;
	}

	// for a given street show all the meters and their balances
	async function streetMeters(street_id) {
		const meters = await pool.query(`SELECT * FROM electricity_meter JOIN street ON electricity_meter.street_id = street.id WHERE street_id = $1`, [street_id]);
		return meters.rows;
	}

	// return all the appliances
	async function appliances() {
		const appliance = await pool.query('SELECT * FROM appliance');
		return appliance.rows;
	}

	// increase the meter balance for the meterId supplied
	function topupElectricity(meterId, units) {

	}
	
	// return the data for a given balance
	function meterData(meterId) {
	
	}

	// decrease the meter balance for the meterId supplied
	function useElectricity(meterId, units) {
	
	}

	return {
		streets,
		streetMeters,
		appliances,
		topupElectricity,
		meterData,
		useElectricity
	}


}