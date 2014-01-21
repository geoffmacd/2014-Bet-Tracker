from flask import Flask, render_template,url_for,redirect,request,make_response
from bson import BSON,json_util
from pymongo import MongoClient
import json
import setupdb
import indicescrape

app = Flask(__name__)
# app.config['SERVER_NAME'] = "alexvsgeoff.com"

client = MongoClient('localhost',27017)

def jd(obj):
    return json.dumps(obj, default=json_util.default)

def response(data={}, code=200):
    resp = data
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
		p = ({'name':player['name']})
		t = []
		totalP = []
		tPerformance = 0
		for ticker in player['tickers']:
			#find prices for tickers from db
			tChart = indicescrape.getTickerHistory(ticker)
			#calculate performance of each stock and then total
			performance = tChart[-1] / tChart[0]
			tPerformance += performance
			#append normalized price
			totalP.append(map((lambda l: float(l/tChart[0])),tChart))
			#append
			t.append({'name':ticker,'performance':performance,'price':tChart[-1]})
		#for each player total performance
		p['tickers'] = t
		p['performance'] = tPerformance / len(player['tickers'])
		#total daily performance, normalized to day 1
		#of size of the numbr of days
		total = [0]*len(totalP[0])
		for ticker in totalP:
			for i in range(len(totalP[0])):
				total[i] += ticker[i]
		p['chart'] = total
		a.append(p)
	#sort by performance
	# a.sort(key=lambda k: k['performance'])
	return a

#gets more details on each player with all ticker charts
def getPlayer(playername):
	a = getAllPlayers()
	player = {}
	#find player and rank
	for i in range(len(a)):
		if a[i]['name'] == playername:
			player = a[i]
			player['place'] = i + 1
			break
	t = []
	tPerformance = 0
	for ticker in player['tickers']:
		#find prices for tickers from db
		tChart = indicescrape.getTickerHistory(ticker['name'])
		#calculate performance of each stock and then total
		performance = tChart[-1] / tChart[0]
		tPerformance += performance
		#append
		t.append({'ticker':ticker['name'],'performance':performance,'chart':tChart, 'price': tChart[-1], 'startprice': tChart[0]})
	#player total performance
	player['performance'] = tPerformance / len(player['tickers'])
	#append ticker array with full charts
	player['tickers'] = t
	return player

#gets more details on each player with all ticker charts
def getTicker(tickername):
	collection = client.stocks[tickername]
	#return all prices
	prices = [tickPrice for tickPrice in collection.find()]
	#strip the dates out since we know this
	chart = map((lambda l: float(l['price'])),prices)
	print chart
	if len(chart) > 0:
		ticker = {'ticker':tickername, 'chart': chart, 'price': chart[-1],'52low':min(chart), '52high':max(chart)}
		return ticker

@app.route('/data/players')
def apiplayers():
	a = getAllPlayers()
	resp = response(a)
	return resp

@app.route('/data/players/<playername>')
def apiplayer(playername):
	player = getPlayer(playername)
	resp = response(player)
	return resp

@app.route('/data/quotes/<tickername>')
def apiticker(tickername):
	print 'requesting stock price ' + tickername
	stock = getTicker(tickername)
	resp = response(stock)
	return resp

#any route goes to index
@app.route('/')
def index():
	return render_template('index.html')

if __name__ == '__main__':
	# setupdb.run()
   	app.run(debug=True,port=8000)
