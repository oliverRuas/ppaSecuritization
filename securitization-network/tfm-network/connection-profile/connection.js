'use strict';

const fs = require('fs');

let archivos=['originator','farmer','ratingagency','spv','investor']
for (let i=0;i<archivos.length;i++){
	let rawdata = fs.readFileSync('../fabric-ca/'+archivos[i]+'/connection-'+archivos[i]+'.json');
	let data = JSON.parse(rawdata);
	data.client.organization=archivos[i];
	let new_data = JSON.stringify(data);
	fs.writeFileSync('../fabric-ca/'+archivos[i]+'/connection-'+archivos[i]+'.json', new_data);		
}
