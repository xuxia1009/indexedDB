var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
//moz代表firefox浏览器，ms代表ie浏览器，-webkit：匹配Webkit枘核浏览器，如chrome and safari。

if (!indexedDB) {
    console.log("你的浏览器不支持IndexedDB");
}

var request = indexedDB.open('xuxia', 1); //版本号只能是整数    创建或打开一个数据库

request.onerror = function(e) {
    console.log(e.currentTarget.error.message);
};

request.onsuccess = function(e) {
    //当数据库建立连接时，会返回一个IDBOpenDBRequest对象
    console.log('成功打开DB');
    console.log(e.target.result) //event的target属性就是request对象
    var db = e.target.result;
    var transaction = db.transaction(['person'], 'readwrite');
    var objectStore = transaction.objectStore('person');
    var index = objectStore.index('name');

    objectStore.add({ name: 'xuxia', age: 10 });
    objectStore.add({ name: 'dingchao', age: 20 });
    console.log('ok');
    //1.通过特定值获取数据
    // var request = objectStore.get(1); //查找第一条数据
    // request.onsuccess = function(event) {
    //     console.log(request.result, '66666666666')
    // }
    // request.onerror = function(event) {
    //     // 错误处理!
    // };


    //2.通过游标获取数据
    //需要遍历整个存储空间中的数据时，需要使用到游标
    var request = objectStore.openCursor();
    //openCursor
    //第一个参数，遍历范围，指定游标的访问范围
    //第二个参数，便利顺序，指定游标便利时的顺序和处理相同id（keyPath属性指定字段）重复时的处理方法。

    request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            // 使用Object.assign方法是为了避免控制台打印时出错
            console.log(Object.assign(cursor.value));
            cursor.continue();
        }
    };

    request.onerror = function(event) {
        // 错误处理!
    };
    //3.使用索引
    // 第一种，get方法
    // index.get('a').onsuccess = function (event) {
    //     console.log(event.target.result);
    // }

    // // 第二种，普通游标方法
    // index.openCursor().onsuccess = function (event) {
    //     console.log('openCursor:', event.target.result.value);
    // }

    // // 第三种，键游标方法，该方法与第二种的差别为：普通游标带有value值表示获取的数据，而键游标没有
    // index.openKeyCursor().onsuccess = function (event) {
    //     console.log('openKeyCursor:', event.target.result);
    // }
};

//在数据库创建或者版本更新时，会触发onupgradeneeded事件
request.onupgradeneeded = function(e) {
    var db = e.target.result;

    if (!db.objectStoreNames.contains('person')) {
        console.log("我需要创建一个新的存储对象");
        //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
        //只能在onupgradeneeded回调函数中创建存储空间，而不能在数据库打开后的success回调函数中创建。
        var objectStore = db.createObjectStore('person', {
            keyPath: "id",
            autoIncrement: true //如果true，对象存储具有密钥生成器。默认为false。
                //autoIncrement 属性为 false，则表示主键值不自增，添加数据时需指定主键值。
        });

        //指定可以被索引的字段，unique字段是否唯一

        objectStore.createIndex("name", "name", {
            unique: false //unique的值为true表示不允许索引值相等。
        });


    }
    console.log('数据库版本更改为： ' + 2);
};


// 修改数据    var request = objectStore.put(data);
// 删除数据   var request = objectStore.delete(name);
// key值能够接受的数据类型

// 在IndexedDB中，键值对中的key值可以接受以下几种类型的值：

//     number
//     data
//     string
//     binary
//     array

// 具体说明可以见文档此处。
// key path能够接受的数据类型

// 当一个key值变为主键，即keyPath时，它的值就只能是以下几种：

//     Blob
//     File
//     Array
//     String

// 注：空格不能出现在key path中。