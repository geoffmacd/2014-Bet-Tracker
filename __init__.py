from flask import Flask, render_template,url_for,redirect,request,make_response
from bson import BSON,json_util
from Price import Price
from pymongo import MongoClient
import json
import setupdb
import indicescrape

app = Flask(__name__)
app.config['SERVER_NAME'] = "alexvsgeoff.com"


client = MongoClient('localhost',27017)

def jd(obj):
    return json.dumps(obj, default=json_util.default)

def response(data={}, code=200):
    resp = {
        "data" : data
    }
    response = make_response(jd(resp))
    response.headers['Status Code'] = 200
    response.headers['Content-Type'] = "application/json"
    return response

def badResponse(code=400):
    resp = {
        "err" : "bad price type"
    }
    response = make_response(jd(resp))
    response.headers['Status Code'] = 400
    response.headers['Content-Type'] = "application/json"
    return response

#gets all players with all their tickers and total portfolio chart
def getAllPlayers():
	collection = client.players.players
	players = collection.find()
	a = []
	for player in players:
		a.append({'name':player.name})
		t = []
		totalP = []
		for ticker in player.tickers:
			#find prices for tickers from db
			tChart = indicescrape.getTickerHistory(ticker)
			#calculate performance of each stock and then total
			performance = tChart[-1] / tChart[0]
			tPerformance += performance
			#append normalized price
			totalP.append(map((lambda l: float(l/tChart[0])),tChart))
			#append
			t.append({'name':ticker.ticker,'performance':performance,'price':tChart[-1]})
		#for each player total performance
		a['tickers'] = t
		a['performance'] = tPerformance / len(player.tickers)
		#total daily performance, normalized to day 1
		#of size of the numbr of days
		total = [0]*len(totalP[0])
		for ticker in totalP:
			for i in range(totalP[0]):
				total[i] += ticker[i]
		a['chart'] = total
	#sort by performance
	a.sort(key=lambda k: k['performance'])
	return a

#gets more details on each player with all ticker charts
def getPlayer(playername):
	a = getAllPlayers()
	player = {}
	#find player and rank
	for i in range(len(a)):
		if a[i] == playername:
			player = a[i]
			player['place'] = i + 1
			break
	t = []
	for ticker in player.tickers:
		#find prices for tickers from db
		tChart = indicescrape.getTickerHistory(ticker)
		#calculate performance of each stock and then total
		performance = tChart[-1] / tChart[0]
		#append
		t.append({'ticker':ticker.ticker,'performance':performance,'chart':tChart, 'price': tChart[-1], 'startprice': tChart[0]})
	#player total performance
	player['performance'] = tPerformance / len(player.tickers)
	#append ticker array with full charts
	player['tickers'] = t
	return player

#gets more details on each player with all ticker charts
def getTicker(tickername):
	collection = client.stocks.tickername
	if collection in client.stocks.collection_names():
		#return all prices
		prices = [tickPrice for tickPrice in collection.find()]
		#strip the dates out since we know this
		chart = map((lambda l: float(l['price'])),prices)
		ticker = {'ticker':tickername, 'chart': chart, 'price': chart[-1],'52low':min(chart), '52high':max(chart)}
		return ticker
	else 
		return None


@app.route('/data/players')
def apiplayers():
	a = getAllPlayers()
	resp = response(data)
	return resp

@app.route('/data/players/<playername>')
def apiplayer(playername):
	player = getPlayer(playername)
	resp = response(data)
	return resp

@app.route('/data/quotes/<tickername>')
def apiticker(tickername):
	player = getTicker(tickername)
	resp = response(data)
	return resp

# def getCurPrice(pricetype):
# 	collectionName = pricetype
# 	print "Requested current " + pricetype + " price"
# 	db = client.priceData
# 	collections = db.collection_names()
# 	if collectionName in collections:
# 		collection = db[collectionName]
# 		print collection
# 		#find this pricetype by date ranging back to Dec12013
# 		for doc in collection.find().sort("date",-1):
# 			#return immediately with price
# 			print doc
# 			p = doc['price']
# 			print p
# 			if p < 1:
# 				result = round(p,3)
# 			elif p < 10:
# 				result = round(p,2)
# 			elif p < 100:
# 				result = round(p,1)
# 			else:
# 				result = int(p)
# 			return result
# 	else:
# 		return None

#any route goes to index
@app.route('/<path:path>')
@app.route('/')
def index():
	return render_template('index.html')

# @app.route('/data/<pricetype>')
# def data(pricetype):
# 	#name will be same as collection
# 	collectionName = pricetype
# 	print "Requested " + pricetype + " data"
# 	db = client.priceData
# 	collections = db.collection_names()
# 	if collectionName in collections:
# 		collection = db[collectionName]
# 		#find this pricetype by date ranging back to Dec12013
# 		data = [doc for doc in collection.find({"date": {"$gt": 20131201}})]
# 		# only need price and date
# 		data = map((lambda d: { "price" : d['price'], "date":d['date']}), data)
# 		print data[0:2]
# 		resp = response(data)
# 		return resp
# 	else:
# 		print "bad request for data" + pricetype
# 		return badResponse()


if __name__ == '__main__':
	setupdb.run()
   	app.run(debug=False,port=80)
