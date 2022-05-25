import os
import time

from flask import Flask, request, redirect, jsonify
from werkzeug.utils import secure_filename
import uuid
from flask_cors import CORS
import subprocess
import re
from uplink_python.errors import StorjException, BucketNotEmptyError, BucketNotFoundError
from uplink_python.module_classes import ListObjectsOptions, Permission, SharePrefix
from uplink_python.uplink import Uplink
import random
import string
import pathlib
import json
# from OpenSSL import SSL
import ssl
context = ssl.SSLContext() 
context.load_cert_chain('server.crt', 'server.key')
# context = SSL.Context(SSL.TLSv1_2_METHOD)
# context.use_privatekey_file('server.key')
# context.use_certificate_file('server.crt')   
# import logging


# logging.basicConfig(filename='./logging.log', format='%(asctime)s %(message)s', level=logging.DEBUG)
# Storj configuration information
MY_API_KEY = "1dfJ4y1dT5ytbW1PpuNxVKjZ5gm6q4UZpPEVda4L32KzsUZ8AKaj6cyYhuAGJZJtfyqxUoTCuL7ATEVYQqD7VPm8X2auf4q1MofdXJkyA8dNSGJs7SBh"
MY_SATELLITE = "12EayRS2V1kEsWESU9QMRseFhdxYxKicsiFmxrsLZHeLUtdps3S@us1.storj.io:7777"
MY_BUCKET = "upload-bucket"

# (path + filename) OR filename
MY_ENCRYPTION_PASSPHRASE = "random brass puzzle leave mule style exist among engage abstract grape cycle"

UPLOAD_FOLDER = './upload'
# os.environ['FLASK_ENV'] = 'development'
app = Flask(__name__)
CORS(app)
# app.secret_key = uuid.uuid4().hex
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# create an object of Uplink class
uplink = Uplink()
access = uplink.request_access_with_passphrase(MY_SATELLITE, MY_API_KEY,
                                               MY_ENCRYPTION_PASSPHRASE)


def storj_upload(SRC_FULL_FILENAME, MY_STORJ_UPLOAD_PATH):
    project = access.open_project()
    try:
        try:
            _ = project.create_bucket(MY_BUCKET)
        except StorjException as e:
            # logging.debug(e)
            # print(e)
            pass
        # upload file/object
        file_handle = open(SRC_FULL_FILENAME, 'r+b')
        # get upload handle to specified bucket and upload file path
        try:
            upload = project.upload_object(MY_BUCKET, MY_STORJ_UPLOAD_PATH)
            # upload file on storj
            upload.write_file(file_handle)
            # commit the upload
            upload.commit()
        except Exception as e:
            print(e)
            pass
        # close file handle
        file_handle.close()
        # close given project using handle
        project.close()
        # get command output
        time.sleep(1)
        batcmd = "uplink share sj://" + MY_BUCKET + "/" + MY_STORJ_UPLOAD_PATH + " --url --not-after=none"
        try:
            std_out = subprocess.check_output(batcmd, shell=True).decode('utf-8')
            url_link = std_out.splitlines()[-1]
            if "storjshare.io" in url_link:
                share_link = re.search(r'(https?://\S+)', url_link).group()
                return share_link + "?wrap=0"
            else:
                return ""
        except Exception as e:
            # logging.debug(e)
            print(e)
            pass
    except StorjException as exception:
        # logging.debug(exception.details)
        print(exception.details)
        project.close()
        return ""
        pass


@app.route('/api', methods=['POST'])
def upload_file():
    # check if the post request has the file part
    if 'file[]' not in request.files:
        resp = jsonify({'message': 'No file part in the request'})
        resp.status_code = 400
        return resp
    # file = request.files['file']
    files = request.files.getlist("file[]")
    if len(files) == 2:
        uploadfile = files[0]
        metafile = files[1]
        if uploadfile.filename == '':
            resp = jsonify({'message': 'No file selected for uploading'})
            resp.status_code = 400
            return resp
        else:
            try:
                # SRC_FULL_FILENAME = app.config['UPLOAD_FOLDER'] + "/" + secure_filename(
                #     "".join(random.choices(string.ascii_lowercase, k=8)) + uploadfile.filename)
                trans_folder = request.form.get('transaction', "temp")
                pathlib.Path(app.config['UPLOAD_FOLDER'] + "/" + trans_folder).mkdir(parents=True, exist_ok=True)
                SRC_FULL_FILENAME = app.config['UPLOAD_FOLDER'] + "/" + trans_folder + "/" + uploadfile.filename

                uploadfile.save(SRC_FULL_FILENAME)
                MY_STORJ_UPLOAD_PATH = trans_folder + "/" + "".join(
                    random.choices(string.ascii_letters + string.digits, k=43)) + pathlib.Path(
                    uploadfile.filename).suffix
                upload_link = storj_upload(SRC_FULL_FILENAME, MY_STORJ_UPLOAD_PATH)

                if upload_link != "":
                    SRC_FULL_FILENAME = app.config['UPLOAD_FOLDER'] + "/" + trans_folder + "/" + metafile.filename
                    SRC_MANI_FILENAME = app.config['UPLOAD_FOLDER'] + "/" + trans_folder + "/manifest.json"
                    metafile.save(SRC_FULL_FILENAME)

                    with open(SRC_FULL_FILENAME, 'r') as openfile:
                        json_object = json.load(openfile)

                    json_object["image"] = upload_link
                    json_object["properties"]["files"][0]["uri"] = upload_link

                    with open(SRC_FULL_FILENAME, 'w') as f:
                        json.dump(json_object, f)
                    MY_STORJ_UPLOAD_PATH = trans_folder + "/" + metafile.filename
                    meta_link = storj_upload(SRC_FULL_FILENAME, MY_STORJ_UPLOAD_PATH)
                    if meta_link != "":

                        with open(SRC_MANI_FILENAME, 'w') as f:
                            json.dump(json_object, f)
                        MY_STORJ_UPLOAD_PATH = trans_folder + "/manifest.json"
                        mani_link = storj_upload(SRC_MANI_FILENAME, MY_STORJ_UPLOAD_PATH)
                        if mani_link != "":
                            resp = jsonify({
                                "messages": [
                                    {
                                        "filename": uploadfile.filename,
                                        "status": "success",
                                        "transactionId": upload_link
                                    },
                                    {
                                        "filename": metafile.filename,
                                        "status": "success",
                                        "transactionId": meta_link
                                    },
                                    {
                                        "filename": "manifest.json",
                                        "status": "success",
                                        "transactionId": mani_link
                                    }
                                ]
                            })
                            resp.status_code = 200
                            return resp
                    else:
                        resp = jsonify(
                            {
                                "messages": [
                                    {
                                        "filename": uploadfile.filename,
                                        "status": "fail",
                                        "error": "upload & share error"
                                    },
                                    {
                                        "filename": metafile.filename,
                                        "status": "fail",
                                        "error": "meta upload & share error"
                                    }
                                ]
                            })
                        resp.status_code = 500
                        return resp

                else:
                    resp = jsonify(
                        {
                            "messages": [
                                {
                                    "filename": uploadfile.filename,
                                    "status": "fail",
                                    "error": "file upload & share error"
                                },
                                {
                                    "filename": metafile.filename,
                                    "status": "fail",
                                    "error": "upload & share error"
                                }
                            ]
                        })
                    resp.status_code = 500
                    return resp
            except Exception as e:
                print(e)
                resp = jsonify(
                    {
                        "messages": [
                            {
                                "filename": uploadfile.filename,
                                "status": "fail",
                                "error": "file upload & share error"
                            },
                            {
                                "filename": metafile.filename,
                                "status": "fail",
                                "error": "meta upload & share error"
                            }
                        ]
                    })
                resp.status_code = 500
                return resp
                pass
    else:
        uploadfile = files[0]
        upload_media_file = files[1]
        metafile = files[2]
        if uploadfile.filename == '':
            resp = jsonify({'message': 'No file selected for uploading'})
            resp.status_code = 400
            return resp
        else:
            try:
                # SRC_FULL_FILENAME = app.config['UPLOAD_FOLDER'] + "/" + secure_filename(
                #     "".join(random.choices(string.ascii_lowercase, k=8)) + uploadfile.filename)
                trans_folder = request.form.get('transaction', "temp")
                pathlib.Path(app.config['UPLOAD_FOLDER'] + "/" + trans_folder).mkdir(parents=True, exist_ok=True)
                SRC_FULL_FILENAME = app.config['UPLOAD_FOLDER'] + "/" + trans_folder + "/" + uploadfile.filename

                uploadfile.save(SRC_FULL_FILENAME)
                MY_STORJ_UPLOAD_PATH = trans_folder + "/" + "".join(
                    random.choices(string.ascii_letters + string.digits, k=43)) + pathlib.Path(
                    uploadfile.filename).suffix
                upload_link = storj_upload(SRC_FULL_FILENAME, MY_STORJ_UPLOAD_PATH)
                SRC_MEDIA_FILENAME = app.config['UPLOAD_FOLDER'] + "/" + trans_folder + "/" + upload_media_file.filename
                upload_media_file.save(SRC_MEDIA_FILENAME)
                MY_STORJ_UPLOAD_PATH = trans_folder + "/" + "".join(
                    random.choices(string.ascii_letters + string.digits, k=43)) + pathlib.Path(
                    upload_media_file.filename).suffix
                upload_media_link = storj_upload(SRC_MEDIA_FILENAME, MY_STORJ_UPLOAD_PATH)

                if upload_link != "" and upload_media_link != "":
                    SRC_FULL_FILENAME = app.config['UPLOAD_FOLDER'] + "/" + trans_folder + "/" + metafile.filename
                    SRC_MANI_FILENAME = app.config['UPLOAD_FOLDER'] + "/" + trans_folder + "/manifest.json"
                    metafile.save(SRC_FULL_FILENAME)

                    with open(SRC_FULL_FILENAME, 'r') as openfile:
                        json_object = json.load(openfile)

                    json_object["image"] = upload_link
                    json_object["animation_url"] = upload_media_link
                    json_object["properties"]["files"][0]["uri"] = upload_link
                    json_object["properties"]["files"][1]["uri"] = upload_media_link

                    with open(SRC_FULL_FILENAME, 'w') as f:
                        json.dump(json_object, f)
                    MY_STORJ_UPLOAD_PATH = trans_folder + "/" + metafile.filename
                    meta_link = storj_upload(SRC_FULL_FILENAME, MY_STORJ_UPLOAD_PATH)
                    if meta_link != "":

                        with open(SRC_MANI_FILENAME, 'w') as f:
                            json.dump(json_object, f)
                        MY_STORJ_UPLOAD_PATH = trans_folder + "/manifest.json"
                        mani_link = storj_upload(SRC_MANI_FILENAME, MY_STORJ_UPLOAD_PATH)
                        if mani_link != "":
                            resp = jsonify({
                                "messages": [
                                    {
                                        "filename": uploadfile.filename,
                                        "status": "success",
                                        "transactionId": upload_link
                                    },
                                    {
                                        "filename": upload_media_file.filename,
                                        "status": "success",
                                        "transactionId": upload_media_link
                                    },
                                    {
                                        "filename": metafile.filename,
                                        "status": "success",
                                        "transactionId": meta_link
                                    },
                                    {
                                        "filename": "manifest.json",
                                        "status": "success",
                                        "transactionId": mani_link
                                    }
                                ]
                            })
                            resp.status_code = 200
                            return resp
                    else:
                        resp = jsonify(
                            {
                                "messages": [
                                    {
                                        "filename": uploadfile.filename,
                                        "status": "fail",
                                        "error": "upload & share error"
                                    },
                                    {
                                        "filename": metafile.filename,
                                        "status": "fail",
                                        "error": "meta upload & share error"
                                    }
                                ]
                            })
                        resp.status_code = 500
                        return resp

                else:
                    resp = jsonify(
                        {
                            "messages": [
                                {
                                    "filename": uploadfile.filename,
                                    "status": "fail",
                                    "error": "file upload & share error"
                                },
                                {
                                    "filename": metafile.filename,
                                    "status": "fail",
                                    "error": "upload & share error"
                                }
                            ]
                        })
                    resp.status_code = 500
                    return resp
            except Exception as e:
                print(e)
                resp = jsonify(
                    {
                        "messages": [
                            {
                                "filename": uploadfile.filename,
                                "status": "fail",
                                "error": "file upload & share error"
                            },
                            {
                                "filename": metafile.filename,
                                "status": "fail",
                                "error": "meta upload & share error"
                            }
                        ]
                    })
                resp.status_code = 500
                return resp
                pass


@app.route('/', methods=['GET'])
def index():
    return jsonify({'message': 'server is running'})


if __name__ == "__main__":
    # context = ('server.crt', 'server.key')
    app.run(host='0.0.0.0', port=80, use_reloader=False, ssl_context=context,threaded=True, debug=True)
