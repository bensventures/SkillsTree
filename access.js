
const config = require('./config');
const fetch = require('node-fetch');

fetch('https://entreprise.pole-emploi.fr/connexion/oauth2/access_token?realm=partenaire', {
    method: "POST",
    headers: { "Content-Type" : "application/x-www-form-urlencoded" },
    body: `grant_type=client_credentials&client_id=${config.id}&client_secret=${config.secret}&scope=application_${config.id}%20api_infotravailv1%20api_matchviasoftskillsv1`
})
.then(response => response.json())
.then(data => {
    console.log(data)
})