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

import time
import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write

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
    repeat = request.args.get('repeat')
    if repeat is None:
        repeat = "no"

    if repeat == "yes":
        PlayFile("anything_else.mp3")

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
                # cases
                
                if any(phrase in MyText for phrase in ['ariel talk', 'hey real talk', 'real talk']) or repeat == "yes":
                    PlayFile("greeting.mp3")
                    
                    r.adjust_for_ambient_noise(source2, duration=0.1)
                    audio2 = r.listen(source2)

                    MyText = r.recognize_google(audio2)
                    MyText = MyText.lower()
                    if 'translate' in MyText:                    
                        response1 = co.chat(message="Give me a 'yes' or 'no' response as to whether or not the text wants to translate something. GIVE ME ONLY A YES OR NO RESPONSE: " + MyText)
                        print(response1.text)

                        if 'y' in response1.text.lower():
                            PlayFile("translate.mp3")
                            response2 = co.chat(message="Give me the two letter iso code for the language to translate to only return 2 characters that are the iso code, NOTHING ELSE, NO MARKDOWN: " + MyText)
                            print(response2.text)
                            return redirect(url_for('camera', response2=response2.text))
                    elif 'recall' in MyText:
                        # retrieve()
                        return redirect(url_for('retrieve', text = MyText))
                    else:
                    
                        dialogue=co.chat(message=f"Behave as a voice assistant that is in the middle of a conversation. Do not greet the user, here's what they said: {MyText}", model="command")
                        print(dialogue.text)
                        SpeakText(dialogue.text)
                        PlayFile('output.mp3')

                    
                    
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

        
        #print(client.query("desk:get"))

        #ADD TO DATABASE
        # response = client.query("insert_into_table", {
        #     "table_name": "flashcards",  # replace with your table name
        #     "document": translation
        # })
        
        return redirect(location=url_for('translate', lang1 = str(list1), lang2 = str(list2), foreign=language))

    

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

def retrieve():
    text = request.args.get('text')


    docs = client.query("memories:get")
    query = text
    print(docs)
    # from docs create a sentence

    query = query.replace("recall", "")
    results = co.rerank(model="rerank-multilingual-v3.0",rank_fields=['foreign', 'lang_from', 'native', 'lang_to', 'transcript'], query=query, documents=docs, top_n=3, return_documents=True)
    most_relevant = results.results[0]
    print(most_relevant.document)

    # get date from _created_at in most_relevant.document its a ms timestamp
    date = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(most_relevant.document._creationTime/1000))
    today = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))
    print(date)

    # get the translation from most_relevant.document['foreign']

    # With cohere, explain when the word was translated, and the translation
    p = f"The word was translated on {date}, right now is {today} and the translation was from {most_relevant.document.lang_from} to {most_relevant.document.lang_to} and the translation was {most_relevant.document.native} which translates to {most_relevant.document.foreign}"
    print(p)
    dialogue = co.chat(message=p, preamble="Behave as a voice assistant that is in the middle of a conversation. Do not greet the user. Compare the given dates, if its the same date compare time. Here's what they said: " + text)
    print(dialogue.text)
    SpeakText(dialogue.text)
    PlayFile('output.mp3')
    
    return results




@app.route('/translate')
def translate():
    foreign = request.args.get("foreign")
    list1 = request.args.get('lang1')
    list2 = request.args.get('lang2')

    print(list1)
    print(list2)
    
    r = sr.Recognizer() 
    while(1):    
        try:
            with sr.Microphone() as source2:
                
                r.adjust_for_ambient_noise(source2, duration=0.1)

                dialogue= co.chat(message=f"Behave as a voice assistant that is in the middle of a conversation. Do not greet the user, and using the following python list {list1} generate a response that will list the items briefly and prompt the user to select one")
                
                SpeakText(dialogue.text)
                PlayFile('output.mp3')
                #listens for the user's input 
                audio2 = r.listen(source2)
                
                # Using google to recognize audio
                MyText = r.recognize_google(audio2)
                MyText = MyText.lower()
    
                print("Did you say ",MyText)
                #SpeakText(MyText) For audio to text
                
                
                response = co.chat(message=f"Looking at the following content; {list1} (don't say stuff twice, but just say 2 people) the user says: {MyText}, return only 1 word, the one they are most interested in, do not provide explanations, your response must be 1 WORD")
                print(response.text)

                filename = record_audio()  # Record 10 seconds of audio
                r = sr.Recognizer()
                with sr.AudioFile(filename) as source:
                    audio = r.record(source)
                try:
                    text = r.recognize_google(audio)
                    print("Recognized text:", text)
                    # with cohere chat, give english word translate to foreign lang
                    lang = co.chat(message=f"Translate the word {response.text} to {foreign}, only return the translation of the word, nothing else")
                    args = {"native": response.text, "foreign": lang.text, "transcript": text, "lang_from": "English", "lang_to":foreign}
                    
                    client.mutation('memories:insert', args=args)

                    # Got it. Added to the flashcards
                    PlayFile("flashcards.mp3")

                    # cohere briefly explain word
                    dialogue=co.chat(message=f"You're in the middle of a conversation trying to explain a word to the user. Do not greet the user. Very briefly explain translation from {foreign} to english part of the word. Don't ask them questions", model="command")
                    print(dialogue.text)
                    SpeakText(dialogue.text)
                    PlayFile('output.mp3')

                    return redirect(url_for('decision1', repeat = "yes"))
                    break
                except sr.UnknownValueError:
                    print("Could not understand audio.")
                except sr.RequestError as e:
                    print(f"Error with the recognition service: {e}")



                
        except sr.RequestError as e:
            print("Could not request results; {0}".format(e))
            
        except sr.UnknownValueError:
            print("unknown error occurred")

    return jsonify({"response": response.text})



def SpeakText(command):
    response = openAIclient.audio.speech.create(model="tts-1", voice="alloy", input=command)
    response.stream_to_file("output.mp3")
    # play the file in the background

def SpeakOriginal(command):
    response = openAIclient.audio.speech.create(model="tts-1", voice="alloy", input=command)
    response.stream_to_file("original.mp3")    
    
def PlayFile(path):
    playsound(path)
    print("Playing file: ", path)

def record_audio(duration=15, fs=44100, filename="output.wav"):
    print("Recording...")
    recording = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()  # Wait for the recording to finish
    write(filename, fs, recording)
    print(f"Recording complete. Saved to {filename}")
    return filename



if __name__ == "__main__":
  app.run(debug=True)

# docs = client.query("memories:get")
# query = "recall clocks in japanese"
# print(docs)
# # from docs create a sentence

# query = query.replace("recall", "")
# results = co.rerank(model="rerank-multilingual-v3.0",rank_fields=['foreign', 'lang_from', 'native', 'lang_to', 'transcript'], query=query, documents=docs, top_n=3, return_documents=True)
# most_relevant = results.results[0]
# print(most_relevant.document._creationTime)