import pandas as pd

# Read in all data
nameslist = ["fire","police"]
names_master = []
assets_master = []
liabilities_master = []
years_master = []
classes_master = []

for idx in range(len(nameslist)):
    for year in range(2005,2017):
        xl = pd.ExcelFile('C:/Users/geoff/IL-Pension/data/raw/{}{}.xlsx'.format(nameslist[idx],year))
        df = xl.parse('AnnualFundingRateReport')
        names = df.iloc[2:,0].tolist()
        assets = df.iloc[2:,1].tolist()
        liabilities = [x + y for x, y in zip(df.iloc[2:,4].tolist(),  df.iloc[2:,5].tolist())]
        years = [year] * len(names)
        classes = [nameslist[idx]] * len(names)

        names_master = names_master + names
        assets_master = assets_master + assets
        liabilities_master = liabilities_master + liabilities
        years_master = years_master + years
        classes_master = classes_master + classes

df = pd.DataFrame()
df['Year'] = years_master
df['Type'] = classes_master
df['Name'] = names_master
df['Assets'] = assets_master
df['Liabilities'] = liabilities_master
df = df[~df['Name'].str.contains("Grand")]
df = df[~df['Name'].str.contains("Summary")]
df.to_csv('C:/Users/geoff/IL-Pension/data/PensionData20052017.csv', index=False)