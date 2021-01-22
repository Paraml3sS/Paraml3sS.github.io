import { radialChart } from './radial-chart.js';
import { barChart } from './bar-chart.js';
import { filterByPopularity, filterByGenre } from './helpers.js'

// Default values
const popularityUrl = 'https://raw.githubusercontent.com/Paraml3sS/Spotify-visualizations/main/popularity_v2.csv';
const genresPopularityUrl = 'https://raw.githubusercontent.com/Paraml3sS/Spotify-visualizations/main/genres_popularity.csv';
const genresInfoUrl = 'https://raw.githubusercontent.com/Paraml3sS/Spotify-visualizations/main/genres_info.csv';


// ---------------------------------------------------------------------
let popularityData;
let genresPopularityData;
let genresInfoData;

let popularityChart;
let genresPopularityChart;
let genresInfoChart;

// ---------------------------------------------------------------------
// Selectors and subscribe on events
const popularitySliderSelector = document.getElementById('popularitySlider');
const hoveredGenreSelector = document.querySelector('.selected-genre');
hoveredGenreSelector.textContent = "basshall";
let genresSelector;

popularitySliderSelector.addEventListener('change', (event) => popularitySliderHandler(event));

const popularitySliderHandler = (e) => {
    let filtered = filterByPopularity(popularityData, Number(e.target.value));
    popularityChart.update(filtered);
}

const genresSelectorHandler = (e) => {
    let genre = e.target.getAttribute("genre");
    hoveredGenreSelector.textContent = genre;
    let filtered = filterByGenre(genresInfoData, genre);
    genresInfoChart.update(filtered);
}

// ---------------------------------------------------------------------
// Load data and create charts 

let margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 360 - margin.left - margin.right,
    height = 560 - margin.top - margin.bottom,
    innerRadius = 80,
    outerRadius = Math.min(width, height) / 1.6;



console.log("Started loading popularity data.")
d3.csv(popularityUrl)
    .then(loadedData => {
        popularityData = loadedData;
        popularityData.forEach(d => {
            d.popularity = +d.popularity;
            d.power = +d.power;
        });


        let filtered = filterByPopularity(popularityData, Number(popularitySliderSelector.value));

        popularityChart = render("#popularityChart", filtered, radialChart, {
            innerRadius,
            outerRadius,
            width,
            height,
            margin
        });

        console.log("Ended loading popularity data.")

    });


console.log("Started loading genres popularity data.")
d3.csv(genresPopularityUrl)
    .then(loadedData => {
        genresPopularityData = loadedData;
        genresPopularityData.forEach(d => {
            d.popularity = +d.popularity;
        });

        console.log("Genres popularity data loaded.")

        genresPopularityChart = render("#genresChart", genresPopularityData, barChart, {
            width: 500,
            height: 300,
            margin: ({ top: 30, right: 0, bottom: -5, left: 40 }),
            color: "steelblue"
        });

        console.log("Ended loading genres popularity data.")
    });


console.log("Started loading genres info data.")
d3.csv(genresInfoUrl)
    .then(loadedData => {
        genresInfoData = loadedData;
        genresInfoData.forEach(d => {
            d.popularity = +d.popularity;
            d.power = +d.power;
        });

        console.log("Genres info data loaded.")

        let filtered = filterByGenre(genresInfoData, "basshall");

        genresInfoChart = render("#genreInfoChart", filtered, radialChart, {
            innerRadius,
            outerRadius,
            width,
            height,
            margin
        });

        console.log("Ended loading genres info data.")
    }).then(() => {
        genresSelector = document.querySelectorAll('.bar');
        genresSelector.forEach((elem) => elem.addEventListener("mouseover", (e) => genresSelectorHandler(e)));
    });



const render = (selector, data, chart, options) => {
    chart = chart(selector, options);
    chart.init(data);
    return chart
}