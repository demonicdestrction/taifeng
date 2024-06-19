//测试爬取的链接数据拼接台风报文链接
const url1 = 'http://www.nmc.cn/f/rest/getContent?dataId=';
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const dataIds = [
    'SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240525151400000',
    'SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240525113300000',
    'SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240525085100000',
    'SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240525054300000',
    'SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240525025500000',
    'SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240524235500000',
    'SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240524211100000',
    'SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240524172400000',
    'SEVP_NMC_TCMO_SFER_ETCT_ACHN_L88_P9_20240524154500000'
];
const dataIds1 = [];
// 遍历dataIds数组并构建URL
dataIds.forEach(dataId => {
    const lasturl = url1 + dataId;
    dataIds1.push(lasturl);
    //console.log(lasturl);
    // 在这里你可以进一步处理每个lasturl，比如发起新的请求
});
console.log(dataIds1);

function app1() {
    app.get('/api/data', async (req, res) => {
        try {
            const allText = [];
            for (let i = 0; i < dataIds.length; i++) {
                const response = await axios.get(dataIds[i]);
                const textWithHTML = response.data.replace(/^<p align="left">|\s*<\/p>$/g, '');
                let textWithoutHTML = textWithHTML.replace(/<br>/g, '').replace(/<[^>]*>/g, '');
                textWithoutHTML = textWithoutHTML.trim();
                if (i === 0) {
                    allText.push(parseTyphoonBulletin(textWithoutHTML));
                } else {
                    allText.push(parseTyphoonBulletin1(textWithoutHTML));
                }
            }
            console.log(allText);
            res.json(allText);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    });
}

app1();