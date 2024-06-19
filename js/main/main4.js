//主要函数副本，有区别
const turf = require("@turf/turf");

function localNow(){
    //定位当前位置
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            const bd09 = wgs84ToBd09(longitude, latitude);
            console.log('BD-09 经度:', bd09[0],'BD-09 纬度',bd09[1]);
            //console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            // 如果你想在OpenLayers地图中使用这些坐标，你可以将它们转换为投影坐标并设置为中心点
            const fromLonLat = ol.proj.fromLonLat; // 假设你已经引入了OpenLayers库
            const center = fromLonLat([bd09[0], bd09[1]]);
            //const center = fromLonLat([ 112.93152826818509, 27.90094304586816 ]);
            //const center = fromLonLat([longitude, latitude]);
            map.getView().setCenter(center);
            map.getView().setZoom(10);
            // ... 设置地图视图的中心点等

            // 创建一个点
            var point = new ol.geom.Point(center); // 替换为你要显示的点的经纬度

            // 创建一个Feature，并设置其几何形状为刚才创建的点
            var feature = new ol.Feature({
                geometry: point
            });

            // 创建一个VectorSource，并添加Feature
            var vectorSource = new ol.source.Vector({
                features: [feature]
            });

            // 创建一个VectorLayer，并设置其数据源为刚才创建的VectorSource
            var vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });

            // 将VectorLayer添加到地图上
            map.addLayer(vectorLayer);

            // 如果需要，可以为Feature添加一个样式
            feature.setStyle(new ol.style.Style({
                image: new ol.style.Icon({
                    src: '/images/dw.jpg', // 替换为你的图标URL
                    anchor: [0.5, 0.5], // 图标定位点，通常是图标的中心
                    anchorXUnits: 'fraction', // 定位点X坐标的单位
                    anchorYUnits: 'fraction', // 定位点Y坐标的单位
                    opacity: 1, // 图标的不透明度
                    scale: 0.1 // 图标的缩放比例
                    // 你可以添加更多属性，如rotateWithView, rotation等
                })
            }));
        }, function(error) {
            console.error('Error occurred while retrieving location: ' + error.message);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
        console.log('获取坐标成功');
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

function draw2Cordon(){
    //画警戒线
    drawCordon("/try/ajax/jingjie.json","24小时警戒线","red","24");
    drawCordon("/try/ajax/jingjie2.json","48小时警戒线","blue","48",[10.5]);
}

function littoral(){
    //画沿海城市shp
    let xhr;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        // 但在现代开发中，通常不会执行这里的代码，因为大多数浏览器都支持 XMLHttpRequest
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var myArr = JSON.parse(this.responseText);
            //alert(myArr);
            for(let i = 0;i < myArr.length;i++){
                //console.log(myArr[i]);
                addShi(myArr[i],"#337ab7");
            }
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            alert("连接失败");
            console.error('Error fetching data:', xhr.statusText);
        }
    };
    //alert("正在查询");
    xhr.open('GET', 'http://localhost:1000/api/data2', true);
    xhr.send();
}

function addGuangXi(){
    //画广西shp
    var boundary="112.019 24.743,111.922 24.632,112.052 24.39,111.908 24.225,111.935 23.991,111.782 23.81,111.482 23.629,111.359 23.346,111.354 22.892,111.051 22.651,110.745 22.56,110.721 22.298,110.499 22.146,110.376 22.167,110.387 21.953,110.228 21.882,109.941 21.847,109.91 21.67,109.746 21.591,109.539 21.502,109.154 21.403,109.123 21.588,108.793 21.635,108.605 21.704,108.393 21.554,107.951 21.542,107.857 21.654,107.67 21.605,107.385 21.598,107.084 21.809,107.062 21.898,106.737 22.008,106.66 22.335,106.56 22.467,106.708 22.58,106.777 22.817,106.605 22.927,106.278 22.87,106.202 22.986,105.872 22.934,105.542 23.194,105.593 23.316,105.864 23.535,106.068 23.49,106.193 23.84,105.995 24.127,105.838 24.034,105.49 24.02,105.227 24.169,105.194 24.331,105.048 24.444,104.726 24.449,104.519 24.538,104.527 24.734,104.629 24.663,104.844 24.683,105.031 24.79,105.208 24.998,105.444 24.919,105.496 24.812,105.763 24.724,106.041 24.684,106.167 24.762,106.158 24.941,106.435 25.021,106.68 25.18,106.895 25.195,107.008 25.277,106.959 25.44,107.061 25.56,107.315 25.506,107.5 25.214,107.751 25.242,107.79 25.119,108.135 25.238,108.151 25.373,108.327 25.539,108.333 25.538,108.417 25.443,108.595 25.458,108.758 25.641,108.948 25.559,108.946 25.734,108.95 25.734,108.954 25.735,109.075 25.78,109.292 25.717,109.48 26.034,109.781 25.993,109.966 26.203,110.06 26.045,110.236 26.036,110.547 26.237,110.599 26.327,110.795 26.271,111.088 26.308,111.277 26.273,111.19 25.959,111.379 25.885,111.386 25.885,111.302 25.721,111.283 25.435,111.097 25.286,110.947 25.047,110.987 24.961,110.985 24.955,110.99 24.935,110.99 24.934,110.99 24.933,111.099 24.996,111.098 24.998,111.271 25.154,111.468 25.016,111.426 24.689,111.567 24.649,111.677 24.781,112.019 24.743";
    var finaldots =[];
    //alert("2");
    var result = boundary.split(",");   //result就是由[[经度 维度],[经度 维度]]的数组
    for (let i = 0; i < result.length; i++) {
        //按照空格分隔字符串
        let dot = result[i].split(" ");  //dot就是每个[经度,纬度]
        let mktdot = lonLat2Mercator(parseFloat(dot[0]), parseFloat(dot[1]));
        //将坐标存入结果数组
        finaldots.push([mktdot.x, mktdot.y]);   //格式为[[x,y],[x,y]]
    }
    //alert("2");
    console.log(finaldots);
    var coordinates = finaldots.map(function(item) {
        // 假设您的原始坐标是 EPSG:4326（WGS 84），并且您想将它们转换为 EPSG:3857（Web Mercator）
        return ol.proj.transform([item[0], item[1]], 'EPSG:4326', 'EPSG:3857');
    });
    //转化坐标系
    console.log(coordinates);
    var Polygon = new ol.Feature({
        geometry: new ol.geom.Polygon([coordinates])
    });
    console.log(Polygon);
    //设置区样式信息
    Polygon.setStyle(new ol.style.Style({
        //边线颜色
        stroke: new ol.style.Stroke({
            color: '#337ab7',
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
        source: source
    });
    //将绘制层添加到地图容器中
    map.addLayer(vector);
    //alert("加入成功");
}

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

function tfDemo() {
    //读台风杜鹃json
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp = new XMLHttpRequest();
    } else
    {
        // IE6, IE5 浏览器执行代码
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var myArr = JSON.parse(this.responseText);
            dataToTable(myArr);
            //myFunction2(myArr);
        }
    }
    xmlhttp.open("GET","/try/ajax/example.json",true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send();
}

function pathDemo() {
    //台风杜鹃详细信息画线
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
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var myArr = JSON.parse(this.responseText);
            myFunction3(myArr);
        }
    }
    xmlhttp.open("GET","/try/ajax/example2.json",true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //alert("readyState ="+xmlhttp.readyState);
    //alert("status ="+xmlhttp.status);
    xmlhttp.send();
}

function bufferDemo(){
    //台风杜鹃详细信息画缓冲区
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
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var myArr = JSON.parse(this.responseText);
            //myFunction3(myArr);
            myFunction4(myArr);
            //myFunction2(myArr);
        }
    }
    xmlhttp.open("GET","/try/ajax/example2.json",true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send();
}

function forecastDemo() {
    //预测的台风以及预测数据
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
        if (xmlhttp.readyState===4 && xmlhttp.status===200)
        {
            var myArr = JSON.parse(this.responseText);
            dataAllForecast(myArr);
            //loadXMLDoc11();
        }
    }
    // alert("正在查询");
    xmlhttp.open('GET', 'http://localhost:2200/api/data1', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send();
}

async function massageData() {
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

function maybeAreas(){
    //做行政区与台风缓冲区分析，如果有交集高亮行政地区
    event.preventDefault();
    let vectorLayers = map.getLayers().getArray().filter(function(layer) {
        return layer instanceof ol.layer.Vector;
    });
    //alert("拥有"+vectorLayers.length +"个元素");

    let polygon1Feature = null;
    let polygon2Feature = null;


    let allFeatures = [];
    vectorLayers.forEach(function(layer) {
        if (layer.get('name') === "shi" && layer.getSource() && typeof layer.getSource().getFeatures === 'function') {
            const features = layer.getSource().getFeatures();
            allFeatures = allFeatures.concat(features); // 将这些要素添加到 allFeatures 数组中
            // alert(features.length); // 如果你不需要弹出每个图层的要素数量，可以注释掉这行
            //console.log(features.length); // 打印当前图层的要素数量（可选）
        }
    });
    alert("市有" + allFeatures.length);
    //console.log(allFeatures.length); // 打印总要素数量

    let turfFeatures = [];
    allFeatures.forEach(function(feature) {
        const geometry = feature.getGeometry();
        //alert("1");
        // fixPolygonRings(feature);
        ensureClosedRing(geometry);
        //alert("2");
        // 使用GeoJSON格式化器将OpenLayers Feature转换为GeoJSON对象
        const geoJSONFeature = new ol.format.GeoJSON().writeFeatureObject(feature);
        //console.log(geoJSONFeature);
        // 根据GeoJSON对象的geometry类型创建相应的turf几何对象
        // 这里假设你主要处理的是Point, LineString, Polygon或MultiPolygon
        let turfGeometry;
        switch (geoJSONFeature.geometry.type) {
            case 'Point':
                turfGeometry = turf.point(geoJSONFeature.geometry.coordinates);
                break;
            case 'LineString':
                turfGeometry = turf.lineString(geoJSONFeature.geometry.coordinates);
                //console.log(turfGeometry);
                break;
            case 'Polygon':
                //console.log(geoJSONFeature);
                turfGeometry = turf.polygon(geoJSONFeature.geometry.coordinates);
                //console.log(turfGeometry);
                break;
            case 'MultiPolygon':
                // MultiPolygon需要特殊处理，因为它是一个坐标数组的数组
                turfGeometry = turf.multiPolygon(geoJSONFeature.geometry.coordinates);
                break;
            // 你可以根据需要添加其他类型的处理
            default:
                console.warn('Unsupported geometry type:', geoJSONFeature.geometry.type);
                return;
        }

        // 创建一个turf Feature，它包含geometry和（可选的）properties
        if (turfGeometry.type === 'Feature') {
            // 如果已经是Feature，直接使用它
            var turfFeature = turfGeometry;
        } else {
            // 如果只是geometry，使用turf.feature创建Feature
            const properties = feature.get('properties'); // 假设这是从OpenLayers的Feature中获取的
            var turfFeature = turf.feature(turfGeometry, properties);
        }
        //console.log(turfFeature);
        // 将turf Feature添加到turfFeatures数组中
        turfFeatures.push(turfFeature);
    });
    console.log(turfFeatures[0]);
    const cross1 = turf.booleanEqual(turfFeatures[0], turfFeatures[0]);
    alert(cross1);
    if (allFeatures) {
        let geomType1 = allFeatures[0].getGeometry().getType(); // 注意这里使用 getGeometry() 和 getType()
        console.log(geomType1); // 应该输出 "Polygon" 或 "MultiPolygon"
    } else {
        console.log("没有找到名称为 '市' 的图层中的多边形特征");
    }
    //console.log("ok1");
    let allFeatures1 = [];
    vectorLayers.forEach(function(layer) {
        if (layer.get('name') === "huanchong" && layer.getSource() && typeof layer.getSource().getFeatures === 'function') {
            const features = layer.getSource().getFeatures();
            allFeatures1 = allFeatures1.concat(features); // 将这些要素添加到 allFeatures 数组中
            // alert(features.length); // 如果你不需要弹出每个图层的要素数量，可以注释掉这行
            //console.log(features.length); // 打印当前图层的要素数量（可选）
        }
    });
    alert("缓冲区有" + allFeatures1.length);
    let turfFeatures1 = [];
    allFeatures1.forEach(function(feature) {
        const geometry = feature.getGeometry();
        //alert("1");
        // fixPolygonRings(feature);
        ensureClosedRing(geometry);
        //alert("2");
        // 使用GeoJSON格式化器将OpenLayers Feature转换为GeoJSON对象
        const geoJSONFeature = new ol.format.GeoJSON().writeFeatureObject(feature);
        //console.log(geoJSONFeature);
        // 根据GeoJSON对象的geometry类型创建相应的turf几何对象
        // 这里假设你主要处理的是Point, LineString, Polygon或MultiPolygon
        let turfGeometry;
        switch (geoJSONFeature.geometry.type) {
            case 'Point':
                turfGeometry = turf.point(geoJSONFeature.geometry.coordinates);
                break;
            case 'LineString':
                turfGeometry = turf.lineString(geoJSONFeature.geometry.coordinates);
                //console.log(turfGeometry);
                break;
            case 'Polygon':
                //console.log(geoJSONFeature);
                turfGeometry = turf.polygon(geoJSONFeature.geometry.coordinates);
                //console.log(turfGeometry);
                break;
            case 'MultiPolygon':
                // MultiPolygon需要特殊处理，因为它是一个坐标数组的数组
                turfGeometry = turf.multiPolygon(geoJSONFeature.geometry.coordinates);
                break;
            // 你可以根据需要添加其他类型的处理
            default:
                console.warn('Unsupported geometry type:', geoJSONFeature.geometry.type);
                return;
        }

        // 创建一个turf Feature，它包含geometry和（可选的）properties
        if (turfGeometry.type === 'Feature') {
            // 如果已经是Feature，直接使用它
            var turfFeature = turfGeometry;
        } else {
            // 如果只是geometry，使用turf.feature创建Feature
            const properties = feature.get('properties'); // 假设这是从OpenLayers的Feature中获取的
            var turfFeature = turf.feature(turfGeometry, properties);
        }
        //console.log(turfFeature);
        // 将turf Feature添加到turfFeatures数组中
        turfFeatures1.push(turfFeature);
    });
    console.log("缓冲区有");
    console.log(turfFeatures1[0]);
    for(let i = 0; i < turfFeatures.length; i++){
        const cross2 = turf.booleanDisjoint(turfFeatures[i], turfFeatures1[0]);
        if(!cross2){
            console.log(turfFeatures[i].geometry.coordinates[0]);
            myFunction9(turfFeatures[i].geometry.coordinates[0],'rgba(255, 0, 0)');
            //alert("ok");
        }
        console.log("第" + i + "与缓冲区相交" + !cross2);
    }
    //const cross2 = turf.booleanEqual(turfFeatures[0], turfFeatures1[0]);
    //alert("警戒线有" + cross2);

    if (allFeatures) {
        let geomType1 = allFeatures[0].getGeometry().getType(); // 注意这里使用 getGeometry() 和 getType()
        console.log(geomType1); // 应该输出 "Polygon" 或 "MultiPolygon"
    } else {
        console.log("没有找到名称为 '警戒线' 的图层中的多边形特征");
    }
    alert("运行完成");
}

function handleKeyDown(event, value) {
    // 检查是否按下了 Enter 键
    if (event.keyCode === 13 || event.key === 'Enter') {
        event.preventDefault();
        // 调用 showHint 函数
        showHint(value);
    }
}

function showHint(str) {
    // event.preventDefault();
    var xhr = str;
    if (str.length==0)
    {
        document.getElementById("txtHint").innerHTML="";
        return;
    }
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        // 但在现代开发中，通常不会执行这里的代码，因为大多数浏览器都支持 XMLHttpRequest
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // alert('请求成功，状态码: ' + xhr.status);
            //alert(xhr.responseText);
            var myArr = JSON.parse(this.responseText);
            //alert(myArr);
            dataToTable(myArr);
        }
        else if(xhr.readyState === 4 && xhr.status !== 200) {
            alert("连接失败");
            console.error('Error fetching data:', xhr.statusText);
        }
    };
    //alert("正在查询");
    xhr.open('GET', 'http://localhost:2000/api/data?q=' + encodeURIComponent(str), true);
    xhr.send();
}

function selectAll(str) {
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

function nowData() {
    //未使用，nmc获取数据但没有实时的
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
            var myStr = this.responseText;
            alert(myStr);
            console.log(myStr);
        }
    }
    // alert("正在查询");
    xmlhttp.open('GET', 'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20231218143000000&_=1716293728029', true);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send();
}