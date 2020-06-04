import tweepy, psycopg2, os, json, datetime, sys, requests, time
import pandas as pd




f = open("sosagua.txt", "a")
#connstr para bd
#dev str
conn_string = "host='localhost' dbname='sosguate' user='postgres' password='Guatemala1'"



#produccion str
#conn_string = "host='localhost' dbname='sosguate' user='postgres' password='postgres2020!Incyt'"



'''
HERLICH STEVEN GONZALEZ ZAMBRANO 2020 --> EN CUARENTENA MUNDIAL
API key:
bCgXMvHfVr1f86jrcwJSIbfyU
API secret key:
UUYjGwM63n6UvZMPTmfZG0yUq5eDm2PE5747F0xht71pgr2g8v
access token
1432847989-W3qw9szAWWP0VxsPpEsvVZX6igJjrVJzUZrrgYY
access token secret
332CPmsifvklzEK33F99flSAde5zz71fCiaz4V1P6qYIs
'''

# estos valores se dan al habilitar el servicio de tweeter de la cuenta.
cfg = { 
  "consumer_key"        : "bCgXMvHfVr1f86jrcwJSIbfyU",
  "consumer_secret"     : "UUYjGwM63n6UvZMPTmfZG0yUq5eDm2PE5747F0xht71pgr2g8v",
  "access_token"        : "1432847989-W3qw9szAWWP0VxsPpEsvVZX6igJjrVJzUZrrgYY",
  "access_token_secret" : "332CPmsifvklzEK33F99flSAde5zz71fCiaz4V1P6qYIs" 
  }

#****************************************FASE 1 *******************************************

'''

update pg_database set encoding=8 where datname='sosagua';
update pg_database set encoding = pg_char_to_encoding('UTF8') where datname = 'sosagua'
	
create table public.fase1(
	fecha timestamp without time zone primary key DEFAULT now(),
	textjson text not null ,
)


create table cubo1(
	municipio numeric not null,
	necesidad numeric not null,
	mes	text	 null,
	ano text	 null,
	contador numeric  null
)

'''


#instalar el paquete de la siguiente forma:  pip install tweepi
def get_api(cfg):
  auth = tweepy.OAuthHandler(cfg['consumer_key'], cfg['consumer_secret'])
  auth.set_access_token(cfg['access_token'], cfg['access_token_secret'])
  return tweepy.API(auth)

def sendTwitt():
  try:
      api = get_api(cfg)
      tweet = "Hello, world! msg from an py app"
      status = api.update_status(status=tweet) 
  except:
      write("twitt not send")


class msg:
  def __init__(self, created_at, id, id_str, text, entities, metadata, source, user):
    self.created_at = created_at
    self.id = id
    self.id_str = id_str
    self.text = text
    self.entities = entities
    self.metadata = metadata
    self.source = source
    self.user = user
  


def postMethod(objeto):
    #url = "http://localhost:3000/incyt/api/sosagua/createalerts"
    url = "https://arcgis-web.url.edu.gt/incyt/api/sosagua/createalerts"
    headers = {'content-type': 'application/json'}
    response = requests.post(url, data = json.dumps(objeto), headers=headers)
    
    #print(response.status_code)
    if response.status_code == 201:
        print('Success!')
    else : #response.status_code == 404:
        print('algo terrible ha ocurrido')
    return response.status_code



def getTweets(search_words,date_since,number):
  try:
      api = get_api(cfg)
      places = api.geo_search(query="GUATEMALA", granularity="country")
      place_id = places[0].id
      #print('*******************')
      #print(places)
      #print('*******************')
      #print(place_id)
      searchPlace = "place:%s" % place_id
      tweets = tweepy.Cursor(api.search,
                  #q=searchPlace + ' ' + search_words,
                  q=search_words,           
                  #lang="es",
                  since=date_since).items(number)
      # Iterate and print tweets
      
      for item in tweets:
        try:
            s = item#este es el string
            mined = {
                            "id":              item.id,
                            "name":            item.user.name,
                            "screen_name":     item.user.screen_name,
                            "retweet_count":   item.retweet_count,
                            "text":            convUTF8(item.text),
                            "location":        convUTF8(item.user.location),
                            "coordinates":     str(item.coordinates),
                            "geo_enabled":     str(item.user.geo_enabled),
                            "geo":             str(item.geo),
                            "created_at":      str(item.created_at),
                            "favorite_count": item.favorite_count,
                            "hashtags":        item.entities['hashtags'],
                            "status_count":    item.user.statuses_count,
                            "place":           convUTF8(item.place),
                            "source":          item.source,
                            "locationId":      0,
                            "necesidadId":     0
                        }
            postMethod(mined)
        except:
            write("un json viene malformado")
  except:
      write("getTweets error")


def getProcessDate():
    try:

        from datetime import date
        today = date.today()
        yesterday = today - datetime.timedelta(days=1)
        return yesterday
    except:
        write("error en getProcessDate")
        
def convUTF8(cadena):
    try:
        return str(cadena).replace("á","a").replace("é","e").replace("í","i").replace("ó","o").replace("ú","u").replace("ñ","n").replace("Á","A").replace("É","E").replace("Í","I").replace("Ó","O").replace("Ú","U").replace("Ñ","Ñ")
    except:
        return cadena


#****************************FASE 2******************************************

'''

create table public.necesidad(
        id SERIAL PRIMARY KEY,
	descripcion text not null
	
);

create table public.sinonimos(
        necesidad numeric,
        sinonimo text not null unique
	
);



'''

def write(cadena):
    try:
        print(cadena)
        f.write(str(cadena) + '\n')
    except:
        print("could not write")


def getHashtags():
    hashtags = []
    try:
        write('getting hashtags')
        conn = psycopg2.connect(conn_string)

        # conn.cursor will return a cursor object, you can use this cursor to perform queries
        cursor = conn.cursor()
        cursor.execute('select * from hashtags')
        rows = cursor.fetchall()
    
        for row in rows:
            hashtags.append(row[1])

        conn.close()

    except:
        write("error en getLocation")
    return hashtags


def getLocation():
    try:
        from psycopg2.extras import RealDictCursor
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("select cast(id as text), pais,departamen_1,municipi_1,cast(point_x as text),cast(point_y as text) from public.municipios")
        l = json.dumps(cursor.fetchall(),indent = 2)
        conn.close()
        return l
    except:
        write("error en getLocation")

def ejecutaComandoPsql(query):
    try:
        #print(query)
        conn = psycopg2.connect(conn_string)
        cursor = conn.cursor()
        cursor.execute(query)
        conn.commit()
        conn.close()
    except:
        write("error en ejecutar comando psql")

def searchHashtag(message):
    message = message.upper()
    print(message)
    ht = ''
    for m in hashtags:
        if (m in message):
            print(True, m)
            ht = ht + ' ' + m
    return ht


def getDataSMS(fecha):
    #data = pd.read_json('https://arcgis-web.url.edu.gt/incyt/api/sms/getSMS?fecha=2020-05-13')
    data = pd.read_json('https://arcgis-web.url.edu.gt/incyt/api/sms/getSMS?fecha=' + str(fecha))    
    return data

def insertSMS(sms):
    print('*********')
    for index, row in sms.iterrows():
        ht = searchHashtag(row.sms['body'])
        
        #print(row.sms['_id'])
        mined = {
                            "id":              row.sms['_id'],
                            "name":            row.sms['address'],
                            "screen_name":     row.sms['address'],
                            "retweet_count":   row.sms['date'],
                            "text":            convUTF8(row.sms['body']),
                            "location":        "[SMS]",
                            "coordinates":     "[0,0]",
                            "geo_enabled":     "false",
                            "geo":             "false",
                            "created_at":      row.sms['date'],
                            "favorite_count":  row.sms['date'],
                            "hashtags":        ht,
                            "status_count":    row.sms['read'],
                            "place":           "[SMS]",
                            "source":          "SMS",
                            "locationId":      0,
                            "necesidadId":     0
                        }
        print(mined)
        if (len(ht)>0):
          postMethod(mined)#SMS APPROVED, HASHTAG FOUND


nTwits = 50000
fecha = getProcessDate()
hashtags = getHashtags()


if __name__ == "__main__":

  write("*************************************************************")
  write(fecha)

  write("FASE 1.0 --> CONECTANDO A TWITTER PARA EXTRAER TWITS DEL DIA")
  
  for x in hashtags:
      write(x)
      try:
          getTweets(x,str(fecha),nTwits)
      except:
          write("error en for de los hashtags, se procede a las fases")

  write("adquiriendo SMS")
  insertSMS(getDataSMS(fecha))
  
  write('FASE 1.2 --> AGREGANDO COORDENADAS DE MUNICIPIOS AL QUERY')
  query = "update fase1  set municipio = m1.id from  municipios m1 where lower(fase1.textjson) like '%' || lower(m1.departamen_1) || '%' and fase1.municipio = 0  and fase1.fecha > '" + str(fecha) + " 00:00:00' "
  ejecutaComandoPsql(query)

  write('FASE 1.3 --> BUSCANDO PALABRAS CLAVE PARA CLASIFICACION')

  query = "update fase1  set municipio = m1.id from  municipios m1 where lower(fase1.textjson) like '%' || lower(m1.municipi_1) || '%'  and fase1.municipio = 0  and fase1.fecha > '" + str(fecha) + " 00:00:00' "
  ejecutaComandoPsql(query)

  write('FASE 1.5 --> actualizando necesidades a tabla fase1')
  query = "update fase1  set necesidad = s1.necesidad from  sinonimos s1 where lower(fase1.textjson) like '%' || lower(s1.sinonimo) || '%'  and extract(MONTH from FECHA) = extract(MONTH from now()) and extract(YEAR from FECHA) = extract(YEAR from now())"
  ejecutaComandoPsql(query)

  write('FASE 1.5 --> borrando datos del mes y ano actual de tabla cubo1')
  query = "delete from cubo1 where cast (mes as numeric) = extract(MONTH from now()) and cast (ano as numeric) = extract(YEAR from now()) "
  ejecutaComandoPsql(query)

  write('FASE 1.6 --> borrando datos del mes y ano actual de tabla cubo1')
  query = "insert into cubo1 (municipio,necesidad,mes,ano,contador) select municipio, necesidad, extract(MONTH from FECHA),extract (YEAR from FECHA), count(*) from fase1 WHERE extract(MONTH from FECHA) = extract(MONTH from now()) and extract(YEAR from FECHA) = extract(YEAR from now())  group by municipio, necesidad,  extract(MONTH from FECHA), extract(YEAR from FECHA) "
  ejecutaComandoPsql(query)

  write("proceso terminado")
  f.close()

