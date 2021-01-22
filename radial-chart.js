export const radialChart = (selection, props) => {
    const {
        margin,
        innerRadius,
        outerRadius,
        width,
        height
    } = props;

    // Axes
    let xScale;
    let yScale;


    const svg = d3.select(selection)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + width / 10 + "," + (height / 2.7 + 100) + ")");

    const chart = svg
        .append("g")
        .attr("class", "chart");

    const labels = svg
        .append("g")
        .attr("class", "labels");


    const update = (data) => {
        xScale.domain(data.map(d => d.characteristic));

        updateChart(data);
        updateLabels(data);
    }


    const updateChart = (data) => {
        let uc = chart
            .selectAll("path")
            .data(data);

        uc
            .enter()
            .append("path")
            .merge(uc)
            .transition().duration(1500)

            .attr("class", "path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius((d) => d['power'] < 0.01
                    ? yScale(d['power'] + 0.01)
                    : yScale(d['power']
                    ))
                .startAngle((d) => xScale(d.characteristic))
                .endAngle((d) => xScale(d.characteristic) + xScale.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius));

        uc.exit().remove();
    }

    const updateLabels = (data) => {
        updatePositions(data);
        updateText(data);
    }

    const updatePositions = (data) => {
        let ul = labels
            .selectAll("g")
            .data(data, d => d.characteristic);


        ul
            .enter()
            .append("g")
            .merge(ul)

            .classed("text-anchor", true)
            .transition().duration(1500)
            .attr("transform", d =>
                "rotate(" + ((xScale(d.characteristic) + xScale.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (yScale(d['power']) + 10) + ",0)")


        ul.exit().remove();
    }

    const updateText = (data) => {
        let ult = labels
            .selectAll(".label")
            .data(data, d => d.characteristic);

        ult
            .enter()
            .append("text")
            .merge(ult)
            .transition().duration(1500)
            .attr("class", "label")
            .text(d => d.characteristic);

        ult.exit().remove();

    }

    const init = (data) => {
        xScale = d3.scaleBand()
            .range([0, 1 * Math.PI])
            .domain(data.map(d => d.characteristic));

        yScale = d3.scaleRadial()
            .range([innerRadius, outerRadius])
            .domain([0, 1]);

        buildChart(data);
        buildLabels(data);
    }



    const buildChart = (data) => {
        chart
            .selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("class", "path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius((d) => d['power'] < 0.01
                    ? yScale(d['power'] + 0.01)
                    : yScale(d['power']
                    ))
                .startAngle((d) => xScale(d.characteristic))
                .endAngle((d) => xScale(d.characteristic) + xScale.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius));
    }

    const buildLabels = (data) => {
        labels
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .classed("text-anchor", true)
            .attr("transform", d =>
                "rotate(" + ((xScale(d.characteristic) + xScale.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (yScale(d['power']) + 10) + ",0)")
            .append("text")
            .attr("class", "label")
            .text(d => d.characteristic);
    }


    return {
        init, update
    };
};