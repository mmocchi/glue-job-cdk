import os
from random import random

import pandas as pd

# Generate some data
# id, timestamp-value, key, value1のカラムをもつ DataFrame
# 1000行のデータを生成
# value1の値は0から1までの小数点以下2桁の乱数
length_of_data = 1000

df = pd.DataFrame({
    'id': range(length_of_data),
    'timestamp': pd.date_range(start='2020-01-01', periods=length_of_data, freq='H'),
    'key': [f'key_{i%10}' for i in range(length_of_data)],
    'value1': [round(random(), 2) for _ in range(length_of_data)]
})

# Save the data
if os.path.exists('dist') == False:
    os.mkdir('dist')
df.to_csv('dist/data.csv', index=False)

