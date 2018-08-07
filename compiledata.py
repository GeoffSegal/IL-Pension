import pandas as pd
import numpy as np


nameslist = ["fire","police"]
names_master = []
assets_master = []
liabilities_master = []
years_master = []
classes_master = []

for idx in range(len(nameslist)):
    for year in range(2005,2016+1): #2017 doesn't have enough
        xl = pd.ExcelFile('C:/Users/geoff/IL-Pension/data/raw/{}{}.xlsx'.format(nameslist[idx],year))
        df = xl.parse('AnnualFundingRateReport')
        names = df.iloc[2:,0].tolist()
        names = [x.strip() for x in names]
        assets = df.iloc[2:,1].tolist()
        if df.shape[1] == 6:
            liabilities = [x + y for x, y in zip(df.iloc[2:,3].tolist(),  df.iloc[2:,4].tolist())]
        elif df.shape[1] == 7:
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
df['Fund_Name'] = names_master
df['Assets'] = assets_master
df['Liabilities'] = liabilities_master
df = df[~df['Fund_Name'].str.contains("Grand")]
df = df[~df['Fund_Name'].str.contains("Summary")]

df['Fund_Name'] = np.where(df.Fund_Name =='ARLINGTON HEIGHTS POLICE FUND','ARLINGTON HEIGHTS POLICE PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='BEACH PARK FPD FIRE FIGHTERS PENSION FUND','BEACH PARK FPD FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='CANTON FIRE PENSION FUND','CANTON FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =="CARBONDALE FIRE FIGHTER'S PENSION FUND",'CARBONDALE FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='CARBONDALE FIRE PENSION FUND','CARBONDALE FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='CHARLESTON FIREFIGHTERS PENSION FUND OF CHARLESTON','CHARLESTON FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='CICERO FIREFIGHTER PENSION FUND','CICERO FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =="CICERO FIREFIGHTERS' PENSION FUND",'CICERO FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='CITY OF GENOA POLICE PENSION FUND','GENOA POLICE PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='DEERFIELD-BANNOCKBURN FPD FIREFIGHTERS PENSION FUN','DEERFIELD-BANNOCKBURN FIRE PROTECTION DISTRICT', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =="DES PLAINES FIREFIGHTERS' PENSION FUND",'DES PLAINES FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='HICKORY HILLS POLICE PENSION PLAN','HICKORY HILLS POLICE PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='KANKAKAEE FIREFIGHTERS PENSION FUND','KANKAKEE FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =="KANKAKEE FIREFIGHTERS' PENSION FUND",'KANKAKEE FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='LOCKPORT TOWNSHIP FPD FIREFIGHTERS PENSION FUND','LOCKPORT TOWNSHIP FPD PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='LONG GROVE FIREMENS PENSION FUND','LONG GROVE FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='MT. ZION POLICE PENSION FUND','MT ZION POLICE PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =="OAK LAWN FIREFIGHTERS' PENSION FUND",'OAK LAWN FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='OAKBROOK TERRACE FPD FIREFIGHTERS PENSION FUND','OAKBROOK TERRACE FIRE PROTECTION DISTRICT', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='PALOS FIRE PROTECTION DISTRICT PENSION FUND','PALOS FPD PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='ROBINSON FPD FIREFIGHTERS PENSION FUND','ROBINSON FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='SAUK VILLAGE FIREFIGHTER PENSION FUND','SAUK VILLAGE FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =="SOUTH BELOIT FIREFIGHTER'S  PENSION FUND",'SOUTH BELOIT FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =="SOUTH HOLLAND FIREFIGHTERS' PENSION FUND",'SOUTH HOLLAND FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =="TROY FPD FIREFIGHTER'S PENSION FUND",'TROY FPD FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='WILLIAMSON COUNTY  FIREFIGHTERS PENSION FUND','WILLIAMSON COUNTY FIREFIGHTERS PENSION FUND', df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =='WOODSTOCK FIRE/RESCUE DISTRICT FIREFIGHTERS PENSIO',"WOODSTOCK FIRE/RESCUE DIST. FIREFIGHTERS' PENSION", df.Fund_Name)
df['Fund_Name'] = np.where(df.Fund_Name =="FOX LAKE FPD  FIREFIGHTER'S PENSION FUND","FOX LAKE FIREFIGHTERS PENSION FUND", df.Fund_Name)


df.to_csv('C:/Users/geoff/IL-Pension/data/PensionData20052016.csv', index=False)
