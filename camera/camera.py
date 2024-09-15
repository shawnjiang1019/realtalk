from playsound import playsound
import cv2

import speech_recognition as sr

from openai import OpenAI
from PIL import Image
from PIL import PngImagePlugin
from flask import Flask, request, redirect, url_for, jsonify
from convex import ConvexClient
from PIL import Image as im 
import cohere
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()
secret_key = os.getenv('OPENAI')
openAIclient = OpenAI(api_key=secret_key)

genai.configure(api_key=os.getenv('GENAI'))
co = cohere.Client(api_key=os.getenv('COHERE'))
client = ConvexClient(os.getenv('CONVEX'))

app = Flask(__name__)

# Open a connection to the webcam

#have script running on a different endpoint, once the keyword is spoken redirt to the camera end point
#as a post request and return labels

@app.route('/decision1', methods=['GET', 'POST'])

def action():
    r = sr.Recognizer() 
    while(1):    
        try:
            with sr.Microphone() as source2:
                
                r.adjust_for_ambient_noise(source2, duration=0.1)
                
                audio2 = r.listen(source2)
                
                # Using google to recognize audio
                MyText = r.recognize_google(audio2)
                MyText = MyText.lower()
    
                print("Did you say ",MyText)
                #SpeakText(MyText) For audio to text
                if 'hey real talk' in MyText:
                    PlayFile("greeting.mp3")
                    
                    r.adjust_for_ambient_noise(source2, duration=0.1)
                    audio2 = r.listen(source2)

                    MyText = r.recognize_google(audio2)
                    MyText = MyText.lower()
                    if 'translate' in MyText:
                        print('We are in the if statement')
                        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
                        prompt1 = "Give me a 'yes' or 'no' response as to whether or not the text wants to translate something. GIVE ME ONLY A YES OR NO RESPONSE"
                    
                        response1 = model.generate_content([prompt1, MyText])
                        print(response1.text)
                        if 'y' in response1.text.lower():
                            PlayFile("translate.mp3")
                            prompt2 = "Give me the two letter iso code for the language to translate to only return 2 characters that are the iso code, NOTHING ELSE, NO MARKDOWN"
                            response2 = model.generate_content([prompt2, MyText])
                            return redirect(url_for('camera', response2=response2.text))
                    
        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))
            
        except sr.UnknownValueError:
            print("unknown error occurred")

    


@app.route('/camera', methods=['GET', 'POST'])
def camera():
    if request.method == 'GET':
        language = request.args.get('response2')    
        language = language.replace("%0A", "")
        language = language.replace("\n", "")
        language = language.replace(" ", "")

        # Open the camera
        cap = cv2.VideoCapture(1)
        cap = cv2.VideoCapture(1)

        if not cap.isOpened():
            return jsonify({"error": "Could not open camera."}), 500

        # Capture a single frame
        ret, frame = cap.read()

        if not ret:
            cap.release()
            return jsonify({"error": "Could not read frame."}), 500

        # Release the camera
        cap.release()
        # use np arrays instead
        # img_array = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(frame)
        # img = frame.

        # Generate content using the model
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        lan1 = request.args.get('original')
        lan2 = request.args.get('new')
        # prompt = "Classify the objects that are in this photo into a list in english and in spanish, return a JSON object"
        # response = model.generate_content([prompt, img])
        # print(response.text)
                # prompt = """ Classify the objects in the photo into an english list and a spanish list in following JSON format.
        # prompt = "Classify the objects that are in this photo into a list in english and in spanish, return a JSON object"
        # response = model.generate_content([prompt, img])
        # print(response.text)
                # prompt = """ Classify the objects in the photo into an english list and a spanish list in following JSON format.

        # Translation_Objects = {'english': list[str], 'spanish': list[str]}
        # """
        prompt1 = """Classify the objects in the photo into a list seperated by ','"""
        prompt2 = """Classify the objects in the photo in spanish into a list seperated by ',' and remove duplicates."""
        prompt2 = """Classify the objects in the photo in spanish into a list seperated by ',' and remove duplicates."""
        response1 = model.generate_content([prompt1, img])
        response2 = model.generate_content([prompt2, img])
        list1 = response1.text.split(", ")
        list2 = response2.text.split(", ")
        rmdp1 = list(dict.fromkeys(list1))
        rmdp2 = list(dict.fromkeys(list2))
        print(rmdp1)
        print(rmdp2)
        rmdp1 = list(dict.fromkeys(list1))
        rmdp2 = list(dict.fromkeys(list2))
        print(rmdp1)
        print(rmdp2)

        translation = {'English': list1, 'Spanish': list2}
        #print(client.query("desk:get"))

        #ADD TO DATABASE
        # response = client.query("insert_into_table", {
        #     "table_name": "flashcards",  # replace with your table name
        #     "document": translation
        # })
        
        return redirect(location=url_for('translate', lang1 = str(list1), lang2 = str(list2)))

    

@app.route('/do', methods=['GET', 'POST'])
def getStuff():
    if request.method == 'GET':
        print("this works")
        thing = client.query("flashcards:get")
        print(thing)
        return thing
    else:
        print('POST REQUEST')


@app.route('/retrieve', methods= ['GET', "POST"])

def retrieve(prompt):
    query = prompt
    cards = client.query("flashcards:get")

    results = co.rerank(model="rerank-multilingual-v3.0", query=query, documents=cards, rank_fields=['answer','question'],top_n=5, return_documents=True)



    
    pass




@app.route('/translate')
def translate():
    list1 = request.args.get('lang1')
    list2 = request.args.get('lang2')

    print(list1)
    print(list2)
    
    r = sr.Recognizer() 
    while(1):    
        try:
            with sr.Microphone() as source2:
                
                r.adjust_for_ambient_noise(source2, duration=0.1)
                
                #listens for the user's input 
                audio2 = r.listen(source2)
                
                # Using google to recognize audio
                MyText = r.recognize_google(audio2)
                MyText = MyText.lower()
    
                print("Did you say ",MyText)
                #SpeakText(MyText) For audio to text
                
                if MyText in list1:
                    object1 = list1[list1.index(MyText)]
                    object2 = list2[list2.index(MyText)]

                    result = {
                        'native': 'English',
                        'original': object1,
                        'translated': object2,
                        'foreign': 'Spanish',
                        'context': ''
                    }
                    break
        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))
            
        except sr.UnknownValueError:
            print("unknown error occurred")

    return result



@app.route('/voice', methods = ['GET'])
def voiceRec():
    #Example Querry: how do you 




    return


def SpeakText(command):
    response = openAIclient.audio.speech.create(model="tts-1", voice="alloy", input=command)
    response.stream_to_file("output.mp3")
    # play the file in the background
    
def PlayFile(path):
    playsound(path)
    print("Playing file: ", path)


if __name__ == "__main__":
  app.run(debug=True)


