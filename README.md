# Processing survey data

## Steps
- Read in csv, output json
- Assign a UID to each row
- Detect type of geolocation
- properly anonymize data!
    + Made Degrees, Minutes, Seconds geolocations less precise by changing the seconds in the address to 0 which seems to obfuscate the precission of the address by about 500 meters.
    + Made Decimal Degrees geolocations less precise by only keeping 2 digits after the comma, making the address precise to about 1km.
- Formulate initial questions
- Play with data in excel, find initial patterns
- Formulate main question
- Design viz on paper
- Start working on viz in d3