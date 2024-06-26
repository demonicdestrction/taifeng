# 台风可视化系统

#### 介绍

东南沿海台风可视化系统
WebGIS，台风，

#### 软件架构

IDEA
SQL Serve

OpenLayers5

express，truf库等

#### 安装教程

1.  将database文件下的数据库文件，都附加到SQL Server
2.  数据库连接修改js文件下的use文件四个js文件的config（有config的话）结构中替换为你数据库中用户密码等
3.  打开js文件下的use文件的四个js文件都运行（express模拟的服务器），在IDEA打开HTML主界面试运行
4.  添加所需的库，运行下

#### 报错解决

1. 数据库不能附加，需要设置database文件的管理员权限不然数据库报错

2. 代码运行时，需将npm，jdk等请配置好

3. 一些Node.js库中的库需要在命令行中安装

   ```
   npm install express -g
   npm install cors -g
   npm install axios -g
   npm install cheerio -g
   npm install mssql -g
   npm install @turf/turf -g
   //此做示范，实际上自己看情况
   ```

4. 实时台风是有bug没改的，查询台风（查询2021和2022年的台风）功能能用的话项目就基本运行ok。

   ```
   
   ```

#### 项目图片

##### 1. 台风查询

![image-20240619144216249](images\github\image-20240619144216249.png)

##### 2. 台风路径

![image-20240619144313740](images\github\image-20240619144313740.png)

##### 3. 实时台风（有bug）

![image-20240619144408649](images\github\image-20240619144408649.png)

   ```

   ```

#### 4.缓冲区分析等

![image-20240619144450355](images\github\image-20240619144450355.png)
