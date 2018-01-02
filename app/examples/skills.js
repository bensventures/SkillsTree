
/*
 * {
 *   "OGR_CODE":"100381",
 *   "ROME_PROFESSION_CARD_CODE":"C1401",
 *   "ROME_PROFESSION_CARD_NAME":"Gestion en banque et assurance",
 *   "SKILL_NAME":"Argumentation commerciale"
 * }
*/

function skills(data) {
    const svg = d3.select('#map-container');
    const radius = 100;
    let width = +svg.attr('width');
    let height = +svg.attr('height');
    let perimeterCoordinateFromCenter = radius * Math.cos(Math.PI / 4);
    data = data.sort(compare); // Compare function at the bottom

    const points = data.map(phyllotaxis(150, width, height));

    let transform = d3.zoomIdentity;;

    let scene = svg.append("g");
    let skillsTree = scene.selectAll("g")
        .data(points);

    let skillsGroups = skillsTree.enter()
        .append("g");

    skillsGroups.append('circle')
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", radius)
        .attr("stroke", d => stringToColour(d.jobName))
        .attr("fill", d => stringToColour(d.jobName));

    const textGroups = skillsGroups.append('g')
        .attr('transform', d => 'translate(' + [d.x - perimeterCoordinateFromCenter, d.y - perimeterCoordinateFromCenter] + ')');

    textGroups.append('foreignObject')
        .attr("width", 2 * perimeterCoordinateFromCenter)
        .attr("height", 2 * perimeterCoordinateFromCenter)
        .attr("class", 'skill-label')
        .append("xhtml:div")
        .html(d => `${d.skillName}`);


    svg.call(d3.zoom()
        .on("zoom", zoomed));

    function zoomed() {
        scene.attr("transform", d3.event.transform);
    }
}

// Distribute skills nicely
function phyllotaxis(radius, width, height) {
    const theta = Math.PI * (3 - Math.sqrt(5));
    return function (skill, index) {
        const r = radius * Math.sqrt(index), a = theta * index;

        return {
            x: width / 2 + r * Math.cos(a),
            y: height / 2 + r * Math.sin(a),
            skillName: skill.SKILL_NAME,
            jobName: skill.ROME_PROFESSION_CARD_NAME
        };
    };
}

function stringToColour(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

function compare(a, b) {
    if (a.MAIN_PROF_AREA_CODE < b.MAIN_PROF_AREA_CODE)
        return -1;
    if (a.MAIN_PROF_AREA_CODE > b.MAIN_PROF_AREA_CODE)
        return 1;
    return 0;
}

export default skills;