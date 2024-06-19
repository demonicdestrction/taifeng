//访问中国气象台的报文数据
//获取其中的预测数据
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 1100;

// 封装成一个异步函数
async function fetchDataIds(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const dataIds = []; // 创建一个空数组来存储data-id
        const url1 = 'http://www.nmc.cn/f/rest/getContent?dataId='
        $('p.time').each(function(i, elem) {
            const dataId = $(this).data('id');
            if (dataId) {
                dataIds.push(url1+dataId); // 将data-id添加到数组中
            }
        });
        console.log(dataIds);
        // 返回dataIds数组
        return dataIds;
    } catch (error) {
        console.error(error);
        throw error; // 或者你可以选择返回一个错误标识或空数组
    }
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// const dataIds = [
//     'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240525151400000',
//     'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240525113300000',
//     'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240525085100000',
//     'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240525054300000',
//     'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240525025500000',
//     'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240524235500000',
//     'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240524211100000'
// ];
const dataIds = [
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240527094300000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240527082600000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240527055100000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240527053400000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240527031800000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240527031200000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526233000000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526232700000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526204500000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526203700000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526175800000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526174200000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526145000000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526143400000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526115000000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526112400000',
    'http://www.nmc.cn/f/rest/getContent?dataId=SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240526111600000'
]



async function getDataIds() {
    try {
        const fetchedDataIds = await fetchDataIds('http://www.nmc.cn/publish/typhoon/message.html');
        return fetchedDataIds || dataIds; // 假设dataIds在函数外部已定义
    } catch (error) {
        console.error('Error fetching data IDs:', error);
        // 你可以在这里返回dataIds作为默认值，或者抛出一个新的错误
        return dataIds;
    }
}
app.get('/api/data', async (req, res) => {
    try {
        const allText =[];
        const fefetchDataIds  = await getDataIds();
        var type = 0;
        //const fefetchDataIds = await fetchDataIds('http://www.nmc.cn/publish/typhoon/message.html') || dataIds;
       // const fefetchDataIds =  dataIds;
        for(let i = 0;i < fefetchDataIds.length;i++ ){
            console.log(fefetchDataIds[i]);
            const response = await axios.get(fefetchDataIds[i]);
            const textWithHTML = response.data.replace(/^<p align="left">|\s*<\/p>$/g, '');
            let textWithoutHTML = textWithHTML.replace(/<br>/g, '');
            let textWithoutHTML1 = textWithoutHTML.replace(/<[^>]*>/g, '');
            //console.log(response.data);
            console.log(textWithoutHTML1.trim());
            const judgement = judgementText(textWithoutHTML1.trim());
            if(type === 0 && judgement){
                //是最新的数据，则拥有预报数据
               // console.log(parseTyphoonBulletin(textWithoutHTML1.trim()));
                allText.push(parseTyphoonBulletin(textWithoutHTML1.trim()));
                type = 1;
            }else if(judgement){
                //如果不是最新的数据
                //console.log(parseTyphoonBulletin1(textWithoutHTML1.trim()));
                allText.push(parseTyphoonBulletin1(textWithoutHTML1.trim()));
            }
            //allText.push(textWithoutHTML1.trim());
            // res.send(textWithoutHTML1.trim());
        }
        console.log("-------------返回的数据------------");
        console.log(allText);
        res.json(allText);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error'); // 如果发生错误，返回500状态码和错误消息
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
function judgementText(bulletinString){
    const regexMove = /MOVE\s+(\w+)\s+(\d+KM\/H)/;
    const initialMatch = bulletinString.match(regexMove)
    if (!initialMatch) {
        return false;
    }else{
        return true;
    }
}
function parseTyphoonBulletin(bulletinString) {
    // 读取txt电文中的信息返回数组
    // console.log(bulletinString);
    const regexInitial = /SUBJECTIVE FORECAST\s+(\w+) (\w+) (\d+) \((\d+)\) INITIAL TIME (\d{6}) UTC\s+(\d{2}HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/;
    const regexInitial1 = /SUBJECTIVE FORECAST\s+(\w+)  (\d{2})\s+INITIAL TIME (\d{6}) UTC\s+(\d{2}HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/;
    const regexMove = /MOVE\s+(\w+)\s+(\d+KM\/H)/;
    const regexForecast = /P\+(\d+HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/g;

    // 匹配初始信息
    const initialMatch = bulletinString.match(regexInitial) || bulletinString.match(regexInitial1);
    //console.log(bulletinString);
    console.log(initialMatch);
    if (!initialMatch) {
        throw new Error('Initial typhoon information not found');
    }
    if(bulletinString.match(regexInitial)){
        var [,windGrade,typhoonNumber, typhoonId, typhoonNumber1,utcTime, hours, latitude, longitude, pressure, windSpeed,moveSpeed] = initialMatch;
    }else{
        var [,windGrade, typhoonId,utcTime, hours, latitude, longitude, pressure, windSpeed,moveSpeeed] = initialMatch;
    }
    var [,movedDirection ,moveSpeed] = bulletinString.match(regexMove);
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
            initial_time: `${utcTime} `,
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
function parseTyphoonBulletin1(bulletinString) {
    // 读取txt电文中的信息返回数组
    // console.log(bulletinString);
    const regexInitial = /SUBJECTIVE FORECAST\s+(\w+) (\w+) (\d+) \((\d+)\) INITIAL TIME (\d{6}) UTC\s+(\d{2}HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/;
    const regexInitial1 = /SUBJECTIVE FORECAST\s+(\w+)  (\d{2})\s+INITIAL TIME (\d{6}) UTC\s+(\d{2}HR) (\d+\.\d+)N (\d+\.\d+)E (\d+)HPA (\d+)M\/S/;
    const regexMove = /MOVE\s+(\w+)\s+(\d+KM\/H)/;

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
        var [,windGrade, typhoonId,utcTime, hours, latitude, longitude, pressure, windSpeed] = initialMatch;
    }
    var [,movedDirection ,moveSpeed] = bulletinString.match(regexMove);
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
            initial_time: `${utcTime} `,
            initial_position: {
                lat: parseFloat(latitude), // 转换为浮点数，但注意这里只是示例，真实情况下可能需要处理度分格式
                lng: parseFloat(longitude), // 同样转换为浮点数
                pressure: parseInt(pressure, 10), // 转换为整数
                speed: parseInt(windSpeed, 10),// 转换为整数，注意风速的单位可能需要根据实际情况处理
                moveSpeed: parseInt(moveSpeed, 10)
            },
        }
    };
    return result;
}