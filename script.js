import { allData } from './data.js';
console.log(allData); 
const dataset = allData.data;
const w = 1200;
const h = 600;
const padding = 50;

const tooltip = d3.select("#tooltip");

const svg = d3.select("#chart")
    .attr("width", w)
    .attr("height", h);

const parseTime = d3.timeParse("%Y-%m-%d");
const formatTime = d3.timeFormat("%Y-%m-%d");
const formatValue = d3.format(",.1f");
const datasetParsed = dataset.map(d => [parseTime(d[0]), d[1]]);

const xScale = d3.scaleTime()
    .domain(d3.extent(datasetParsed, d => d[0]))
    .range([padding, w - padding]);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(datasetParsed, d => d[1])])
    .range([h - padding, padding]);

const barWidth = (w - 2 * padding) / datasetParsed.length;

svg.selectAll("rect")
    .data(datasetParsed)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(d[0]))
    .attr("y", d => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", d => h - padding - yScale(d[1]))
    .attr("fill", "#3C4AEC")
    .attr("data-date", d => formatTime(d[0]))
    .attr("data-gdp", d => d[1])
    .on("mouseover", function (event, d) {
        tooltip.style("opacity", 1)
            .attr("data-date", formatTime(d[0]))
            .html(`Fecha: ${formatTime(d[0])} <br> Valor: ${formatValue(d[1])} Billion`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 40) + "px");
        d3.select(this).attr("fill", "#2ABAE1");
    })
    .on("mousemove", function (event) {
        tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 40) + "px");
    })
    .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this).attr("fill", "#3C4AEC");
    });

const xAxis = d3.axisBottom(xScale)
    .ticks(d3.timeYear.every(5))
    .tickFormat(d3.timeFormat("%Y"));

svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${h - padding})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

const yAxis = d3.axisLeft(yScale);

svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis);

svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -h / 1.5)
    .attr('y', 80)
    .attr('font-weight', 700)
    .text('Gross Domestic Product');
