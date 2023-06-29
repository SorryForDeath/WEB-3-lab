//ТУТ ВСЕ НУЖНЫЕ ПЕРЕМЕННЫЕ ЗАВОДИМ
let inputElement = document.querySelectorAll("select");
inputElement[0].onclick = function(){
	for (let i = 0; i < this.children.length; i++)
		this.children[i].style.display = ``;
	if (inputElement[1].value != 0)
		this.children[inputElement[1].value].style.display = 'none';
		if (inputElement[2].value != 0)
		this.children[inputElement[2].value].style.display = 'none';
}

inputElement[1].onclick = function(){
	for (let i = 0; i < this.children.length; i++)
		this.children[i].style.display = ``;
	if (inputElement[0].value != 0)
		this.children[inputElement[0].value].style.display = 'none';
	if (inputElement[2].value != 0)
		this.children[inputElement[2].value].style.display = 'none';
}

inputElement[2].onclick = function(){
	for (let i = 0; i < this.children.length; i++)
		this.children[i].style.display = ``;
	if (inputElement[0].value != 0)
		this.children[inputElement[0].value].style.display = 'none';
	if (inputElement[1].value != 0)
		this.children[inputElement[1].value].style.display = 'none';
}

let element = document.getElementById("buttonFilter");
let element2 = document.getElementById("buttonSort");
let s = document.getElementsByTagName(`table`);
let arrStr = [];
//ТУТ ПРОШЛИСЬ ПО ВСЕЙ ТАБЛИЦЕ И ЗАПОМНИЛИ ЕЕ В МАССИВ
let arr = s[s.length - 1].children[0].children;
let arrFinal = [];
for (let i = 0; i < arr[0].children.length; i++){
	arrStr[i] = arr[0].children[i].innerHTML;
}
for (let i = 1; i < arr.length; i++) {
	let t = {};
	for (let j = 0; j < arrStr.length; j++) {
		t[arrStr[j]] = arr[i].children[j].innerHTML;
	}
	arrFinal.push(t);
}
let arrFinalFilter = [];
for (let i = 0; i < arrFinal.length; i++)
	arrFinalFilter.push(arrFinal[i]);
//ФУНКЦИЯ ФИЛЬТРАЦИИ ПО КЛИКУ
element.onclick = function(){
	for (let i = 1; i < arr.length; i++)
		arr[i].style.display = '';
	let flag = true;
	let yearFlag = true;
	let arrNewStr = [];
	let arrInput = document.getElementsByName("filter");
	let arrFilter = [];
	for (let i = 0; i < arrInput.length - 2; i++){
		if (arrInput[i].value == '') continue;
		arrFilter.push(arrInput[i]);
		arrNewStr.push(arrStr[i]);
	}
	let min = arrInput[arrInput.length - 2].value == '' ? `Empty` : arrInput[arrInput.length - 2].value;
	let max = arrInput[arrInput.length - 1].value == '' ? `Empty` : arrInput[arrInput.length - 1].value;
	if (!(min == `Empty` && max == `Empty`)){
		if (isNaN(min) || !isFinite(min) || min < 0  || min > 2024 || !Number.isInteger(+min) || isNaN(max) || !isFinite(max) || max < 0  || max > 2024 || !Number.isInteger(+max) || min > max){
			alert(`Errors in the fields with the year`);
			return 0;
		}		
		yearFlag = false;
	}
	if (!yearFlag){
		for (let i = 1; i < arr.length; i++){
			if (+arr[i].children[arr[i].children.length - 1].innerHTML < +min || +arr[i].children[arr[i].children.length - 1].innerHTML > +max)
				arr[i].style.display = `none`;
		}
	}
	for (let i = 1; i < arr.length; i++){
		for (let j = 0; j < arrFilter.length; j++){
			if (!(arrFinal[i - 1][arrNewStr[j]] == arrFilter[j].value)){
				flag = false;
				break;
			}
		}

		if (!flag) arr[i].style.display = `none`;
		flag = true;
	}
		
}
//ФУНКЦИЯ СОРТИРОВКИ ПО КЛИКУ
element2.onclick = function(){
	//ТУТ ЗАВОДИМ ВСЕ НУЖНЫЕ ПЕРЕМЕННЫЕ
	for (let i = 1; i < arr.length; i++)
		arr[i].style.display = '';
	let sortSelector = document.querySelectorAll("select");
	let checkArr = document.getElementsByName('desc');
	//СОБСТВЕННО АЛГОРИТМ СОРТИРОВКИ
	arrFinal.sort(compare = function(a, b){
		let count = 0;
		while (count < sortSelector.length){
			if (+sortSelector[count].value != 0) {
				if (checkArr[count].checked) {
					if (a[arrStr[sortSelector[count].value - 1]] > b[arrStr[sortSelector[count].value - 1]]) {
						return -1;
					}
					if (a[arrStr[sortSelector[count].value - 1]] < b[arrStr[sortSelector[count].value - 1]]) {
						return 1;
					}
				}
				else {
					if (a[arrStr[sortSelector[count].value - 1]] < b[arrStr[sortSelector[count].value - 1]]) {
					return -1;
					}
					if (a[arrStr[sortSelector[count].value - 1]] > b[arrStr[sortSelector[count].value - 1]]) {
						return 1;
					}
				}	
				count++;
			}
			else return 0;			
		}	
		return 0;
	});
	for (let i = 1; i < arr.length; i++)
		for (let j = 0; j < arr[i].children.length; j++)
			arr[i].children[j].innerHTML = arrFinal[i - 1][arrStr[j]];
	element.click();
};

function getArrGraph(arrObject, fieldX, fieldY) {
	// сформируем список меток по оси OX (различные элементы поля fieldX)
	// группируем по полю fieldX
	let groupObj = d3.group(arrObject, d=>d[fieldX]);//take an element from array d
	arrGroup = []; // массив объектов для построения графика
	for(let entry of groupObj) {
	//выделяем минимальное и максимальное значения поля fieldY in only two elements as min and max
	//для очередной метки по оси ОХ
	let minMax = d3.extent(entry[1].map(d => d[fieldY]));
	let elementGroup = {};

	elementGroup.labelX = entry[0];
	elementGroup.valueMin = minMax[0];
	elementGroup.valueMax = minMax[1];

	arrGroup.push(elementGroup);
	}
	return arrGroup;
}


function drawGraph(data) {
	// формируем массив для построения диаграммы year or country
	let arrGraph = getArrGraph(arrFinal, data.ox.value, "Год")
	let marginX = 100;
	let marginY = 90;
	let height = 600;
	let width = 1000;
	if (!(data.ox.value=="Жанр") && !(data.ox.value=="Язык")){
		alert('Значения по оси OX отсутствуют!');
		return;
	}
	if (!(data.sales_max.checked)&&!(data.sales_min.checked)){
		alert('Значения по оси OY отсутствуют!');
		return;
	}
	let svg = d3.select("svg")
		.attr("height", height + 110)
		.attr("width", width);
	// очищаем svg перед построением
	svg.selectAll("*").remove();

	// определяем минимальное и максимальное значение по оси OY
	let min = d3.min(arrGraph.map(d => d.valueMin)) * 0.95;
	let max = d3.max(arrGraph.map(d => d.valueMax)) * 1.05;
	let xAxisLen = width - 2 * marginX;
	let yAxisLen = height - 2 * marginY;

	// определяем шкалы для осей//сопоставляем оси с текстовыми значениями
	let scaleX = d3.scaleBand()
	.domain(arrGraph.map(function(d) {
	return d.labelX;
	})
	)
	.range([0, xAxisLen],1);
	let scaleY = d3.scaleLinear()
	.domain([min, max])
	.range([yAxisLen, 0]);
	// создаем оси
	let axisX = d3.axisBottom(scaleX); // горизонтальная
	let axisY = d3.axisLeft(scaleY);// вертикальная

	// отображаем ось OX, устанавливаем подписи оси ОX и угол их наклона
	svg.append("g")
	.attr("transform", `translate(${marginX}, ${height - marginY})`)
	.call(axisX)
	.attr("class", "x-axis")
	.selectAll("text")
	.style("text-anchor", "end")
	.style("font-size", "15px")
	.attr("dx", "-.8em")
	.attr("dy", ".15em")
	.attr("transform", function (d) {
	return "rotate(-45)";
	});
	// отображаем ось OY
	svg.append("g")
	.attr("transform", `translate(${marginX}, ${marginY})`)
	.attr("class", "y-axis")
	.call(axisY)
	.selectAll("text")
	.style("text-anchor", "end")
	.style("font-size", "11px");
	// создаем набор вертикальных линий для сетки
	d3.selectAll("g.x-axis g.tick")
	.append("line") // добавляем линию
	.classed("grid-line", true) // добавляем класс
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", 0)
	.attr("y2", - (yAxisLen));
	// создаем горизонтальные линии сетки
	d3.selectAll("g.y-axis g.tick")
	.append("line")
	.classed("grid-line", true)
	.attr("x1", 0)
	.attr("y1", 0)
	.attr("x2", xAxisLen)
	.attr("y2", 0);
	
	//по умолчанию выбраны обе высоты и точечная диаграмма
	if ((data.sales_max.checked)&&(data.sales_min.checked)){
		if (!(data.ox.value==="Жанр") && !(data.ox.value==="Язык")){alert('Значения по оси OX отсутствуют!');}
			svg.selectAll(".dot")//для максимальной 
			.data(arrGraph)
			.enter()
			.append("circle")
			.attr("r", 5)
			.attr("cx", function(d) { return scaleX(d.labelX); })
			.attr("cy", function(d) { return scaleY(d.valueMax); })
			.attr("transform",
			`translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
			.style("fill", "#a21212")

			svg.selectAll(".dot")//для минимальной 
			.data(arrGraph)
			.enter()
			.append("circle")
			.attr("r", 5)
			.attr("cx", function(d) { return scaleX(d.labelX); })
			.attr("cy", function(d) { return scaleY(d.valueMin); })
			.attr("transform",
			`translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
			.style("fill", "#646161")
		
	} else if ((data.sales_max.checked)&&!(data.sales_min.checked)){
		
			svg.selectAll(".dot")//для максимальной 
			.data(arrGraph)
			.enter()
			.append("circle")
			.attr("r", 5)
			.attr("cx", function(d) { return scaleX(d.labelX); })
			.attr("cy", function(d) { return scaleY(d.valueMax); })
			.attr("transform",
			`translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
			.style("fill", "#a21212")
		
	} else if (!(data.sales_max.checked)&&(data.sales_min.checked)){
		
			svg.selectAll(".dot")//для минимальной 
			.data(arrGraph)
			.enter()
			.append("circle")
			.attr("r", 5)
			.attr("cx", function(d) { return scaleX(d.labelX); })
			.attr("cy", function(d) { return scaleY(d.valueMin); })
			.attr("transform",
			`translate(${marginX + scaleX.bandwidth()/2}, ${marginY})`)
			.style("fill", "#646161")
		
	} else if (!(data.sales_max.checked)&&!(data.sales_min.checked)){ 
		alert('Значения по оси OY отсутствуют!');
	} 
}	         