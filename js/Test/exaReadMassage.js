//用作测试读取报文
const bulletinString = `ZCZC
WTPQ20 BABJ 260600
SUBJECTIVE FORECAST
TS EWINIAR 2401 (2401) INITIAL TIME 260600 UTC
00HR 14.2N 121.5E 990HPA 23M/S
MOVE NE 9KM/H
P+12HR 15.0N 122.2E 985HPA 25M/S
P+24HR 16.2N 123.1E 982HPA 28M/S
P+36HR 17.3N 124.1E 980HPA 30M/S
P+48HR 19.0N 125.8E 975HPA 33M/S
P+60HR 21.2N 128.1E 970HPA 35M/S
P+72HR 23.8N 130.8E 975HPA 33M/S
P+96HR 27.2N 135.0E 980HPA 30M/S
P+120HR 30.3N 139.1E 995HPA 20M/S=
NNNN`;
const bulletinString1 = `ZCZC
WTPQ20 BABJ 180600
SUBJECTIVE FORECAST
TD DOKSURI 2305 (2305) INITIAL TIME 190000 UTC
00HR 21.6N 119.2E 935HPA 52M/S
MOVE NW 18KM/H
P+12HR 24.1N 118.8E 935HPA 52M/S
P+24HR 27.0N 117.4E 990HPA 25M/S=
NNNN`;
const bulletinString3 = `ZCZC
WTPQ20 BABJ 250000
SUBJECTIVE FORECAST
TD  01 INITIAL TIME 242100 UTC
00HR 11.9N 124.6E 1002HPA 15M/S
MOVE NW 18KM/H
P+12HR 13.1N 123.1E 1002HPA 15M/S
P+24HR 14.3N 122.2E 998HPA 18M/S
P+36HR 15.4N 122.6E 995HPA 20M/S
P+48HR 16.5N 123.3E 990HPA 23M/S
P+60HR 17.6N 124.2E 985HPA 25M/S
P+72HR 19.3N 125.7E 975HPA 33M/S
P+96HR 24.7N 131.3E 965HPA 38M/S
P+120HR 32.0N 142.0E 980HPA 28M/S=
NNNN`;
function parseTyphoonBulletin(bulletinString) {
    // 假设bulletinString是提供的台风报文字符串
    const regexInitial = /SUBJECTIVE FORECAST\s+(\w+) (\w+) (\d+) \((\d+)\) INITIAL TIME (\d{6}) UTC\s+(\d{2}HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/;
    const regexInitial1 = /TD  (\d{2})\s+INITIAL TIME (\d{6}) UTC\s+(\d{2}HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/;
    const regexMove = /MOVE\s+(\w+)\s+(\d+KM\/H)/;
    const regexForecast = /P\+(\d+HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/g;
    console.log(bulletinString.match(regexMove));
    // 匹配初始信息
    const initialMatch = bulletinString.match(regexInitial) || bulletinString.match(regexInitial1);
    //console.log(bulletinString);
    //console.log(initialMatch);
    if (!initialMatch) {
        throw new Error('Initial typhoon information not found');
    }
    if(bulletinString.match(regexInitial)){
        var [,windGrade,typhoonNumber, typhoonId, typhoonNumber1,utcTime, hours, latitude, longitude, pressure, windSpeed] = initialMatch;
    }else{
        var [, typhoonId,utcTime, hours, latitude, longitude, pressure, windSpeed] = initialMatch;
    }
    var [,movedDirection ,moveSpeed] = bulletinString.match(regexMove);
    console.log(moveSpeed);
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
                speed: parseInt(windSpeed, 10), // 转换为整数，注意风速的单位可能需要根据实际情况处理
                 moveSpeed: parseInt(moveSpeed, 10)
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

// 示例使用

const typhoonData = parseTyphoonBulletin(bulletinString);
console.log(JSON.stringify(typhoonData, null, 2)); // 格式化输出JSON
jsonString = JSON.stringify(typhoonData, null, 2);

//const data = JSON.parse(jsonString);

const initialLat = typhoonData.subjective_forecast.initial_position.lat;
const initialLng = typhoonData.subjective_forecast.initial_position.lng;
const initialPressure = typhoonData.subjective_forecast.initial_position.pressure;
const initialSpeed = typhoonData.subjective_forecast.initial_position.speed;
console.log(`初始位置经纬度: (${initialLat}, ${initialLng}) 气压:${initialPressure} 风速:${initialSpeed}`); // 输出可能是错误的经度

// 读取预测位置的经纬度
typhoonData.subjective_forecast.forecast_positions.forEach((position, index) => {
    const forecastLat = position.lat;
    const forecastLng = position.lng;
    const forecastPressure= position.pressure;
    const forecastSpeed = position.speed;
    const timeOffset = position.time_offset;
    console.log(`预测位置 ${timeOffset} 经纬度: (${forecastLat}, ${forecastLng}) 气压:${forecastPressure} 风速:${forecastSpeed}`);
});