from flask import Flask, render_template,url_for,redirect,request,make_response
from bson import BSON,json_util
from Price import Price
from pymongo import MongoClient
import json
import setupdb

app = Flask(__name__)	
app.config['SERVER_NAME'] = "jogit.io"


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

  

def getCurPrice(pricetype):
	collectionName = pricetype
	print "Requested current " + pricetype + " price"
	db = client.priceData 
	collections = db.collection_names()
	if collectionName in collections:
		collection = db[collectionName]
		print collection
		#find this pricetype by date ranging back to Dec12013
		for doc in collection.find().sort("date",-1):
			#return immediately with price
			print doc
			return doc['price']
	else:
		return None

@app.route('/')
def index():
	dbG = client.bets.geoff
	dbA = client.bets.alex
	betsG = [doc for doc in dbG.find()]
	print betsG
	bets = []
	for betG in betsG:
		pricetype = betG["type"]
		print pricetype
		betA = dbA.find_one({"type":pricetype})
		if betA:
			dbPrice = client
			curPrice = getCurPrice(pricetype)
			print curPrice
			p = Price(pricetype,curPrice,{"name":"Geoff","bet":betG["price"]},{"name":"Alex","bet":betA["price"]})
			bets.append(p)
		else:
			continue
	return render_template('index.html',prices=bets)

@app.route('/data/<pricetype>')
def data(pricetype):
	#name will be same as collection
	collectionName = pricetype
	print "Requested " + pricetype + " data"
	db = client.priceData 
	collections = db.collection_names()
	if collectionName in collections:
		collection = db[collectionName]
		#find this pricetype by date ranging back to Dec12013
		data = [doc for doc in collection.find({"date": {"$gt": 20131201}})]
		# only need price and date
		data = map((lambda d: { "price" : d['price'], "date":d['date']}), data)
		print data[0:2]
		resp = response(data)
		return resp
	else:
		print "bad request for data" + pricetype
		return badResponse()


if __name__ == '__main__':
	setupdb.run()
   	app.run(debug=False,port=80)
