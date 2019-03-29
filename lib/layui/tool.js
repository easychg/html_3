/*
*异步调用js
**/

var PageUrl = "/" + window.location.pathname.split('/')[1] + "/Page";
var DeleteUrl = "/" + window.location.pathname.split('/')[1] + "/Delete";
var EditUrl = "/" + window.location.pathname.split('/')[1] + "/Edit";//添加、修改地址
var RecommendUrl = "/" + window.location.pathname.split('/')[1] + "/Recommend";//推荐
var TopUrl = "/" + window.location.pathname.split('/')[1] + "/Sign";//置顶
var ReviewUrl = "/" + window.location.pathname.split('/')[1] + "/Review";//审核
layui.extend({
    admin: '{/}../../static/js/admin'
});
layui.use(['laydate', 'table', 'jquery', 'form', 'admin'], function () {
    var table = layui.table,
        $ = layui.jquery,
        form = layui.form,
        laydate = layui.laydate,
        admin = layui.admin;
    var _where = function () {
        var _return = "{";
        var paramters = $("#demoTable").serialize().split('&');
        for (var i = 0; i < paramters.length; i++) {
            var paramter = paramters[i].split('=');
            if (i != 0) {
                _return += ",\"" + paramter[0] + "\":\"" + paramter[1] + "\"";
            } else {
                _return += "\"" + paramter[0] + "\":\"" + paramter[1] + "\"";
            }
        }
        _return += "}";
        return eval('(' + _return + ')');
    }
    //执行一个laydate实例
    laydate.render({
        elem: '#start' //指定元素
    });
    //执行一个laydate实例
    laydate.render({
        elem: '#end' //指定元素
    });
    table.render({
        elem: '#articleList',
        cellMinWidth: 80,
        height: 560,
        url: PageUrl //请求数据接口
        , limit: 10//要传向后台的每页显示条数
        //,page:true(自带的这个要注掉)
        , page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
            layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']//自定义分页布局
            , limits: [10, 50, 100, 500, 1000, 10000, 100000]
            , first: false //不显示首页
            , last: false //不显示尾页
        }
        , where: _where()
        , title: '用户表'
        , toolbar: '#toolbarDemo' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
        , cols: _cols
        , autoSort: false
        , id: 'idTest'
        , event: true
        , totalRow: true
    });
    form.on('switch(recommendDemo)', function (obj) {
        //当前元素
        var data = $(obj.elem);
        //遍历父级tr，取第一个，然后查找第二个td，取值
        var ids = data.parents('tr').first().find('td').eq(1).text();
        var check = obj.elem.checked;

        $.ajax({
            url: RecommendUrl,
            type: "GET",
            data: {
                "ids": ids,
                "code": obj.elem.checked
            },
            success: function (info) {
                var data = eval('(' + info + ')');
                if (data.status == "success") {
                    layer.msg(data.msg, {
                        offset: ['50%'],
                        time: 1000 //2秒关闭（如果不配置，默认是3秒）
                    }, function () {
                        table.reload('idTest', {
                        });
                        //location.href = data.url;
                    });
                } else {
                    layer.msg(data.msg);
                }
            }
        });
    });
    form.on('switch(topDemo)', function (obj) {
        //当前元素
        var data = $(obj.elem);
        //遍历父级tr，取第一个，然后查找第二个td，取值
        var ids = data.parents('tr').first().find('td').eq(1).text();
        var check = obj.elem.checked;

        $.ajax({
            url: TopUrl,
            type: "GET",
            data: {
                "ids": ids,
                "code": obj.elem.checked
            },
            success: function (info) {
                var data = eval('(' + info + ')');
                if (data.status == "success") {
                    layer.msg(data.msg, {
                        offset: ['50%'],
                        time: 1000 //2秒关闭（如果不配置，默认是3秒）
                    }, function () {
                        table.reload('idTest', {
                        });
                        //location.href = data.url;
                    });
                } else {
                    layer.msg(data.msg);
                }
            }
        });
    });
    form.on('checkbox(reviewDemo)', function (obj) {
        //当前元素
        var data = $(obj.elem);
        //遍历父级tr，取第一个，然后查找第二个td，取值
        var ids = data.parents('tr').first().find('td').eq(1).text();
        var check = obj.elem.checked;

        $.ajax({
            url: ReviewUrl,
            type: "GET",
            data: {
                "ids": ids,
                "code": obj.elem.checked
            },
            success: function (info) {
                var data = eval('(' + info + ')');
                if (data.status == "success") {
                    layer.msg(data.msg, {
                        offset: ['50%'],
                        time: 1000 //2秒关闭（如果不配置，默认是3秒）
                    }, function () {
                        table.reload('idTest', {
                        });
                        //location.href = data.url;
                    });
                } else {
                    layer.msg(data.msg);
                }
            }
        });
    });
    // start
    //监听排序事件
    table.on('sort(test)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        console.log(obj.field); //当前排序的字段名
        console.log(obj.type); //当前排序类型：desc（降序）、asc（升序）、null（空对象，默认排序）
        console.log(this); //当前排序的 th 对象
        //尽管我们的 table 自带排序功能，但并没有请求服务端。
        //有些时候，你可能需要根据当前排序的字段，重新向服务端发送请求，从而实现服务端排序，如：
        table.reload('idTest', {
            initSort: obj //记录初始排序，如果不设的话，将无法标记表头的排序状态。
          , where: { //请求参数（注意：这里面的参数可任意定义，并非下面固定的格式）
              field: obj.field //排序字段
            , order: obj.type //排序方式
          }
        });
        layer.msg('排序完成！');
    });
    //头工具栏事件
    table.on('toolbar(test)', function (obj) {
        layer.msg('选中了 个');
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'getCheckDatat':
                var data = checkStatus.data;
                layer.alert(JSON.stringify(data));
                break;
            case 'getCheckLengtht':
                var data = checkStatus.data;
                layer.msg('选中了：' + data.length + ' 个');
                break;
            case 'isAllt':
                layer.msg(checkStatus.isAll ? '全选' : '未全选');
                break;
        };
    });
    //监听工具条
    table.on('tool(test)', function (obj) { //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象

        if (layEvent === 'detail') { //查看
            layer.msg('查看');
            //do somehing
        } else if (layEvent === 'del') { //删除
            layer.confirm('确认要删除吗？', function (index) {
                //发异步删除数据
                $.ajax({
                    url: DeleteUrl,
                    type: "GET",
                    data: {
                        "ids": data.id
                    },
                    success: function (info) {
                        var data = eval('(' + info + ')');
                        if (data.status == "success") {
                            layer.msg(data.msg, {
                                offset: ['50%'],
                                time: 1000 //2秒关闭（如果不配置，默认是3秒）
                            }, function () {
                                table.reload('idTest', {
                                });
                                //location.href = data.url;
                            });
                        } else {
                            layer.msg(data.msg);
                        }
                    }
                });
            });
        } else if (layEvent === 'edit') { //编辑
            //do something

            WeAdminShow('编辑', EditUrl + "/" + data.id)
            //执行重载
            //table.reload('idTest', {
            //});
            //同步更新缓存对应的值
            //obj.update({
            //    username: '123'
            //  , title: 'xxx'
            //});
        }
    });
    table.on('edit(test)', function (obj) { //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"
        console.log(obj.value); //得到修改后的值
        console.log(obj.field); //当前编辑的字段名
        console.log(obj.data); //所在行的所有相关数据
        layer.msg('单元格');
    });
    //监听行单击事件
    table.on('row(test)', function (obj) {
        //layer.msg('单击');
        //console.log(obj.tr) //得到当前行元素对象
        //console.log(obj.data) //得到当前行数据
        //obj.del(); //删除当前行
        //obj.update(fields) //修改当前行数据
    });
    //监听行双击事件
    table.on('rowDouble(test)', function (obj) {
        //obj 同上
        layer.msg('双击');
    });
    //end
    $(function () {
        form.render();
    });
    var active = {
        getCheckData: function () { //批量删除
            var checkStatus = table.checkStatus('idTest'),
                data = checkStatus.data;
            //layer.alert(JSON.stringify(data));
            if (data.length > 0) {
                layer.confirm('确认要删除吗？', function (index) {
                    var ids = '';
                    for (var i = 0; i < data.length; i++) {
                        if (i == 0) {
                            ids += data[i].id;
                        } else {
                            ids += "," + data[i].id;
                        }
                    }
                    ids += '';
                    //发异步删除数据
                    $.ajax({
                        url: DeleteUrl,
                        type: "GET",
                        data: {
                            "ids": ids
                        },
                        success: function (info) {
                            var data = eval('(' + info + ')');
                            if (data.status == "success") {
                                layer.msg(data.msg, {
                                    offset: ['50%'],
                                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
                                }, function () {
                                    table.reload('idTest', {
                                    });
                                    //location.href = data.url;
                                });
                            } else {
                                layer.msg(data.msg);
                            }
                        }
                    });
                });
                //layer.confirm('确认要删除吗？' + JSON.stringify(data), function (index) {
                //    console.log("data:"+data)
                //    layer.msg('删除成功', {
                //        icon: 1
                //    });
                //    //找到所有被选中的，发异步进行删除
                //    $(".layui-table-body .layui-form-checked").parents('tr').remove();
                //});
            } else {
                layer.msg("请先选择需要删除的数据！");
            }
        },
        Recommend: function () {//推荐
            var checkStatus = table.checkStatus('idTest'),
                data = checkStatus.data;
            if (data.length > 0) {
                var ids = '';
                for (var i = 0; i < data.length; i++) {
                    if (i == 0) {
                        ids += data[i].id;
                    } else {
                        ids += "," + data[i].id;
                    }
                }
                ids += '';
                $.ajax({
                    url: RecommendUrl,
                    type: "GET",
                    data: {
                        "ids": ids,
                        "code": true
                    },
                    success: function (info) {
                        var data = eval('(' + info + ')');
                        if (data.status == "success") {
                            layer.msg(data.msg, {
                                offset: ['50%'],
                                time: 1000 //2秒关闭（如果不配置，默认是3秒）
                            }, function () {
                                table.reload('idTest', {
                                });
                                //location.href = data.url;
                            });
                        } else {
                            layer.msg(data.msg);
                        }
                    }
                });
                //layer.msg("您点击了推荐操作");
                //for (var i = 0; i < data.length; i++) {
                //    console.log("a:" + data[i].recommend);
                //    data[i].recommend = "checked";
                //    console.log("aa:" + data[i].recommend);
                //    form.render();
                //}
            } else {
                layer.msg("请先选择需要推荐的数据");
            }
            //$(".layui-table-body .layui-form-checked").parents('tr').children().children('input[name="zzz"]').attr("checked","checked");
        },
        Top: function () {
            var checkStatus = table.checkStatus('idTest'),
                data = checkStatus.data;
            if (data.length > 0) {
                var ids = '';
                for (var i = 0; i < data.length; i++) {
                    if (i == 0) {
                        ids += data[i].id;
                    } else {
                        ids += "," + data[i].id;
                    }
                }
                ids += '';
                $.ajax({
                    url: TopUrl,
                    type: "GET",
                    data: {
                        "ids": ids,
                        "code": true
                    },
                    success: function (info) {
                        var data = eval('(' + info + ')');
                        if (data.status == "success") {
                            layer.msg(data.msg, {
                                offset: ['50%'],
                                time: 1000 //2秒关闭（如果不配置，默认是3秒）
                            }, function () {
                                table.reload('idTest', {
                                });
                                //location.href = data.url;
                            });
                        } else {
                            layer.msg(data.msg);
                        }
                    }
                });
                //layer.msg("您点击了推荐操作");
                //for (var i = 0; i < data.length; i++) {
                //    console.log("a:" + data[i].recommend);
                //    data[i].recommend = "checked";
                //    console.log("aa:" + data[i].recommend);
                //    form.render();
                //}
            } else {
                layer.msg("请先选择需要置顶的数据");
            }
        },
        Review: function () {
            var checkStatus = table.checkStatus('idTest'),
                data = checkStatus.data;
            if (data.length > 0) {
                var ids = '';
                for (var i = 0; i < data.length; i++) {
                    if (i == 0) {
                        ids += data[i].id;
                    } else {
                        ids += "," + data[i].id;
                    }
                }
                ids += '';
                $.ajax({
                    url: ReviewUrl,
                    type: "GET",
                    data: {
                        "ids": ids,
                        "code": true
                    },
                    success: function (info) {
                        var data = eval('(' + info + ')');
                        if (data.status == "success") {
                            layer.msg(data.msg, {
                                offset: ['50%'],
                                time: 1000 //2秒关闭（如果不配置，默认是3秒）
                            }, function () {
                                table.reload('idTest', {
                                });
                                //location.href = data.url;
                            });
                        } else {
                            layer.msg(data.msg);
                        }
                    }
                });
                //layer.msg("您点击了推荐操作");
                //for (var i = 0; i < data.length; i++) {
                //    console.log("a:" + data[i].recommend);
                //    data[i].recommend = "checked";
                //    console.log("aa:" + data[i].recommend);
                //    form.render();
                //}
            } else {
                layer.msg("请先选择需要审核的数据");
            }
        },
        reload: function () {//查询
            //执行重载
            table.reload('idTest', {
                page: {
                    curr: 1 //重新从第 1 页开始
                }
              , where: _where()
            });
            layer.msg("查询完成！");
        }
    };
    $('.demoTable .layui-btn').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
        return false;
    });
    /*用户-删除*/
    //window.member_del = function (obj, id) {
    //    //layer.confirm('确认要删除吗？', function (index) {
    //    //    //发异步删除数据
    //    //    $(obj).parents("tr").remove();
    //    //    layer.msg('已删除!', {
    //    //        icon: 1,
    //    //        time: 1000
    //    //    });
    //    //});
    //    //layer.confirm('确认要删除吗？', function (index) {
    //    //    //发异步删除数据
    //    //    $.ajax({
    //    //        url: DeleteUrl,
    //    //        type: "GET",
    //    //        data: {
    //    //            "ids": id
    //    //        },
    //    //        success: function (info) {
    //    //            var data = eval('(' + info + ')');
    //    //            if (data.status == "success") {
    //    //                layer.msg(data.msg, {
    //    //                    offset: ['50%'],
    //    //                    time: 1000 //2秒关闭（如果不配置，默认是3秒）
    //    //                }, function () {
    //    //                    table.reload('idTest', {
    //    //                    });
    //    //                    //location.href = data.url;
    //    //                });
    //    //            } else {
    //    //                layer.msg(data.msg);
    //    //            }
    //    //        }
    //    //    });
    //    //});
    //}
});
//function delAll(argument) {
//    var data = tableCheck.getData();
//    layer.confirm('确认要删除吗？' + data, function (index) {
//        //捉到所有被选中的，发异步进行删除
//        layer.msg('删除成功', {
//            icon: 1
//        });
//        $(".layui-form-checked").not('.header').parents('tr').remove();
//    });
//}
function add() {
    WeAdminShow('添加', EditUrl + "/0")
}