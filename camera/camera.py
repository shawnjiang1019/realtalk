import cv2
import torch
import speech_recognition as sr
import pyttsx3 
from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify, Response
from io import BytesIO
import base64
#import convex
from PIL import Image as im 

import google.generativeai as genai
import os
import subprocess

genai.configure(api_key="AIzaSyA6PgnXOvsx0lK2RpuWkdoyah-Xp6R61z8")


app = Flask(__name__)
r = sr.Recognizer() 




# Open a connection to the webcam

#have script running on a different endpoint, once the keyword is spoken redirt to the camera end point
#as a post request and return labels
def generate_frames():
    camera = cv2.VideoCapture(0)
    while True:
        success, frame = camera.read()  # Capture frame-by-frame
        if not success:
            break
        else:
            # Encode the frame in JPEG format
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            # Yield the frame in a HTTP response
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    """Video streaming route. Put this in the src attribute of an img tag"""
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

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
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = im.fromarray(frame_rgb) 

        buffer = BytesIO()
        img.save(buffer, format="JPEG")
        img_bytes = buffer.getvalue()
        img_base64 = base64.b64encode(img_bytes).decode('utf-8')

        # Generate content using the model
        model = genai.GenerativeModel(model_name="gemini-1.5-flash")
        lan1 = request.args.get('original')
        lan2 = request.args.get('new')
        # prompt = "Classify the objects that are in this photo into a list in english and in spanish, return a JSON object"
        # response = model.generate_content([prompt, img])
        # print(response.text)
                # prompt = """ Classify the objects in the photo into an english list and a spanish list in following JSON format.

        # Translation_Objects = {'english': list[str], 'spanish': list[str]}
        # """
        prompt1 = """Classify the objects in the photo into a list seperated by ','"""
        prompt2 = """Classify the objects in the photo in spanish into a list seperated by ','"""
        response1 = model.generate_content([prompt1, img])
        response2 = model.generate_content([prompt2, img])
        list1 = response1.text.split(", ")
        list2 = response2.text.split(", ")

        translation = {'English': list1, 'Spanish': list2}

        # return response.text
        return render_template('camera.html', classification=translation, image=img_base64)

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
    #Example Querry: how do you 




    return


def SpeakText(command, speed=150, voice="samantha"):
    voices = ['fred', 'junior', 'kathy', 'ralph', 'samantha']
    # Initialize the engine
    # engine = pyttsx3.init(driverName='espeak')

    # engine.say(command)
    # engine.runAndWait()
    subprocess.run(['say', '-v', voice, '-r', str(speed), command])

if __name__ == "__main__":
  app.run(debug=True)