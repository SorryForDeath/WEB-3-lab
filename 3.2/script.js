let width = 500;
let height = 500;
  
let marginX = 50;
let marginY = 40;

f = (x) => (Math.E**(0.01 * x))/(x**2 - 8);

const n = 100;

function drawGraph(a, b) {
  if (a == '' || b == '') {
    alert("Не все поля заполнены")
    return
  }
  if (a == b || +a > +b){
    alert('Некорректные данные')
    return
  }
  a = Number(a);
  x = a;
  b = Number(b);
  let arrGroup = [];
  let h = Math.round(Number((b - a) / n)*1000)/1000;

  while (x < b) {
    let elementGroup = {};
    if (x !== Math.round(Math.sqrt(5) * 1000)/1000) {
    x = Math.round(x*1000)/1000;
    elementGroup.labelX = x;
    elementGroup.labelY = Number(f(x));
    arrGroup.push(elementGroup);
    }
    x += h;
  }

  let svg = d3.select("body")
    .append("svg")

  svg = d3.select("svg") 
      .attr("height", height)
      .attr("width", width)
      .style("border", "solid thin grey");

  svg.selectAll("*").remove();

  let minMaxF = d3.extent(arrGroup.map(d => d.labelY));
  let min = minMaxF[0];
  let max = minMaxF[1];

  let scaleX = d3.scaleLinear()
    .domain([a-5, b+5])
    .range([0, width - 2 * marginX]);

  let scaleY = d3.scaleLinear()
    .domain([min, max])
    .range([height - 2 * marginY, 0]);

  // создание осей
  let axisX = d3.axisBottom(scaleX); // горизонтальная
  let axisY = d3.axisLeft(scaleY); // вертикальная

  // отрисовка осей в SVG-элементе
  svg.append("g")
    .attr("transform", `translate(${marginX}, ${scaleY(0) + marginY})`)
    .call(axisX);
  svg.append("g")
    .attr("transform", `translate(${marginX + scaleX(0)}, ${marginY})`)
    .call(axisY);

    let data1 = [];
    let data2 = [];
    for (let i=0; i<arrGroup.length;i++) {
      if (arrGroup[i].labelX < Math.sqrt(5)) {
        data1.push(arrGroup[i]);
        //alert(arrGroup[i].labelX);
      } else {
        data2.push(arrGroup[i]);
      }
    }

    let line = d3.line()
      .x(function(d) {
        return scaleX(d.labelX);
      })
      .y(function(d) {
        return scaleY(d.labelY);
      })

    svg.append("path") // добавляем путь
        // созданному пути добавляются данные массива arrGraph в качестве атрибута
        .datum(data1)
        // вычисляем координаты концов линий с помощью функции lineF
        .attr("d", line)
        // помемещаем путь из линий в область построения
        .attr("transform", `translate(${marginX}, ${marginY})`)
        // задаем стиль линии графика
        .style("stroke-width", "2")
        .style("stroke", "red")

    svg.append("path") // добавляем путь
        .datum(data2)
        .attr("d", line)
        .attr("transform", `translate(${marginX}, ${marginY})`)
        .style("stroke-width", 2)
        .style("stroke", "red")
}