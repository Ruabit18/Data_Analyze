'''
Descripttion: 
Version: xxx
Author: WanJu
Date: 2021-06-03 11:47:28
LastEditors: WanJu
LastEditTime: 2021-06-08 20:39:29
'''
from os import listdir, walk, sep as sys_sep
import os.path
from .sqlite_tools import Sqlite_Tools

def csv_to_sql(db_name, table_name, data_path:str, target_file:str = '.csv', max_depth:int=3):
    sqlite_tools = Sqlite_Tools()
    sqlite_tools.set_db(db_name=db_name)
    sqlite_tools.set_table_name(table_name=table_name)

    start_depth = len(data_path.split(sep=sys_sep))
    for root, dirs, files in walk(data_path):
        search_depth = len(root.split(sep=sys_sep)) - start_depth + 1
        if search_depth > max_depth:
            print("超出最大深度，停止搜索.")
            return
        for file in files:
            if os.path.splitext(file)[1] == target_file:
                csv_path = os.path.join(root, file)
                print('writing: ', csv_path)
                sqlite_tools.create_table_by_csv(csv_path=csv_path)

    print("数据写入完成:")
    sqlite_tools.show_tables()


if __name__ == '__main__':
    data_path = 'E:\BackBlaze\DP_test\original_data'
    db_name = 'disks.db'
    table_name = 'back_blaze'

    csv_to_sql(db_name=db_name, table_name=table_name, data_path=data_path)