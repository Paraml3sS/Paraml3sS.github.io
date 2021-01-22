export const barChart = (selection, props) => {
    const {
        width,
        height,
        margin,
        color
    } = props;


    console.log("In the bar chart.");

    const init = data => {

        console.log(data.length);

        const x = d3.scaleBand()
            .domain(d3.range(data.length))
            .range([0, 178380])
            .padding(0.1)


        const y = d3.scaleLinear()
            .domain([0, 1]).nice()
            .range([height, margin.top])

        const xAxis = g => g
            .attr("transform", `translate(50,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(i => data[i].genres).tickSizeOuter(0))
            .call(g => g.selectAll(".tick text")
                .attr("class", "label label-rotate genre-popularity-label")
                .attr("x", 20)
                .attr("y", 11));

        const yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(null, "%"))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("class", "label")
                .attr("x", -margin.left)
                .attr("y", 10)
                .attr("fill", "currentColor")
                .attr("text-anchor", "start")
                .text("↑ Popularity"))
            .call(g => g.selectAll(".tick text")
                .attr("class", "label"));



        const svg = d3.select(selection)
            .append("svg")
            .attr("width", data.length * 60)
            .attr("height", height + 50)

        svg.append("g")
            .attr("fill", color)
            .attr("class", "rect-container")
            .attr("transform", `translate(50, 0)`)
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d.popularity))
            .attr("height", d => y(0) - y(d.popularity) + 5)
            .attr("width", x.bandwidth())
            .attr("class", "bar")
            .attr("genre", d => d.genres);

        let format = y.tickFormat(20, "%");

        svg.append("g")
            .attr("fill", "white")
            .attr("font-family", "sans-serif")
            .attr("text-anchor", "start")
            .attr("font-size", 12)
            .selectAll("text")
            .data(data)
            .join("text")
            .attr("x", (d, i) => x(i) + x.bandwidth() / 2 )
            .attr("y", d => y(d.popularity))
            .attr("dy", 20)
            .attr("dx", "3.4em")
            .text(d => format(d.popularity))
            .call(text => text.filter(d => y(0) - y(d.popularity) < 40) // short bars
                .attr("dy", -10)
                .attr("dx", "5.4em")
                .attr("font-family", "Dosis")
                .attr("fill", "black")
                .attr("text-anchor", "end"));

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

    }



    return {
        init
    };
};