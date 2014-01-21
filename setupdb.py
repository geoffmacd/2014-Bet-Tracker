from pymongo import MongoClient
import indicescrape

client = MongoClient('localhost',27017)

def scrapeStocks():
	collection = client.players.players
	players = collection.find()
	for player in players:
		#scrape each persons stocks
		print player
		for ticker in player['tickers']:
			indicescrape.saveTickerHistory(ticker)
			print "scraped " + ticker

	print "finished"

def initPlayers():
	dbc = client.players.players
	dbc.insert({"name":"Geoff","tickers":['MFC','SU','POT','RCI','AMZN','CRM','LULU','TGT','JPM']})
	dbc.insert({"name":"Alex","tickers":['ARE','GIL','PJC','BAC','BA','BBBY','PKG','GOOG']})
	dbc.insert({"name":"Steve","tickers":['GPS','DOL','PCLN','SWI','PII','BWLD','TSLA']})
	print "done 2"

def dropAll():
	#drop stocks
	db = client.stocks
	collections = db.collection_names()
	for collectionName in collections:
		if collectionName != 'system.indexes':
			db.drop_collection(collectionName)
	#drop players
	db = client.players
	db.drop_collection(db.players)
	print "done 1"

def run():
	dropAll()
	initPlayers()
	scrapeStocks()

if __name__ == '__main__':
	run()
