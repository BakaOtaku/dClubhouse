import tensorflow as tf
import numpy as np
import imageio
from PIL import Image
import imagehash
import glob
import matplotlib.pyplot as plt
from flask import Flask
import os
import base64
from flask_cors import CORS,cross_origin

app = Flask(__name__)
CORS(app)

def generateMeow(requestid):

    def generate_and_save_images(requestid,epoch, test_input):

        model = tf.saved_model.load("generator_model")
        predictions = model(test_input, training=False)
        os.makedirs(f"./image/generated/image_{requestid}/")
        
        fig = plt.figure(figsize=(4,4))
        for i in range(predictions.shape[0]):
            plt.subplot(4, 4, i+1)
            plt.imshow(predictions[i, :, :, 0] * 127.5 + 127.5, cmap='gray')
            plt.axis('off')

            plt.savefig(f'image/generated/image_{requestid}/image_at_epoch_{epoch}.png')

        
    noise_dim = 100
    num_examples_to_generate = 16
    epochs=1
    gen_seed = tf.random.normal([num_examples_to_generate, noise_dim])
    generate_and_save_images(requestid,epochs,gen_seed)


@app.route("/",methods=["GET","POST"])
@cross_origin()
def home():
    return {"status":200}

# requestid=0

@app.route("/generate",methods=["GET"])
@cross_origin()
def generateImage():
    global requestid
    requestid+=1
    hash=generateMeow(requestid)
    return {"hash":requestid}

@app.route("/getImage/<hash>",methods=["GET"])
@cross_origin()
def getImage(hash):
    catimage=0
    with open(f'image/generated/image_{str(hash)}/image_at_epoch_1.png',"rb") as data:
        catimage= base64.b64encode(data.read())
    
    return {
        "image":str(catimage)
    }

if __name__=="__main__":
    requestid=0
    app.run()


        # plt.show()




# generate_and_save_images(model, 3000, gen_seed)

# anim_file = 'dcgan.gif'

# with imageio.get_writer(anim_file, mode='I') as writer:
#   filenames = glob.glob('image*.png')
#   filenames = sorted(filenames)
#   for filename in filenames:
#     image = imageio.imread(filename)
#     writer.append_data(image)
#   image = imageio.imread(filename)
#   writer.append_data(image)