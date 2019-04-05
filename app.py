import re
from flask import Flask, jsonify, render_template, request


app = Flask(__name__)


@app.route('/operation', methods=["POST"])
def calculate():
    num1 = request.form['number1']
    op = request.form['operator']
    num2 = request.form['number2']
    
    result = 1
    if op == '+':
          result = int(num1) + int(num2);
   
    if op == '-':
          result = int(num1) - int(num2);

    if op == '*':
          result = int(num1) * int(num2);

    if op == '/':
          result = int(num1) / int(num2);

    return jsonify(result=result)


@app.route('/')
def index():
    return render_template('index.html')
	
@app.route('/application')
def index1():
    return render_template('application.html')


if __name__ == '__main__':
    app.run()
