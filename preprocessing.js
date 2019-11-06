const fs = require('fs')
const d3 = require('d3-dsv')
const geolocation = require('./geolocation.js')

//This settigns object controls the global settings for this programme
const settings = {
	fileName: 'output/jsonData',
	filterData: false,
	removeResidenceData: false
}

loadFile()

//Load a file using the fs package, then call parseData
function loadFile(){
	fs.readFile("input/rawData.csv", {encoding: 'utf-8'}, function(err,data){
	    if (!err) {
	        // console.log('received data items: ' + data.length);
	        parseData(data)
	    } else {
	        console.log(err);
	    }
	})
}

//Parsedata takes a source and manipulates it the way we want it
function parseData(source){
	//First let's convert the data to JSON using d3.csvParse
	const data = d3.csvParse(source)
	console.log("#Entries in data: ", data.length)
	//If filtering is on, pass data through the filterProperties function
	let selection = settings.filterData ? data.map(filterProperties) : data//.slice(0,10)
	
	//You can make this script more functional by putting this pattern in a function
	selection.forEach( (item, index) => {
		item.id = index
		item.huidigeLocatie = item["Woonplaats: plak GPS locatie uit google maps (instructie hier: https://www.lifewire.com/latitude-longitude-coordinates-google-maps-1683398 )"]
		delete item["Woonplaats: plak GPS locatie uit google maps (instructie hier: https://www.lifewire.com/latitude-longitude-coordinates-google-maps-1683398 )"]
		item.geboortePlaats = item['Geboorteplaats (plak GPS locatie)']
		delete item['Geboorteplaats (plak GPS locatie)']
	})

	//If removeResidenceData is on, call removePlaceOfResidence, if not, keep the data as it is
	selection = settings.removeResidenceData ? selection.map(removePlaceOfResidence) : selection
	
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
// But this time the index is increased. This makes the function recursive.
// We can make this possible without using an outside variable by using a ES6 feature called default
// parameter. Each time we call the function we iterate index (BEFORE THE FUNCTION IS CALLED)
function writeDataFile(data, fileIndex = 0)
{
	fs.writeFile(settings.fileName +"_"+ fileIndex +".json",
				JSON.stringify(data, null, 4),
				{ encoding:'utf8', flag:'wx' },
				function (err) {
	    //Check if filename already exists, if it does, increase the number at the end by 1
	    if (err && err.code == "EEXIST") {	
	    	writeDataFile(data, ++fileIndex)
	    } else if(err){
	        return console.log(err)
	    } else {
	    	console.log("The file was saved!")
	    }
	})
}

//This function is used to only return properties we want in the output
// And to rename them to more usable properties.
function filterProperties(item){
	return {
		voorkeuren: item["Waar liggen je (CMD) voorkeuren?"],
		alcohol: item["Hoeveel glazen alcohol drink je per week?"]
	}
}