import pyq
import datetime,time
from pymongo import MongoClient
# from datetime import datetime

client = MongoClient('localhost',27017)

# Gets 2014 stock history with price values
def getTickerHistory(ticker):
	collection = client.stocks[ticker]
	#return all prices
	prices = [tickPrice for tickPrice in collection.find()]
	#strip the dates out since we know this
	chart = map((lambda l: float(l['price'])),prices)
	return chart


def saveTickerHistory(ticker):
	data = pyq.get_yahoo_ticker_historical('20140101', time.strftime("%Y%m%d"),ticker)
	#reverse list so that end is latest
	data.reverse() 
	#save only date and price
	#toSave = map((lambda l: {'date':datetime.strptime(data[1], "%Y%m%d"),'price':data[7]}),data)
	toSave = map((lambda l: {'date':l[1],'price':l[7]}),data)
	# print toSave
	dbSaveTickerHistory(toSave,ticker)
	print 'saved ' + ticker 


def dbSaveTickerHistory(data,ticker):
	#drop and refresh
	db = client.stocks
	collection = db[ticker]
	db.drop_collection(collection)
	for price in data:
                collection.insert(price)

