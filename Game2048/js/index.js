//  方格数组
var arr = [];

window.onload = function () {
    // 初次加载
    obj.createEle = 1;
    obj.gameStart();
}

var obj = {
    ROW: 4,
    CELL: 4,
    r: 0, //  行
    c: 0, //  列
    f: 0, //  f表示查找的下一位置
    keyOption: 0,
    score: 0,
    createEle: 0, // 是否新创建一个元素
    eleFragment: "", // 文档片段变量

    // 游戏初始化
    init: function () {
        obj.eleFragment = document.createDocumentFragment();
        //  生成ROW行、CELL列的格子
        for (r = 0; r < obj.ROW; r++) {
            arr.push([]);
            for (c = 0; c < obj.CELL; c++) {
                arr[r][c] = 0;
                if (obj.createEle == 1) {
                    obj.create(r, c);
                }
            }
        }
        //  确定是否新建小格子
        if (obj.createEle == 1) {
            obj.createEle = 0;
            document.getElementById("panel").innerHTML = ""; // 清空原有的元素
            document.getElementById("panel").appendChild(obj.eleFragment); // 添加元素
        }
        obj.score = 0;
        document.getElementById("score").innerHTML = obj.score;
        document.getElementById("game").style.display = "none";
        document.getElementById("gameOver").style.display = "none";
        //  游戏开始时随机位置生成两个数，为2或4
        obj.random(); 
        obj.random();
        //  更新格子
        obj.updateView();
    },
    // 开始
    gameStart: function () {
        //  格子初始化
        obj.init();
        //  按键时触发
        document.onkeydown = function (e) { // e为事件对象
            switch (e.keyCode) { //  根据按键号执行不同的逻辑
                case 37:
                    obj.keyOption = 1;
                    obj.moveLeft();
                    break;
                case 38:
                    obj.keyOption = 2;
                    obj.moveUp();
                    break;
                case 39:
                    obj.keyOption = 1;
                    obj.moveRight();
                    break;
                case 40:
                    obj.keyOption = 2;
                    obj.moveDown();
                    break;
            }
            document.getElementById("score").innerHTML = obj.score; //  修改分数
        }
    },
    // 新创建小格子及格子内的随机数，并将其添加到panel中
    create: function (r, c) {
        //  grid为格子，cell为格子里的数字，经过调整使格子整体大小适中
        var grid, cell;
        var increment = 12,
            grWidth, grHeight, grMarginTop, grMarginLeft, ceWidth, ceHight;
        grid = document.createElement("div");
        cell = document.createElement("div");
        grid.id = "g" + r + c;
        grid.className = "grid";
        cell.id = "c" + r + c;
        cell.className = "cell";
        grWidth = grHeight = ceWidth = ceHight = 60 + (6 - obj.ROW) * increment;
        grMarginTop = grMarginLeft = (480 - grWidth * obj.ROW) / (obj.ROW + 1);
        grid.style.width = grWidth + "px";
        grid.style.height = grHeight + "px";
        grid.style.marginTop = grMarginTop + "px";
        grid.style.marginLeft = grMarginLeft + "px";
        cell.style.width = ceWidth + "px";
        cell.style.height = ceHight + "px";
        cell.style.top = grMarginTop + r * (grMarginTop + ceWidth) + "px";
        cell.style.left = grMarginLeft + c * (grMarginLeft + ceHight) + "px";
        cell.style.lineHeight = ceHight + "px";
        cell.style.fontSize = 30 + (6 - obj.ROW) * 10 + "px";
        obj.eleFragment.appendChild(grid);
        obj.eleFragment.appendChild(cell);
    },
    // 随机位置生成2或4
    random: function () {
        while (true) {
            var row = Math.floor(Math.random() * obj.ROW);
            var cell = Math.floor(Math.random() * obj.CELL);
            if (arr[row][cell] == 0) { // 当随机数位置为0时，随机生成2或4
                arr[row][cell] = (Math.random() < 0.5) ? 2 : 4;
                break;
            }
        }
    },
    // 对页面进行更新
    updateView: function () {
        var win = 0;
        for (r = 0; r < obj.ROW; r++) {
            for (c = 0; c < obj.CELL; c++) {
                if (arr[r][c] == 0) { // 值为0的不显示
                    document.getElementById("c" + r + c).innerHTML = ""; // 0不显示
                    document.getElementById("c" + r + c).className = "cell" // 清除样式
                } else {
                    document.getElementById("c" + r + c).innerHTML = arr[r][c];
                    document.getElementById("c" + r + c).className = "cell n" + arr[r][c]; // 添加不同数字的颜色
                    if (obj.ROW == 3 && arr[r][c] == 1024) {
                        win = 1;
                    } else if (obj.ROW == 4 && arr[r][c] == 2048) {
                        win = 1;
                    } else if (obj.ROW == 5 && arr[r][c] == 4096) {
                        win = 1;
                    } else if (obj.ROW == 6 && arr[r][c] == 8192) {
                        win = 1;
                    }
                }
            }
        }
        if (win == 1) { // 全部通过
            document.getElementById("game").style.display = "block";
            document.getElementById("gameOver").style.display = "block";
            document.getElementById("finalScore").innerHTML = "登峰造极!恭喜通关！<br>finalScore:" + obj.score;
        }
        if (obj.isGameOver()) { // 游戏失败
            document.getElementById("game").style.display = "block";
            document.getElementById("gameOver").style.display = "block";
            document.getElementById("finalScore").innerHTML = "好可惜，再试一次吧！<br>finalScore:" + obj.score;
            console.log("gameOver");
        }
    },
    // 游戏失败
    isGameOver: function () {
        for (r = 0; r < obj.ROW; r++) {
            for (c = 0; c < obj.CELL; c++) {
                if (arr[r][c] == 0) { // 有0还不是gameOver
                    return false;
                } else if (c != obj.CELL - 1 && arr[r][c] == arr[r][c + 1]) { // 左往右 前一个和下一个不相等
                    return false;
                } else if (r != obj.ROW - 1 && arr[r][c] == arr[r + 1][c]) { // 上往下 上一个和下一个不相等
                    return false;
                }
            }
        }
        return true;
    },
    // 查找下一个不为0的数值的位置
    find: function (r, c, start, condition, direction) {
        if (obj.keyOption == 2) { // 上下按键
            if (direction == 1) { // 向上按键 f++
                for (var f = start; f < condition; f += direction) {
                    if (arr[f][c] != 0) {
                        return f;
                    }
                }
            } else { // 向下按键 f--
                for (var f = start; f >= condition; f += direction) {
                    if (arr[f][c] != 0) {
                        return f;
                    }
                }
            }
        } else { // 左右按键
            if (direction == 1) { // 左按键 f++
                for (var f = start; f < condition; f += direction) {
                    if (arr[r][f] != 0) {
                        return f;
                    }
                }
            } else { // 右按键 f--
                for (var f = start; f >= condition; f += direction) {
                    if (arr[r][f] != 0) {
                        return f;
                    }
                }
            }
        }
        return null; // 循环结束仍然没有找到！=0的数值，返回null
    },
    // 移动
    move: function (fn) {
        var before, // 没处理前
            after; // 处理之后
        before = arr.toString();
        fn(); // 执行传进来的函数
        after = arr.toString();
        // 若不同则更新
        if (before != after) {
            obj.random();
            obj.updateView();
        }
    },
    // 左移
    moveLeft: function () {
        obj.move(function () {
            for (r = 0; r < obj.ROW; r++) {
                obj.dealToLeft(r);
            }
        })
    },
    // 右移
    moveRight: function () {
        obj.move(function () {
            for (r = 0; r < obj.ROW; r++) {
                obj.dealToRight(r);
            }
        })
    },
    // 上移
    moveUp: function () {
        obj.move(function () {
            for (c = 0; c < obj.CELL; c++) {
                obj.dealToUp(c);
            }
        })
    },
    // 下移
    moveDown: function () {
        obj.move(function () {
            for (c = 0; c < obj.CELL; c++) {
                obj.dealToDown(c);
            }
        })
    },
    // 左移主逻辑
    dealToLeft: function (r) {
        var nextPos;
        for (c = 0; c < obj.ROW; c++) {
            nextPos = obj.find(r, c, c + 1, obj.CELL, 1); // 找出第一个不是0的位置
            if (nextPos == null) break; // 如果没有找到就结束循环
            if (arr[r][c] == 0) {
                arr[r][c] = arr[r][nextPos]; // 替换
                arr[r][nextPos] = 0; // 将找到的那个位置清零
                c--;
            } else if (arr[r][c] == arr[r][nextPos]) { // 若两个位置的数值相等，则相加
                arr[r][c] *= 2;
                arr[r][nextPos] = 0;
                obj.score += arr[r][c];
            }
        }
    },
    // 右移主逻辑
    dealToRight: function (r) {
        var nextPos;
        for (c = obj.CELL - 1; c >= 0; c--) {
            nextPos = obj.find(r, c, c - 1, 0, -1); // 找出第一个不是0的位置
            if (nextPos == null) break; // 没有找到就跳出循环
            if (arr[r][c] == 0) { // 当前位置是0
                arr[r][c] = arr[r][nextPos]; // 替换
                arr[r][nextPos] = 0; // 找到的位置清零
                c++;
            } else if (arr[r][c] == arr[r][nextPos]) { // 若两个位置的数值相等，则相加
                arr[r][c] *= 2;
                arr[r][nextPos] = 0;
                obj.score += arr[r][c];
            }
        }
    },
    // 上移主逻辑
    dealToUp: function (c) {
        var nextPos;
        for (r = 0; r < obj.ROW; r++) {
            nextPos = obj.find(r, c, r + 1, obj.ROW, 1); // 找出第一个不是0的位置
            if (nextPos == null) break;
            if (arr[r][c] == 0) { // 当前位置是0
                arr[r][c] = arr[nextPos][c]; // 替换
                arr[nextPos][c] = 0; // 找到的位置清零
                r--;
            } else if (arr[r][c] == arr[nextPos][c]) { // 若两个位置的数值相等，则相加
                arr[r][c] *= 2;
                arr[nextPos][c] = 0;
                obj.score += arr[r][c];
            }
        }
    },
    // 下移主逻辑
    dealToDown: function (c) {
        var nextPos;
        for (r = obj.ROW - 1; r >= 0; r--) {
            nextPos = obj.find(r, c, r - 1, 0, -1); // 找出第一个不是0的位置
            if (nextPos == null) {
                break;
            }
            if (arr[r][c] == 0) { // 如果当前位置为0
                arr[r][c] = arr[nextPos][c]; // 替换
                arr[nextPos][c] = 0; // 找到的位置清零
                r++;
            } else if (arr[r][c] == arr[nextPos][c]) { // 若两个位置的数值相等，则相加
                arr[r][c] *= 2;
                arr[nextPos][c] = 0;
                obj.score += arr[r][c];
            }
        }
    }
}
// 切换闯关级别
function getDegree(e) {
    var t = e.target,
        degree = 4;
    if (t.nodeName == "A") {
        if (t.innerHTML == "闯关4*4") {
            degree = 4;
        } else if (t.innerHTML == "闯关5*5") {
            degree = 5;
        } else if (t.innerHTML == "闯关6*6") {
            degree = 6;
        } else if (t.innerHTML == "闯关7*7") {
            degree = 7;
        } else if (t.innerHTML == "闯关8*8") {
            degree = 8;
        }
        obj.ROW = obj.CELL = degree;
        obj.createEle = 1; //  是否创建格子
        obj.gameStart(); // 重新开始
    }
}