from flask import Flask, render_template,url_for,redirect,request,make_response
from bson import BSON,json_util
from Price import Price
from pymongo import MongoClient
import json

app = Flask(__name__)	

global prices
prices = []
prices.append(Price("oil","geoff","alex",1200,1300,1150))
prices.append(Price("gold","geoff","alex",1200,1300,1150))
prices.append(Price("nasdaq","geoff","alex",1200,1300,1150))
prices.append(Price("usdcad","geoff","alex",1200,1300,1150))
prices.append(Price("tsx","geoff","alex",1200,1300,1150))
prices.append(Price("dow","geoff","alex",1200,1300,1150))

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

@app.route('/')
def index():
   print prices
   return render_template('index.html',prices=prices)

@app.route('/data/<pricetype>')
def data(pricetype):
	#name will be same as collection
	collectionName = pricetype
	print "Requested " + pricetype + " data"
	client = MongoClient('localhost',27017)
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
    app.run(debug=True)