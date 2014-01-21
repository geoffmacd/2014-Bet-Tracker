from pymongo import MongoClient
import indicescrape


client = MongoClient('localhost',27017)

# def clearPrices():
# 	db = client.priceData
# 	db.drop_collection(client.priceData.oil)
# 	db.drop_collection(client.priceData.nasdaq)
# 	db.drop_collection(client.priceData.tsx)
# 	db.drop_collection(client.priceData.dow)
# 	db.drop_collection(client.priceData.usdcad)
# 	db.drop_collection(client.priceData.gold)
# 	print "done 2"

# def clearBets():	
# 	db = client.bets
# 	db.drop_collection(client.bets.geoff)
# 	db.drop_collection(client.bets.alex)
# 	print "done 1"

# def initBets():
# 	dbG = client.bets.geoff
# 	dbG.insert({"name":"Geoff","price":125,"type":"oil"})
# 	dbG.insert({"name":"Geoff","price":900,"type":"gold"})
# 	dbG.insert({"name":"Geoff","price":3900,"type":"nasdaq"})
# 	dbG.insert({"name":"Geoff","price":1.05,"type":"usdcad"})
# 	dbG.insert({"name":"Geoff","price":15000,"type":"tsx"})
# 	dbG.insert({"name":"Geoff","price":16500,"type":"dow"})

# 	dbA = client.bets.alex
# 	dbA.insert({"name":"Alex","price":95,"type":"oil"})
# 	dbA.insert({"name":"Alex","price":1300,"type":"gold"})
# 	dbA.insert({"name":"Alex","price":4850,"type":"nasdaq"})
# 	dbA.insert({"name":"Alex","price":0.90,"type":"usdcad"})
# 	dbA.insert({"name":"Alex","price":14650,"type":"tsx"})
# 	dbA.insert({"name":"Alex","price":17500,"type":"dow"})
# 	print "done 3"

# def initPrices():
# 	l=indicescrape.getData()
# 	indicescrape.writeDB(l)
# 	print "done 4"

# def run():
# 	clearBets()
#     	clearPrices()
#     	initBets()
#     	initPrices()

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
