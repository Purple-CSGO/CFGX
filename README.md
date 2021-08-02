# CFG eXtended
> Uniform Standard of source engine games' extended and enhanced configuration files (i.e. CSGO cfg) and backbone of user-friendly GUI settings modifier.

起源引擎游戏的设置文件扩展&增强——CFGX，为用户友好的图形交互设置修改奠定基础。

## 说明

游戏设置的指令，如灵敏度 `sensitivity` 、键位绑定 `bind` 、自定义指令 `alias` 、具有某种功能的一段脚本script等，放在一个或多个CFG文件里，分享并在文本编辑器修改的方法并不足够易用。理想状态下游戏的设置都应在图形界面下修改。

- 定义**功能块**，可以专门找一个库存储大量的功能块，玩家也能浏览找自己喜欢的功能；

- 比如跳投，玩家实际关心的是跳投绑定的键是什么，具体实现应交给脚本编写者，想必应把按键 `key` 这一部分单独出来，作为这个**功能块的参数**；

- 还比如准星切换，可能涉及到两个独立的cfg文件，**外部文件也要考虑进去**；

- 要能表达游戏中的bind、alias、bindtoggle、incrementvar等指令和 + - 状态；

- 玩家使用涉及到的单指令并不多，如果能**规定指令和参数及映射关系**，即可压缩存储。比如 net_graph 定义为0，sensitivity 定义为1... 

  - 可以用json存储：`{"0":"1", "1":"1.23456", ...}`
  - 也可以用列表：`["1", "1.23456", ...]`

  在此基础之上还可以用zip压缩进一步降低存储占用，可以利用Cloudflare的无服务和存储做成免费的设置云端存储，免费额度即可供大量用户使用；

- ...

## 要解决的问题

- 如何定义和表达**功能块**，要考虑到：
  - 按键绑定 key
  - 别名指令 alias
  - `+` `-` 指令及其状态
  - ↑相关的组合指令，如incrementvar
  - 注释 comment
  - ...
- 如何定义单指令、参数与映射关系
- 如何适配多个游戏：分多个 .cfgxdef 文件，文件名和定义文件中包含游戏名称
- 如何版本迭代：定义文件中包含定义的版本 version 如 `v1.0` `v2.2`

## 初版demo

> 先随手写个例子出来

文件名：`csgo_v0.1.cfxdef`

```
game: csgo
version: v0.1
commands:{
	1: "net_graph",
	2: "sensitivity",
}
block: ...
```

功能块

```
//简单跳投
//key1 = Capslock
bind %key1% "+jumpthrow";
alias +jumpthrow "+jump;-attack;-attack2";
alias -jumpthrow "-jump";
```





