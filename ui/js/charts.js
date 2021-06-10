/*
 * @Descripttion: 
 * @Version: xxx
 * @Author: WanJu
 * @Date: 2021-05-31 16:21:19
 * @LastEditors: WanJu
 * @LastEditTime: 2021-06-10 11:27:17
 */
// import * as echarts from '../js/libs/echarts.min.js'
// var echarts = require('../js/libs/echarts.min.js');
function paint_form(header, data, table_id, height){
    // console.log(header)
    // console.log(data)

    var myTable = document.getElementById(table_id);
    myTable.innerHTML = '';
    $(table_id + " tbody").html("");

    console.log('shape-row:', data.length);
    console.log('shape-col:', data[0].length);
    for (var i = 0; i < data.length; i++){
        myTable.insertRow(i);
        for (var j = 0; j < data[i].length; j++){
            myTable.rows[i].insertCell(j).innerHTML = data[i][j];
        }
    }
    
    var thead = myTable.createTHead();
    thead.insertRow(0);
    for (var i = 0; i < header.length; i++){
        thead.rows[0].insertCell(i).innerHTML = header[i];
    }

    $('#' + table_id).fixedThead({height: height});
}

function paint_line(title, legend, index, data, smooth){
    var canvas = document.getElementById('div_all_charts')
    var chartPar = document.createElement('div');
    var chartDom = document.createElement('div');
    var del_chart = document.createElement('input');
    chartPar.appendChild(chartDom)
    chartPar.appendChild(del_chart)
    chartPar.className = 'charts_par'
    chartDom.className = 'charts'
    del_chart.className = 'del_chart'
    del_chart.type = 'button'
    del_chart.value = '删除'
    del_chart.onclick = function(){
        canvas.removeChild(chartPar)
    }

    canvas.appendChild(chartPar)
    var chart_line = echarts.init(chartDom, 'dark')
    var option = {}
    option['title'] = {
        text: title
    }
    
    option['tooltip'] = {
        trigger: 'axis'
    }

    option['legend'] = {
        data: legend,
        orient: 'vertical',
        x: 'left',
        y: 'top',
        itemGap: 15,
        padding:[50,0,0,10],
        textStyle: {
            fontSize: 13,
            color: '#fff',
        }
    }

    option['toolbox'] = {
        feature: {
            saveAsImage: {},
            dataView: {},
            magicType: {
                type: ['bar', 'line']
            },
            restore: {}
        },
        right: '80px'
    }

    option['xAxis'] = {
        type: 'category',
        boundaryGap: false,
        data: index
    }

    option['yAxis'] = {
        type: 'value'
    }

    option['series'] = []
    for (var i = 0; i < legend.length; i++){
        option['series'].push({
            name: legend[i],
            type: 'line',
            data: data[i],
            smooth: smooth
        })
    }

    option['dataZoom'] = [
        {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'none',
        },
        {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'none'
        },
        {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'none'
        },
        {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'none'
        }
    ]

    option['backgroundColor'] = '#00000000'

    option['grid'] = {
        left: '200px',
        right: '70px',
        containLabel: true
    }

    option && chart_line.setOption(option)
    window.addEventListener("resize", function() {
        chart_line.resize();
      });
}

function paint_bar(title, legend, index, data, type){
    var canvas = document.getElementById('div_all_charts')
    var chartPar = document.createElement('div');
    var chartDom = document.createElement('div');
    var del_chart = document.createElement('input');
    chartPar.appendChild(chartDom)
    chartPar.appendChild(del_chart)
    chartPar.className = 'charts_par'
    chartDom.className = 'charts'
    del_chart.className = 'del_chart'
    del_chart.type = 'button'
    del_chart.value = '删除'
    del_chart.onclick = function(){
        canvas.removeChild(chartPar)
    }

    canvas.appendChild(chartPar)
    var chart_line = echarts.init(chartDom, 'dark')
    var option = {}
    option['title'] = {
        text: title
    }
    
    option['tooltip'] = {
        trigger: 'axis'
    }

    option['legend'] = {
        data: legend,
        orient: 'vertical',
        x: 'left',
        y: 'top',
        itemGap: 15,
        padding:[50,0,0,10],
        textStyle: {
            fontSize: 13,
            color: '#fff',
        }
    }

    option['toolbox'] = {
        feature: {
            saveAsImage: {},
            dataView: {},
            magicType: {
                type: ['bar', 'line']
            },
            restore: {}
        },
        right: '80px'
    }

    var xAxis = 'xAxis'
    var yAxis = 'yAxis'
    if (type == 'h'){
        xAxis = 'yAxis'
        yAxis = 'xAxis'
    }
    option[xAxis] = {
        type: 'category',
        data: index
    }

    option[yAxis] = {
        type: 'value',
        boundaryGap: [0, 0.01]
    }

    option['series'] = []
    for (var i = 0; i < legend.length; i++){
        option['series'].push({
            name: legend[i],
            type: 'bar',
            data: data[i]
        })
    }

    option['dataZoom'] = [
        {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'none',
        },
        {
            type: 'slider',
            yAxisIndex: 0,
            filterMode: 'none'
        },
        {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'none'
        },
        {
            type: 'inside',
            yAxisIndex: 0,
            filterMode: 'none'
        }
    ]

    option['backgroundColor'] = '#00000000'

    option['grid'] = {
        left: '150px',
        right: '70px',
        containLabel: true
    }

    option && chart_line.setOption(option)
    window.addEventListener("resize", function() {
        chart_line.resize();
      });
}