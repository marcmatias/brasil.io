function hexToRGBA(hex, rgba) {
  parts = hex.split("");
  parts.shift();
  if (parts.length == 3) {
    parts = [parts[0], parts[0], parts[1], parts[1], parts[2], parts[2]];
  }
  hexNumber = `0x${parts.join("")}`;
  red = (hexNumber >> 16) & 255;
  green = (hexNumber >> 8) & 255;
  blue = hexNumber & 255;
  return `rgba(${red}, ${green}, ${blue}, ${rgba})`;
}

function arraySum(arr) {
  return arr.reduce(function (total, n) { return total + n; });
}

function arrayToInt(arr) {
  return arr.map(function (value) {
    return value !== null ? parseInt((value).toFixed(0)) : null;
  });
}

function movingAverage(values, n) {
  var lastValues = [];
  var movingAvg = [];

  for (i = 0; i < values.length; i++) {
    var value = values[i];
    lastValues.push(value);
    if (i + 1 < n) {
      movingAvg.push(null);
    }
    else {
      movingAvg.push(arraySum(lastValues) / lastValues.length);
      lastValues.shift();
    }
  }
  return movingAvg;
}

class MultiLineChart {

  chartType() {
    return ["line"];
  }

  constructor(options) {
    this.animationDuration = options.animationDuration || 0;
    this.colors = options.colors;
    this.canvasElement = document.getElementById(options.divId)
    this.context = this.canvasElement.getContext("2d");
    this.options = options;
    this.title = options.title;
    this.xData = options.xData;
    this.yLabels = options.yLabels;
    this.yData = options.yData;
    this.chartOptions = {
      animation: {duration: this.animationDuration},
      bezierCurve: false,
      elements: {
        point: {
          radius: 0,
        },
      },
      legend: {
        display: this.options.showYLabels === undefined ? true : this.options.showYLabels,
        labels: {
          filter: function (legendItem, data) { return legendItem.text !== undefined; },
        },
      },
      maintainAspectRatio: false,
      scales: {
        yAxes: this.yAxes(),
        xAxes: this.xAxes(),
      },
      title: {
        display: true,
        text: options.title,
      },
      tooltips: {
        mode: "label",
      },
    };
  }

  getYLabel(index) {
    return this.yLabels[index];
  }

  xAxes() {
    var axes = [{
      stacked: this.options.stacked === undefined ? false : this.options.stacked,
    }];
    if (this.options.xLabel !== undefined) {
      axes[0].scaleLabel = {
        labelString: this.options.xLabel,
        display: true,
      };
    }
    return axes;
  }

  yAxes() {
    return [
      {
        id: 1,
        position: "left",
        stacked: this.options.stacked === undefined ? false : this.options.stacked,
        ticks: {
          beginAtZero: this.options.beginAtZero === undefined ? true : this.options.beginAtZero,
        },
        type: "linear",
      },
    ];
  }

  datasets() {
    var result = new Array();
    for (var index = 0; index < this.yLabels.length; index++) {
      result.push({
        borderColor: this.colors[index],
        data: this.yData[index],
        fill: false,
        label: this.getYLabel(index),
        type: this.chartType(),
        yAxisID: 1,
      });
    }
    return result;
  }

  draw() {
    this.chart = new Chart(this.context, {
      data: {
        datasets: this.datasets(),
        labels: this.xData,
      },
      options: this.chartOptions,
      type: this.chartType()[0],
    });
    if (this.options.source !== undefined) {
      var newNode = document.createElement("p");
      newNode.innerHTML = this.options.source;
      this.canvasElement.parentNode.appendChild(newNode);
    }
    return this;
  }
}

class MultiBarLineChart extends MultiLineChart {

  chartType() {
    return ["bar", "line"];
  }

  datasets() {
    var result = new Array();
    for (var index = 0; index < this.yLabels.length; index++) {
      // TODO: constructor should receive chart type and this if/else could use
      // it and execute a LineChart/BarChart method to create the data pushed
      // into result.
      if (index == 0) {  // Bar
        result.push({
          backgroundColor: this.colors[index],
          data: this.yData[index],
          label: this.getYLabel(index),
          type: "bar",
          yAxisID: 1,
        });
      }
      else {  // Line
        result.push({
          borderColor: this.colors[index],
          data: this.yData[index],
          fill: false,
          label: this.getYLabel(index),
          type: "line",
          yAxisID: 1,
        });
      }
    }
    return result;
  }

}


class MultiBarChart extends MultiLineChart {

  chartType() {
    return ["bar"];
  }

  datasets() {
    var result = new Array();
    for (var index = 0; index < this.yLabels.length; index++) {
      result.push({
        backgroundColor: this.colors[index],
        data: this.yData[index],
        label: this.getYLabel(index),
        type: this.chartType()[0],
        yAxisID: 1,
      });
    }
    return result;
  }

}

class StackedBarChart extends MultiBarChart {

  datasets() {
    var result = new Array();
    for (var stackIndex = 0; stackIndex < this.yData.length; stackIndex++) {
      for (var index = 0; index < this.yData[stackIndex].length; index++) {
        result.push({
          backgroundColor: this.colors[stackIndex][index],
          data: this.yData[stackIndex][index],
          label: this.yLabels[stackIndex][index],
          stack: stackIndex,
          type: this.chartType()[0],
          yAxisID: 1,
        });
      }
    }
    return result;
  }

}
