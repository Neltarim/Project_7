import json
from os import getcwd


def json_load(path):
    """Quick load from json file."""
    with open(path, "r") as file:
        data = json.load(file)

    return data


def parse_text(string):
    """Kill every stop words and whitespaces"""

    #Stop words list path
    stop_words = json_load(getcwd() + "/grandpyApp/stopwords/stop_words.json")

    raw = string.split() #Split every words from string
    tmp = []

    whitespaces = ["?","!",".",":",";",]

    for word in raw: # Browse every words from raw
        word = word.lower() #Prevent uppercase
        insert = True #If the word can be inserted
        
        print("process :" + word)
        for stop in stop_words: # Browse stop_words
            
            if word == stop:
                insert = False #Don't insert it
                break

        for char in whitespaces: # Browse whitespaces

            if word == char: 
                insert = False #Don't insert it
                break

        if insert: #The word can be inserted
            tmp.append(word.capitalize())

    #Back to string
    sep = " "
    res = sep.join(tmp)

    print(res)
    return res
                

if __name__ == "__main__":
    print(parse_text("tu sais où se trouve la toUr EiFfel ?"))