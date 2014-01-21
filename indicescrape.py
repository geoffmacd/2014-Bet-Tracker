import pyq
import datetime,time
from pymongo import MongoClient
# from datetime import datetime

client = MongoClient('localhost',27017)

# Gets 2014 stock history with price values
def getTickerHistory(ticker):

	collection = client.stocks.ticker
	if collection in client.stocks.collection_names():
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


# def writeDB(l):
# 	db = client.stocks
# 	firstLine = l[0]
# 	# start at first price not date
# 	for i in range(len(firstLine)):
# 		if i == 0:
# 			continue 
# 		#name of collection is in the first line of generated list
# 		print "inserting to " + firstLine[i]
# 		pricesC = db[firstLine[i]]
# 		print pricesC
# 		#only add unique dates
# 		t = l[1:]
# 		for row in t:
# 			date = row[0]
# 			print "trying date " + str(date)
# 			prev = pricesC.find_one({"date":date})
# 			print prev
# 			if not prev:
# 				# insert otherwise
# 				pricesC.insert({"date":row[0],"price":row[i]})
# 				print "inserted : " + str(row[i]) + " on " + str(row[0])


# def getData():
# 	#indices
# 	l1 = pyq.get_yahoo_ticker_historical('20131202', time.strftime("%Y%m%d"),'^DJI')
# 	l2 = pyq.get_yahoo_ticker_historical('20131202', time.strftime("%Y%m%d"),'^GSPTSE')
# 	l3 = pyq.get_yahoo_ticker_historical('20131202', time.strftime("%Y%m%d"),'^IXIC')
# 	dates = map((lambda l: int(l[1])),l1)
# 	r1 = map((lambda l: float(l[2])),l1)
# 	r2= map((lambda l: float(l[2])),l2)
# 	r3 = map((lambda l: float(l[2])),l3)
# 	#currency
# 	l4 = pyq.get_oanda_fxrate('20131202', time.strftime("%Y%m%d"),'CADUSD=X')
# 	r4 = map((lambda l: float(l[2])),l4)
# 	#oil
# 	url = 'http://www.ofdp.org/continuous_contracts/data?exchange=NYM&symbol=CL&depth=1'
# 	r = requests.get(url)
# 	data = r.text
#  	soup = BeautifulSoup(data)

# 	rows = soup.find_all('tr')
# 	targetstart = '2013-12-02'
# 	k=0
# 	cells = soup.find_all('td')
# 	for i in range(len(rows)):
# 		if str(cells[i * 7].text) == targetstart:
# 			#found start date
# 			k = i
# 			break
# 	print k
# 	l5 = []
# 	for i in range(k):
# 		l5.append(float(str(cells[((k-i) * 7) + 4].text)))
# 	#gold
# 	r = requests.get('http://www.galmarley.com/prices/prices.json?callback=jQuery19106167615607846528_1388903931429&noCache=1388904020916&version=v2&chartType=CHART_POINTS&securityId=AUX&valuationSecurityId=USD&interval=172800&batch=Full&_=1388903931430')
# 	i = r.text[41:].split(');')[0]
# 	data = json.loads(i)
# 	#sort array looking for jan1
# 	k = 0
# 	for i in range(len(data['seriesData']['prices'])):
# 		if data['seriesData']['prices'][i]['latestPrice'] == 39804.79:
# 			k = i
# 			break
# 	print k
# 	l6 = []
# 	for i in range(k):
# 		l6.append(data['seriesData']['prices'][k-i]['latestPrice']/32.1507466)	

# 	result = [['date','dow','tsx','nasdaq','usdcad','oil','gold']]
# 	for i in range(min(len(l6),len(l5))):
# 		result.append([dates[i],r1[i],r2[i],r3[i],r4[i],l5[i],l6[i]])

# 	for i in range(len(result)):
# 		print result[i] 

# 	return result


# if __name__ == '__main__':
#     l= getData()
#     writeDB(l)
