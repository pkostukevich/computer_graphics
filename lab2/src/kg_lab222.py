# -*- coding: utf-8 -*-
"""
Created on Tue Oct 24 01:33:37 2023

@author: user
"""
from tkinter import Tk, filedialog, Button, Canvas, Label
from PIL import ImageTk, Image
import cv2
import numpy as np
import mahotas as mh
import mahotas.demos
from skimage import io, filters
from skimage import data

from skimage import data, io
from matplotlib import pyplot as plt
cv2.imwrite('images/i.png', data.page())

root = Tk()

def load_image():
    filepath = filedialog.askopenfilename(filetypes=[('Image Files', '*.jpg;*.jpeg;*.png')])
    if filepath:  
        process_image(filepath)

def apply_smoothing_filter(image, kernel_size):
    kernel = np.ones((kernel_size, kernel_size), np.float32) / (kernel_size ** 2)
    result = cv2.filter2D(image, -1, kernel)
    return result

def convert_to_pil(image):
    return Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

def resize_image(image):
    return image.resize((250, 250), Image.NEAREST)

def convert_to_tk(image):
    return ImageTk.PhotoImage(image)

def process_image(filepath):
    
    image = cv2.imread(filepath)                 #for smoothing filters
    image2 = io.imread(filepath, as_gray=True)   #for niblack
    image3 = mahotas.imread(filepath)            #for bernsen
    image3 = image3.max(2)
    
    window_size = 25
    thresh_niblack = filters.threshold_niblack(image2, window_size=window_size, k=0.8)
    binary_niblack = image2 > thresh_niblack
    binary_niblack_resized = cv2.resize(binary_niblack.astype(np.uint8) * 255, (250, 250))
    binary_niblack_pil = Image.fromarray(binary_niblack_resized)
    
    bernsen = mh.thresholding.bernsen(image3, 15, 15)
    bernsen_resized = cv2.resize(bernsen.astype(np.uint8) * 255, (250, 250))
    bernsen_pil = Image.fromarray(bernsen_resized)


    smooth5 = apply_smoothing_filter(image, 5)
    blur = cv2.GaussianBlur(image,(5,5),0)
    
    images = [image, smooth5, blur, blur]

    pil_images = [convert_to_pil(i) for i in images]
    
    resized_images = [resize_image(i) for i in pil_images]
 
    resized_images.append(binary_niblack_pil)
    resized_images.append(bernsen_pil)
   
    images =[convert_to_tk(i) for i in resized_images]

    labels = ["Исходное изображение", "Однородный усредняющий фильтр", "Фильтр Гаусса", '', 'Метод Ниблацка','Метод Бернсена']
    
    # Removing previous images from canvas
    canvas.delete("all")

    for i in range(6):
        row = i // 3
        column = i % 3
        
        if i == 0:
            canvas.create_image( 50,  200, anchor="nw", image=images[i])
            canvas.create_text( 170,  480, text=labels[i], font=("Arial", 10))
            
        elif i != 3:
            canvas.create_image(column * 300 + 80, row * 350 + 50, anchor="nw", image=images[i])
            canvas.create_text(column * 300 + 200, row * 350 + 330, text=labels[i], font=("Arial", 10))

    canvas.image0 = images[0]
    canvas.image1 = images[1]
    canvas.image2 = images[2]
    canvas.image3 = images[3]
    canvas.image4 = images[4]
    canvas.image5 = images[5]


Button(root, text='Загрузить изображение', command=load_image).pack()  
canvas = Canvas(root, width=950, height=750)
canvas.pack()

root.mainloop()
