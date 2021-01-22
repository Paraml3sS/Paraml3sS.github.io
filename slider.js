const popularitySlider = document.querySelector('input[type="range"]');

var target = document.querySelector('.value');
target.innerHTML = `${popularitySlider.value}%`;

const rangeValue = function () {
    var target = document.querySelector('.value');
    target.innerHTML = `${popularitySlider.value}%`;
}

popularitySlider.addEventListener("input", rangeValue);