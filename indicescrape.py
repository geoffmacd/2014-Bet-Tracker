#!/usr/bin/env python

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
			chart = formatTickers(webFormat,ticker)
		else:
			return None
	return chart

#uses db
def getTickerHistoryFromDb(ticker):
	#convert ticker to candian if necessary
	ticker = ticker.replace('.TO','-TO')
	collection = client.stocks[ticker]
	#return all prices
	prices = [tickPrice for tickPrice in collection.find()]
	#strip the dates out since we know this
	chart = formatTickers(prices,ticker)
	return chart

#uses pyq
def getTickerHistoryFromWeb(ticker):
	try:
		data = pyq.get_yahoo_ticker_historical('20140116', time.strftime("%Y%m%d"),ticker)
	except:
		print 'could not find on web' + ticker
		return None
	#reverse list so that end is latest
	data.reverse() 
	#save only date and price
	chart = map((lambda l: {'date':l[1],'price':l[5]}),data)
	return chart

def usDefault():
	ticker = 'GOOG'
	collection = client.stocks[ticker]
	#return all prices
	stock = [tickPrice for tickPrice in collection.find()]
	return stock

def cadDefault():
	ticker = 'DOL-TO'
	collection = client.stocks[ticker]
	#return all prices
	stock = [tickPrice for tickPrice in collection.find()]
	return stock

def formatTickers(prices,ticker):
	#decide to insert duplicate data for holidays
	if ticker.find('TO') > 0:
		oppStock = usDefault()
	else:
		oppStock = cadDefault()
	dateMap = map((lambda l: l['date']), oppStock)
	curDateMap = map((lambda l: l['date']), prices)
	# print ticker
	for (count,date) in enumerate(dateMap):
		#if does not exist in us or cad stock insert 0
		try:
			curDateMap.index(date)
		except Exception, e:
			#insert duplicate price
			if count > 0 and count <= len(prices):
				toInsert = {'date': date, 'price' : prices[count-1]['price']}
				# print 'inserting missing date' + date
				prices.insert(count, toInsert)
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
	ticker = ticker.replace('.TO','-TO')
	db = client.stocks
	collection = db[ticker]
	db.drop_collection(collection)
	for idx,price in enumerate(data):
		if(ticker == 'BAD-TO' and idx > 5):
                	collection.insert(price*3)
                else:
                	collection.insert(price)

