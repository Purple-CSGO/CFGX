const fs = require("fs");
const yaml = require('js-yaml');

// define

const file = './demo2.yml'
const cfg_file = './demo2.cfg'

// 为每个cfgx功能块生成cfg字符串
function scriptToString(script) {
    // 初始化
    var out = []
    var key = []
    var alias = []
    var value = []
    var content = String(script.content)
    key = script.key
    alias = script.alias
    value = script.value

    // 描述&版本号&作者
    var desc = (script.desc !== '' | null ? script.desc + ' ': '')
                + (script.version !== '' | null ? script.version + ' ': '')
                + (script.author !== '' | null ? '作者: ' + script.author: '')
    if ( desc !== '' | null ) {
        out.push( '// ' + desc )
    }

    // 按键说明+key替换
    for (var i of key) {
        console.log(i)
        content = content.replaceAll('[['+ i.name +']]', i.value)
        out.push( '// ' + i.value + ' 键 -> ' + i.info )
    }

    // alias替换
    for (var i of alias) {
        console.log(i)
        content = content.replaceAll('[['+ i.name +']]', i.value)
    }

    // value替换
    for (var i of value) {
        console.log(i)
        content = content.replaceAll('[['+ i.name +']]', i.value)
    }

    if ( content !== '' | null ) {
        out.push( content )
    }

    return out.join('\n')
}

function generateCfg(cfgx, file) {
    var output = []
    output.push('//CFGX v0.2.0 自动生成\n')
    for (var script of cfgx.scripts) {
        output.push(scriptToString(script))
    }

    //写入文件
    fs.writeFileSync(file, output.join('\n'),'utf-8')
}

// 同步读取文件
var data = fs.readFileSync(file, 'utf-8');
var cfgx = yaml.load(data, json=true)

console.log(cfgx)

// 生成CFG
generateCfg(cfgx, cfg_file)

// 异步读取
// fs.readFile(file, 'utf-8', function (err, data) {
//         if (err) {
//             return console.error(err);
//         }
//         console.log(data.toString());
// });
