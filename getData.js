
// Run this from node to output a json file with the data.
// Some examples below, recommended use of the SQL query to JOIN multiple ressources into one file.

const jsonfile = require('jsonfile');
const fetch = require('node-fetch');

// !!!!!!!!!!!!!!!!!!!!!!!!
// IMPORTANT: Get the token
const token = '8b59c4cd-c330-4dae-9367-3019e8980284' //'get token from access.js => `node access.js`';

// Available methods to call upon

//readReferences();
//readSoftSkills();

//Grands domaines et domaines professionnels des métiers ROME  #532 metiers
//readGeneric('aff724e0-cb7f-4ee0-a559-740d51331736', 'jobs.json');

// Jobs cards
//readGeneric('767d0c4a-277b-493c-84b7-00143933efce', 'jobs-cards.json');

//Grands domaines professionnels #14
//readGeneric('e5eba2a1-d8f4-4762-abc2-cb8bb00686d4', 'high-level-domains.json');

// Domaines #110
//readGeneric('ad3b6d19-4aab-45c6-b9ea-c0a5b49b3e6e', 'domains.json');

// Domaines de formations #2652
//readGeneric('f4717749-70cd-421c-a7cd-0980cb40f176');

//Competences #4947
//readGeneric('bb7c0638-2bc3-41d9-93aa-75205c288509');

// Links between skills and jobs #42K
//readGeneric('794e460b-6679-4d0b-bfea-8cf4071b4687', 'links.json');

readSQLAll('all.json');


// Methods for data collection

// Get the references of the different resources.
// Use this to get the id of a ressource to then use readGeneric or readSQL
function readReferences() {
    fetch('https://api.emploi-store.fr/partenaire/infotravail/v1/resource_search?query=pe_type:reference', {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.result.results.map(ref => (
            {
                id: ref.id,
                name: ref.name
            }
        )));
    })
    .catch((error) => {
        console.log(error)
    })
}

function readSoftSkills() {
    fetch('https://api.emploi-store.fr/partenaire/matchviasoftskills/v1/professions/job_skills', {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch((error) => {
        console.log(error)
    })
}

/**
 * Generic function to make requests to the api. takes the referencial id of the ressource.
 * @param {*} referentialId 
 * @param {string} [fileName] if set, a file is saved in the same folder, using the parameter as the filename
 */
function readGeneric(referentialId, fileName) {
    // Array to store results when multipaginated
    let cache = [];
    let offset = 0;
    let limit = 100;

    function getData() {
        fetch(`https://api.emploi-store.fr/partenaire/infotravail/v1/datastore_search?resource_id=${referentialId}&offset=${offset}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (fileName) {
                cache = cache.concat(data.result.records);

                if (data.result.total > offset) {
                    offset += limit;
                    console.log(offset);
                    getData();
                } else {
                    jsonfile.writeFile(`data/${fileName}`, {data: cache}, function (err) {
                        console.error(err);
                    });
                }
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }
    getData();
}

/*
 * Use SQL syntax to make query against different resources.
*/
function readSQLAll(fileName) {
    const query = `
        SELECT 
            skills."SKILL_NAME", 
            jobs."ROME_PROFESSION_CARD_NAME", 
            jobs."MAIN_PROF_AREA_NAME",
            jobs."PROFESSIONAL_AREA_NAME"
        from "bb7c0638-2bc3-41d9-93aa-75205c288509" skills 
        INNER JOIN "794e460b-6679-4d0b-bfea-8cf4071b4687" links
        ON skills."OGR_CODE" = links."OGR_CODE" 
        INNER JOIN "aff724e0-cb7f-4ee0-a559-740d51331736" jobs
        ON links."ROME_PROFESSION_CARD_CODE" = jobs."ROME_PROFESSION_CARD_CODE"
        WHERE links."REF_TYPE_CODE" LIKE '1'
    `;

    fetch(`https://api.emploi-store.fr/partenaire/infotravail/v1/datastore_search_sql?sql=${query}`, {
        headers: {
            "Authorization": `Bearer ${token}`
            
        }
    })
    .then(response => response.json())
    .then(data => {
        if (fileName) {
            jsonfile.writeFile(`data/${fileName}`, {data: data.result.records}, function (err) {
                console.error(err);
            });
        }
    })
    .catch((error) => {
        console.log(error)
    })
}
