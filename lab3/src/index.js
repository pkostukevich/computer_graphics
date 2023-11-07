const grid = document.getElementById("layer1");
const canvas = document.getElementById("layer2");
const ctx0 = grid.getContext("2d");
const ctx = canvas.getContext("2d");
ctx.transform(1, 0, 0, -1, canvas.width / 2, canvas.height / 2);
ctx.strokeStyle = "black";
const xStartElem = document.getElementById("xStart");
const yStartElem = document.getElementById("yStart");
const xEndElem = document.getElementById("xEnd");
const yEndElem = document.getElementById("yEnd");
const radius = document.getElementById("r");
var radioButtons = document.getElementsByName("scale");
var scale = 10;
var step = 1;
var xDelta = [0, -1, -1, 0];
var yDelta = [0, 0, -1, -1];

function drawLineStepByStep(xStart, yStart, xEnd, yEnd) {
  var points = [];
  var xStartTemp, xEndTemp, yStartTemp, yEndTemp;

  if (yStart >= yEnd) {
    yStartTemp = yEnd;
    yEndTemp = yStart;
  } else {
    yStartTemp = yStart;
    yEndTemp = yEnd;
  }

  if (xStart > xEnd) {
    xStartTemp = xEnd;
    xEndTemp = xStart;
  } else {
    xStartTemp = xStart;
    xEndTemp = xEnd;
  }
  points.push([xStart, yStart]);
  if (xStart == xEnd) {
    for (var i = yStartTemp; i < yEndTemp; i++) {
      points.push([xStart, i]);
    }
  } else {
    let k = (yStart - yEnd) / (xStart - xEnd);
    let b = yStart - k * xStart;
    if (Math.abs(k) >= 1) {
      for (let i = yStartTemp; i < yEndTemp; i++) {
        points.push([Math.round((i - b) / k), i]);
      }
    } else {
      for (var i = xStartTemp; i < xEndTemp; i++) {
        points.push([]);
        points.push([i, Math.round(k * i + b)]);
      }
    }
  }
  return points;
}

function drawBresenhamLine(x0, y0, x1, y1) {
  var dx, dy, err;

  var points = [];

  var dx = Math.abs(x1 - x0);
  var dy = Math.abs(y1 - y0);
  var sx = x0 < x1 ? scale : -1 * scale;
  var sy = y0 < y1 ? scale : -1 * scale;
  var err = dx - dy;

  var quadrant = getQuadrant() - 1;

  while (true) {
    if (x0 === x1 && y0 === y1) break;
    ctx.fillRect(
      x0 + xDelta[quadrant] * scale,
      y0 + yDelta[quadrant] * scale,
      scale,
      scale
    );
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return points;
}

function drawGrid() {
  debugger;
  ctx0.clearRect(0, 0, canvas.width, canvas.height);
  ctx0.beginPath();
  for (var x = -grid.width / 2; x < grid.width; x += step * scale) {
    ctx0.moveTo(grid.width / 2 + x, 0);
    ctx0.lineTo(grid.width / 2 + x, grid.height);
    if (x % ((scale * 100) / scale) == 0)
      ctx0.fillText(
        (x / scale).toString(),
        grid.width / 2 + x - 7,
        grid.height / 2 + 10
      );
  }
  for (var y = -grid.height / 2; y < grid.height; y += step * scale) {
    ctx0.moveTo(0, grid.height / 2 + y);
    ctx0.lineTo(grid.width, grid.height / 2 + y);
    if (y % ((scale * 100) / scale) == 0 && y != 0)
      ctx0.fillText(
        (-y / scale).toString(),
        grid.width / 2 + 2,
        grid.height / 2 + y + 4
      );
  }
  ctx0.strokeStyle = "#ddd";
  ctx0.stroke();

  ctx0.beginPath();
  ctx0.moveTo(0, grid.height / 2);
  ctx0.lineTo(grid.width, grid.height / 2);
  ctx0.moveTo(grid.width / 2, 0);
  ctx0.lineTo(grid.width / 2, grid.height);
  debugger;
  ctx0.strokeStyle = "black";
  ctx0.stroke();
}

function draw(points) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  var quadrant = getQuadrant() - 1;
  console.log(quadrant);
  for (var i = 0; i < points.length; i++) {
    ctx.fillRect(
      (points[i][0] + xDelta[quadrant]) * scale,
      (points[i][1] + yDelta[quadrant]) * scale,
      scale,
      scale
    );
  }
}

function stepBystep() {
  debugger;
  draw(
    drawLineStepByStep(
      parseInt(xStartElem.value),
      parseInt(yStartElem.value),
      parseInt(xEndElem.value),
      parseInt(yEndElem.value)
    )
  );
}

function clearLine() {
  ctx.clearRect(
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  );
}

function Bresenham() {
  drawBresenhamLine(
    parseInt(xStartElem.value) * scale,
    parseInt(yStartElem.value) * scale,
    parseInt(xEndElem.value) * scale,
    parseInt(yEndElem.value) * scale
  );
}

drawGrid();

function start() {
  var algorithm = document.querySelector(".alg:checked").value;
  var sc = document.querySelector(".sc:checked");
  scale = parseInt(sc.value);
  step = 10 / scale;
  clearLine();
  drawGrid();
  if (algorithm == "stepByStep") {
    stepBystep();
  } else {
    Bresenham();
  }
}

function getQuadrant() {
  var dx = xEndElem.value - xStartElem.value;
  var dy = yEndElem.value - yStartElem.value;
  if (dx >= 0) {
    if (dy >= 0) return 1;
    else return 4;
  } else {
    if (dy >= 0) return 2;
    else return 3;
  }
}
