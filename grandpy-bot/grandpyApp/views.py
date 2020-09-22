import os
from flask import Flask, render_template, request, jsonify, send_from_directory
from grandpyApp.grandpy import Grandpy
from grandpyApp.parsing import parse_text

app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'mdb-favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/api/answer', methods=['GET'])
def grandpy_answer():

    parsed = parse_text(request.args.get("str"))
    gp = Grandpy(parsed)

    result = {
            "status": 200,
            "answer": gp.compil_data(),
            "API_fails": {
                "gmap": gp.gmap_failed,
                "wiki": gp.wiki_failed
            }
        }

    return jsonify(result)

#if __name__ == "__main__":
#    app.run()