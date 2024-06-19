
// 当 tubiao.js 被加载时，不需要额外的函数调用来初始化图表
// 因为图表初始化代码已经直接写在了这个文件里
// 确保 DOM 已经加载完成（虽然在这里不是必须的，因为通常会在 HTML 文件的末尾引入此文件）
document.addEventListener('DOMContentLoaded', function () {
    $.getJSON('js/westeros.json', function (themeJSON) {
        echarts.registerTheme('wonderland', themeJSON)


        var option = {
            // title: {
            //     text: '气象数据折线图',
            //     left: '10%',
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['风速', '气压'],
                right: '1%',
            },
            // toolbox: {
            //     feature: {
            //         saveAsImage: {}
            //     }
            // },
            grid: {
                left: '3%',
                 right: '0%',
                 top:'25%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [
                    '24日0时',  '24日6时',  '24日9时',
                    '24日12时', '24日18时', '24日21时',
                    '25日0时',  '25日6时',  '25日9时',
                    '25日12时', '25日18时', '25日21时',
                    '26日0时',  '26日6时',  '26日9时',
                    '26日12时', '26日18时', '26日21时',
                    '27日0时',  '27日6时',  '27日9时',
                    '27日12时', '27日18时', '27日21时',
                    '28日0时',  '28日6时',  '28日9时'
                ]
            },
            yAxis: [
                {
                    type: 'value',
                    name: '风速',
                    position: 'left',

                },
                {
                    type: 'value',
                    name: '气压',
                    position: 'right',
                    axisLabel: {
                        fontSize: 8
                    },
                    min:900,
                },
            ],
            series: [
                {
                    name: '风速',
                    type: 'line',
                    stack: '风速',
                    smooth: true, // 平滑过渡
                    symbol: 'circle', // 数据点形状为圆形
                    symbolSize: 2, // 数据点大小
                    data:[
                        18, 18, 20, 20, 23, 23, 23, 23,
                        23, 23, 25, 25, 28, 28, 30, 30,
                        30, 30, 33, 33, 33, 30, 28, 25,
                        23, 20, 20
                    ],
                    areaStyle: { // 设置区域样式
                        color: '#B5DBFE',
                    },
                },
                {
                    name: '气压',
                    type: 'line',
                    stack: '气压',
                    yAxisIndex: 1,
                    smooth: true, // 平滑过渡
                    symbol: 'circle', // 数据点形状为圆形
                    symbolSize: 2, // 数据点大小
                    data:[
                        1003, 1002, 997, 997, 995, 995,
                        995,  995, 995, 995, 990, 990,
                        985,  985, 982, 982, 982, 980,
                        978,  978, 978, 982, 985, 988,
                        990,  995, 995
                    ], // 假设的数据
                    areaStyle: { // 设置区域样式
                        color: '#7AD9C8',
                    },
                }
            ]
        };
        var option1 = {
            title: {},
            // 不设置 legend，或者设置为 {} 来隐藏图例
            // legend: {},
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '5%',
                 top:'15%',
                bottom: '0%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [
                    '24日0时',  '24日6时',  '24日9时',
                    '24日12时', '24日18时', '24日21时',
                    '25日0时',  '25日6时',  '25日9时',
                    '25日12时', '25日18时', '25日21时',
                    '26日0时',  '26日6时',  '26日9时',
                    '26日12时', '26日18时', '26日21时',
                    '27日0时',  '27日6时',  '27日9时',
                    '27日12时', '27日18时', '27日21时',
                    '28日0时',  '28日6时',  '28日9时'
                ]
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'm/s',
                    position: 'left',
                }
            ],
            series: [
                {
                    name: '风速',
                    type: 'line',
                    stack: '风速',
                    smooth: true, // 平滑过渡
                    symbol: 'circle', // 数据点形状为圆形
                    symbolSize: 2, // 数据点大小
                    data:[
                        13, 13, 12, 10, 10, 12, 13, 15,
                        15, 15, 16, 17, 17, 19, 17, 17,
                        20, 18, 21, 30, 26, 31, 37, 35,
                        45, 50, 50
                    ],
                    areaStyle: { // 设置区域样式
                        color: '#B5DBFE',
                    },
                    // markPoint: {
                    //     data: [
                    //         {type: 'max',}
                    //     ]
                    // },
                },
            ]
        };
        var myChart = echarts.init(document.getElementById('main'), 'wonderland');
        myChart.setOption(option);
        var myChart1 = echarts.init(document.getElementById('main1'), 'wonderland');
        myChart1.setOption(option1);

    });
});