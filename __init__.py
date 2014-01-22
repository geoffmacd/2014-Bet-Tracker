from flask import Flask, render_template,url_for,redirect,request,make_response
from bson import BSON,json_util
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

def performanceStr(fl):
	if fl > 0:
		result = '+' + str(fl)
	else:
		result = str(fl)
	return result

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
			performance = round((performance -1.00)* 100, 2) 
			#append normalized price
			totalP.append(map((lambda l: float(l/tChart[0]) - 1.00),tChart))
			#append
			t.append({'name':ticker.upper(),'performance':performanceStr(performance),'price':tChart[-1]})
		#sort tickers by performance
		t.sort(key=lambda k: float(k['performance']),reverse=True)
		#for each player total performance
		p['tickers'] = t
		p['performance'] = performanceStr(round(((tPerformance / len(player['tickers']))-1.00) * 100,2))
		#total daily performance, normalized to day 1
		#of size of the numbr of days
		total = [0]*len(totalP[0])
		for ticker in totalP:
			for i in range(len(totalP[0])):
				if i < len(ticker):
					total[i] += ticker[i] * 100 / len(totalP)
		p['chart'] = total
		a.append(p)
	#sort players by performance
	a.sort(key=lambda k: float(k['performance']),reverse=True)
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
		bookprice = tChart[0]
		marketprice = tChart[-1]
		performance = tChart[-1] / tChart[0] 
		tChart = map((lambda l: (float(l/tChart[0]) -1.00) *100),tChart)
		#calculate performance of each stock and then total
		tPerformance += performance
		performance = round((performance -1.00)* 100, 2) 
		#append
		t.append({'ticker':ticker['name'].upper(),'performance':performanceStr(performance),'chart':tChart, 'price': marketprice, 'startprice': bookprice})
	#sort tickers by performance
	t.sort(key=lambda k: float(k['performance']),reverse=True)
	#player total performance
	player['performance'] = performanceStr(round((tPerformance / len(player['tickers']) -1)* 100, 2)) 
	#append ticker array with full charts
	player['tickers'] = t
	return player

#gets more details on each player with all ticker charts
def getTicker(tickername):
	chart = indicescrape.getTickerHistory(tickername)
	if chart:
		ticker = {'ticker':tickername.upper(), 'chart': chart, 'price': chart[-1],'52low':min(chart), '52high':max(chart)}
		return ticker
	else:
		return None
	


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
	if stock is not None:
		resp = response(stock)
		return resp
	else:
		resp = badResponse()
		return resp	

#any route goes to index
@app.route('/')
def index():
	return render_template('index.html')

if __name__ == '__main__':
	# setupdb.run()
   	app.run(debug=False,port=80)
