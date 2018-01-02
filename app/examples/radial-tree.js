

/*
 * {
 *   "OGR_CODE":"100381",
 *   "ROME_PROFESSION_CARD_CODE":"C1401",
 *   "ROME_PROFESSION_CARD_NAME":"Gestion en banque et assurance",
 *   "SKILL_NAME":"Argumentation commerciale"
 * }
*/

function radialTree(data) {

    let orderedData;
    let mainGroup;
    let tree;

    function initialize() {
        let svg = d3.select("svg");
        let width = +svg.attr("width");
        let height = +svg.attr("height");
        
        mainGroup = svg.append("g").attr("transform", "translate(" + (width / 2 + 40) + "," + (height / 2 + 90) + ")");

        const nest = d3.nest()
            .key(d => d.MAIN_PROF_AREA_NAME).sortKeys(d3.ascending)
            .key(d => d.PROFESSIONAL_AREA_NAME).sortKeys(d3.ascending)
            .key(d => d.ROME_PROFESSION_CARD_NAME).sortKeys(d3.ascending)
            .entries(data);

        orderedData = d3.hierarchy({ values: nest }, function (d) { return d.values; })
            .sort(function (a, b) { return b.value - a.value; });

        tree = d3.tree()
            .size([2 * Math.PI, 500])
            .separation(function (a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

        // Initial collapse of all nodes except first one
        orderedData.children.forEach(collapse);
    }

    function update(data) {
        const root = tree(data);

        // Lines between nodes
        const link = mainGroup.selectAll(".link")
            .data(root.links(), d => d.id);

        const linkGroup = link.enter()
            .append("path")
            .attr("class", "link")
            .attr("d", d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y)
            )
            .merge(link);

        // Grey dot and text
        const node = mainGroup.selectAll(".node")
            .data(root.descendants(), d => d.id);

        const nodeGroup = node.enter()
            .append("g")
        .merge(node)
            .attr("class", d => `node ${d.children ? "node--internal" : " node--leaf"}`)
            .on('click', click)

        nodeGroup.append("circle")
            .attr("r", 2.5);

        nodeGroup.append("g")
            .attr("dy", "0.31em")
            .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
            .attr("transform", d => `translate(${radialPoint(d.x, d.y)}) rotate(${(d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI})`)
        .append('foreignObject')
            .attr("class", "node-label")
            .append("xhtml:div")
            .html(d => d.data.key || d.data.SKILL_NAME);

        // Remove old elements as needed.
        link.exit().remove();
        node.exit().remove();
    }

    function radialPoint(x, y) {
        return [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    }

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    // Toggle children on click.
    function click(d) {
        console.log('clicked')
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }

        update(orderedData);
    }

    initialize();
    update(orderedData);
}

export default radialTree;