'''
Descripttion: 
Version: xxx
Author: WanJu
Date: 2021-05-31 19:19:38
LastEditors: WanJu
LastEditTime: 2021-06-11 16:56:02
'''
from flask import Flask, json, render_template, request, jsonify
from flask_cors import CORS
import webbrowser
import os.path as path
import pandas as pd
from Sqlite.sqlite_tools import Sqlite_Tools
from Data_analyze.data_process import Data_Process


app = Flask(__name__, template_folder='./ui/html')
CORS(app, resources=r'/*')


# 全局变量
sqlite_tools = Sqlite_Tools()

@app.route('/show_tables', methods=['POST'])
def show_tables():
    db_name = request.form.get('db_name', type=str, default=None)
    sqlite_tools.set_db(db_name=db_name)

    result = {}
    result['tables'] = sqlite_tools.show_tables()
    return jsonify(result)

@app.route('/load_data', methods=['POST'])
def load_data():
    table_name = request.form.get('table_name', type=str, default=None)
    sqlite_tools.set_table_name(table_name=table_name)
    index = sqlite_tools.get_col_name()
    data = sqlite_tools.select(values=['*'],
                                limit=(100, 0))
                                
    result = {}
    sqlite_tools.set_col_name(col_name=list(index))
    result['index'] = sqlite_tools.col_name_
    result['data'] = data.to_json(orient='values', force_ascii=False)
    return jsonify(result)


@app.route('/data_filter', methods=['POST'])
def data_filter():
    keys = json.loads(request.form.get('feature_filter', type=str, default=None))

    data = sqlite_tools.select(keys=keys,
                                values=['*'],
                                limit=(500, 0))
    data.dropna(axis=1, how='all', inplace=True) 
    result = {}
    result['index'] = list(data.columns)
    result['data'] = data.to_json(orient='values', force_ascii=False)
    return jsonify(result)

@app.route('/data_process', methods=['POST'])
def data_process():
    keys = json.loads(request.form.get('features', type=str, default=None))
    values = json.loads(request.form.get('values', type=str, default=None))
    order = json.loads(request.form.get('order', type=str, default=None))
    func = json.loads(request.form.get('func', type=str, default=None))
    base = json.loads(request.form.get('base', type=str, default=None))
    # print(keys, values, order, func)

    data = sqlite_tools.select(keys=keys,
                                values=values,
                                order=order)
    data_process = Data_Process(data=data, funcs=func, base=base)
    result = data_process.data_process()
    result['index'] = list(data.columns)
    return jsonify(result)

if __name__ == '__main__':
    webbrowser.open(path.join(path.curdir, 'ui/html/main.html'))
    app.run(host='0.0.0.0', port=5000)