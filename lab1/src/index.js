
var colorPicker = new iro.ColorPicker(".colorPicker", {
    // color picker options
    // Option guide: https://iro.js.org/guide.html#color-picker-options
    width: 320,
    color: "rgb(255, 255, 255)",
    borderWidth: 1,
    borderColor: "#fff",
  });

var swatchGrid = document.getElementById('swatch-grid');

swatchGrid.addEventListener('click', function(e) {
  var clickTarget = e.target;
  // read data-color attribute
  if (clickTarget.dataset.color) {
    // update the color picker
    colorPicker.color.set(clickTarget.dataset.color);
  }
});

function changeAllValues(color){
    cmykValues = convertRGBtoCMYK(color.rgb);
    updateCMYK(cmykValues);
    updateRGB(color.rgb);
    updateHSV(color.hsv);
}

colorPicker.on('color:change', function(color) {
    changeAllValues(color);
  });

function convertRGBtoCMYK(rgb){
    var r = rgb.r;
    var g = rgb.g;
    var b = rgb.b;
    var computedC = 0;
    var computedM = 0;
    var computedY = 0;
    var computedK = 0;

 if (r==0 && g==0 && b==0) {
  computedK = 100;
  return {c: computedC,m: computedM,y: computedY,k: computedK};
 }

 computedC = 1 - (r/255);
 computedM = 1 - (g/255);
 computedY = 1 - (b/255);

 var minCMY = Math.min(computedC,
              Math.min(computedM,computedY));
 computedC = Math.round((computedC - minCMY) / (1 - minCMY) * 100) ;
 computedM = Math.round((computedM - minCMY) / (1 - minCMY) * 100) ;
 computedY = Math.round((computedY - minCMY) / (1 - minCMY) * 100 );
 computedK = Math.round(minCMY * 100);

 return {c: computedC,m: computedM,y: computedY,k: computedK};
}

function convertCMYKtoRGB(cmyk){
    var c = cmyk.c/100;
    var m = cmyk.m/100;
    var y = cmyk.y/100;
    var k = cmyk.k/100;
    var r = parseInt(255 * (1 - c) * (1 - k));
    var g = parseInt(255 * (1 - m) * (1 - k));
    var b = parseInt(255 * (1 - y) * (1 - k));
    return {r: r, g: g, b: b};
}

function validateRGB(val){
    return val < 0 ? 0 : val > 255 ? 255 : val;
}

function changeRangeValue(input, val){
    if (input.id.includes('rgb')){
        input.value = validateRGB(val);
    }
    else{
        input.value = val < 0 ? 0 : val > 100 ? 100 : val;
    }
    document.getElementById(input.nextElementSibling.id).value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
}

function changeInputValue(input, val){
    document.getElementById(input.previousElementSibling.id).value = isNaN(parseInt(val, 10)) ? 0 : parseInt(val, 10);
}

function updateCMYK(cmykValues){
    cmyk = document.getElementsByClassName('number-cmyk');
    cmyk[0].value = cmykValues.c;
    cmyk[1].value = cmykValues.m;
    cmyk[2].value = cmykValues.y;
    cmyk[3].value = cmykValues.k;
    for(let el of cmyk){
        changeRangeValue(el, el.value);
    };
}

function updateHSV(hsvValues){
    hsv = document.getElementsByClassName('number-hsv');
    hsv[0].value = parseInt(hsvValues.h*100/360);
    hsv[1].value = parseInt(hsvValues.s);
    hsv[2].value = parseInt(hsvValues.v);
    for(let el of hsv){
        changeRangeValue(el, el.value);
    };
}

function updateRGB(rgbValues){
    rgb = document.getElementsByClassName('number-rgb');
    rgb[0].value = rgbValues.r;
    rgb[1].value = rgbValues.g;
    rgb[2].value = rgbValues.b;
    for(let el of rgb){
        changeRangeValue(el, el.value);
    };
}

function recountFromRGB(input, val){
    var property = input.id[input.id.length - 1];
    colorPicker.color.setChannel('rgb', property, val);
    updateCMYK(convertRGBtoCMYK(colorPicker.color.rgb));
    updateHSV(colorPicker.color.hsv);
}

function recountFromHSV(input, val){
    var property = input.id[input.id.length - 1];
    if (property == 'h'){
        colorPicker.color.setChannel('hsv', property, (parseInt(val)*360/100)%360);
    }
    else{
        colorPicker.color.setChannel('hsv', property, (parseInt(val)));
    }
    updateCMYK(convertRGBtoCMYK(colorPicker.color.rgb));
    updateRGB(colorPicker.color.rgb);
}

function recountFromCMYK(input, val){
    cmykValues = document.getElementsByClassName('number-cmyk');
    cmyk = {
        c: isNaN(parseInt(cmykValues[0].value, 10)) ? 0 : parseInt(cmykValues[0].value, 10),
        m: isNaN(parseInt(cmykValues[1].value, 10)) ? 0 : parseInt(cmykValues[1].value, 10),
        y: isNaN(parseInt(cmykValues[2].value, 10)) ? 0 : parseInt(cmykValues[2].value, 10),
        k: isNaN(parseInt(cmykValues[3].value, 10)) ? 0 : parseInt(cmykValues[3].value, 10),
    };
    colorPicker.color.set(convertCMYKtoRGB(cmyk));
    updateRGB(colorPicker.color.rgb);
    updateHSV(colorPicker.color.hsv);
}