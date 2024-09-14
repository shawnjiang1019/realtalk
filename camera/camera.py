import cv2
import torch


model = torch.hub.load('ultralytics/yolov5', 'yolov5s')  

cap = cv2.VideoCapture(1)  
if not cap.isOpened():
    print("Error: Could not open video stream.")
    exit()

while True:
    ret, frame = cap.read()
    
    if not ret:
        print("Error: Could not read frame.")
        break
    
    results = model(frame)

    annotated_frame = results.render()[0] 

    cv2.imshow('Testing LOL', annotated_frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
