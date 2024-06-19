fetch('https://api.qweather.com/v7/tropical/storm-list?basin=NP&year=2023&key=49fe07b7f3184dd3bd0b0e15adfda789', {
    method: 'GET', // 或者 'POST', 'PUT', 'DELETE' 等
    headers: {
        'Content-Type': 'application/json', // 根据需要设置
        // 'Authorization': 'Bearer your_token' // 如果需要身份验证
    },
    // 如果你的请求是POST或其他需要请求体的方法，你可以添加body属性
    // body: JSON.stringify({ key: 'value' })
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // 或者 response.text() 如果你期望的是文本
    })
    .then(data => {
        console.log(data);
        // 在这里处理你的数据
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
