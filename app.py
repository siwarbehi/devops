from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return "Bienvenue sur mon projet Flask !"

@app.route('/about')
def about():
    return "À propos de cette application."

if __name__ == '__main__':
    app.run(debug=True)
 
