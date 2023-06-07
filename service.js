// Importation des modules
var path = require('path');

// MQTT module
const mqtt = require('mqtt')
// MongoDB CLient
const { MongoClient } = require('mongodb');

//Ajout des icônes et des leds 
var icon_color;
var led_color;
// Topic MQTT
const TOPIC_PISCINE = 'uca/M1/piscine'

const mqtt_info = {
	url : "http://mqtt.eclipseprojects.io:1883",
	user : "21911094",
	password : "pwd_123",
	trackerID : "EB",
	deviceID: "Elodie"
}


const databse = {
	nom: "WaterBnB",
	uri: "mongodb+srv://ebantos:Pwd_123@cluster0.okxq2fi.mongodb.net/?retryWrites=true&w=majority",
	collection: "pool"
}

async function main() {
	const mongoClient = new MongoClient(databse.uri, { useNewUrlParser: true, useUnifiedTopology: true });

	//connection mongo
	mongoClient.connect(function (err, mongoClient) {
		if (err) throw err;

		// on accède à la databse ou on la crée si elle existe pas 
		db = mongoClient.db(databse.nom);

		// connection mqtt
		var mqttClient = mqtt.connect(mqtt_info.url)

		// on s'abonne au topic
		mqttClient.on('connect', function () {
			mqttClient.subscribe(TOPIC_PISCINE, function (err) {
				if (!err) {
					console.log('Node Server has subscribed to ', TOPIC_PISCINE);
				}
			})
		})

		// réception message sur topic piscine 
		mqttClient.on('message', function (message) {
			console.log("Msg payload : ", message);
			var msg = JSON.parse(message);
			var document = {
				clientid: msg.clientid,
				lat: msg.lat,
				lon: msg.lon,
				color: msg.color ? msg.color : "#fff"
			}
			console.log(document);
			//insertion dans la collection 
			db.collection(databse.collection).insertOne(document, function (err) {
				if (err) throw err;
				console.log("insertion dans la collection: " + databse.collection + " du json: " + document);
			});

		})

		process.on('exit', () => { //déconnection mongo
			if (mg_client && mg_client.isConnected()) mg_client.close();
		})

	});
}

void function calcul_localisation(mqttClient, pool){
	let client_localisation = (mqttClient.lat, mqttClient.lon);
	let piscine_localisation = (pool.lat, pool.lon);
	if (piscine_localisation - client_localisation < 100){
		client_request(true);
	}
}

void function client_request(request, ouverturepiscine){
	if (request){
		icon_color.set("Yellow");
		return 0;
	}
	if (ouverturepiscine){
		led_color.set("Blue");
		return 0;
	}
	icon_color.set(blue);
	return 0;
}

main().catch(console.error);
