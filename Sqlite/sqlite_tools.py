'''
Descripttion: 
Version: xxx
Author: WanJu
Date: 2021-06-03 11:47:50
LastEditors: WanJu
LastEditTime: 2021-06-08 21:04:33
'''
from os import read
import sqlite3
import os.path
from sqlite3.dbapi2 import Error
from numpy import append
import pandas as pd
from pandas.core.frame import DataFrame

db_root = 'E:\SqliteDB'


class Sqlite_Tools:
    def __init__(self) -> None:
        pass
        
    def set_db(self, db_name):
        self.db_name_ = db_name

    def set_col_name(self, col_name):
        self.col_name_ = col_name

    def set_table_name(self, table_name):
        self.table_name_ = table_name

    def connect(self):
        db_path = os.path.join(db_root, self.db_name_)
        print('Connecting DB: ', db_path)
        if not os.path.exists(db_path):
            return None
        conn = sqlite3.connect(db_path)
        return conn

    def create_table_by_csv(self, csv_path):
        conn = self.connect()
        df = pd.DataFrame(pd.read_csv(csv_path, encoding='utf-8'))
        df.to_sql(name=self.table_name_, con=conn, if_exists='append', index=False)

    def show_tables(self) -> list:
        conn = self.connect()
        cursor = conn.cursor()
        tables = cursor.execute("select name from sqlite_master where type='table' order by name")
        result = list(tables.fetchall())
        conn.close()
        return result

    def get_col_name(self) -> list:
        conn = self.connect()
        col_name = pd.read_sql(sql='PRAGMA table_info([%s])' % self.table_name_, con=conn)['name']
        return list(col_name)

    def select(self, values:list = [], keys:dict = {}, order:list = None, limit:tuple = None, chunksize:int = None) -> DataFrame:
        conn = self.connect()
        if len(values) == 0:
            return None
        sql = 'select '
        sql += ','.join(values) + ' from %s' % self.table_name_
        
        if len(keys) > 0:
            sql += ' where %s' % ' and '.join([key + '=\'%s\'' % value for key, value in keys.items()])
        
        if order != None and len(order) == 2:
            sql += ' order by \'%s\' %s' % (order[0], order[1])

        if limit != None and len(limit) == 2:
            sql += ' limit %d offset %d' % limit

        print('execute sql:', sql)
        try:
            result = pd.read_sql(sql=sql, con=conn, chunksize=chunksize)
        except Error as e:
            print(e)
            return None
        return result

    def insert(self):
        pass

    def delete(self):
        pass

    def update(self):
        pass
    