const fs = require('fs')
const d3 = require('d3-dsv')
const geolocation = require('./geolocation.js')

loadFile()

function loadFile(){
	fs.readFile("input/rawData.csv", {encoding: 'utf-8'}, function(err,data){
	    if (!err) {
	        //console.log('received data: ' + data);
	        parseData(data)
	    } else {
	        console.log(err);
	    }
	})
}

function parseData(source){
	console.log("parsing data")
	const data = d3.csvParse(source)
	console.log("#Entries in data: ", data.length)
	//console.log(data[0])
	//console.log(Object.keys(data[0]))
	const selection = data//.slice(0,10)
	
	selection.forEach( (item, index) => {
		item.id = index
		item.huidigeLocatie = item["Woonplaats: plak GPS locatie uit google maps (instructie hier: https://www.lifewire.com/latitude-longitude-coordinates-google-maps-1683398 )"]
		delete item["Woonplaats: plak GPS locatie uit google maps (instructie hier: https://www.lifewire.com/latitude-longitude-coordinates-google-maps-1683398 )"]
		item.geboortePlaats = item['Geboorteplaats (plak GPS locatie)']
		delete item['Geboorteplaats (plak GPS locatie)']
	})

	//Function to remove place of residence entirely
	function removePlaceOfResidence(item){
		item.huidigeLocatie = null
		return item
	}

	const transformed = selection.map(item => {
		//console.log("mapping item", item.id)
		item.huidigeLocatie = geolocation.obfuscateLocation(item.huidigeLocatie)
		item.geboortePlaats = geolocation.obfuscateLocation(item.geboortePlaats)
		//console.log(item.huidigeLocatie)
		return item
	})
	writeDataFile(transformed)
}

function writeDataFile(data)
{
	fs.writeFile('output/processedData.json', JSON.stringify(data, null, 4), 'utf8', function (err) {
	    if (err) {
	        return console.log(err)
	    } else {
	    	console.log("The file was saved!")
	    }
	})
}