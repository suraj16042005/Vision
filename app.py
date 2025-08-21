from flask import Flask, render_template, request
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import yfinance as yf
import io
import base64

app = Flask(__name__, template_folder="templates", static_folder="static")

# ========== DATA PROCESSING & GRAPH GENERATION ==========
def generate_summary(data):
    return data.describe().to_html()

def generate_closing_price_plot(data):
    plt.figure(figsize=(12, 6))
    plt.gca().set_facecolor('white')
    plt.gcf().set_facecolor('white')
    plt.plot(data['Close'], label='Closing Price', linewidth=2, color='blue')
    plt.title('Closing Price Graph', color='white')
    plt.grid(True)
    plt.legend()
    plt.savefig('static/closing_price.png')
    plt.close()

def generate_ma_plot(data):
    plt.figure(figsize=(12, 6))
    plt.gca().set_facecolor('white')
    plt.gcf().set_facecolor('white')
    plt.plot(data['Close'], label='Closing Price', linewidth=2, color='blue')
    plt.plot(data['Close'].rolling(window=100).mean(), label='100 MA', linewidth=2, color='green')
    plt.plot(data['Close'].rolling(window=200).mean(), label='200 MA', linewidth=2, color='red')
    plt.title('Moving Averages Graph', color='white')
    plt.grid(True)
    plt.legend()
    plt.savefig('static/ma_price.png')
    plt.close()

def generate_prediction_plot(original, prediction):
    plt.figure(figsize=(12, 6))
    plt.gca().set_facecolor('white')
    plt.gcf().set_facecolor('white')
    plt.plot(original, label='Original Price', linewidth=2, color='blue')
    plt.plot(prediction, label='Predicted Price', linewidth=2, color='orange')
    plt.title('Prediction vs Original', color='white')
    plt.grid(True)
    plt.legend()

    # Save image in memory (for inline embedding)
    img = io.BytesIO()
    plt.savefig(img, format='png')
    plt.close()
    img.seek(0)
    return base64.b64encode(img.getvalue()).decode('utf8')

# ========== ROUTES ==========
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get-stock-data', methods=['GET'])
def get_stock_data():
    stock_name = request.args.get('stock_ticker').upper()

    # Fetch real data from Yahoo Finance
    try:
        data = yf.download(stock_name, period='7y')  # 7-year data
        if data.empty:
            return render_template('error.html', message="Invalid stock symbol or no data available.")
    except Exception as e:
        return render_template('error.html', message=f"Error fetching data: {str(e)}")
    print(data)

    # Generate graphs
    summary = generate_summary(data)
    generate_closing_price_plot(data)
    generate_ma_plot(data)

    # Prediction logic
    original_price = data['Close']
    predicted_price = data['Close'] * 1.066  #  prediction logic

    image_data = generate_prediction_plot(original_price, predicted_price)

    return render_template('result.html', summary=summary, image_data=image_data)

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signin')
def signup():
    return render_template('signin.html')

if __name__ == '__main__':
    app.run(debug=True, threaded=True)