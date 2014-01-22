import pyq
import datetime,time
from pymongo import MongoClient
# from datetime import datetime

client = MongoClient('localhost',27017)



# Gets 2014 stock history with price values
def getTickerHistory(ticker):
	chart = getTickerHistoryFromDb(ticker)
	if len(chart) < 2:
		#going to web
		print 'went to web for: ' + ticker
		webFormat = getTickerHistoryFromWeb(ticker)
		if webFormat:
			#save the stock for future reuse
			dbSaveTickerHistory(webFormat,ticker)
			chart = formatTickers(webFormat)
		else:
			return None
	return chart

#uses db
def getTickerHistoryFromDb(ticker):
	collection = client.stocks[ticker]
	#return all prices
	prices = [tickPrice for tickPrice in collection.find()]
	#strip the dates out since we know this
	chart = formatTickers(prices)
	return chart

#uses pyq
def getTickerHistoryFromWeb(ticker):
	try:
		data = pyq.get_yahoo_ticker_historical('20140114', time.strftime("%Y%m%d"),ticker)
	except:
		print 'could not find on web' + ticker
		return None
	#reverse list so that end is latest
	data.reverse() 
	#save only date and price
	chart = map((lambda l: {'date':l[1],'price':l[7]}),data)
	return chart

def formatTickers(prices):
	#strip out dates
	chart = map((lambda l: float(l['price'])),prices)
	return chart

def saveTickerHistory(ticker):
	toSave = getTickerHistoryFromWeb(ticker)
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

