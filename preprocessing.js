const fs = require('fs')
const d3 = require('d3-dsv')
const geolocation = require('./geolocation.js')

let fileName = 'output/jsonData'
let fileIndex = 0

const filterData = false;
const removeResidenceData = false;

loadFile()

function loadFile(){
	fs.readFile("input/rawData.csv", {encoding: 'utf-8'}, function(err,data){
	    if (!err) {
	        // console.log('received data: ' + data);
	        parseData(data)
	    } else {
	        console.log(err);
	    }
	})
}

function parseData(source){
	const data = d3.csvParse(source)
	console.log("#Entries in data: ", data.length)
	//If filtering is on, pass data through the filterProperties function
	let selection = filterData ? data.map(filterProperties) : data//.slice(0,10)
	
	//You can make this script more functional by putting this pattern in a function
	selection.forEach( (item, index) => {
		item.id = index
		item.huidigeLocatie = item["Woonplaats: plak GPS locatie uit google maps (instructie hier: https://www.lifewire.com/latitude-longitude-coordinates-google-maps-1683398 )"]
		delete item["Woonplaats: plak GPS locatie uit google maps (instructie hier: https://www.lifewire.com/latitude-longitude-coordinates-google-maps-1683398 )"]
		item.geboortePlaats = item['Geboorteplaats (plak GPS locatie)']
		delete item['Geboorteplaats (plak GPS locatie)']
	})

	//If removeResidenceData is on, call removePlaceOfResidence, if not, keep the data as it is
	selection = removeResidenceData ? selection.map(removePlaceOfResidence) : selection
	
	//Function to remove place of residence entirely
	function removePlaceOfResidence(item){
		item.huidigeLocatie = null
		return item
	}

	selection.forEach(item => {
		//console.log("mapping item", item.id)
		if (item.huidigeLocatie){
			item.huidigeLocatie = geolocation.obfuscateLocation(item.huidigeLocatie)
		}
		if (item.geboortePlaats){
			item.geboortePlaats = geolocation.obfuscateLocation(item.geboortePlaats)
		}
		//console.log(item.huidigeLocatie)
	})
	writeDataFile(selection)
}

//Notice that this function checks if a filename exists and if it does it calls itself again
// But this time the fileIndex is increased. This makes the function recursive.
// There are btter ways of doing this.
function writeDataFile(data)
{
	fs.writeFile(fileName +"_"+ fileIndex +".json", JSON.stringify(data, null, 4), {encoding:'utf8', flag:'wx'}, function (err) {
	    //Check if filename already exists, if it does, increase the number at the end by 1
	    if (err && err.code == "EEXIST") {	
	    	fileIndex ++
	    	writeDataFile(data)
	    } else if(err){
	        return console.log(err)
	    } else {
	    	console.log("The file was saved!")
	    }
	})
}

function filterProperties(item){
	return {
		voorkeuren: item["Waar liggen je (CMD) voorkeuren?"],
		alcohol: item["Hoeveel glazen alcohol drink je per week?"]
	}
}