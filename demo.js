let fs = require("fs");

// define
var re_start = /\/\/CFGX\[(v\d.\d.\d)];([\s\S]*)/g
var re_key = /KEY\[([^\[\]]+)\]\[([^\[\]]+)\](\{([^\[\]\}]+)\})?;/g
var re_alias = /ALIAS\[([^\[\]]+)\]\[([^\[\]]+)\](\{([^\[\]\}]+)\})?;/g
var re_value = /VALUE\[([^\[\]]+)\]\[([^\[\]]+)\](\{([^\[\]\}]+)\})?;/g
var re_desc = /DESC\{([^\[\]\}]+)\};/g
var re_author = /AUTHOR\{([^\[\]\}]+)\};/g
const file = './demo.cfgx'
const cfg_file = './demo.cfg'

// 解析块内数据
function blockParse(block) {
    var key = [], alias = [], value = [], desc = '', author = '', res
    // 解析comment
    if (block.comment !== '') {
        // Key
        while(res = re_key.exec(block.comment)){
            key.push({"name": res[1], "value": res[2], "info": res.length === 5 ? res[4]:''})
        }

        // alias
        while(res = re_alias.exec(block.comment)){
            alias.push({"name": res[1], "value": res[2], "info": res.length === 5 ? res[4]:''})
        }

        // value
        while(res = re_value.exec(block.comment)){
            value.push({"name": res[1], "value": res[2], "info": res.length === 5 ? res[4]:''})
        }

        // desc
        while(res = re_desc.exec(block.comment)){
            desc = res.length === 2 ? res[1]:''
        }

        // author
        while(res = re_author.exec(block.comment)){
            author = res.length === 2 ? res[1]:''
        }
    }

    return {
        "version": block.version,
        "key": key,
        "alias": alias,
        "value": value,
        "desc": desc,
        "author": author,
        "script": block.script
    }
}

// 从字符串得到块
function stringToBlocks(data) {
    // 初始化，判断空
    let blocks = []
    var lines = data.split("\n")
    if (lines === null) {
        return blocks
    }

    let block = {version: '', comment: '', script: ''}
    let inblock = false // 状态flag
    for (var line of lines) {
        if(line.trim() === '') {
            // 空行
            if(inblock) {
                blocks.push(blockParse(block))
                block = {version: '', comment: '', script: ''}
                inblock = false
            }
        } else {
            // 未遇到CFGX
            var res = re_start.exec(line)
            if (res !== null) {
                // CFGX[v0.1.0] 
                if(inblock) {
                    blocks.push(blockParse(block))
                    block = {version: '', comment: '', script: ''}
                }
                block.version = res[1]
                block.comment += res[2]

                // 状态改变
                inblock = true
            } else if (inblock) {
                if (line.startsWith('//')) {
                    // 不删//也行
                    block.comment += line.replace('//', '')
                } else {
                    block.script +=  line + '\n'
                }
            }
        }
    }

    // 结束后判断
    if(inblock) {
        blocks.push(blockParse(block))
    }

    return blocks
}

//由block生成cfg字符串
function blockToString(block) {
    var output = '//'
                + (block.desc !== ''? block.desc + ' ': '')
                + (block.author !== ''? '作者: ' + block.author: '')
                + '\n'
    for (var i of block.key) {
        block.script = block.script.replaceAll('[['+ i.name +']]', i.value)
        output += '// ' + i.value + ' 键 -> ' + i.info + '\n'
    }
    for (var i of block.alias) {
        block.script = block.script.replaceAll('[['+ i.name +']]', i.value)
    }
    for (var i of block.value) {
        block.script = block.script.replaceAll('[['+ i.name +']]', i.value)
    }

    return output + block.script
}

function generateCfg(blocks, file) {
    var output = '//CFGX v0.1.0 自动生成\n\n'
    for (var block of blocks) {
        output += blockToString(block) + '\n'
    }

    //写入文件
    fs.writeFileSync(file, output,'utf-8')
}

// 同步读取文件
var data = fs.readFileSync(file, 'utf-8');
var blocks = stringToBlocks(data)

// 输出解析结果
console.log('解析结果')
for(var block of blocks){
    console.log(block)
}

// 生成CFG
generateCfg(blocks, cfg_file)

// 异步读取
// fs.readFile(file, 'utf-8', function (err, data) {
//         if (err) {
//             return console.error(err);
//         }
//         console.log(data.toString());
// });
