import cv2
import torch
import speech_recognition as sr
import pyttsx3 
from flask import Flask, render_template, request, flash, redirect, url_for, session, jsonify


app = Flask(__name__)

# Load YOLOv5 pre-trained model
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')  # Load YOLOv5 model
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

        # Process the image with the model
        results = model(frame)

        # Extract labels from the results
        print(results.names)
        
        
        return jsonify(results.names[0])
    

@app.route('/test', methods = ['GET'])
def thing():

    if request.method == 'GET':
        while(1):    
     
            # Exception handling to handle
            # exceptions at the runtime
            try:
                
                # use the microphone as source for input.
                with sr.Microphone() as source2:
                    
                    # wait for a second to let the recognizer
                    # adjust the energy threshold based on
                    # the surrounding noise level 
                    r.adjust_for_ambient_noise(source2, duration=0.1)
                    
                    #listens for the user's input 
                    audio2 = r.listen(source2)
                    
                    # Using google to recognize audio
                    MyText = r.recognize_google(audio2)
                    MyText = MyText.lower()
        
                    print("Did you say ",MyText)
                    #SpeakText(MyText) For audio to text
                    if MyText == 'camera':
                        return redirect(url_for('camera'))
                    
            
                    


                    
            except sr.RequestError as e:
                print("Could not request results; {0}".format(e))
                
            except sr.UnknownValueError:
                print("unknown error occurred")

        print("Left the loop\n")
        #run the voice detection
        


    
# Release the webcam and close windows

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