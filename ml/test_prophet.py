import pandas as pd
from prophet import Prophet

df = pd.read_csv('https://raw.githubusercontent.com/facebook/prophet/main/examples/example_wp_log_peyton_manning.csv')
print(df.head())

# Python
m = Prophet()
m.fit(df)

future = m.make_future_dataframe(periods=365)
print(future.tail())