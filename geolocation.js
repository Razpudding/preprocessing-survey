//Expects a String holding a geolocation of either DMS or DD format
exports.obfuscateLocation = function(rawLocation){
	let location = determineLocationType(rawLocation)

	if (location.type == "DMS"){
		location.obfuscated = location.raw.replace(/'[^"]*/g, "'0")	//Change everything after ' but before " to '0
	} else if (location.type == "DD"){
		let latlong = location.raw.split(",")
		location.obfuscated = latlong[0].substring(0, latlong[0].indexOf(".")+3) + "," +
		latlong[1].substring(0, latlong[1].indexOf(".")+3)	//basically shorten the lat and long to be less precise
	} else if (location.type == "INVALID"){
		location.obfuscated = -1
	}
	//console.log(location)
	delete location.raw
	return location
}

//Function that attemps to determine geolocation type.
	//WARNING: I made this up myself as I didn't find a reliable method online, it's fuzzy logic
	//	If the locationstring has a degrees symbol it assumes the type to be degrees, minutes, seconds
	//	If it doesn't have a comma (fuzziest part), it injects one
	//  It then tests if both lat and long parts are number and assumes the type to be decimal degrees
	//	If none of those tests succeed, the location type is deemed invalid.
function determineLocationType (rawLocation){
	let location = {
		//Remove "(" and ")"
		raw: rawLocation ? rawLocation.replace(/[\(\)]/g,""): "",	
		type: "INVALID"
	}
	if (location.raw === null){
		return location
	}
	if (location.raw.includes("°")){
		location.type = "DMS"
	}
	else {
		if(!location.raw.includes(",") ){
			//Try injecting a comma in case lat and long are separated by a space
			location.raw = location.raw.replace(" ",",")		
		}
		if(isNumber(location.raw.split(",")[0]) && isNumber(location.raw.split(",")[1]))
		{
			location.type = "DD"
		}
	}
	return location
}

//Helper function found at https://stackoverflow.com/a/1421988/5440366
function isNumber(n) { return !isNaN(parseFloat(n)) && !isNaN(n - 0) }