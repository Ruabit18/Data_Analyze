'''
Descripttion: 
Version: xxx
Author: WanJu
Date: 2021-06-04 16:13:34
LastEditors: WanJu
LastEditTime: 2021-06-10 10:46:10
'''
import pandas as pd
from pandas.core.frame import DataFrame

class Data_Process:
    def __init__(self, data:DataFrame = None, funcs:list = [], base:str = '') -> None:
        self.data_ = data
        self.funcs_ = funcs
        self.base_ = base
        
    def data_process(self):
        # 用相应的函数进行数据预处理
        res = {}
        if 'original' in self.funcs_:
            res['original'] = self.data_.T.to_json(orient='values', force_ascii=False)
        if 'mean' in self.funcs_:
            res['mean'] = get_mean(self.data_)
        if 'var' in self.funcs_:
            res['var'] = get_var(self.data_)
        if 'std' in self.funcs_:
            res['std'] = get_std(self.data_)
        if 'corr' in self.funcs_:
            res['corr_name'], res['pearson'], res['spearman'] = get_corr(self.data_, self.base_)

        return res

# 数据处理函数
def get_mean(data:DataFrame = None):
    # 获取均值
    res = []
    for index, col in data.iteritems():
        res.append([index, col.mean()])

    return res

def get_std(data:DataFrame = None):
    res = []
    for index, col in data.iteritems():
        res.append([index, col.std()])

    return res

def get_var(data:DataFrame = None):
    res = []
    for index, col in data.iteritems():
        res.append([index, col.var()])

    return res

def get_corr(data:DataFrame = None, base:str = ''):
    # 获取相关性
    res_index = [base]
    res_pearson = []
    res_spearman = []
    for index, col in enumerate(list(data.columns)):
        if (col != base and data[col].std() != 0 and data[base].std() != 0):
            res_index.append(col)
            res_pearson.append(data[base].corr(data[col], method='pearson'))
            res_spearman.append(data[base].corr(data[col], method='spearman'))

    return res_index, res_pearson, res_spearman

# if __name__ == '__main__':
#     df = pd.DataFrame(
#         [[1, 2, 3],
#         [3, 4, 5],
#         [5, 6, 7]]
#     )
#     df.columns = ['a', 'b', 'c']
#     print(df)

#     mean = get_mean(data=df)
#     print('mean', mean)
    
#     std = get_std(data=df)
#     print('std', std)

#     var = get_var(data=df)
#     print('var', var)

#     data = pd.DataFrame({'id': [3, 2, 1, 1, 2, 3, 2, 3, 1, 1, 2, 3, 1, 2, 1],
#                         'age': [27, 33, 16, 29, 32, 23, 25, 28, 22, 18, 26, 26, 15, 29, 26]})

#     pearson, spearman = get_corr(data=data)
#     print('pearson', pearson)
#     print('spearman', spearman)