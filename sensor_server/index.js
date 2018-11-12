var admin = require("firebase-admin");
var fs = require('fs');
var dateTime = require('node-datetime');
var request = require('request');
var config = require('config');
const path = require('path');
const mime = require('mime');
const serialNumber = '00000000825c40c5';
const MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);
const firebaseFunctionUrl = 'https://us-central1-xxx.cloudfunctions.net';


//declare the variables
var sensorTypes;
var sensorTypeID;
var sensorID;
var sensorCustomerID;
var sensorZoneID;
var sensorOwnName;
var bIsGetData = false;

// define the variables

var categories           = ['status', 'vocAnalytics', 'vocRaw', 'processedData', 'debug'];
var tableTypes           = ['header_row_type', 'header_type'];
var valueTypes           = ['option', 'number', 'text', 'time'];
var SYSTEM_MODE          = config.get('mode');
var SENSORTYPE_TABLE     = config.get('sensorType');
var SENSORDATA_TABLE     = config.get('sensorData');
var SENSORS_TABLE        = config.get('sensors');
var SENSORDEVICES_TABLE  = config.get('sensorDevices');
var SENSORCONFIGS_TABLE  = config.get('sensorConfigs');
var CALIBRATIONDATA_TABLE  = config.get('calibrationData');
// var SENSORCSVS_TABLE     = config.get('sensorCsvs');
var RAWDATA_TABLE     = config.get('RawData');
var SENSORSTORAGES_TABLE = config.get('sensorStorages');
var PROCESSEDDATA_TABLE  = config.get('processedData');
var PROCESSSTORAGE_TABLE = config.get('processedStorages');
var ANALYTICALDATA_TABLE  = config.get('analyticalData');
var ANALYTICALSTORAGE_TABLE = config.get('analyticalStorages');
var DEBUG_STROAGE_TABLE = config.get('debugStorage');
var DEBUG_DATA_TABLE = config.get('debugData');
var CRON_JOB_TEST_SENSOR_TABLE = config.get('cronJobTestSensor');

// init the firebase
var serviceAccount = require("./service-account.json");
const keyFilename="./service-account.json";
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://test-xxx.firebaseio.com"
});

var db               = admin.database();
var getSensorsRef    = db.ref(`/${SENSORS_TABLE}`);
var connectedRef     = db.ref('/.info/connected');
//init the firebase storage
const projectId  = "test-xxx";
const bucketName = `${projectId}.appspot.com`;
console.log(require('@google-cloud/storage'))
const gcs = require('@google-cloud/storage')({
    projectId,
    keyFilename
});
const bucket = gcs.bucket(bucketName);

/*
*** define the function ***
*/

// init the variables for the data
function initData() {
	sensorTypes = {};
}

// start interval firebase function
// function startFirebaseInterval(strFirebaseUrl, strSystemMode, strSensorId) {
// 	var postData = {
// 		strSensorId: strSensorId,
// 		strSystemMode: strSystemMode
// 	};

// 	var options = {
// 		method: 'post',
// 		body: postData, // Javascript object
// 		json: true, // Use,If you are sending JSON data
// 		url: strFirebaseUrl
// 	}

// 	request(options, function (err, res, body) {
// 		if (err) {
// 			console.log('Error :', err)
// 			return
// 		}
// 		console.log(' Body :', body)
// 	});
// }

// send the message to slack
function sendToSlack(strComment, strMessage) {
	var strSend = 'node.js side, ';
	strSend += 'serialNumber: ';
	strSend += serialNumber;
	strSend += ' ,';
	strSend += strComment;
	strSend += ': ';
	strSend += strMessage;
	slack.send(strSend);
}

// var isGetEvent = false;
// var currentActionStatus = -1;

// get the online event
// function getOnlineEvent() {
// 	if(sensorID) {
// 		db.ref(`/${SENSORS_TABLE}/${sensorID}/availability`).set('on');
// 	} else {
// 		console.log('The sensor ID is not existed yet.');
// 	}
// }
let bIsSet = false;
let currentNetWorkStatus = 'offline';
let bIsFirebase = false; 

function setOnlineStatus() {
	if(!bIsSet) {
		console.log('---Reset---');
		main();
		bIsSet = true;
	}

	if(sensorID) {
		bIsFirebase = false;
		let lisnterSensorAvailaibilty = db.ref(`/${SENSORS_TABLE}/${sensorID}/availability`);
		lisnterSensorAvailaibilty.set('on')
		.then(() => {
			currentNetWorkStatus = 'online';
			bIsFirebase = true;
		});
		setTimeout(() => {
			if (!bIsFirebase) {
				currentNetWorkStatus = 'offline';
				db.goOffline();
			}
		}, 5000);
		lisnterSensorAvailaibilty.onDisconnect().set('off');
	} else {
		console.log('The sensor ID is not gotten yet.');
	}
}

function checkGoogleConnection() {
	require('internet-available')({
		timeout: 4500,
		retries: 2
	}).then(function() {
		console.log('online');
		setOnlineStatus();
	}).catch(function() {
		console.log('offline');
		// db.goOffline();
		currentNetWorkStatus = 'offline';
	});
}

function checkDeviceStatus() {
	db.goOnline();
	db.ref('.info/connected').once('value', function(snap) {
		if (snap.val() === true) {
			console.log('---Connected---');
			setOnlineStatus();
		} else {
			console.log('---Disconnected---');
			currentNetWorkStatus = 'offline';
		}
	});
}

var raiseTimeHandler;

// timer function
function raiseTimeEvent(timeSpace) {
	raiseTimeHandler = setInterval(checkDeviceStatus, timeSpace * 1000);
}

raiseTimeEvent(10); //10s


// get last time
function getSensorLastTime(timeKey) {
	if(!sensorID) {
		console.log('The sensor key is not gotten.');
	}
	var categoryName = categories[0];
	var categoryRef = db.ref(`/${SENSORDATA_TABLE}/${categoryName}/${sensorID}/series`);
	categoryRef.orderByChild('timestamp').limitToLast(1).once("value", function(snapshot) {
		snapshot.forEach(function(childSnap) {
			var categoryData = childSnap.val();
			console.log('---Last time at ---');
			console.log(categoryData['value'][timeKey]);
		});
	});
}

// process.on('SIGINT', function() {
// 	if(sensorID) {
// 		db.ref(`/${SENSORS_TABLE}/${sensorID}/availability`).set('off');
// 	} else {
// 		console.log('Sensor ID is not existed');
// 	}

// 	if(raiseTimeHandler) {
// 		clearInterval(raiseTimeHandler);
// 	}
// });

function setDailyTestResult(logKey, status) {
	var postData = {
		sensorId: sensorID,
		systemMode: SYSTEM_MODE,
		status: status,
		logKey: logKey
	};

	request({
		url: `${firebaseFunctionUrl}/setDailyTestResult`,
		method: 'POST',
		json: true,   // <--Very important!!!
		body: postData
	}, function (error, response, body){
		console.log(response);
	});
}

// get the firebase data
function getFirebaseData() {
	// get sensorTypes
	getSensorsRef.orderByChild("serialNumber").equalTo(serialNumber).once("value", function(snapshot) {
		var sensorData = snapshot.val();

		if(sensorData) {
			for (var key in sensorData) {
				sensorID = key;
				sensorTypeID = sensorData[sensorID]['sensorTypeId'];
				sensorCustomerID = sensorData[sensorID]['customerId'];
				sensorZoneID = sensorData[sensorID]['zoneId'];
				sensorOwnName = sensorData[sensorID]['name'];
			}

			if(!sensorID) {
				console.log('Sensor ID does not exist');
			}

			if(!sensorTypeID) {
				console.log('Sensor Type ID does not exist');
			}


			if(sensorID && sensorTypeID) {
				// getSensorLastTime('Last1 sample at');
				var getSensorTypeRef          = db.ref(`/${SENSORTYPE_TABLE}/${sensorTypeID}`);
				var listenerSensorStatusRef   = db.ref(`/${SENSORDEVICES_TABLE}/${sensorID}/actionStatus`);
				var listenerCalibrationStatusRef = db.ref(`/${SENSORDEVICES_TABLE}/${sensorID}/calibrationStatus`);
				var listenerSensorResponseRef = db.ref(`/${SENSORDEVICES_TABLE}/${sensorID}/resVal`);
				var listenerSensorPingRef     = db.ref(`/${SENSORDEVICES_TABLE}/${sensorID}/pingVal`);
				var listenerSensorDeviceRef   = db.ref(`/${SENSORCONFIGS_TABLE}/${sensorID}`);
				var lisnterSensorAvailaibilty = db.ref(`/${SENSORS_TABLE}/${sensorID}/availability`);
				lisnterSensorAvailaibilty.set('on');
				lisnterSensorAvailaibilty.onDisconnect().set('off');
				// Sensor availibility status lisnter
				lisnterSensorAvailaibilty.on('value', snapshot => {
					if(snapshot.val() !== 'on') {
						lisnterSensorAvailaibilty.set('on');
					}
				});

				getCategoryParameters('status').then((res) => {
					console.log('--- Category Parameters ---');
					console.log(res)
				}).catch(function(err) {
					console.log(err)
				});

				getBarometricPressure();

				// sensor action response listener
				listenerSensorResponseRef.on('value', snapshot => {
					if(snapshot.val()) {
						var value = snapshot.val();
						if(parseInt(value) !== 111) {
							listenerSensorResponseRef.set(111);
						}
					}
				});
				listenerCalibrationStatusRef.on("value", function(calibrationSnapshot) {
					if(calibrationSnapshot.val() || calibrationSnapshot.val() === 0) {
						switch(parseInt(calibrationSnapshot.val())) {
							case 0:
								console.log('Status is PID calibration Start');
							break;
							case 1:
								console.log('Status is PID calibration Stop');
							break;
							case 2:
								console.log('Status is PID calibration Config Save');
								getCalibtrationData();
							break;
						}
					}
				});

				return;
				
				// getAnalyticalParams();ANALYTICALDATA_TABLE
				// db.ref(`/${ANALYTICALDATA_TABLE}/${sensorID}`).set(11);
				// sendLocationUpdated(42.292322, -83.713272, '1301 Beal Ave, Ann Arbor, Michigan');

				// get sensorTypes
				getSensorTypeRef.once("value", function(typesnapshot) {
					var value = typesnapshot.val();
					var types = ['header_row_type', 'header_type'];
					var statusKeyArray = [];
					var sensortypeArray;

					if(value['status']['tableType'] === types[0]) {
						sensortypeArray = value['status']['rows'];
					} else {
						sensortypeArray = value['status']['heads'];
					}

					for(var i=0; i<sensortypeArray.length; i++) {
						if(sensortypeArray[i]['id']) {
							statusKeyArray.push(sensortypeArray[i]['id']);
						}
					}
					initData(sensorID, sensorTypeID);
					setSensorCategories(typesnapshot.val());
					sendCategory({
						'6ijvh1LLB4': '192.123.5.4'
					}, 0);
					return;
					
					var messageData = {
						'Status3': '1',
						'Power3': '2',
						'Temp3 (F)': '3',
						'Humidity level3 (%)': '4',
						'Barometer3 (in)': '5',
						'Barometer3 (mb)': '6',
						'Pump status3': '7',
						'Last sample at3': '8'
					};

					var statusData_new ={};

					for(var j=0; j<statusKeyArray.length; j++) {
						let dataKey = statusKeyArray[j];
						if(messageData.hasOwnProperty(dataKey)) {
							statusData_new[dataKey] = messageData[dataKey];
						}
					}
					initData(sensorID, sensorTypeID);
					// setSensorCategories(typesnapshot.val());
					// sendSensorData();
				},function(error){
				    console.log('Fail getting the sensor type: ');
				    writeLog(error);
				});

				//db.ref(`/${SENSORS_TABLE}/${sensorID}/availability`).set('on');
				// db.ref(`/${SENSORS_TABLE}/${sensorID}/availability`).onDisconnect().set('off');
				// listenerSensorStatusRef.onDisconnect().set(0);
				// listenerSensorStatusRef.onDisconnect().set(5);
				// uploadProcessData();
				// getServerTime();
				// uploadCSV();

				// watch the sensor ping value
				// listenerSensorPingRef.on("value", function(ping) {
				// 	if(ping.val() && parseInt(ping.val()) === 1) {
				// 		listenerSensorPingRef.set(0);
				// 	} else {
				// 		var newPingRef = db.ref(`/${SENSORDEVICES_TABLE}/${sensorID}/`);
				// 		newPingRef.update({
				// 			pingVal: 0
				// 		});
				// 	}
				// });

				// sendProgressData();
				resetProgressBar();
				// listenerCalibrationStatusRef.on("value", function(calibrationSnapshot) {
				// 	if(calibrationSnapshot.val() || calibrationSnapshot.val() === 0) {
				// 		switch(parseInt(calibrationSnapshot.val())) {
				// 			case 0:
				// 				console.log('Status is PID calibration Start');
				// 			break;
				// 			case 1:
				// 				console.log('Status is PID calibration Stop');
				// 			break;
				// 			case 2:
				// 				console.log('Status is PID calibration Config Save');
				// 				getCalibtrationData();
				// 			break;
				// 		}
				// 	}
				// });

				listenerSensorStatusRef.on("value", function(snapshot) {
					if(snapshot.val() || snapshot.val() === 0) {
						var value = snapshot.val();
						switch(parseInt(value)) {
							case 0:
								console.log('Online status and None action');
								break;
							case 1:
								console.log('Status is configuration');
								listenerSensorStatusRef.set(0);
								// getConfigure(sensorID);
							break;
							case 2:
								console.log('Status is start');
								// uploadCSV();
							break;
							case 3:
								console.log('Status is stop');
							break;
							case 4:
								console.log('Status is reboot');
							break;
							case 5:
								console.log('Status is debug');
								clearDebug().then((res) => {
									if(res) {
										var csv_file_path = './canlendar.csv';
										uploadDebug(csv_file_path);
									}
								});
							break;
							case 6:
								console.log('Status is shutdown');
							break;
							default:
								console.log('Status is unknown');
								listenerSensorStatusRef.set(0);
						}
					}
				});
			}
		} else {
			console.log('This sensor is not existed in firebase database.');
		}
	},function(error){
	    console.log('Fail getting the sensor: ');
	    writeLog(error);
	});
}

function main() {
	// sendToSlack('sensor status', 0);
	getFirebaseData();
}

function getCalibtrationData() {
	if (sensorID) {
		var sensorCalibrationDataRef = db.ref(`/${CALIBRATIONDATA_TABLE}/${sensorID}/recent`);
		sensorCalibrationDataRef.once('value', calibrationSnap => {
			var calibrationData = calibrationSnap.val();
			db.ref(`/${SENSORDEVICES_TABLE}/${sensorID}/calibrationStatus`).set(1);
			console.log('Calibration Data:');
			console.log(calibrationData);
		});
	}
}

function getBarometricPressure() {
	if (sensorID) {
		var sensorCalibrationDataRef = db.ref(`/${CALIBRATIONDATA_TABLE}/${sensorID}/barometricPressure/value`);
		sensorCalibrationDataRef.on('value', barometricPressureSnap => {
			var barometricPressure = barometricPressureSnap.val();
			console.log('barometric pressure:');
			console.log(barometricPressure);
		});
	}
}

function sendLocationUpdated(lat, lng, address) {
	if(sensorID) {
		var objUpdatedValue = {
			lat: lat,
			lng: lng,
			address: address
		};
		db.ref(`/${SENSORS_TABLE}/${sensorID}`).update(objUpdatedValue);
	} else {
		console.log('The sensor id is not set yet.');
	}
}

var currentModalType;

function updateSignals(wifiIP, cellularIP, wifiSignal, cellularSignal) {
	if (sensorID) {
		var sensorDeviceRef = db.ref(`/${SENSORDEVICES_TABLE}/${sensorID}`);
		sensorDeviceRef.update({
			wifiIP: wifiIP,
			cellularIP: cellularIP,
			wifiSignal: wifiSignal,
			cellularSignal: cellularSignal
		});
	}
}

// send the sensor data to the firebase
function sendProgressData() {
	currentModalType = 0;
	// if(currentModalType) {
		var listenerSensorDeviceRef = db.ref(`/${SENSORCONFIGS_TABLE}/${sensorID}/${currentModalType}`);
		listenerSensorDeviceRef.update({
			runNumber: 1,
			stepNumber: 1,
			runProgressPercent: 1,
			stepProgressPercent: 1,
			stepTotalTime: 10,
			runTotalTime: 10,
			stepRemainTime: 9,
			runRemainTime: 9,
			isFinished: false
		});
	// } else {
	// 	console.log('Error: empty modal type');
	// }
}

function resetProgressBar() {
	if (sensorID) {
		var sensorConfigsRef = db.ref(`/${SENSORCONFIGS_TABLE}/${sensorID}`);
		sensorConfigsRef.once('value', sensorConfigsRes => {
			var sensorConfigsData = sensorConfigsRes.val();
			if (sensorConfigsData && sensorConfigsData['Current_Modal_Type']) {
				db.ref(`/${SENSORCONFIGS_TABLE}/${sensorID}/${sensorConfigsData['Current_Modal_Type']}`)
					.update({
						runNumber: 0,
						stepNumber: 0,
						runProgressPercent: 0,
						stepProgressPercent: 0,
						stepTotalTime: 0,
						runTotalTime: 0,
						stepRemainTime: 0,
						runRemainTime: 0,
						isFinished: false
					});
			}
		});
	}
}

function getConfigure(sensorID) {
	var getSensorConfigTypeRef = db.ref(`/${SENSORCONFIGS_TABLE}/${sensorID}`);

	getSensorConfigTypeRef.once("value", function(configSnapshot) {
		var configDataNew = configSnapshot.val();
		var currentModalType = configDataNew['Current_Modal_Type'];
        configData = configDataNew[currentModalType];
		var type = configData['Current_Type'];
		if(type) {
			if(configData.hasOwnProperty(type)) {
				console.log('---config data--');
				console.log(configData[type]);
			} else {
				console.log('For the type, there is no data.');
			}
		} else {
			console.log('Type is not defined.');
		}
		
	},function(error){
	    console.log('Fail getting the sensor type: ');
	    writeLog(error);
	});
}

function getCategoryParameters(category) {
	return new Promise((resolve, reject) => {
		db.ref(`/${SENSORTYPE_TABLE}/${sensorTypeID}/${category}`).once("value", function(keys) {
			var types = keys.val();

			if(!types) {
				reject('There is no keys');
			} else {
				var heads = types.heads?types.heads.filter(function(f) {return !f.primaryKey;}).map(function(a) {return a.id;}):null;
				var rows = types.rows?types.rows.map(function(a) {return a.id;}):null;

				db.ref(`/${SENSORDATA_TABLE}/${category}/${sensorID}/recent/value`).once("value", function(params) {
					let keys = params.val();
					let parameters = {};
					if (!keys) {
						reject('No sensor data');
					} else {
						for(var r = 0; r < rows.length; r ++) {
							let rowKeys;
	
							if(keys.hasOwnProperty(rows[r])) {
								if(heads) {
									rowKeys = {};
	
									for(var h = 0; h < heads.length; h ++) {
										if(keys[rows[r]].hasOwnProperty(heads[h])) {
											rowKeys[heads[h]] = keys[rows[r]][heads[h]];
										} else {
											rowKeys[heads[h]] = '';
										}
									}
								} else {
									rowKeys= keys[rows[r]];
								}
	
								parameters[rows[r]] = rowKeys;
							} else if(heads) {
								for(var h = 0; h < heads.length; h ++) {
									rowKeys[heads[h]] = '';
								}
	
								parameters[rows[r]] = rowKeys;
							}
						}
						resolve(parameters);
					}
				},function(error){
					console.log(error);
					reject('Fail getting the category parameters');
				});
			}
		},function(error){
			console.log(error);
			reject('Fail getting the sensor type');
		});
	});
}

function getAnalyticalParams() {
	db.ref(`/${SENSORTYPE_TABLE}/${sensorTypeID}/vocAnalytics`).once("value", function(key) {
		var type = key.val();
		var heads = type.heads.filter(function(f) {return !f.primaryKey;}).map(function(a) {return a.id;});
		var rows = type.rows.map(function(a) {return a.id;});

		db.ref(`/${SENSORDATA_TABLE}/vocAnalytics/${sensorID}/recent/value`).once("value", function(param) {
			let keys = param.val();
			let params = {};

			for(var r = 0; r < rows.length; r ++) {
				let rowKeys = {};
				if(keys.hasOwnProperty(rows[r])) {
					for(var h = 0; h < heads.length; h ++) {
						if(keys[rows[r]].hasOwnProperty(heads[h])) {
							rowKeys[heads[h]] = keys[rows[r]][heads[h]];
						} else {
							rowKeys[heads[h]] = '';
						}
					}
				} else {
					for(var h = 0; h < heads.length; h ++) {
						rowKeys[heads[h]] = '';
					}
				}

				params[rows[r]] = rowKeys;
			}

			console.log('---Voc Analytical Params---');
			console.log(params);
		},function(error){
			console.log('Fail getting the vocAnalytics params: ');
		});
	},function(error){
		console.log('Fail getting the sensor type: ');
	});
}

function uploadAnalyticData() {
	var csv_file_path = './canlendar.csv';
	gServerTime = admin.database.ServerValue.TIMESTAMP;
	const fileMime = mime.lookup(csv_file_path);
	var csv_file_name = path.basename(csv_file_path);
    var uploadTo = path.join(ANALYTICALSTORAGE_TABLE, sensorCustomerID, sensorZoneID, sensorID, csv_file_name);
    console.log("uploadto:", uploadTo);
    var metadata = {
    	contentType: fileMime,
    	cacheControl: "public, max-age=300",
    	customerId: sensorCustomerID
    };
    
    bucket.upload(csv_file_path,{
	    destination:uploadTo,
	    public:true,
	    metadata: metadata
	}, function(err, file) {
	    if(err)
	    {
	        console.log(err);
	        return;
	    }
	    console.log(createPublicFileURL(uploadTo));
	    updateAnalyticalDataPath(uploadTo, createPublicFileURL(uploadTo), file['metadata']['size']);
	});
}

/*update csv url field of the firebase*/
function updateAnalyticalDataPath(path, storageUrl, fileSize) {
	getServerTime();
	// var sensorCsvRef = db.ref(`/${RAWDATA_TABLE}/${sensorID}`);
	// sensorCsvRef.push({
	// 	timestamp: admin.database.ServerValue.TIMESTAMP,
	// 	storagePath: path,
	// 	storageUrl: storageUrl,
	// 	fileSize: fileSize,
	// 	stepType: 'Sampling',
	// 	cycleIndex: admin.database.ServerValue.TIMESTAMP
	// }).then((snap) => {
	// 	var key = snap.key;
	// 	var sensorCsvDataRef = db.ref(`/${RAWDATA_TABLE}/${sensorID}/${key}`);
		
	// 	sensorCsvDataRef.once("value", function(csvData) {
	// 		var data = csvData.val();
	// 		console.log('---first timestamp in cycle');
	// 		console.log(data['cycleIndex']);
	// 		console.log(new Date(data['cycleIndex']).toLocaleString())
	// 	},function(error){
	// 	    console.log('Fail getting the csv data: ');
	// 	    writeLog(error);
	// 	});
	// });
}

var gServerTime = 0;
/*upload csv file to the firebase storage*/
function uploadCSV() {
	var csv_file_path = './test.csv.gz';
	gServerTime = admin.database.ServerValue.TIMESTAMP;
	const fileMime = mime.lookup(csv_file_path);
	var csv_file_name = path.basename(csv_file_path);
	var uploadTo = path.join(SENSORSTORAGES_TABLE, sensorCustomerID, sensorZoneID, sensorID, csv_file_name);
	console.log("uploadto:", uploadTo);
	var metadata = {
		contentType: 'text/plain',
		contentEncoding: 'gzip',
		cacheControl: "public, max-age=300",
		customerId: sensorCustomerID
	};
	
	bucket.upload(csv_file_path,{
		destination:uploadTo,
		public:true,
		metadata: metadata
	}, function(err, file) {
		if(err)
		{
			console.log(err);
			return;
		}
		console.log(createPublicFileURL(uploadTo));
		updateSensorCsvPath(uploadTo, createPublicFileURL(uploadTo), file['metadata']['size']);
	});
}

function uploadProcessData() {
	var csv_file_path = './canlendar.csv';
	const fileMime = mime.lookup(csv_file_path);
	var csv_file_name = path.basename(csv_file_path);
    var uploadTo = path.join(PROCESSSTORAGE_TABLE, sensorCustomerID, sensorZoneID, sensorID, csv_file_name);
    console.log("uploadto:", uploadTo);
    var metadata = {
    	contentType: fileMime,
    	cacheControl: "public, max-age=300",
    	customerId: sensorCustomerID
    };
    
    bucket.upload(csv_file_path,{
	    destination:uploadTo,
	    public:true,
	    metadata: metadata
	}, function(err, file) {
	    if(err)
	    {
	        console.log(err);
	        return;
	    }
	    console.log(createPublicFileURL(uploadTo));
	    updateProcessedDataPath(uploadTo, createPublicFileURL(uploadTo), file['metadata']['size']);
	});
}

function deleteStorageFile(filePath) {
	var promise = new Promise(function(resolve, reject) {
		bucket.file(filePath).delete().then(function(res) {
			resolve(true);
		}).catch(function(err) {
			resolve(false);
		});
	});
	return promise;
}

/*upload debug file to the firebase storage*/
function clearDebug() {
	var promise = new Promise(function(resolve, reject) {
		db.ref(`/${DEBUG_DATA_TABLE}/${sensorID}`).once("value", function(debug) {
			var debugFileList = debug.val();
			var promises = [];
			
			if(debugFileList) {
				for (key in debugFileList) {
					if(debugFileList[key] && debugFileList[key]['storagePath']) {
						promises.push(deleteStorageFile(debugFileList[key]['storagePath']));
					}
				}
	
				Promise.all(promises)
					.then(function(res) {
						db.ref(`/${DEBUG_DATA_TABLE}/${sensorID}`).remove()
							.then(() => {
								resolve(true);
							}).catch(function(err) {
								resolve(false);
							});
					}).catch(function(err) {
						resolve(false);
					});
			} else {
				resolve(true);
			}
		},function(error){
			console.log('Fail getting the start time: ');
			writeLog(error);
			resolve(false);			
		});
	});

	return promise;
}

function uploadDebug(csv_file_path) {
	gServerTime = admin.database.ServerValue.TIMESTAMP;
	const fileMime = mime.lookup(csv_file_path);
	var csv_file_name = path.basename(csv_file_path);
    var uploadTo = path.join(DEBUG_STROAGE_TABLE, sensorCustomerID, sensorZoneID, sensorID, csv_file_name);
    var metadata = {
    	contentType: fileMime,
    	cacheControl: "public, max-age=300",
    	customerId: sensorCustomerID
    };
    
    bucket.upload(csv_file_path,{
	    destination:uploadTo,
	    public:true,
	    metadata: metadata
	}, function(err, file) {
	    if(err)
	    {
	        console.log(err);
	        return;
	    }
	    console.log(createPublicFileURL(uploadTo));
	    updateDebugPath(uploadTo, createPublicFileURL(uploadTo), file['metadata']['size']);
	});
}

function updateDebugPath(path, storageUrl, fileSize) {
	var debugDataRef = db.ref(`/${DEBUG_DATA_TABLE}/${sensorID}`);
	debugDataRef.push({
		storagePath: path,
		storageUrl: storageUrl,
		fileSize: fileSize,
		timestamp: admin.database.ServerValue.TIMESTAMP
	});
}

var strStartTime;

function getServerTime() {
	strStartTime = null;
	var sensorDeviceRef = db.ref(`/${SENSORDEVICES_TABLE}/${sensorID}`);
	sensorDeviceRef.update({
		startTimestamp: admin.database.ServerValue.TIMESTAMP
	}).then(() => {
		sensorDeviceRef.once("value", function(info) {
			var data = info.val();
			strStartTime = data['startTimestamp'];
			console.log('-focusing--');
			console.log(strStartTime);
		},function(error){
		    console.log('Fail getting the start time: ');
		    writeLog(error);
		});
	});
}

function updateProcessedDataPath(path, storageUrl, fileSize) {
	var processedDataRef = db.ref(`/${PROCESSEDDATA_TABLE}/${sensorID}`);
	processedDataRef.push({
		Chromatogram: {
			storagePath: Chromatogram_Path,
			storageUrl: Chromatogramdown_LoadUrl,
			fileSize: Chromatogramdown_FileSize,
			timestamp: admin.database.ServerValue.TIMESTAMP
		},
		DetectedPeaks: {
			storagePath: DetectedPeaks_Path,
			storageUrl: DetectedPeaks_LoadUrl,
			fileSize: DetectedPeaks_FileSize,
			timestamp: admin.database.ServerValue.TIMESTAMP
		},
		startTimestamp: admin.database.ServerValue.TIMESTAMP
	});
}

/*get the csv file url for download*/
function createPublicFileURL(storageName) {
    return `http://storage.googleapis.com/${bucketName}/${encodeURIComponent(storageName)}`;
}

/*update csv url field of the firebase*/
function updateSensorCsvPath(path, storageUrl, fileSize) {
	getServerTime();
	// var sensorCsvRef = db.ref(`/${RAWDATA_TABLE}/${sensorID}`);
	// sensorCsvRef.push({
	// 	timestamp: admin.database.ServerValue.TIMESTAMP,
	// 	storagePath: path,
	// 	storageUrl: storageUrl,
	// 	fileSize: fileSize,
	// 	stepType: 'Sampling',
	// 	cycleIndex: admin.database.ServerValue.TIMESTAMP
	// }).then((snap) => {
	// 	var key = snap.key;
	// 	var sensorCsvDataRef = db.ref(`/${RAWDATA_TABLE}/${sensorID}/${key}`);
		
	// 	sensorCsvDataRef.once("value", function(csvData) {
	// 		var data = csvData.val();
	// 		console.log('---first timestamp in cycle');
	// 		console.log(data['cycleIndex']);
	// 		console.log(new Date(data['cycleIndex']).toLocaleString())
	// 	},function(error){
	// 	    console.log('Fail getting the csv data: ');
	// 	    writeLog(error);
	// 	});
	// });
}

// set local variable back end data
function setSensorCategories(sensorTypeData) {
	if(!sensorTypeData) {
		writeLog('The sensorType data is not existed');
		return;
	}

	for(var i=0; i<categories.length; i++) {
		var categoryName = categories[i];

		if(sensorTypeData.hasOwnProperty(categoryName)) {
			sensorTypes[categoryName] =	sensorTypeData[categoryName]
		}
	}
}

// write the error log to the log.txt
function writeLog(txt) {
	var dt = dateTime.create();
	var log = dt.format('Y-m-d H:M:S');
	log += '\n';
	log += txt;
	log += '\n';
	fs.appendFileSync('log.txt', log);
}

// send the sensor data to the firebase
function sendSensorData() {
	var basicData = [];

	// status basic data
	basicData[0] = {
		'Status1': 'Normal',
		'Power1': 'On',
		'Voltage level1': 'Check',
		'Temp1 (F)': 24.22,
		'Humidity level1 (%)': 9,
		'Barometer1 (in)': 100,
		'Barometer1 (mb)': 8,
		'Pump status1': 'Stopped',
		'Last sample at1': '2017-4-17',
		'bm3nVoeJ6n': '192.168.0.12'
	};

	// vocAnalytics basic data
	basicData[1] = {
		'Benzene1': {
			'ppb1': 12
		},
		'Toluene1': {
			'ppb1': 11
		},
		'm-xylene1': {
			'ppb1': 13
		},
		'O-Xylene1': {
			'ppb1': 14
		},
		'Mesitylene1': {
			'ppb1': 15
		},
		'Hexanal1': {
			'ppb1': 16
		},
		'Chlorobenzene1': {
			'ppb1': 17
		},
		'Chlorohexane1': {
			'ppb1': 18
		}
	};

	// vocRaw basic data
	basicData[2] = {
		'Raw Capacitance (pF)1': 22
	};

	// processedData basic data
	basicData[3] = {
		'Compensated Capacitance1': 32
	};

	// debug basic data
	basicData[4] = {
		'Debug1': 'This sensor is broken because of some errors.'
	};

	sendCategory(basicData[0], 0);
}

// check if the input value is followed by the template value type
function checkValueType(value, valueStructure) {
	if(valueStructure && valueStructure.hasOwnProperty('valueType')) {
		var result = false;
		switch(valueStructure['valueType']) {
		    case valueTypes[0]: // option
		        if(valueStructure.hasOwnProperty('defaultValue') && valueStructure['defaultValue'].length > 0) {
		        	if(valueStructure['defaultValue'].indexOf(value) > -1) {
		        		result = true
		        	} else {
		        		result = false;
		        		writeLog(value + ' is not existed in default value.');
		        	}
		        } else {
		        	result = false;
		        	writeLog('Default value property is not existed.');
		        }

		        return result;
		        break;
		    case valueTypes[1]: //  number
		        return !isNaN(parseFloat(value)) && isFinite(value);
		        break;
		    default:
		        if(value) {
		        	return true;
		        } else {
		        	return false;
		        }
		}
	} else {
		writeLog('valueType property is not existed.');
		return false;
	}
}


// get the sensor data field id with the name
/*
- params
name: name
value: data value
template: field structure
- return
id if id is existed for the value, null if not
*/
function getTemplateID(name, value, template) {
	if(template && template.length > 0) {
		for(var i=0; i<template.length; i++) {
			if(name == template[i]['id']) {
				var result = checkValueType(value, template[i]);
				if(result) {
					return template[i]['id'];
				} else {
					return null;
				}
			}
		}	
	} else {
		writeLog('Template is not existed');
	}

	return null;
}


// get primary id in the sensor type fields
/*
- params
heads: params
- return
primary key id
*/
function getPrimaryID(heads) {
	if(heads && heads.length > 0) {
		for(var i=0; i<heads.length; i++) {
			if(heads[i].hasOwnProperty('primaryKey') && heads[i]['primaryKey']) {
				if(heads[i].hasOwnProperty('id')) {
					return heads[i]['id'];	
				} else {
					writeLog('id is not existed.');
					return null;
				}
			} else {
				writeLog('primaryKey is not existed.');
				return null;
			}
		}
	} else {
		writeLog('head is not existed.');
		return null;
	}
}

// change the name keys to id ones
/*
- params
data: the data should be sent to sensorData's category
template: sensor category's template structure
type: true if heads property is existed, false if not
*/
function changeRowFieldKeys(data, template, type) {
	var changedData = {};
	if(type) { // heads is existed
		var primaryKeyID = getPrimaryID(template['heads']);
		if(!primaryKeyID) {
			return;
		} 

		for (rowKey in data ) { // rows
			var rowData = {};
			for (headKey in data[rowKey] ) { // rows
				var headId = getTemplateID(headKey, data[rowKey][headKey], template['heads']);
				if(headId) {
					rowData[headId] = data[rowKey][headKey];
				}
			}

			rowData[primaryKeyID] = 'primaryKey';

			var rowId = getTemplateID(rowKey, data[rowKey], template['rows']);
			if(rowId) {
				changedData[rowId] = rowData;	
			}

		}
	} else {
		for (key in data ) {
			var id = getTemplateID(key, data[key], template['rows']);
			if(id) {
				changedData[id] = data[key];	
			}
			
		}
	}

	return changedData;
}

// change the name to the id
/*
- params
data: basic data of the sensor
template: sensor field template
- return
the data which is changed the name field to the id one
*/
function changeHeadFieldKeys(data, template) {
	var primaryKeyID = getPrimaryID(template);
	if(!primaryKeyID) {
		return;
	}
	var changedData = {};

	for (key in data ) {
		var id = getTemplateID(key, data[key], template);
		if(id) {
			changedData[id] = data[key];	
		}
		
	}

	changedData[primaryKeyID] = 'primaryKey';

	return changedData;
}

// get real data to send to the firebase with the basic sensor data
/*
- params
value: basic data of the sensor
categoryTemplate: category template
- return
real data to send to the firebase
*/
function getSendValue(value, categoryTemplate) {
	var result;
	if(categoryTemplate.hasOwnProperty('tableType')) {
		if(categoryTemplate['tableType'] === tableTypes[0]) { //row-header type

			if(categoryTemplate.hasOwnProperty('heads') && categoryTemplate['heads']) {
				result = changeRowFieldKeys(value, categoryTemplate, true);
			} else {
				result = changeRowFieldKeys(value, categoryTemplate, false);
			}


		} else { // header type
			result = changeHeadFieldKeys(value, categoryTemplate['heads']);
		}
	} else {
		writeLog('The tableType property is not existed.');
		result = null;
	}

	return result
}

// send real category data to the firebase for saving
/*
- params
basicData: basic data which sensor get through device
categoryID: 0: status, 1: vocAnalytics, 2: vocRaw, 3: processedData, 4: debug
*/
function sendCategory(basicData, categoryID) {
	var categoryName = categories[categoryID];
	var sendValue;

	if(sensorTypes.hasOwnProperty(categoryName)) {
		var categoryTemplate = sensorTypes[categoryName];
		sendValue = getSendValue(basicData, categoryTemplate);
	} else {
		writeLog(`${categoryName} property is not existed`);
		return;
	}

	// uploadCSV();

	if(sendValue) {
		var sendData = {
			"timestamp": admin.database.ServerValue.TIMESTAMP,
			"value": sendValue
		};

		ref = db.ref(`/${SENSORDATA_TABLE}`);

		var dataRef = ref.child(`${categoryName}/${sensorID}/series`);
		var newPostRef = dataRef.push();
		newPostRef.set(sendData);
		var recentRef = ref.child(`${categoryName}/${sensorID}/recent`);
		recentRef.update(sendData);
		console.log(`The category-${categoryName} is sent successfully.`);
	} else {
		console.log(`The category-${categoryName} is empty!`);
	}
}
