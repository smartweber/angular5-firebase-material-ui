const admin      = require('firebase-admin');
const csv        = require("fast-csv");
const axios      = require('axios');
const request    = require('request');
const cors       = require('cors')({ origin: true });
const btoa       = require('btoa');
const functions  = require('firebase-functions');
const moment     = require('moment-timezone');
const fs         = require('fs');
const projectId  = 'test-***';
const bucketName = `${projectId}.appspot.com`;
const keyFilename = './service-account.json';
const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
  projectId,
	keyFilename
});
const bucket = storage.bucket(bucketName);

const api_key = 'key-xxx';
const domain  = 'mg.test.com';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
// init the firebase
const serviceAccount = require("./service-account.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://test-***.firebaseio.com"
});

//define system mode
const objSystemMode = {
	dev: '_Dev',
	test: '_Test',
	prod: ''
};
const arrStrSensorStatus = ['on', 'off'];
const strSensorResponse = '111';

/**
 * check sensors status in real time on the cron job
 * @param {*} strSystemMode 
 */
function checkSensorsStatusInRealtime(strSystemMode) {
	var strDeviceTable = 'SensorDevices' + objSystemMode[strSystemMode];
	return new Promise((resolve, reject) => {
		admin.database().ref(strDeviceTable).once('value', devicesRes => {
			var sensorResponsePromises = [];
			var deviceData = devicesRes.val();
			if (deviceData) {
				for (var key in deviceData) {
					if (!deviceData.hasOwnProperty(key)) continue;
					if (deviceData[key] && deviceData[key]['isInRealTime']) {
						sensorResponsePromises.push(checkSensorResponse(key, strSystemMode));
					}
				}

				Promise.all(sensorResponsePromises)
					.then(() => {
						resolve(true);
					});
			} else {
				resolve(true);
			}
		});
	});
}

/**
 * check sensor response
 * @param {*} key 
 * @param {*} strSystemMode 
 */
function checkSensorResponse(key, strSystemMode) {
	var strDeviceTable = 'SensorDevices' + objSystemMode[strSystemMode];
	var strSensorTable = 'Sensors' + objSystemMode[strSystemMode];
	admin.database().ref(`${strDeviceTable}/${key}`).update({
		resVal: Math.random().toString(36).slice(-5)
	});
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			admin.database().ref(`${strDeviceTable}/${key}`).once('value', deviceRes => {
				var deviceData = deviceRes.val();
				if (deviceData && deviceData['resVal'].toString() === strSensorResponse) { // sensor is running
					admin.database().ref(`/${strSensorTable}/${key}/availability`).set(arrStrSensorStatus[0]);
				} else { // sensor is offline
					admin.database().ref(`/${strSensorTable}/${key}/availability`).set(arrStrSensorStatus[1]);
				}
				resolve();
			});
		}, 6000);
	});
}

/**
 * send daily sensors report mail
 * @param {*} title 
 * @param {*} content 
 */
function sendDailyTestMail(title, content) {
	var mailTo = ['test.com'];
	var data = {
		from: 'no-reply@test.com',
		subject: title,
		html: content,
		to: mailTo
	};

	return new Promise((resolve, reject) => {
		mailgun.messages().send(data, function(error, body) {
			if (error) {
				return reject(error);
			}

			return resolve();
		});
	});
}

/**
 * 
 * @param {*} configData: Mode_Config data
 * @param {*} configDataKey: config data key
 * get the every step action total time in SensorConfigs table
 */
function getStepActionRunTime(configData, configDataKey, totalRunTime) {
	var stepTime = 0;
	var stepActions = ['Measurement Run', 'Data Processing', 'Data Upload', 'Chemical Recognition'];
	switch (configData[configDataKey]['stepAction']) {
		case stepActions[0]:
			stepTime = parseInt(configData[configDataKey]['Total_Run_Time']);
			break;
		case stepActions[1]:
			stepTime = 3 * 60;
			break;
		case stepActions[2]:
			stepTime = 6;
			break;
		case stepActions[3]:
			stepTime = 20;
			break;
	}
	return stepTime;
}

/**
 * 
 * @param {*} data: configration data in current modal type of the SensorConfigs
 * calculate total run time with configuration data
 */
function calculateRunTime(data) {
	var totalTime = 0;

	if (data['Current_Type']) {
		var cycleNumber = parseInt(data[data['Current_Type']]['Num_of_Cycle']);
		var configData = data[data['Current_Type']]['Mode_Config'];
		for ( var key in configData ) {
			if (!configData[key]) continue;
			totalTime += getStepActionRunTime(configData, key, totalTime);
		}

		totalTime *= cycleNumber;
	}

	return totalTime;
}

/**
 * process to test specific sensor
 * @param {*} key 
 * @param {*} configFileKey 
 * @param {*} sensorData 
 * @param {*} strSystemMode 
 */
function processTestSensor(key, configFileKey, sensorData, strSystemMode) {
	var strTestDeviceTable = 'CronJobTestSensor' + objSystemMode[strSystemMode];
	var strConfigurationTable = 'Configurations' + objSystemMode[strSystemMode];
	var strSensorConfigurationTable = 'SensorConfigs' + objSystemMode[strSystemMode];
	var strSensorDeviceTable = 'SensorDevices' + objSystemMode[strSystemMode];
	var strAddedTestDeviceKey = '';

	// update the cron job test sensor table's timestamp
	var logPath = `${strTestDeviceTable}/${key}/log`;
	admin.database().ref(logPath).push({
		startTimestamp: admin.database.ServerValue.TIMESTAMP,
		status: -1
	}).then(testDeviceRes => {
		strAddedTestDeviceKey = testDeviceRes.key;
		admin.database().ref(logPath).orderByChild('startTimestamp').limitToLast(10).once('value', log => {
			if (log.val()) {
				admin.database().ref(logPath).set(log.val());
			}
		});
	});

	return new Promise((resolve) => {
		admin.database().ref(`${strSensorDeviceTable}/${key}`).once('value', deviceRes => {
			var deviceData = deviceRes.val();
			if (deviceData && deviceData['isInRealTime']) {
				// device is running now
				if (parseInt(deviceData['actionStatus']) === 2) {
					var startTime = moment().tz('America/Los_Angeles').format();
					if (deviceData['runType'] === 'DailyTest') {
						var title = 'Daily Sensor Test Report for ' + sensorData['name'];
						var content = `The previous test run has not completed yet. Current time is ${startTime}(PST time)`;
						return sendDailyTestMail(title, content).then(() => {
							return Promise.all([
								admin.database().ref(`${logPath}/${strAddedTestDeviceKey}`).update({
									endTimestamp: admin.database.ServerValue.TIMESTAMP,
									status: 1
								}),
								admin.database().ref(`${strSensorDeviceTable}/${key}`).update({
									runType: ''
								})
							]).then(() => {
								return resolve(startTime);
							}).catch(() => {
								return resolve(null);
							});
						}).catch(() => {
							return resolve(null);
						});
					} else {
						var title = 'Daily Sensor Test Report for ' + sensorData['name'];
						var content = `Right now some run is in progress. Current time is ${startTime}(PST time)`;
						return sendDailyTestMail(title, content).then(() => {
							return Promise.all([
								admin.database().ref(`${logPath}/${strAddedTestDeviceKey}`).update({
									endTimestamp: admin.database.ServerValue.TIMESTAMP,
									status: 1
								}),
								admin.database().ref(`${strSensorDeviceTable}/${key}`).update({
									runType: ''
								})
							]).then(() => {
								return resolve(startTime);
							}).catch(() => {
								return resolve(null);
							});
						}).catch(() => {
							return resolve(null);
						});
					}
				} else {
					admin.database().ref(`${strSensorDeviceTable}/${key}`).update({
						runType: 'DailyTest'
					});

					// Get configuration file with the key and parse in configuration table
					admin.database().ref(`${strConfigurationTable}/${configFileKey}`).once('value', configRes => {
						var configurationData = configRes.val();
		
						if (configurationData['configUrl'] && configurationData['path'] && configurationData.hasOwnProperty('modalType')) {
							var configFileName = (configurationData['path'] && configurationData['path'].indexOf('/') > -1) ? configurationData['path'].split('/').pop() : '';
							// parse config file
							axios.get(configurationData['configUrl'])
								.then(post => {
									var totalRunTime = calculateRunTime(post.data);
									admin.database().ref(`${logPath}/${strAddedTestDeviceKey}`).update({
										totalRunTime: totalRunTime * 1.1
									});
									admin.database().ref(`${strSensorConfigurationTable}/${key}`).set({
										Current_Modal_Type: configurationData['modalType'],
										File_Name: configFileName,
										[configurationData['modalType']]: post.data
									}).then(() => {
										admin.database().ref(`${strSensorDeviceTable}/${key}`).update({
											actionStatus: 2
										});
										return resolve(moment().tz('America/Los_Angeles').format());
									});
									return resolve(null);
								})
								.catch(() => {
									return resolve(null);
								});
						} else {
							return resolve(null);
						}
					});
				}
			} else {
				return resolve(null);
			}
		});
	});
}

/**
 * check the specific sensor for daily test
 * @param {*} deviceDetail 
 * @param {*} key 
 * @param {*} strSystemMode 
 */
function checkDailyTestSensor(deviceDetail, key, strSystemMode) {
	return new Promise((resolve) => {
		var date = moment().tz('America/Los_Angeles').format();
		if (deviceDetail['configFileKey'] && Number.isInteger(deviceDetail['configSchedule'])) {
			var configSchedule = parseInt(deviceDetail['configSchedule']);
			if (configSchedule >= 4) {
				configSchedule -= 4;
			} else {
				configSchedule += 20;
			}
			var fromTime = moment().tz('America/Los_Angeles').format('YYYY-MM-DD');
			fromTime = moment.tz(fromTime, 'America/Los_Angeles').set({ hours: configSchedule }).format();
			var toTime = moment().tz('America/Los_Angeles').format('YYYY-MM-DD');

			if (configSchedule === 23) {
				toTime = moment.tz(toTime, 'America/Los_Angeles').add(1, 'days').format();
			} else {
				toTime = moment.tz(toTime, 'America/Los_Angeles').set({ hours: configSchedule + 1 }).format();
			}

			if (date >= fromTime && date < toTime) {
				var strSensorTable = 'Sensors' + objSystemMode[strSystemMode];

				admin.database().ref(`${strSensorTable}/${key}`).once('value', sensorRes => {
					var sensorData = sensorRes.val();
					if (sensorData) {
						processTestSensor(key, deviceDetail['configFileKey'], sensorData, strSystemMode).then(res => {
							return resolve(res);
						});
					} else {
						return resolve(null);
					}
				});
			} else {
				return resolve(null);
			}
		} else {
			return resolve(null);
		}
	});
}

function startCronJobTestDevices(strSystemMode) {
	return new Promise((resolve) => {
		var strTestDeviceTable = 'CronJobTestSensor' + objSystemMode[strSystemMode];
		admin.database().ref(strTestDeviceTable).once('value', function(res) {
			var devices = res.val();
			if (devices) {
				var promises = [];

				for (var key in devices) {
					if(!devices.hasOwnProperty(key)) continue;
					promises.push(checkDailyTestSensor(devices[key], key, strSystemMode));
				}

				Promise.all(promises).then(() => {
					return resolve(true);
				});
			} else {
				return resolve(null);
			}
		});
	});
}

/**
 * update test run log and send a error notification
 * @param {*} devicesData 
 * @param {*} sensorKey 
 * @param {*} strSystemMode 
 * @param {*} startTime 
 * @param {*} endTime 
 */
function updateTestRunErroLog(devicesData, sensorKey, strSystemMode, startTime, endTime) {
	var strTestDeviceTable = 'CronJobTestSensor' + objSystemMode[strSystemMode];
	var strSensorTable = 'Sensors' + objSystemMode[strSystemMode];
	return new Promise((resolve) => {
		admin.database().ref(`${strTestDeviceTable}/${sensorKey}`).update({
			log: devicesData[sensorKey]['log']
		});

		admin.database().ref(`${strSensorTable}/${sensorKey}`).once('value', sensorRes => {
			var sensorData = sensorRes.val();
			if (sensorData) {
				var title = 'Daily Sensor Test Report for ' + sensorData['name'];
				var content = `The test run is failed. It has started at ${startTime}(PST time) and finished at ${endTime}(PST time).`;
				return sendDailyTestMail(title, content).then(() => {
					return resolve(true);
				}).catch(() => {
					return resolve(true);
				});
			} else {
				return resolve(null);
			}
		});
	});
}

function sensorDeviceFinsish(strSystemMode, key) {
	var strSensorTable = 'Sensors' + objSystemMode[strSystemMode];
	var strDeviceTable = 'SensorDevices' + objSystemMode[strSystemMode];
	var strTestDeviceTable = 'CronJobTestSensor' + objSystemMode[strSystemMode];
	var logPath = `${strTestDeviceTable}/${key}/log`;

	return new Promise((resolve, reject) => {
		admin.database().ref(`${strDeviceTable}/${key}`).once('value', devicesRes => {
			var deviceData = devicesRes.val();
			if (deviceData && deviceData['runType'] === 'DailyTest') {
				// get last log
				admin.database().ref(logPath).orderByChild('startTimestamp').limitToLast(1).once('value', log => {
					var logData = log.val();
					if (logData) {
						for(var logKey in logData) {
							if (!logData.hasOwnProperty(logKey)) {
								return reject(null);
							}
							// update end time and status to the log, and send success email
							admin.database().ref(`${logPath}/${logKey}`).update({
								endTimestamp: admin.database.ServerValue.TIMESTAMP,
								status: 1
							});
							var startTime = moment(logData[logKey]['startTimestamp']).tz('America/Los_Angeles').format();
	
							admin.database().ref(`${strSensorTable}/${key}`).once('value', sensorRes => {
								var sensorData = sensorRes.val();
								if (sensorData) {
									var title = 'Daily Sensor Test Report for ' + sensorData['name'];
									var content = `The sensor has run without any problem. The test run was started at ${startTime}(PST time)`;
									return sendDailyTestMail(title, content)
										.then(() => {
											// update run type
											admin.database().ref(`${strDeviceTable}/${key}`).update({
												runType: ''
											}).then(() =>{
												return resolve(sensorData['name']);
											});
										})
										.catch(error => {
											admin.database().ref(`${strDeviceTable}/${key}`).update({
												runType: ''
											}).then(() =>{
												return reject(error);
											});
										});;
								} else {
									return resolve(null);
								}
							});
						}
					} else {
						return resolve(null);
					}
				});
			} else {
				return resolve(null);
			}
		});
	});
}

function runResultInRealtime(strSystemMode) {
	var currentDate = new Date();
	var currentTimeStamp = currentDate.getTime();
	var strTestDeviceTable = 'CronJobTestSensor' + objSystemMode[strSystemMode];
	return new Promise((resolve) => {
		admin.database().ref(strTestDeviceTable).once('value', devicesRes => {
			var devicesData = devicesRes.val();
			if (devicesData) {
				var devicesPromises = [];
				for (var sensorKey in devicesData) {
					if (!devicesData.hasOwnProperty(sensorKey)) continue;
					var endTest = false;
					var latestStartTimestamp = 0;
					if (devicesData[sensorKey]['log']) {
						for (var logKey in devicesData[sensorKey]['log']) {
							if (!devicesData[sensorKey]['log'].hasOwnProperty(logKey)) continue;
							var startTimestamp = devicesData[sensorKey]['log'][logKey]['startTimestamp'] ? parseInt(devicesData[sensorKey]['log'][logKey]['startTimestamp']) : 0;
							var finishedSeconds = devicesData[sensorKey]['log'][logKey]['totalRunTime'] ? parseFloat(devicesData[sensorKey]['log'][logKey]['totalRunTime']) : 0;
							var status = (devicesData[sensorKey]['log'][logKey]['status'] || devicesData[sensorKey]['log'][logKey]['status'] === 0) ? parseInt(devicesData[sensorKey]['log'][logKey]['status']) : -1;
							if (startTimestamp > latestStartTimestamp) {
								latestStartTimestamp = startTimestamp;
							}
							if ((currentTimeStamp - startTimestamp) / 1000 >= finishedSeconds && [0, 1].indexOf(status) < 0) {
								devicesData[sensorKey]['log'][logKey]['endTimestamp'] = admin.database.ServerValue.TIMESTAMP;
								devicesData[sensorKey]['log'][logKey]['status'] = 0;
								endTest = true;
							}
						}
					}
	
					if (endTest && latestStartTimestamp > 0) {
						var startTime = moment(latestStartTimestamp).tz('America/Los_Angeles').format();
						var endTime = moment().tz('America/Los_Angeles').format();
						var devicePromise = updateTestRunErroLog(devicesData, sensorKey, strSystemMode, startTime, endTime);
						devicesPromises.push(devicePromise);
					}
				}

				if (devicesPromises.length > 0) {
					Promise.all(devicesPromises).then(() => {
						return resolve(true);
					});
				} else{
					return resolve(null);
				}
			} else {
				return resolve(null);
			}
		});
	});
}

function createSystemParameterReport(strSystemMode) {
	return new Promise((resolve) => {
		var strDataTable = 'SensorData' + objSystemMode[strSystemMode];
		admin.database().ref(`${strDataTable}/status`).once('value', snapShot => {
			var sensors = snapShot.val();
			if (!sensors || sensors && Object.keys(sensors).length === 0) {
				resolve({
					status: 'Fail',
					msg: 'Empty sensors'
				});
			} else {
				var sensorResponsePromises = [];

				for (const strSensorKey in sensors) {
					if (sensors.hasOwnProperty(strSensorKey)) {
						sensorResponsePromises.push(uploadSystemParameterFile(strSystemMode, strSensorKey, sensors[strSensorKey]['series']));
					}
				}
				Promise.all(sensorResponsePromises).then(() => {
					resolve({
						status: 'Success'
					});
				}).catch(() => {
					resolve({
						status: 'Fail',
						msg: 'Fail to run upload function'
					});
				});
			}
		});
	});
}

function createPublicFileURL(storageName) {
	return `http://storage.googleapis.com/${bucketName}/${encodeURIComponent(storageName)}`;
}

function uploadSystemParameterFile(strSystemMode, strSensorKey, series) {
	return new Promise((resolve) => {
		if (!series || series && series && Object.keys(series).length === 0) {
			resolve({
				stauts: 'Fail',
				msg: 'Empty'
			});
		} else {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth();
			var day = date.getDate();
			var uploadTo = `SystemParameter${objSystemMode[strSystemMode]}/${strSensorKey}/${year}_${month+1}_${day}.json`;
			var downloadUrl = createPublicFileURL(uploadTo);
			var json = JSON.stringify(series);
			admin.storage().bucket(bucketName).file(uploadTo).save(json, {
				contentType: 'application/json',
				public: true
			}, err => {
				if (err) {
					resolve({
						stauts: 'Fail',
						msg: 'Fail uploading a file'
					});
				} else {
					var strDataTable = 'SensorData' + objSystemMode[strSystemMode];
					admin.database().ref(`${strDataTable}/status/${strSensorKey}/logs`).push({
						downloadUrl: downloadUrl,
						storageUrl: uploadTo,
						timestamp: admin.database.ServerValue.TIMESTAMP
					}).then(() => {
						admin.database().ref(`${strDataTable}/status/${strSensorKey}/series`).remove().then(() => {
							resolve({
								stauts: 'Success'
							});
						}).catch(() => {
							resolve({
								stauts: 'Fail',
								msg: 'Fail to remove series'
							});
						});
					}).catch(() => {
						resolve({
							stauts: 'Fail',
							msg: 'Fail to push the logo url'
						});
					});
				}
			});
		}
	});
}

// start the ping to the sensor
exports.getCSVData = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.body.url) {
			var arrCSVData = [];
			var bIsHeader;
			if(req.body.isHeader == 'no') {
				bIsHeader = false;
			} else {
				bIsHeader = true;
			}

			csv
				.fromStream(request(req['body']['url']), {headers: bIsHeader})
				.on("data-invalid", function(data){
					res.status(500).send({
						message: 'Invalid data'
					});
				})
				.on("data", function(data){
					arrCSVData.push(data);
				})
				.on("end", function(){
					res.send({
						data: arrCSVData
					});
				})
				.on("error", function(error){
					res.status(500).send({
						message: error
					});
				});
		} else {
			res.status(500).send({
				message: 'url is invalid'
			});
		}
	});
});

exports.getData = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.body.url) {
			var strUrl = req.body.url;
 
			axios.get(strUrl)
				.then(posts => {
					res.send({
						data: posts.data
					});
				})
				.catch(error => {
					res.status(500).send({
						message: error
					});
				});
		} else {
			res.status(500).send({
				message: 'url is invalid'
			});
		}
	});
});

exports.deleteUser = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		var result;
		if(req.body.userKey && req.body.userType) {
			var strUserTable = 'Users' + objSystemMode[req.body.systemMode];
			var promiseDeleteAuthUser = admin.auth().deleteUser(req.body.userKey);
			var promiseDeleteUserTable = admin.database().ref(`${strUserTable}/${req.body.userType}/${req.body.userKey}`).remove();
			Promise.all([promiseDeleteAuthUser, promiseDeleteUserTable]).then(() => {
				result = {
					status: 'success',
					message: 'User deletion is successful!'
				};
				res.status(200).send(JSON.stringify(result));
			}).catch(error => {
				result = {
					status: 'fail',
					message: error
				};
				res.status(500).send(JSON.stringify(result));
			});
		} else {
			result = {
				status: 'fail',
				message: 'Empty system mode, user key or type.'
			};
			res.status(500).send(JSON.stringify(result));
		}
	});
});

exports.sendInvitation = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
		if(req.body.to && req.body.content) {
			var data = {
				from: 'no-reply@test.com',
				subject: 'Invitation',
				html: req.body.content,           
				to: req.body.to
			};

			mailgun.messages().send(data, function(error, body) {
				var result;
				if(error) {
					result = {
						status: 'fail',
						message: error
					};
				} else  {
					result = {
						status: 'success',
						message: 'Email has been sent successfully!'
					};
				}
				res.status(200).send(JSON.stringify(result));
			});
		} else {
			var result = {
				status: 'fail',
				message: 'Empty target email or content'
			};
			res.status(500).send(JSON.stringify(result));
		}
	});
});

exports.registerRequest = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
		if( req.body.host && req.body.userId && req.body.hasOwnProperty('customerPath') && req.body.systemMode ) {
			var strUserTable = 'Users' + objSystemMode[req.body.systemMode];
			var userUrl = '';

			if(req.body.customerPath) { // customer user case
				userUrl = `${strUserTable}/customers`;
			} else { // staff user case
				userUrl = `${strUserTable}/staffs`;
			}

			admin.database().ref(`${userUrl}/${req.body.userId}`).once('value', function(userRes) {
				if(userRes.val()) {
					admin.database().ref(userUrl).orderByChild('action/role').equalTo('admin').once('value', function(adminRes) {
						if(adminRes.val()) {
							var adminUsers = adminRes.val();

							for (var key in adminUsers) {
								if(adminUsers[key]['action']['status'] === 'approved') {
									var originalData = {
										userId: req.body.userId,
										userType: req.body.customerPath?'customers':'staffs'
									};

									var encodeData = btoa(JSON.stringify(originalData));
									var inviteUrl = `${req.body.host}/admin?approval=${encodeData}`;
									var mailPortal = req.body.host;

									if(req.body.customerPath) {
										inviteUrl = `${req.body.host}/${req.body.customerPath}/admin?approval=${encodeData}`;
										mailPortal = `${req.body.host}/${req.body.customerPath}`;
									}

									var html = 'New user asked a account through this portal '+mailPortal+', please click this <a href="'+inviteUrl+'">link</a> to check.'

									var data = {
										from: 'no-reply@test.com',
										subject: 'Invitation',
										html: html,           
										to: adminUsers[key]['info']['email']
									};

									mailgun.messages().send(data, function(error, body) {
										if(error) {
											console.log('Fail to send a register request email: ');
											console.log(error);
										}
									});
								}
							}

							var result = {
								status: 'success',
								message: 'Request emails are successfully sent!'
							};

							res.status(200).send(JSON.stringify(result));
						} else {
							var result = {
								status: 'fail',
								message: 'There is no admin user'
							};
							res.status(500).send(JSON.stringify(result));
						}
					});
				} else {
					var result = {
						status: 'fail',
						message: 'There is no user'
					};
					res.status(500).send(JSON.stringify(result));
				}
			});
		} else {
			var result = {
				status: 'fail',
				message: 'Enough data'
			};
			res.status(500).send(JSON.stringify(result));
		}
	});
});

exports.getDatabase = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.body.url) {
			admin.database().ref(req.body.url).on('value', function(data) {
				data = data.val();
				var returnVal = [];

				if(data) {
					for (var key in data) {
						var item = data[key];
						item['key'] = key;
 
						returnVal.push(
							item
						);
					}
				}

				res.status(200).send({
					status: 'success',
					data: returnVal
				});
			});
		} else {
			res.status(500).send({
				status: 'fail',
				message: 'url is empty'
			});
		}
	});
});

exports.postAsObject = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if(req.body.url && req.body.postData) {
			var strUrl = req.body.url;
			admin.database().ref(strUrl).set(req.body.postData).then(() => {
				res.status(200).send({
					status: 'success'
				});
			});
		} else {
			res.status(500).send({
				status: 'fail',
				message: 'Database path or post data is empty'
			});
		}
	});
});

exports.dailyTestSensors = functions.pubsub.topic('dailyTestSensors').onPublish((event) => {
	return Promise.all([
		startCronJobTestDevices('dev'),
		startCronJobTestDevices('test'),
		startCronJobTestDevices('prod')
	])
		.then(res => {
			return res;
		})
		.catch(error => {
			return error;
		});
});

exports.runResultInRealtime = functions.pubsub.topic('runResultInRealtime').onPublish((event) => {
	return Promise.all([
		runResultInRealtime('dev'),
		runResultInRealtime('test'),
		runResultInRealtime('prod')
	])
		.then(res => {
			return res;
		})
		.catch(error => {
			return error;
		});
});

exports.systemParameterReport = functions.pubsub.topic('systemParameterReport').onPublish((event) => {
	return Promise.all([
		createSystemParameterReport('dev'),
		createSystemParameterReport('test'),
		createSystemParameterReport('prod')
	])
		.then(res => {
			return res;
		})
		.catch(error => {
			return error;
		});
});

exports.devSensorDeviceFinish = functions.database.ref('/SensorConfigs_Dev/{configId}/{modalType}/isFinished').onWrite((event, context) => {
	if (!event.before.val() && event.after.val()) {
		var strSystemMode = 'dev';
		var key = context.params.configId;
		return sensorDeviceFinsish(strSystemMode, key);
	} else {
		return null;
	}
});

exports.testSensorDeviceFinish = functions.database.ref('/SensorConfigs_Test/{configId}/{modalType}/isFinished').onWrite((event, context) => {
	if (!event.before.val() && event.after.val()) {
		var strSystemMode = 'test';
		var key = context.params.configId;
		return sensorDeviceFinsish(strSystemMode, key);
	} else {
		return null;
	}
});

exports.prodSensorDeviceFinish = functions.database.ref('/SensorConfigs/{configId}/{modalType}/isFinished').onWrite((event, context) => {
	if (!event.before.val() && event.after.val()) {
		var strSystemMode = 'prod';
		var key = context.params.configId;
		return sensorDeviceFinsish(strSystemMode, key);
	} else {
		return null;
	}
});
