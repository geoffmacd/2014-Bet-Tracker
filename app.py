from flask import Flask, render_template,url_for,redirect
from Price import Price

app = Flask(__name__)	

global prices
prices = []
prices.append(Price("oil","geoff","alex",1200,1300,1150))
prices.append(Price("gold","geoff","alex",1200,1300,1150))
prices.append(Price("nasdaq","geoff","alex",1200,1300,1150))
prices.append(Price("usdcad","geoff","alex",1200,1300,1150))
prices.append(Price("tsx","geoff","alex",1200,1300,1150))
prices.append(Price("dow","geoff","alex",1200,1300,1150))

@app.route('/')
def index():
   print prices
   return render_template('index.html',prices=prices)

@app.route('/data/<pricetype>')
def data(pricetype):
    return redirect(url_for('static', filename='data.tsv'))

if __name__ == '__main__':
    app.run(debug=True)