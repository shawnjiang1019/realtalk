import cv2
import torch
import speech_recognition as sr
import pyttsx3 
from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify
#import convex
from PIL import Image as im 

import google.generativeai as genai
import os

genai.configure(api_key="AIzaSyA6PgnXOvsx0lK2RpuWkdoyah-Xp6R61z8")


app = Flask(__name__)
r = sr.Recognizer() 




# Open a connection to the webcam

#have script running on a different endpoint, once the keyword is spoken redirt to the camera end point
#as a post request and return labels


@app.route('/camera', methods=['GET', 'POST'])
def camera():
    if request.method == 'GET':
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
        prompt = "Classify the objects that are in this photo into a list in english and in spanish, return a JSON object"
        response = model.generate_content([prompt, img])
        print(response.text)

        return response.text

@app.route('/translate/<list1>/<list2>/<object>')
def translate(list1, list2):

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




    return


def SpeakText(command):
     
    # Initialize the engine
    engine = pyttsx3.init()
    engine.say(command) 
    engine.runAndWait()

if __name__ == "__main__":
  app.run(debug=True)