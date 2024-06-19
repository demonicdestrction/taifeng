const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');


app.use(cors({
    origin: 'http://localhost:63342', // 允许来自这个源的请求
    methods: ['GET', 'POST'], // 允许的HTTP方法
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的HTTP头
}));
// app.get('/api/data', (req, res) => {
//     res.setHeader('Content-Type', 'text/plain');
//     res.send('连接上服务器了');
// });
console.log("服务器在运行");
app.get('/api/data1', async (req, res) => {
    // 假设你有一个 JSON 字符串
    //const jsonString = '{"key": "value"}';
    const str = req.query.q;
    try {
        // 解析 JSON 字符串
        const jsonString = await ReadWindName2(str);
        const data = JSON.parse(jsonString);

        // 基于解析后的数据做一些处理...
        // 例如，我们只关心 'key' 的值，并返回它
        //const value = data.key;

        // 设置内容类型为 application/json 并返回处理后的数据
        res.setHeader('Content-Type', 'application/json');
        //res.send('连接上服务器了');
        //res.send('你好呀！！！');
        res.send(JSON.stringify(data)); // 返回 "value" 的 JSON 表示
        // 或者，如果 value 是一个可以直接转换为 JSON 的对象或数组，使用 res.json(value);
    } catch (error) {
        // 处理解析错误
        console.error('Error parsing JSON:', error);
        res.status(500).send('Internal Server Error');
    }
});
// function ReadWindName2() {
//     // 假设这个函数返回了一个JSON格式的字符串
//     //return "1111";
//     // return
//     //
//     return '[{"Number":202106,"CNName":"烟花","ENName":"In-Fa"}]';
// }
// // 解析JSON字符串为JavaScript对象（在这种情况下是一个数组）
// const data = JSON.parse(ReadWindName2());

// 打印整个数组
//console.log(data);
async function processWindName() {
    try {
        // // 等待ReadWindName1完成并返回结果
        // const jsonString = await ReadWindName1();
        // console.log(jsonString);
        // console.log(typeof jsonString === 'string');
        console.log("33333");
        // const parsedData = JSON.parse(jsonString); // 解析JSON字符串为JavaScript对象
        // console.log(parsedData); // 打印解析后的对象
    } catch (error) {
        // 处理任何可能出现的错误
        console.error('Error:', error);
    }
}
processWindName();
//ReadWindName();

//console.log("111");
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//onsole.log("Hello");

const sql = require('mssql');
const {json} = require("express");

// 假设config是您的数据库连接配置对象
// 假设str是您要搜索的字符串
// 假设callback是您要传递的回调函数
//ReadWindName2();
async function ReadWindName2(string) {
    try {
        // 模拟数据库查询，这里使用setTimeout来模拟异步操作
        const dataFromDatabase = await new Promise(resolve => {
            const sql = require('mssql');
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
            //alert("连接到数据库了");
           // var str = '202101';
            var str = string;
            //var str = "烟花";
            //var stringline = "yanhua";
            sql.connect(config)
                .then(pool => {
                    return pool.request()
                        .query(`select * from winddata where Number = '${str.replace(/[\\'%]/g, '\\$&')}'`)
                        .then(result => {
                            //console.log("查询表成功");
                            // 处理查询结果，例如打印第一行数据
                            if (result.recordset && result.recordset.length > 0) {
                                const replacer = ['Time', 'WindGrade', 'WindSpeed','Longitude','Latitude','WindSpeed','QiYa','MoveSpeed'];
                                console.log("--------------你好-----------------");
                                console.log(JSON.stringify(result.recordset[0], replacer, 2));
                                //return JSON.stringify(result.recordset);
                                //console.log(result.recordset);
                                //console.log(JSON.stringify(result.recordset));
                                // stringline = result.recordset;
                                // console.log(stringline);
                                //return  result.recordset;
                                //resolve(result.recordset);
                                resolve(JSON.stringify(result.recordset, replacer, 2));
                                //resolve('{"name": "Wind 1"}');
                                //return Promise.resolve('{"name": "Wind 1"}');
                                // for (let i = 0; i < result.recordset.length; i++) {
                                //     console.log(result.recordset[i]);
                                // }
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
            console.log("windname运行成功");
        });

        // 返回解析后的数据（如果需要的话）
        return dataFromDatabase; // 注意：这里我们直接解析了JSON字符串，所以调用者不需要再次解析
    } catch (error) {
        // 如果发生错误，你应该reject这个Promise，而不是返回undefined
        console.error('Error fetching wind name:', error);
        throw error; // 抛出错误，以便调用者可以捕获并处理
    }
}
//ReadWindName2();
async function ReadWindName() {
    //返回查询查询结果
    //return "1111";
    //console.log("开始连接数据库");
    const sql = require('mssql');
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
    //alert("连接到数据库了");
    var str = "烟花";
    //var stringline = "yanhua";
    sql.connect(config)
        .then(pool => {
            return pool.request()
                .query('SELECT [Number], [CNName], [ENName]\n' +
                    'FROM windname\n' +
                    'WHERE\n' +
                    '    [Number] LIKE \'%' + str.replace(/[\\'%]/g, '\\$&') + '%\' OR\n' +
                    '    [CNName] LIKE \'%' + str.replace(/[\\'%]/g, '\\$&') + '%\' OR\n' +
                    '    [ENName] LIKE \'%' + str.replace(/[\\'%]/g, '\\$&') + '%\';')
                .then(result => {
                    //console.log("查询表成功");
                    // 处理查询结果，例如打印第一行数据
                    if (result.recordset && result.recordset.length > 0) {
                        const replacer = ['Number', 'CNName', 'ENName'];
                        console.log("--------------你好-----------------");
                        console.log(JSON.stringify(result.recordset[0], replacer, 2));
                        //return JSON.stringify(result.recordset);
                        console.log(result.recordset);
                        console.log(JSON.stringify(result.recordset));
                        // stringline = result.recordset;
                        // console.log(stringline);
                        //return  result.recordset;
                        return Promise.resolve('{"name": "Wind 1"}');
                        // for (let i = 0; i < result.recordset.length; i++) {
                        //     console.log(result.recordset[i]);
                        // }
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
    console.log("windname运行成功");
}

