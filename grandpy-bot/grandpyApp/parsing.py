import json
from os import getcwd


def json_load(path):
    with open(path, "r") as file:
        data = json.load(file)

    return data


def parse_text(string):
    stop_words = json_load(getcwd() + "/grandpyApp/stopwords/stop_words.json")

    raw = string.split()
    tmp = []

    stop_chars = ["?","!",".",":",";",]

    for word in raw:
        word = word.lower()
        insert = True
        
        print("process :" + word)
        for stop in stop_words:
            
            if word == stop:
                insert = False
                break

        for char in stop_chars:

            if word == char: 
                insert = False
                break

        if insert:
            tmp.append(word.capitalize())

    sep = " "
    res = sep.join(tmp)

    print(res)
    return res
                

if __name__ == "__main__":
    print(parse_text("tu sais où se trouve la toUr EiFfel ?"))