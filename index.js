const async = require('async');
const { MongoClient } = require('mongodb');
const personalData = require('./data/personal');
const addressData = require('./data/address');

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
	if(error) {
		console.log(error);
		exit();
	}
	const db = client.db('edx');
	const limit = process.argv[2] || 100;
	let tasks = [];
	let migratedChunks = [];

	for(let offset = 0; offset < 1000; offset++) {

		const migratedRecord = Object.assign({}, personalData[offset], addressData[offset]);
		migratedChunks.push(migratedRecord);

		if((offset + 1) % limit === 0) {
			const data = Object.assign([], migratedChunks);
			console.log("Processing records : " + migratedChunks[0].id + " -> " + migratedChunks[limit-1].id);
			const task = (callback) => {
				db.collection('migration').insertMany(data, callback);
			}
			tasks.push(task);
			migratedChunks = [];
		}
	}
	if(migratedChunks.length > 0) {
		const data = Object.assign([], migratedChunks);
		const len = data.length;
		console.log("Processing records : " + data[0].id + " -> " + data[len-1].id);
		tasks.push((callback) => {
			db.collection('migration').insertMany(data, callback);
		});
	}
	async.parallel(tasks, (error, results) => {
		if(!error) {
			results.forEach((result) => {
				console.log(`Records inserted : ${result.insertedCount}`);
			})
			process.exit(0);
		} else {
			console.log(error.err);
			process.exit(1);
		}
	});
});
