import requests
from grandpyApp.api_key import API_KEY

class Grandpy():
    """ Bot process """

    def __init__(self, parsed_content):
        
        self.search_string = parsed_content

        #GMAP
        self.id = None
        self.address = None
        self.place_id = None
        self.name = None
        self.location = None

        #MEDIAWIKI
        self.page_id = None
        self.description = None

        #Succeed of failed
        self.gmap_failed = False
        self.wiki_failed = False

        self.res = []


    def compil_data(self):
        """ Start all requests and return result """

        self.gmap_call()
        self.wiki_find_page()
        self.wiki_call()

        try:
            print("\n" + self.name + "\n")
            print(self.address + "\n")
            print(self.description + "\n\n")
        except:
            pass


        self.res.append(self.name)
        self.res.append(self.address)
        self.res.append(self.description)
        self.res.append(self.location)
        self.res.append(self.id)

        return self.res

    def gmap_call(self):
        """ Request gmap API """

        url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?"

        try:
            payload = {
                "input"     : self.search_string,
                "inputtype" : 'textquery',
                "fields"    : 'formatted_address,place_id,name,geometry',
                "key"       : API_KEY
            }

            data = requests.get(url, params=payload)
            
            data = data.json()
            self.address = data['candidates'][0]['formatted_address']
            self.place_id = data['candidates'][0]['place_id']
            self.name = data['candidates'][0]['name']
            self.location = data["candidates"][0]['geometry']['location']
            self.id = self.name.replace(" ", "_") + "_map"

        except:
            self.gmap_failed = True
            print("ERROR: gmap_call() failed.")
            pass

    def wiki_find_page(self):
        """ Define the MediaWiki page with by title """
        
        url = "http://fr.wikipedia.org/w/api.php"

        try:
            payload = {
                    'action'    : 'query',
                    'format'    : 'json',
                    'titles'    : self.search_string,
                }

            data = requests.get(url=url, params=payload)
            data = data.json()
            print(data)
        
            pages = data['query']['pages']
            
            for page in pages: # Get only the first element
                self.page_id = pages[page]['pageid']
                break

        except:
            self.wiki_failed = True
            print("ERROR: Wiki_find_page() failed.")
            pass

    def wiki_find_page_from_coord(self):
        """ Define the MediaWiki page by coordinates """

        url = "http://fr.wikipedia.org/w/api.php"

        try:
            coord = str(self.location['lat']) + "|" + str(self.location['lng'])

            payload = {
                    'list'      : 'geosearch',
                    'action'    : 'query',
                    'format'    : 'json',
                    'gsradius'  : 500,
                    'gscoord'   : coord
                }

            data = requests.get(url=url, params=payload)
            data = data.json()
            print(data)
            
            self.page_id = data['query']['geosearch'][0]['pageid']

        except:
            self.wiki_failed = True
            print("ERROR: Wiki_find_page_from_coord() failed.")
            pass


    def wiki_call(self):
        """ Extract content from page MediaWiki """
        
        url = "http://fr.wikipedia.org/w/api.php"

        try:
            payload = {
                'action'        : 'query',
                'format'        : 'json',
                'prop'          : 'extracts',
                'pageids'        : self.page_id,
                'formatversion' : '2',
                'ascii'         : '1',
                'exsentences'   : '4', # number of sentences to extract
                'exlimit'       : '1',
                'explaintext'   : 1
            }

            data = requests.get(url=url, params=payload)
            data = data.json()
            print()
            print(data)

            self.description = data['query']['pages'][0]['extract']

        except:
            self.wiki_failed = True
            print("ERROR: Wiki_call() failed.")
            pass


if __name__ == "__main__":
    gp_test = Grandpy(["Tour Eiffel"])