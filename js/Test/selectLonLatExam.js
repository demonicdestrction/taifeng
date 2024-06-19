//测试获取202101的经纬度
let dateString = "2021-02-18T20:00:00";
let date = new Date(dateString);

// 转化为本地时间格式的字符串
let formattedDate = date.toLocaleString();
console.log(formattedDate); // 输出类似于 "2/18/2021, 8:00:00 PM" 的字符串（取决于本地时区）

console.log("Hello");

const sql = require('mssql');

console.log("第二步成功");
// 配置数据库连接信息
const config = {
    user: 'sa', //这里写你的数据库的用户名
    password: '123456',//这里写数据库的密码
    server: 'localhost',
    database: 'winddatabase', // 数据库名字
    port: 1433, //端口号,默认1433
    options: {
        encrypt: false,  //加密,设置为true时会连接失败 Failed to connect to localhost:1433 - self signed certificate
        enableArithAbort: false
    },
    pool: {
        min: 0,
        max: 10,
        idleTimeoutMillis: 3000
    }
}
sql.connect(config)
    .then(pool => {
        //console.log("连接数据库成功");
        return pool.request()
            .query('SELECT  * FROM winddata where Number = 202101') // 替换为你的表名
            .then(result => {
                //console.log("查询表成功");
                // 处理查询结果，例如打印第一行数据
                if (result.recordset && result.recordset.length > 0) {
                    const replacer = ['Longitude', 'Latitude'];
                    //console.log(JSON.stringify(result.recordset[0], replacer, 2));  // 第二个和第三个参数是可选的，用于格式化输出
                    //console.log("winddata数据返回json成功返回");
                    //console.log("数据成功返回");
                    //console.log(result.recordset[0]);
                    //console.log(result.recordset[1]);
                    for(let i = 0;i < result.recordset.length; i++ ){
                        console.log(JSON.stringify(result.recordset[i], replacer, 2)+',');
                    }
                } else {
                    console.log("没有数据返回");
                }
                // 关闭连接池
                pool.close();
            })
            .catch(err => {
                // 处理查询错误
                console.error("查询表时发生错误:", err);
                // 仍然需要关闭连接池，即使发生了错误
                pool.close();
            });
    })
    .catch(err => {
        // 处理连接错误
        console.error("无法连接到数据库:", err);
    });

// 由于前面的代码是异步的，这条消息可能会在连接和查询之前打印出来
//console.log("3");
var coordinatesArray = [
    {"Longitude": 132.2, "Latitude": 7.3},
    {"Longitude": 132.1, "Latitude": 7.3}
];

// 转换数组为OpenLayers可以理解的格式，并创建点特征
