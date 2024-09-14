import cv2
import torch
import speech_recognition as sr
import pyttsx3 
from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify
from convex import ConvexClient
from PIL import Image as im 
import cohere



import google.generativeai as genai
import os

genai.configure(api_key="AIzaSyA6PgnXOvsx0lK2RpuWkdoyah-Xp6R61z8")
co = cohere.Client(api_key="FF6yLnIcFESrqvE1vKvOmvfTdugIWS15oLcvR2Fo")
client = ConvexClient('https://adept-lyrebird-670.convex.cloud/ ')

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
                if MyText == 'hey real talk':
                    userResponse = r.recognize_google(audio2)
                    userResponse = userResponse.lower()
                    if 'translate' in userResponse:
                        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
                        prompt1 = "Give me a 'yes' or 'no' response as to whether or not the text wants to translate something"
                    
                    
                        response1 = model.generate_content([prompt1])
                        if response1 == 'yes': 
                            prompt2 = "Give me the two letter iso code for the language to translate to"
                            response2 = model.generate_content([prompt2])
                            return redirect(url_for('camera', response2))
                    
        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))
            
        except sr.UnknownValueError:
            print("unknown error occurred")

    


@app.route('/camera', methods=['GET', 'POST'])
def camera():
    if request.method == 'GET':
        language = request.args.response2
        # Open the camera
        cap = cv2.VideoCapture(0)

        if not cap.isOpened():
            return jsonify({"error": "Could not open camera."}), 500

        # Capture a single frame
        ret, frame = cap.read()

        if not ret:
            cap.release()
            return jsonify({"error": "Could not read frame."}), 500

        # Release the camera
        cap.release()

        img = im.fromarray(frame) 

        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        lan1 = request.args.get('original')
        lan2 = request.args.get('new')

        prompt1 = """Classify the objects in the photo into a list seperated by ','"""
        prompt2 = """Classify the objects in the photo in {} into a list seperated by ','""".format(language)
        response1 = model.generate_content([prompt1, img])
        response2 = model.generate_content([prompt2, img])
        list1 = response1.text.split(", ")
        list2 = response2.text.split(", ")

        translation = {'English': list1, language: list2}
        #print(client.query("desk:get"))

        #ADD TO DATABASE
        # response = client.query("insert_into_table", {
        #     "table_name": "flashcards",  # replace with your table name
        #     "document": translation
        # })
        
        return redirect(location=url_for('translate', lang1 = list1, lang2 = list2))

    

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
    list1 = request.args.lang1
    list2 = request.args.lang2
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
     
    # Initialize the engine
    engine = pyttsx3.init()
    engine.say(command) 
    engine.runAndWait()




if __name__ == "__main__":
  app.run(debug=True)