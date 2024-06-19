//爬取中国台风网的报文数据链接，防止中国气象台无法访问
const axios = require('axios');
const cheerio = require('cheerio');

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

        // 返回dataIds数组
        return dataIds;
    } catch (error) {
        console.error(error);
        throw error; // 或者你可以选择返回一个错误标识或空数组
    }
}


fetchDataIds('http://www.nmc.cn/publish/typhoon/message.html') // 替换为实际的URL
    .then(dataIds => {
        console.log(dataIds); // 打印返回的数组
    })
    .catch(error => {
        console.error('An error occurred:', error);
    });

