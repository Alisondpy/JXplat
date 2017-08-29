#使用说明

##安装npm包

```sh
npm install
```

##开发环境

- 运行gulp

```sh
gulp

```

- gulp后输出以下代码(部分截图)。

```sh
[BS] Access URLs:
 --------------------------------------
       Local: http://localhost:3000
    External: http://192.168.1.240:3000
 --------------------------------------
          UI: http://localhost:3001
 UI External: http://192.168.1.240:3001
 --------------------------------------
```

- 浏览器会默认打开`http://localhost:3000` 具体端口看个人配置,修改打开窗口的地址`http://localhost:3000`如下：

```sh
http://192.168.1.240:3000/service-market/dist/html/index.html
```

- 修改完后，回车，愉快的写业务吧！

##生产环境
```sh
gulp release
```
