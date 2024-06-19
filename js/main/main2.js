//一些具体的函数
function DeleteLayers(){
    //清楚all矢量图层,除了警戒线和行政区域
    var vectorLayers = map.getLayers().getArray().filter(function(layer) {
        return layer instanceof ol.layer.Vector;
    });
    //alert("去除"+vectorLayers.length +"个元素");
    // 遍历并移除所有矢量图层
    vectorLayers.forEach(function(layer) {
        //console.log(layer.name);
        //alert(layer.get('name'));
        if (layer.get('name') === "jingjiexian" || layer.get('name') === "shi") {
            // 如果线条不可删除，则不执行任何操作或显示错误消息
            //alert('此线条不可删除！');
            return;
            // console.log("1");
        }
        map.removeLayer(layer);
    });
}
function gradeToColor(grade) {
    if(grade < 6){
        return '#38FB43';
    } else if (grade <= 7) {
        return '#3E7FF7';
    } else if (grade <= 9) {
        return '#FDFC31';
    } else if (grade <= 11) {
        return '#FC9C1F';
    } else if (grade <= 13) {
        return '#FA7DFD';
    } else if (grade > 15) {
        return '#F73134';
    }
}
function speedToColor(speed){
    if (speed < 10.8) {
        return '#38FB43';
    }else if(speed <= 17.1){
        return '#3E7FF7';
    } else if (speed <= 24.4) {
        return '#FDFC31';
    } else if (speed <= 32.6) {
        return '#FC9C1F';
    } else if (speed <= 41.4) {
        return '#FA7DFD';
    } else if (speed > 41.4) {
        return  '#F73134';
    }
}
function speedToGrade(speed){
    if (speed < 10.8) {
        return 'TC';
    }else if(speed <= 17.1){
        return 'TD';
    } else if (speed <= 24.4) {
        return 'TS';
    } else if (speed <= 32.6) {
        return 'STS';
    } else if (speed <= 41.4) {
        return 'TY';
    } else if (speed > 41.4) {
        return  'STY';
    }
}
function areCoordinatesEqual(coord1, coord2) {
    //判断数组长度是否相等
    if (coord1 && coord2 && coord1.length === coord2.length) {
        // 使用数组的 every 方法来检查每个元素是否相等
        return coord1.every((value, index) => value === coord2[index]);
    }
    // 如果数组不存在或长度不等，则认为它们不相等
    return false;
}
function ensureClosedRing(geometry) {
    //强行使得数组的首尾坐标相同，不推荐，而且未使用
    if (geometry instanceof ol.geom.Polygon || geometry instanceof ol.geom.LinearRing) {
        const coordinates = geometry.getCoordinates();
        const firstCoord = coordinates[0][0];
        const lastCoord = coordinates[0][coordinates[0].length - 1];
        // console.log("首坐标" + firstCoord);
        // console.log("尾坐标" + lastCoord);
        //console.log("首尾不同");
        // 检查首坐标和尾坐标是否相同
        if (!areCoordinatesEqual(firstCoord, lastCoord)) {
            // 如果不相同，添加首坐标的副本到数组末尾
            coordinates[0].pop()
            //coordinates[0].push(firstCoord.slice()); // 使用slice()来避免直接修改原始对象（如果需要的话）
            console.log("首尾不同");
            // 更新geometry的坐标
            geometry.setCoordinates(coordinates[0]);
            console.log(coordinates[0]);
            //myFunction6(coordinates[0]);
            //console.log("Updated feature:", feature.toJSON());
        }
    }
}
function fixPolygonRings(feature) {
    //修复内部环，未使用
    if (feature.getGeometry() && feature.getGeometry() instanceof ol.geom.Polygon) {
        const geometry = feature.getGeometry();
        console.log(geometry);
        // 获取线性环数组（包括外部环和内部环/洞）
        const linearRings = geometry.getLinearRings();
        //console.log(linearRings.length);
        // 遍历每个环并修复它
        for (let i = 0; i < linearRings.length; i++) {
            const ring = linearRings[i];
            const coordinates = ring.getCoordinates();

            // 检查起始点和结束点是否相同
            if (!ol.extent.equals(coordinates[0], coordinates[coordinates.length - 1])) {
                // 如果不相同，复制起始点到数组末尾
                coordinates.push(coordinates[0].slice()); // 使用slice()来创建一个新数组副本

                // 更新环的坐标
                ring.setCoordinates(coordinates);
            }
        }
    }
    return feature;
}
function formatDate(dateString) {
    //时间格式转换
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要+1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0') + '时'; // 添加“时”作为小时单位
    return `${year.toString().slice(-2)}/${month}/${day} ${hours}`;
}
function drawPoint(arr){
    //数组转point然后显示，未使用
    var features = arr.map(function(arr) {
        var geometry = new ol.geom.Point(ol.proj.transform([arr.Longitude, arr.Latitude], 'EPSG:4326', 'EPSG:3857'));
        return new ol.Feature({
            geometry: geometry
        });
    });

    // 创建一个矢量源，并将特征添加到其中
    var vectorSource = new ol.source.Vector({
        features: features
    });

    // 创建一个矢量图层，并设置样式（可选）
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: function(feature) {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({color: 'rgba(255,0,0,1)'}),
                    stroke: new ol.style.Stroke({color: 'rgba(0,0,0,0.5)', width: 1})
                })
            });
        }
    });
    map.addLayer(vectorLayer);
}

function setText(arr,str,color,classname){
    //alert(str);
    const overlay = new ol.Overlay({
        element: document.createElement('div'),
        offset: [10, 80], // 根据需要调整偏移量
        positioning: 'center-center',
    });

    const feature = map.getLayers().getArray()[1].getSource().getFeatures()[0];
    const line =  arr.map(function(item) {
        // 假设您的原始坐标是 EPSG:4326（WGS 84），并且您想将它们转换为 EPSG:3857（Web Mercator）
        return ol.proj.transform([item.Longitude, item.Latitude], 'EPSG:4326', 'EPSG:3857');
    });
    const Point = line[line.length - 1];
    //alert(Point);
    overlay.setPosition(Point);
    const overlayElement = overlay.getElement();
    overlayElement.className = classname;
    overlayElement.style.display = 'flex';
    overlayElement.style.flexDirection = 'column'; // 这不会真正使文本垂直，但可以使元素垂直排列
    overlayElement.style.lineHeight = '1em'; // 调整行高以适应你的需求
    overlayElement.style.writingMode = 'vertical-rl'; // 这在某些浏览器（如Firefox）中有效
    overlayElement.style.transform = 'rotate(0deg)'; // 可能需要旋转来匹配地图的方向
    overlayElement.style.fontSize = '12px';
    overlayElement.style.fontWeight = 'bold';
    overlayElement.style.letterSpacing = '4px';

    // overlayElement.textContent = text.split('').join('\n'); // 将每个字符放在新的一行上
    overlay.getElement().textContent = str;
    overlayElement.style.color = color;

    map.addOverlay(overlay);
}
function toLine(arr,color,linedash){
    var coordinates = arr.map(function(item) {
        // 假设您的原始坐标是 EPSG:4326（WGS 84），并且您想将它们转换为 EPSG:3857（Web Mercator）
        return ol.proj.transform([item.Longitude, item.Latitude], 'EPSG:4326', 'EPSG:3857');
    });

    var lineString = new ol.geom.LineString(coordinates);

    // 创建一个包含 LineString 几何的 Feature
    var feature = new ol.Feature({
        geometry: lineString,
    });

    var features = [feature]; // 或者对于多条线，可以在循环中创建多个 Feature 并推送到数组中

    var vectorSource = new ol.source.Vector({
        features: features,
    });

    // 创建一个 Vector 图层并设置样式
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        name: "jingjiexian",
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: color,
                width: 1.5,
                lineDash:linedash
            })

        })
    });
    map.addLayer(vectorLayer);
}
function drawCordon(url,textName,color,classname,linedash){
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            let myArr = JSON.parse(this.responseText);
            setText(myArr,textName,color,classname);
            toLine(myArr,color,linedash);
        }
    }
    xmlhttp.open("GET",url,true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //alert("输出警戒线1");
    xmlhttp.send();
}

function addShi(myArr,color){
    //添加市级行政区
    for (let i = 0; i < myArr.length; i++) {
        let point = myArr[i];
        let temp = point[0];
        point[0] = point[1];
        point[1] = temp;
    }

    var coordinates = myArr.map(function(item) {
        // 假设您的原始坐标是 EPSG:4326（WGS 84），并且您想将它们转换为 EPSG:3857（Web Mercator）
        return ol.proj.transform([item[0], item[1]], 'EPSG:4326', 'EPSG:3857');
    });

    var Polygon = new ol.Feature({
        geometry: new ol.geom.Polygon([coordinates])
    });
    //console.log(Polygon);
    //设置区样式信息
    Polygon.setStyle(new ol.style.Style({
        //边线颜色
        stroke: new ol.style.Stroke({
            color: color,
            width: 2
        }),
        //形状
        image: new ol.style.Circle({
            radius: 700,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0.1)' // 红色，半透明
        })
    }));

    //实例化一个矢量图层Vector作为绘制层
    var source = new ol.source.Vector({
        features: [Polygon]
    });
    //创建一个图层
    var vector = new ol.layer.Vector({
        source: source,
        name: 'shi'
    });
    //将绘制层添加到地图容器中
    map.addLayer(vector);
    //alert("加入成功");
}
function lonLat2Mercator(lon, lat) {
    //输入lon，lat输出{x:x,y:y}的数组
    var x = lon ; // 假设的简单缩放
    var y = lat; // 假设的简单缩放
    return {
        x: x,
        y: y
    };
}

function dataToTable(arr) {
    //获取的台风基本信息写入表格
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        out += '<a href="' + arr[i].url + '">' +
            arr[i].Number + '</a><br>';
    }
    //out = arr[0].Number + arr[0].CNName + arr[0].ENName;
    // out='<td>'+arr[0].Number+ '</td>'
    // +'<td>'+arr[0].CNName+'</td>'
    // +'<td>'+arr[0].ENName+'</td>'
    // ;
    out = '<table border="1">\n' +
        '<thead>\n' +
        '<tr>\n' +
        '    <th>台风编号</th>\n' +
        '    <th>台风名</th>\n' +
        '    <th>英文名</th>\n' +
        '</tr>\n' +
        '</thead>\n' +
        '<tbody>\n';

// 遍历数组arr
    for (let i = 0; i < arr.length; i++) {
        // 为每个台风创建一个<tr>元素，并添加onclick事件（如果需要的话）
        // 注意：这里我使用了i作为索引来访问arr中的每个对象
        out +=`<tr onclick="dataOfNumber('${arr[i].Number}')">`+ // 假设loadXMLDoc2接受一个字符串参数
            '    <td>' + arr[i].Number + '</td>\n' +
            '    <td>' + arr[i].CNName + '</td>\n' +
            '    <td>' + arr[i].ENName + '</td>\n' +
            '</tr>\n';
    }

    out += '</tbody>\n' +
        '</table>';

    var elements = document.getElementsByClassName('tftjxzContent'); // 注意这里不要加点号
    if (elements.length > 0) {
        elements[0].innerHTML = out;// 只设置第一个元素的innerHTML
    }
    //document.getElementById("myDiv").innerHTML=out;
}
function dataOfNumber(str) {
    //查询台风详细信息表然后画path
    var xmlhttp;
    // alert("查询"+str);
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            var myArr = JSON.parse(this.responseText);
            dataAll(myArr);
        }
    }
    // alert("正在查询");
    xmlhttp.open('GET', 'http://localhost:3000/api/data1?q=' + encodeURIComponent(str), true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send();
}
async function dataAll(myArr){
    try {
        // alert(myArr[0]);
        dataToTable1(myArr);
        drawChart(myArr);
        await drawPath(myArr);
        BufferRadius(myArr);
    } catch (error){
        console.log("加载失败");
    }

}
function dataToTable1(arr) {
    //获取的台风详细信息写入表格
    //alert("6666");
    var out = "";
    out = '<table border="1">\n' +
        '  <thead>\n' +
        '    <tr>\n' +
        '      <th>时间</th>\n' +
        '      <th>风力</th>\n' +
        '      <th>风速</th>\n' +
        '    </tr>\n' +
        '  </thead>\n' +
        '  <tbody>';
    //alert(out);

    for(let i = 0; i < arr.length;i++){
        //console.log(convertUtcTimeToBeijingTime(arr[i].time,2024));
        // const time1 =  formatDate(arr[i].Time) || convertUtcTimeToBeijingTime(arr[i].time,2024);
        let time1;
        if (arr[i].Time) {
            time1 = formatDate(arr[i].Time);
        } else if (arr[i].time) {
            time1 = convertUtcTimeToBeijingTime(arr[i].time, 2024);
        }
        out += ' <tr class = "a" onclick="alert(\'定位台风点\')">\n' +
            '                            <td>'+time1+'</td>\n' +
            '                            <td>'+(arr[i].WindGrade || speedToGrade(arr[i].speed))+'</td>\n' +
            '                            <td>'+(arr[i].WindSpeed || arr[i].speed)+'</td>\n' +
            '                        </tr>\n';
    }
    out += '</tbody>\n' +
        '</table>';
    var elements = document.getElementsByClassName('tfljContent'); // 注意这里不要加点号
    if (elements.length > 0) {
        elements[0].innerHTML = out;// 只设置第一个元素的innerHTML
    }
}

function MapCenter(arr,zoom){
    const fromLonLat = ol.proj.fromLonLat; // 假设你已经引入了OpenLayers库
    const lonLat = (arr[0].Longitude !== undefined && arr[0].Latitude !== undefined)
        ? [arr[0].Longitude, arr[0].Latitude]
        : [arr[0].lng || 0, arr[0].lat || 0]; // 如果lng或lat不存在，则使用0作为默认值

    const center = fromLonLat(lonLat);
    console.log(lonLat);
    //const center = fromLonLat([arr[0].Longitude, arr[0].Latitude]]);
    map.getView().setCenter(center);
    map.getView().setZoom(zoom);
}
function drawPoint1(arr){
    //画点
    var longitude = arr.Longitude || arr.lng;
    var latitude = arr.Latitude || arr.lat;
    var  color =  gradeToColor(arr.WindGrade) || speedToColor(arr.speed);
    // 将经纬度从 EPSG:4326 转换为 EPSG:3857
    var coordinate = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');

    // 创建一个点几何对象
    var geometry = new ol.geom.Point(coordinate);

    // 创建一个包含该几何对象的 Feature
    var feature = new ol.Feature({
        geometry: geometry // 确保这里使用的是 geometry 而不是 point
    });

    // 创建一个矢量源，并将特征添加到其中
    var vectorSource = new ol.source.Vector({
        features: [feature]
    });

    // 创建一个矢量图层，并设置样式
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: function(feature) {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 3,
                    fill: new ol.style.Fill({color: color}),
                    stroke: new ol.style.Stroke({color: color, width: 1})
                })
            });
        }
    });

    // 将矢量图层添加到地图上
    map.addLayer(vectorLayer);
};
function toLine1(arr,i,lineDash){
    if(i == 0) return 0;
    let arr1 = [arr[i-1], arr[i]];
    var coordinates = arr1.map(function(item) {
        // 假设您的原始坐标是 EPSG:4326（WGS 84），并且您想将它们转换为 EPSG:3857（Web Mercator）
        return ol.proj.transform([item.Longitude || item.lng, item.Latitude || item.lat], 'EPSG:4326', 'EPSG:3857');
    });
    var  color =  gradeToColor(arr[i-1].WindGrade) || speedToColor(arr[i-1].speed);
    //console.log(coordinates);
    // 使用所有点坐标创建一个 LineString
    var lineString = new ol.geom.LineString(coordinates);

    // 创建一个包含 LineString 几何的 Feature
    var feature = new ol.Feature({
        geometry: lineString
    });

    // 如果您有多个这样的线（尽管在您提供的数组中只有一个），则可以在此处创建一个 Feature 数组
    var features = [feature]; // 或者对于多条线，可以在循环中创建多个 Feature 并推送到数组中

    // 创建一个 Vector 源并将 Feature（或 Feature 数组）添加到其中
    var vectorSource = new ol.source.Vector({
        features: features
    });

    // 创建一个 Vector 图层并设置样式
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: color,
                width: 2,
                lineDash: lineDash
            })
        })
    });
    // 将 Vector 图层添加到地图上
    map.addLayer(vectorLayer);
}
async function drawPath(arr) {
    //alert("1");
    DeleteLayers();// 清楚所有矢量图层
    //设置中心点
    MapCenter(arr,5);
    return new Promise((resolve, reject) => {
        let completedCount = 0; // 计数器，用于追踪完成的回调数量
        const totalCount = arr.length; // 总共需要完成的回调数量
        // 封装回调函数，以便在完成后增加计数器
        function onComplete() {
            completedCount++;
            if (completedCount === totalCount) {
                // 所有回调都已完成，解决 Promise
                resolve();
                //alert("路径显示完成"); // 现在这个警告会在所有路径都显示完成后显示
            }
        }

        for (let i = 0; i < arr.length; i++) {
            setTimeout(function () {
                drawPoint1(arr[i]);
                toLine1(arr, i);
                onComplete(); // 回调完成后调用 onComplete
            }, i * 100); // 乘以 index 以确保每次延迟增加
        }
    });
}

function BufferRadius(arr){
    //turf做真实缓冲区
    const line = arr.map(function (item) {
        return [item.Longitude ?? item.lng, item.Latitude ?? item.lat];
    });
    const lineGeoJSON = turf.lineString(line);
    //alert(line);
    // const distance = arr.map(function (item) {
    //     return [item.distance];
    // const distanceGeoJSON = turf.lineString(distance);

    // 使用Turf.js计算缓冲区
    var bufferedGeoJSON = turf.buffer(lineGeoJSON, 150, {units: 'kilometers'});

    // 处理可能是Polygon或MultiPolygon的情况
    var bufferedGeometry;
    if (bufferedGeoJSON.geometry.type === 'Polygon') {
        bufferedGeometry = new ol.geom.Polygon([bufferedGeoJSON.geometry.coordinates[0]]).transform('EPSG:4326', 'EPSG:3857');
    }
    else if (bufferedGeoJSON.geometry.type === 'MultiPolygon')
    {
        // 对于MultiPolygon，你需要遍历每个Polygon并创建一个ol.geom.Polygon的数组
        var polygonGeometries = bufferedGeoJSON.geometry.coordinates.map(function(coords)
        {
            return new ol.geom.Polygon([coords[0]]).transform('EPSG:4326', 'EPSG:3857');
        });
        bufferedGeometry = polygonGeometries[0];
    }

    var bufferedFeature = new ol.Feature(bufferedGeometry);

    var bufferSource = new ol.source.Vector({
        features: [bufferedFeature]
    });

    var bufferLayer = new ol.layer.Vector({
        source: bufferSource,
        name: 'huanchong',
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.2)' // 使用一个更明显的颜色以便看到
            }),
            stroke: new ol.style.Stroke({
                color: '#ff0000', // 红色边框
                width: 2 // 更宽的边框
            })
        })
    });
    //alert("添加缓冲区图层");
    map.addLayer(bufferLayer);
}
function circleBufferRadius(arr){
    // 做圆缓冲区
    var coordinates = arr.map(function(item) {
        // 假设您的原始坐标是 EPSG:4326（WGS 84），并且您想将它们转换为 EPSG:3857（Web Mercator）
        return ol.proj.transform([item.Longitude, item.Latitude], 'EPSG:4326', 'EPSG:3857');
    });

    // 使用所有点坐标创建一个 LineString
    var lineString = new ol.geom.LineString(coordinates);

    // 缓冲区半径（以米为单位），这里假设为100000米
    var bufferRadius = 100000;
    //alert("1");
    // 创建一个空的features数组来存储缓冲区圆
    var bufferFeatures = [];

    // 遍历LineString的每个坐标
    lineString.getCoordinates().forEach(function(coordinate) {
        var circle = new ol.geom.Circle(coordinate, bufferRadius);
        var feature = new ol.Feature({
            geometry: circle
        });
        feature.setStyle(new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255,255,255,0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#3399CC',
                width: 1
            })
        }));

        bufferFeatures.push(feature);
    });
    //alert("2");
    // 创建一个Vector源并将Feature数组添加到其中
    var vectorSource = new ol.source.Vector({
        features: bufferFeatures
    });

    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    map.addLayer(vectorLayer);
}

function drawChart(arr){

    var newData = arr.map(function(item){
        console.log(item.Time);
        var timeValue = item.Time !== undefined ? formatDateTimeTo12Hour(item.Time) : convertUtcTimeToBeijingTime(item.time,2024);
        // 如果 timeValue 仍然是 falsy（例如 undefined），则可能希望返回一个默认值或其他逻辑
        return timeValue !== undefined ? timeValue : null; // 或其他默认值
    })

    //console.log(newData);
    var newData1 = arr.map(function(item){
        var speedValue = item.WindSpeed !== undefined ? item.WindSpeed : item.speed;
        // 如果 speedValue 仍然是 falsy（例如 undefined），则可能希望返回一个默认值或其他逻辑
        return speedValue !== undefined ? speedValue : null; // 或其他默认值
    });
    var newData2  = arr.map(function(item){
        return item.QiYa || item.pressure;
    })
    var newData3  = arr.map(function(item){
        return item.MoveSpeed || item.moveSpeed;
    })
    console.log(newData);
    console.log(newData1);
    console.log(newData2);
    console.log(newData3);
    //alert("完成");
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
            data: newData,
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
                data:newData1,
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
                data:newData2, // 假设的数据
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
            data: newData,
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
                data:newData3,
                areaStyle: { // 设置区域样式
                    color: '#B5DBFE',
                },
            },
        ]
    };
    //option.xAxis[0].data = newData;
    // option.series[0].data = newData1;
    // option.series[1].data = newData2;
    //alert("nihao");
    // console.log("111");
    var chart = document.getElementById('main');
    // 如果已经有图表实例，先销毁它
    var myChart = echarts.getInstanceByDom(chart);
    if (myChart) {
        myChart.dispose();
    }
    // 初始化新图表实例
    myChart = echarts.init(chart);
    // 设置图表配置项和数据
    myChart.setOption(option);
    
    console.log(newData3);
    var chart1 = document.getElementById('main1');
    var myChart1 = echarts.getInstanceByDom(chart1);
    if (myChart1) {
        myChart1.dispose();
    }
    // 初始化新图表实例
    myChart = echarts.init(chart1);
    // 设置图表配置项和数据
    myChart.setOption(option1);

}
function convertUtcTimeToBeijingTime(utcTimeString) {
    // 假设utcTimeString格式为"MMDDHHMM"
    const parts = utcTimeString.match(/^(\d{2})(\d{2})(\d{2})/);
    if (!parts) {
        throw new Error('Invalid UTC time format');
    }

    // 分别获取月、日、时、分的部分
    const dd = parseInt(parts[1], 10); // 日期
    const hh = parseInt(parts[2], 10); // UTC小时
    const min = parseInt(parts[3], 10); // 分钟

    // 假设当前年份（因为UTC时间没有年份），这里使用当前年份作为示例
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // 构造UTC日期对象（月份是从0开始的）
    const utcDate = new Date(Date.UTC(currentYear, 6 - 1, dd, hh, min, 0, 0));

    // 将UTC时间转换为北京时间（东八区）
    const beijingDate = new Date(utcDate.getTime() ); // 加8小时

    // 构造目标格式的字符串（注意：这里假设日期是当月的某一天，不考虑跨月情况）
    const dayOfMonth = beijingDate.getDate();
    const hour = beijingDate.getHours(); // 注意：getHours()返回的是本地时间的小时
    return `${dayOfMonth}日${(hour < 10 ? '0' : '') + hour}时`;
    console.log( `${dayOfMonth}日${(hour < 10 ? '0' : '') + hour}时`);
}
function formatDateTimeTo12Hour(dateTimeString, timezoneOffsetInHours = 8) {
    // 解析日期时间字符串为UTC时间
    const date = new Date(dateTimeString + 'Z'); // 添加'Z'表示UTC时间

    // 应用时区偏移（以毫秒为单位）
    const offset = timezoneOffsetInHours * 60 * 60 * 1000;
    const localDate = new Date(date.getTime() + offset);

    // 格式化日期和时间（12小时制）
    const hours = localDate.getHours() ; // 12小时制的小时数
    const minutes = localDate.getMinutes().toString().padStart(2, '0'); // 两位数的分钟数
    const dayOfMonth = localDate.getDate(); // 一个月中的第几天
    const period = hours >= 12 ? '下午' : '上午'; // 上午或下午

    // 返回格式化后的字符串
    return `${dayOfMonth}日${hours}时`;
}

async function messageData() {
    //读取txt中的电文然后显示预测路径
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
    }
    else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            console.log(this.responseText);
            const bulletinString1 = this.responseText;

            const typhoonData = parseTyphoonBulletin(bulletinString1); //文本正则表达式转化为数组返回
            console.log(JSON.stringify(typhoonData, null, 2)); // 格式化输出JSON
            //以下代码为显示电文的内容
            //const jsonString = JSON.stringify(typhoonData, null, 2);
            //const data = JSON.parse(jsonString);

            // const initialLat = typhoonData.subjective_forecast.initial_position.lat;
            // const initialLng = typhoonData.subjective_forecast.initial_position.lng;
            // const initialPressure = typhoonData.subjective_forecast.initial_position.pressure;
            // const initialSpeed = typhoonData.subjective_forecast.initial_position.speed;
            // console.log(`初始位置经纬度: (${initialLat}, ${initialLng}) 气压:${initialPressure} 风速:${initialSpeed}`); // 输出可能是错误的经度
            //
            // // 读取预测位置的经纬度
            // typhoonData.subjective_forecast.forecast_positions.forEach((position, index) => {
            //     const forecastLat = position.lat;
            //     const forecastLng = position.lng;
            //     const forecastPressure= position.pressure;
            //     const forecastSpeed = position.speed;
            //     const timeOffset = position.time_offset;
            //     console.log(`预测位置 ${timeOffset} 经纬度: (${forecastLat}, ${forecastLng}) 气压:${forecastPressure} 风速:${forecastSpeed}`);
            // });
            const initialPosition = {
                lat: typhoonData.subjective_forecast.initial_position.lat,
                lng: typhoonData.subjective_forecast.initial_position.lng,
                speed:typhoonData.subjective_forecast.initial_position.speed
            };

            // 创建一个数组来存储所有位置的经纬度
            const positionsArray = [initialPosition]; // 先将初始位置加入数组

            // 读取预测位置的经纬度
            typhoonData.subjective_forecast.forecast_positions.forEach((position, index) => {
                const forecastPosition = {
                    lat: position.lat,
                    lng: position.lng,
                    pressure: position.pressure, // 也可以包含其他信息
                    speed: position.speed,
                    timeOffset: position.time_offset
                };
                positionsArray.push(forecastPosition); // 将预测位置加入数组
                // 输出预测位置的信息
                console.log(`预测位置 ${position.time_offset} 经纬度: (${position.lat}, ${position.lng}) 气压:${position.pressure} 风速:${position.speed}`);
            });
            // 现在 positionsArray 包含初始位置和所有预测位置的经纬度信息
            console.log(positionsArray);//

            forecastData(positionsArray);//画预测路径

        }
    }
    xmlhttp.open("GET","/try/ajax/forcast.txt",true);
    xmlhttp.send();

}
function parseTyphoonBulletin(bulletinString) {
    // 读取txt电文中的信息返回数组
    // console.log(bulletinString);
    const regexInitial = /TD (\w+) (\d+) \((\d+)\) INITIAL TIME (\d{6}) UTC\s+(\d{2}HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/;
    const regexInitial1 = /TD  (\d{2})\s+INITIAL TIME (\d{6}) UTC\s+(\d{2}HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/;
    const regexForecast = /P\+(\d+HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/g;

    // 匹配初始信息
    const initialMatch = bulletinString.match(regexInitial) || bulletinString.match(regexInitial1);
    //console.log(bulletinString);
    //console.log(initialMatch);
    if (!initialMatch) {
        throw new Error('Initial typhoon information not found');
    }
    if(bulletinString.match(regexInitial)){
        var [, typhoonNumber, typhoonId, typhoonNumber1,utcTime, hours, latitude, longitude, pressure, windSpeed] = initialMatch;
    }else{
        var [, typhoonId,utcTime, hours, latitude, longitude, pressure, windSpeed] = initialMatch;
    }
    console.log('UTC Time:', utcTime);
    // 初始化结果对象
    const result = {
        // header: {
        //     zczc: 'ZCZC', // 通常这个不需要从报文中提取，因为它是固定的
        //     bulletin_type: 'WTPQ20', // 同样，这也是固定的，除非报文中有明确说明
        //     originating_station: 'BABJ', // 假设这是固定的
        //     issue_time: utcTime // UTC时间
        // },
        subjective_forecast: {
            ID: `${typhoonId}`,
            name:`${typhoonNumber}`,
            initial_time: `${utcTime} UTC`,
            initial_position: {
                lat: parseFloat(latitude), // 转换为浮点数，但注意这里只是示例，真实情况下可能需要处理度分格式
                lng: parseFloat(longitude), // 同样转换为浮点数
                pressure: parseInt(pressure, 10), // 转换为整数
                speed: parseInt(windSpeed, 10) // 转换为整数，注意风速的单位可能需要根据实际情况处理
            },
            forecast_positions: []
        }
    };

    // 匹配并解析预报位置
    let forecastMatch;
    while ((forecastMatch = regexForecast.exec(bulletinString)) !== null) {
        // 注意：这里简化了处理，假设所有预报都是有效的，并且没有考虑可能出现的错误
        const [, timeOffset, forecastLatitude, forecastLongitude, forecastPressure, forecastWindSpeed] = forecastMatch;
        result.subjective_forecast.forecast_positions.push({
            time_offset: timeOffset,
            lat: parseFloat(forecastLatitude), // 转换为浮点数
            lng: parseFloat(forecastLongitude), // 转换为浮点数
            pressure: parseInt(forecastPressure, 10), // 转换为整数
            speed: parseInt(forecastWindSpeed, 10) // 转换为整数
        });
    }
    return result;
}
function parseTyphoonBulletin1(bulletinString) {
    // 读取txt电文（没有预测的）中的信息返回数组
    // console.log(bulletinString);
    const regexInitial = /TD (\w+) (\d+) \((\d+)\) INITIAL TIME (\d{6}) UTC\s+(\d{2}HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/;
    const regexInitial1 = /TD  (\d{2})\s+INITIAL TIME (\d{6}) UTC\s+(\d{2}HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/;


    // 匹配初始信息
    const initialMatch = bulletinString.match(regexInitial) || bulletinString.match(regexInitial1);
    //console.log(bulletinString);
    //console.log(initialMatch);
    if (!initialMatch) {
        throw new Error('Initial typhoon information not found');
    }
    if(bulletinString.match(regexInitial)){
        var [, typhoonNumber, typhoonId, typhoonNumber1,utcTime, hours, latitude, longitude, pressure, windSpeed] = initialMatch;
    }else{
        var [, typhoonId,utcTime, hours, latitude, longitude, pressure, windSpeed] = initialMatch;
    }
    //console.log('UTC Time:', utcTime);
    // 初始化结果对象
    const result = {
        // header: {
        //     zczc: 'ZCZC', // 通常这个不需要从报文中提取，因为它是固定的
        //     bulletin_type: 'WTPQ20', // 同样，这也是固定的，除非报文中有明确说明
        //     originating_station: 'BABJ', // 假设这是固定的
        //     issue_time: utcTime // UTC时间
        // },
        subjective_forecast: {
            ID: `${typhoonId}`,
            name:`${typhoonNumber}`,
            initial_time: `${utcTime} UTC`,
            initial_position: {
                lat: parseFloat(latitude), // 转换为浮点数，但注意这里只是示例，真实情况下可能需要处理度分格式
                lng: parseFloat(longitude), // 同样转换为浮点数
                pressure: parseInt(pressure, 10), // 转换为整数
                speed: parseInt(windSpeed, 10) // 转换为整数，注意风速的单位可能需要根据实际情况处理
            },
            forecast_positions: []
        }
    };
    return result;
}
function maybeDisaster(myArr,color){
    //灾害预警地区高亮显示
    // console.log(myArr.length);
    // console.log(myArr);
    var coordinates = myArr;

    var Polygon = new ol.Feature({
        geometry: new ol.geom.Polygon([coordinates])
    });
    //console.log(Polygon);
    //设置区样式信息
    Polygon.setStyle(new ol.style.Style({
        //边线颜色
        stroke: new ol.style.Stroke({
            color: color,
            width: 2
        }),
        //形状
        image: new ol.style.Circle({
            radius: 700,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 255, 0,0.2)' // 红色，半透明
        })
    }));

    //实例化一个矢量图层Vector作为绘制层
    var source = new ol.source.Vector({
        features: [Polygon]
    });
    //创建一个图层
    var vector = new ol.layer.Vector({
        source: source,
        name: 'weijishi'
    });
    //将绘制层添加到地图容器中
    map.addLayer(vector);
    //alert("加入成功");
}
async function forecastPathDemo(arr) {
    //画杜苏
    // DeleteLayers();// 清楚所有矢量图层
    // //设置中心点
    // MapCenter(arr);

    return new Promise((resolve, reject) => {
        let completedCount = 0; // 计数器，用于追踪完成的回调数量
        const totalCount = arr.length; // 总共需要完成的回调数量

        // 封装回调函数，以便在完成后增加计数器
        function onComplete() {
            completedCount++;
            if (completedCount === totalCount) {
                // 所有回调都已完成，解决 Promise
                resolve();
                //alert("路径显示完成"); // 现在这个警告会在所有路径都显示完成后显示
            }
        }

        for (let i = 0; i < arr.length; i++) {
            setTimeout(function () {
                drawPoint1(arr[i]);
                console.log("1111");
                toLine1(arr, i,[10,5]);
                onComplete(); // 回调完成后调用 onComplete
            }, i * 100); // 乘以 index 以确保每次延迟增加
        }


        // 注意：不要在这里调用 resolve 或 alert，因为这会立即发生
    });
}
async function forecastData(myArr){
    try {
        //台风路径图
        await forecastPathDemo(myArr);
    } catch (error){
        console.log("加载失败");
    }

}
async function dataAllForecast(myArr){
    try {
        // alert(myArr[0]);
        //加载数据表
        dataToTable1(myArr);
        //画信息图
        drawChart(myArr);
        //台风路径图
        await drawPath(myArr);
        //预测路线
        messageData();
        //alert("输出预测路线");
        //缓冲区
        //BufferRadius(myArr);
    } catch (error){
        console.log("加载失败");
    }

}

function reverseEnds(arr) {
    // 数组反置
    let reversedArr = [...arr]; // 使用扩展运算符来复制数组

    let halfLength = Math.floor(arr.length / 2);

    for (let i = 0; i < halfLength; i++) {
        let j = arr.length - 1 - i;
        [reversedArr[i], reversedArr[j]] = [reversedArr[j], reversedArr[i]];
    }

    return reversedArr;
}








