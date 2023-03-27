#from crypt import methods
import os
import requests
from flask import Flask, jsonify, render_template, request, session
from flask_socketio import SocketIO, emit
from sqlalchemy import Null, true
#import eventlet
#eventlet.monkey_patch()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)
cl = []
ch = cl
d = {}

@app.route("/")
def index():
    print('index python')
    print(cl)
    return render_template("index.html", cl = cl)

@app.route("/channels", methods = ['GET', 'POST'])
def channels():
    return render_template("channel.html")

@app.route("/ChannelList", methods = ['GET', 'POST'])
def ChannelList():
    channel = request.form.get('newChannel')
    ChannelI = request.form.get('c')
    print('python')
    print(ChannelI)
    if(channel!=None):
        cl.append(channel)
    if (ChannelI not in d):
        return jsonify({"newList": cl})
    print('python')
    #print('python:', ChannelI)
    print(d[ChannelI])
    return jsonify({"newList": cl, 'ChatEntries': d[ChannelI]})

@app.route("/chat", methods = ['GET', 'POST'])
def chat():
    return render_template("chat.html")

@socketio.on("ChatEntry")
def chat(data):
    ChannelIn = data["channel"]

    if(ChannelIn not in d):
        d.update({ChannelIn: [{"text": data['text'], 'user': data['user']}]})
    else:
        d[ChannelIn].append({"text": data['text'], 'user': data['user']})

    print(d, 'hello from server')
    emit('DisplayText', {'dict': d[ChannelIn]}, broadcast=True)


app.run(debug=True)
#socketio.run(app,debug=True)
