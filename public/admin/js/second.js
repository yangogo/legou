$(function () {
    var page = 1;
    var pageSize = 5;
    render();
    //渲染函数
    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: page,
                pageSize: pageSize
            },
            success: function (info) {
                //模板与数据结合渲染 
                $('tbody').html(template("tmp", info));
                //分页功能
                $(".paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    numberOfPages: 5,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, p) {
                        page = p;
                        render()
                    }
                });
            }
        })
    }

    //打开模态框按钮事件//获取一级分类数据
    $(".add_modal").on('click', function () {
        $("#addModal").modal('show');
        //获取一级分类数据
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100,
            },
            success:function(info){
                $(".dropdown-menu").html( template("tmp1", info) )
            }
        })



    })
    //一级分类下拉菜单 点击事件
    $(".dropdown-menu").on("click","a", function(){   
        $(".btn-text").html($(this).text());
        $("[type='hidden']").val($(this).data("id"));
        $("#form").data('bootstrapValidator').updateStatus("categoryId", "VALID" );
        
    })

    //上传图片
    $("#fileupload").fileupload({
        //e：事件对象
        //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
            $(".brandLogo").val(data.result.picAddr)
            $(".img-text").attr("src",data.result.picAddr );
            $("#form").data('bootstrapValidator').updateStatus("brandLogo", "VALID" );
        }
    });


    // 表单校验
     //使用表单校验插件
    $("#form").bootstrapValidator({
        excluded: [],
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        //3. 指定校验字段
        fields: {
            //校验用户名，对应name表单的name属性
            brandName: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请输入品牌名称'
                    },

                }
            },
            categoryId: {
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请选择一级分类'
                    },

                }
            },
            brandLogo:{
                validators: {
                    //不能为空
                    notEmpty: {
                        message: '请上传图片'
                    },

                }
            },
        }

    });
    //表单校验完成
    $("#form").on('success.form.bv', function (e) {
        e.preventDefault();
        //使用ajax提交逻辑
        //发送数据
        $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $("#form").serialize(),
            success: function (info) {
                console.log(info);
                
                if (info.success) {
                    $("#addModal").modal('hide');
                    page = 1
                    render();
                    //表单重置
                    $("#form").data('bootstrapValidator').resetForm(true);
                    $(".btn-text").text("请选择一级分类");
                    $(".img-text").attr("src","./images/none.png" );
                }
            }
        })
    });
//     //添加分类事件
//     $('.btn_add').on('click', function () {
//         //重置表单


//     })
 })