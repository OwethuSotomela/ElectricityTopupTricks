// this is our
module.exports = function (pool) {

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
	async function topupElectricity(meterId, units) {
		await pool.query('UPDATE electricity_meter SET balance = balance + $1 WHERE id = $2', [units, meterId]);
	}

	// return the data for a given balance
	function meterData(meterId) {

	}

	// Get appliances
	async function getAppliances(){
		const appliances = await pool.query(`SELECT * FROM appliance`);
		return appliances.rows;
	}

	// decrease the meter balance for the meterId supplied
	async function useElectricity(meterId, units) {
		//Getting balnce first
		const balance = await pool.query('SELECT balance from electricity_meter WHERE id = $1', [meterId]);
		if (balance.rows.length != 0) {
			// Setting the balance to zero if the units above the balance so it does not become negative
			if (parseFloat(balance.rows[0].balance) < parseFloat(units)) {
				await pool.query(`UPDATE electricity_meter SET balance = 0.00 WHERE id = $1`, [meterId]);
			}
			await pool.query(`UPDATE electricity_meter SET balance = balance - $1 WHERE id = $2`, [units, meterId]);
		}
	}

	async function lowestBalanceMeter(){
		const meter = await pool.query(`SELECT electricity_meter.id, balance, street_number, MIN(balance) FROM electricity_meter JOIN street ON electricity_meter.street_id = street.id GROUP BY electricity_meter.id LIMIT 1`);
		return meter.rows;
	}

	async function highestBalanceStreet(street){
		const meter = await pool.query(`SELECT * FROM electricity_meter JOIN street ON electricity_meter.street_id = street.id WHERE name = $1`, [street]);
		console.log(meter.rows)
		return meter.rows;
	}

	return {
		streets,
		streetMeters,
		appliances,
		topupElectricity,
		meterData,
		useElectricity,
		lowestBalanceMeter,
		highestBalanceStreet,
		getAppliances,
	}


}