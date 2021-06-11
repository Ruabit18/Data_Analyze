/*
 * @Descripttion: 
 * @Version: xxx
 * @Author: WanJu
 * @Date: 2021-06-11 15:49:31
 * @LastEditors: WanJu
 * @LastEditTime: 2021-06-11 19:26:36
 */

cur_db_name = ''
cur_table_name = ''
cur_col_name = []
feature_filter = {}
functions = ['原始数据', '相关性', '均值', '方差', '标准差']
functions_value = ['original', 'corr', 'mean', 'var', 'std']

function is_null(str){
    if (str == null || str.length <= 0)
        return true
    return false
}

function load_db(db_name){
    if (is_null(db_name)){
        alert('数据库名称不能为空!')
        return
    }
    send_data = {
        'db_name': db_name
    }

    $.ajax({
        url: 'http://0.0.0.0:5000/show_tables',
        type: 'post',
        dataType: 'json',
        data: send_data,
        success: function(data){
            if (data.hasOwnProperty('tables')){
                $('#select_tables').html('')
                $('#select_tables').append('<option selected hidden disabled value="">请选择</option>')
                for(i = 0, len = data.tables.length; i < len; i++){
                    $('#select_tables').append(
                        '<option value=' + data.tables[i] + '>' + data.tables[i] + '</option>'
                    )
                }
                cur_db_name = db_name
            }
            else
                alert('数据库' + db_name + '加载失败!')
        }
    })
}

function load_tables(table_name){
    if (is_null(table_name)){
        alert('数据表名称不能为空!')
        return
    }
    send_data = {
        'table_name': table_name
    }

    $.ajax({
        url: 'http://0.0.0.0:5000/load_data',
        type: 'post',
        dataType: 'json',
        data: send_data,
        success: function(data){
            if (data.hasOwnProperty('index') &&
                data.hasOwnProperty('data')){
                    paint_form(data.index, JSON.parse(data.data), 'table_original_data', 600)
                    cur_table_name = table_name
                    cur_col_name = data.index
                }
            else
                alert('数据表' + table_name + '加载失败!')
        }
    })
}

function filter_init(){
    if (is_null(cur_table_name)){
        alert('当前未加载数据表!')
        return
    }
    var html_filter = ''
    for (i = 0, len = cur_col_name.length; i < len; i++){
        html_filter += '<a class="checkbox" ><input onchange=filter_add() type="checkbox" name="check_filter" value='+ cur_col_name[i] +'>'+ cur_col_name[i] +'</a>'
    }
    $('#features_filter').append(html_filter)
    funcs_init()
}

function funcs_init(){
    var html_func = ''
    for (i = 0, len = functions.length; i < len; i++){
        html_func += '<a class="checkbox" ><input type="checkbox" name="check_funcs" value='+ functions_value[i] +'>'+ functions[i] +'</a>'
    }
    $('#func_filter').html(html_func)
}

function filter_add(){
    check_filters = $('input[name=check_filter]')
    var html_table = ''
    for(i = 0, len = check_filters.length; i < len; i++){
        if (check_filters[i].checked){
            html_table += '<tr><td>'+ check_filters[i].value +'</td><td><input name="input_filter" value="" alt='+ check_filters[i].value +'></td></tr>'
        }
    }
    $('#table_features').html(html_table)
}

function filter_start(){
    var input_filters = $('input[name=input_filter]')
    feature_filter = {}
    for(i = 0, len = input_filters.length; i < len; i++){
        feature_filter[input_filters[i].alt] = input_filters[i].value
    }
    send_data = {'feature_filter': JSON.stringify(feature_filter)}
    
    $.ajax({
        url: 'http://0.0.0.0:5000/data_filter',
        type: 'post',
        dataType: 'json',
        data: send_data,
        success: function(data){
            if (data.hasOwnProperty('index') &&
                data.hasOwnProperty('data')){
                paint_form(data.index, JSON.parse(data.data), 'table_filter_data', 300)
                cur_col_name = data.index
                select_order_init()
                select_value_init()
            }
            else
                alert('数据库请求失败!')
        }
    })
}

function select_order_init(){
    var html_order = ''
    for(i = 0, len = cur_col_name.length; i < len; i++){
        html_order += '<option value=' + cur_col_name[i] + '>' + cur_col_name[i] + '</option>'
    }
    $('#select_order').html(html_order)
}

function select_value_init(){
    var html_value = ''

    for(i = 0, len = cur_col_name.length; i < len; i++){
        html_value += '<a class="checkbox" >\
        <input onchange=change_base() type="checkbox" name="check_value" value='+ cur_col_name[i] +'>\
        <input type="radio" name="radio_base" disabled value='+ cur_col_name[i] +'>'+ cur_col_name[i] +'</a>'    
    }
    $('#value_filter').html(html_value)
}

function select_all(checked){
    var check_values = $('input[name=check_value]')
    var radio_values = $('input[name=radio_base]')
    
    for(i = 0, len = check_values.length; i < len; i++){
        check_values[i].checked = checked
        radio_values[i].disabled = !checked
        if (!checked)
            radio_values[i].checked = checked
    }
}

function change_base(){
    var check_values = $('input[name=check_value]')
    var radio_values = $('input[name=radio_base]')
    for(i = 0, len = check_values.length; i < len; i++){
        radio_values[i].disabled = !check_values[i].checked
        if (!check_values[i].checked)
            radio_values[i].checked = false
    }
    
}

function show_charts(){
// 采集信息
    var funcs = []
    $('input[name=check_funcs]:checked').each(
        function(){
            funcs.push($(this).val())
        }
    )
    var values = []
    $('input[name=check_value]:checked').each(
        function(){
            values.push($(this).val())
        }
    )
    var base =  $('input[name=radio_base]:checked').val()
    var order = [$('#select_order').val(), $('input[name=radio_order]:checked').val()]

    if ($.inArray('corr', funcs) && is_null(base)){
        alert('选择相关性函数时, 必须选择基准属性!')
        return
    }

    send_data = {
        'features': JSON.stringify(feature_filter),
        'values': JSON.stringify(values),
        'order': JSON.stringify(order),
        'func': JSON.stringify(funcs),
        'base': JSON.stringify(base)
    }
    console.log(send_data)

    $.ajax({
        url: 'http://0.0.0.0:5000/data_process',
        type: 'post',
        dataType: 'json',
        data: send_data,
        success: function(data){
            paint_charts(data)
        }
    })
    
}

function paint_charts(data){
    if (data.hasOwnProperty('corr_name') && 
        data.hasOwnProperty('pearson') &&
        data.hasOwnProperty('spearman')){
            // 绘制相关性图表
            console.log('spearman')
            paint_bar(data.corr_name[0] + '的线性相关性',
                    ['pearson', 'spearman'],
                    data.corr_name.slice(1),
                    [data.pearson, data.spearman],
                    'h'
                    )
        }

    if (data.hasOwnProperty('original') && 
        data.hasOwnProperty('index')){
            // 绘制原始数据图表
            original_data = JSON.parse(data.original)
            paint_line(
                '原始数据',
                data.index,
                Array.from(new Array(original_data[0].length).keys()),
                original_data,
                false
            )
        }

    if (data.hasOwnProperty('mean')){
        
    }
    if (data.hasOwnProperty('var')){
        
    }
    if (data.hasOwnProperty('std')){
        
    }
}