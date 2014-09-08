# App发布版本说明

* 项目重构，采用PhoneGap架构，有利于UI快速开发，AngularJS动态数据绑定
* 增加登录页、建设单位首页、联系人页、考核列表页
* 重构文件目录，尽量采用单一目录结构
* 增加gulp编译，开发时采用js全引用，ionic serve方式，部署时采用app.js单文件
* 增加foreground camera插件，解决Android Activity切换时app重启问题