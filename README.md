# Processing survey data

## Usage
I wrote this code to use it in an upcoming course at the Hogeschool van Amsterdam. It converts student survey data (not included in this repo for privacy reasons) from csv to json.
It also uses the module `geolocation` to anonymize geolocation data.

## Steps to take
- [x] Read in csv, output json
- [x] Assign a UID to each row
- [x] Detect type of geolocation
- [x] Anonymize geodata
    + Made Degrees, Minutes, Seconds geolocations less precise by changing the seconds in the address to 0 which seems to obfuscate the precission of the address by about 500 meters.
    + Made Decimal Degrees geolocations less precise by only keeping 2 digits after the comma, making the address precise to about 1km.
- [ ] Formulate initial questions
- [ ] Play with data in excel, find initial patterns
- [ ] Formulate main question
- [ ] Design viz on paper
- [ ] Start working on viz in d3