"use strict";
let {ResponseHandler} = require('@rahadiana/node_response_standard')

const EsignBsre = function (options) {
    if (!(this instanceof EsignBsre)) 
        return new EsignBsre(options);
    
    this.BaseUrl = options.BaseUrl;
    this.Auth = Buffer
        .from(`${options.username}:${options.password}`)
        .toString("base64")

    return this;
};

const getBase64 = function (url) {
    return new Promise(async (resolve) => {
        try {
            const axios = require('axios');
            const response = await axios.get(url, {
                responseType: 'arraybuffer'
            }, {timeout: 12000});
            return resolve(Buffer.from(response.data))
        } catch (err) {
            return resolve(ResponseHandler(err.code, '', err.message))
        }
    })
}

const FileChecker = function (data) {
    return new Promise(async (resolve) => {
        try {
            const fs = require('fs');
            const val = data
            const res = val.substring(7, 0) == "http://"
                ? await getBase64(val)
                : val.substring(8, 0) == "https://"
                    ? await getBase64(val)
                    : fs.existsSync(val) == true
                        ? fs.createReadStream(val)
                        : '';
            return resolve(await res);
        } catch (e) {
            return resolve("wahh");
        }
    })
}

const CleanArr = function (data) {
    return new Promise(async (resolve) => {
        try {
            Object
                .keys(data)
                .forEach(key => {
                    if (data[key] === undefined) {
                        delete data[key];
                    }
                });
            return resolve(data);
        } catch (e) {
            return resolve(ResponseHandler(400, e, "inputan tidak benar"));
        }
    })
}

const CheckArr = function (data, BaseUrl, Auth) {
    return new Promise(async (resolve) => {
        try {
            const {Validator} = require('node-input-validator');
            const v = new Validator(data, 
                {
                file: 'required|contains:.pdf',
                nik: 'required|integer|maxLength:16',
                passphrase: 'required|string',
                tampilan: 'required|string|in:visible,invisible',
                image: 'string|requiredIf:tampilan,visible|in:true,false',
                imageTTD: 'contains:.png,.jpg',
                linkQR: 'url|requiredIf:image,false',
                page: 'integer',
                xAxis: 'integer|requiredIf:tampilan,visible',
                yAxis: 'integer|requiredIf:tampilan,visible',
                width: 'integer|requiredIf:tampilan,visible',
                height: 'integer|requiredIf:tampilan,visible',
                tag_koordinat: 'string|maxLength:1'
            });

            if (await v.check() == false) {
                return resolve(ResponseHandler(400, v.errors, "Periksa Kembali Data Anda"))
            } else {
                const CleanArrs = await CleanArr(data)
                const SignDocs = await SignDoc(CleanArrs, BaseUrl, Auth)
                return resolve(SignDocs)
            }

        } catch (e) {
            return resolve(ResponseHandler(400, e, "Periksa Kembali Data Anda"));
        }
    })
}

const SignDoc = async function (Arr, BaseUrl, Auth) {
    try {
        const url = `${BaseUrl}/api/sign/pdf`;
        const {PassThrough} = require("stream");
        const Axios = require('axios');
        const path = require("path");
        const FormData = require('form-data');
        const NewArr = Arr
        const data = new FormData();
        NewArr.file === undefined
            ? ""
            : data.append('file', await FileChecker(NewArr.file), {
                filename: path.basename(NewArr.file)
            });
        NewArr.imageTTD === undefined
            ? ""
            : data.append('imageTTD', await FileChecker(NewArr.imageTTD), {
                filename: path.basename(NewArr.imageTTD)
            });
        delete NewArr.file
        delete NewArr.imageTTD

        for await(const key of Object.keys(NewArr)) {
            data.append(key, NewArr[key].toString());
        }

        const response = await Axios({
            url,
            method: 'post',
            responseType: 'stream',
            timeout: 7000,
            headers: {
                'Authorization': `Basic ${Auth}`,
                ...data.getHeaders()
            },
            data: data
        }); const chunks = response.data.pipe(new PassThrough({encoding: 'base64'})); let str = ''; for await(let chunk of chunks) {
            str += chunk;
        }
        return (ResponseHandler(response.status, {
            file: str,
            id_dokumen: response.headers.id_dokumen
        }, "success generate data"));

    } catch (err) {
        if (err.response) {
            return (ResponseHandler(err.response.status, "", err.message))
        }
    }
}

EsignBsre.prototype.SignInvisible = function (data) {
    return new Promise(async (resolve) => {
        try {
            const NewArr = {
                file: data.file,
                nik: data.nik,
                passphrase: data.passphrase,
                tampilan: 'invisible',
                reason: data.reason,
                location: data.location,
                text: data.text
            }
            return resolve(CheckArr(NewArr, this.BaseUrl, this.Auth));
        } catch (e) {
            return resolve(ResponseHandler(400, e, "failed generate data"));
        }
    })
}

EsignBsre.prototype.SignQr = function (data) {
    return new Promise(async (resolve) => {
        try {
            const NewArr = {
                file: data.file,
                nik: data.nik,
                passphrase: data.passphrase,
                tampilan: data.tampilan,
                image: data.image.toString(),
                linkQR: data.linkQR,
                page: data.page,
                xAxis: data.xAxis,
                yAxis: data.yAxis,
                width: data.width,
                height: data.height,
                reason: data.reason,
                location: data.location,
                text: data.text
            }

            return resolve(CheckArr(NewArr, this.BaseUrl, this.Auth));
        } catch (e) {
            return resolve(ResponseHandler(400, e, "failed generate data"));
        }
    })
}

EsignBsre.prototype.SignImageTTD = function (data) {
    return new Promise(async (resolve) => {
        try {
            const NewArr = {
                file: data.file,
                nik: data.nik,
                passphrase: data.passphrase,
                tampilan: data.tampilan,
                image: data.image.toString(),
                imageTTD: data.imageTTD,
                linkQR: data.linkQR,
                page: data.page,
                xAxis: data.xAxis,
                yAxis: data.yAxis,
                width: data.width,
                height: data.height,
                tag_koordinat: data.tag_koordinat,
                reason: data.reason,
                location: data.location,
                text: data.text
            }
            return resolve(CheckArr(NewArr, this.BaseUrl, this.Auth));
        } catch (e) {
            return resolve(ResponseHandler(400, e, "failed generate data"));
        }
    })
}

EsignBsre.prototype.Verify = function (Arr) {
    return new Promise(async (resolve) => {
        try {
            const NewArr = {
                signed_file: Arr.signed_file
            }
            const axios = require('axios');
            const path = require("path");
            const FormData = require('form-data');
            const data = new FormData();
            NewArr.signed_file === undefined
                ? ""
                : data.append('signed_file', await FileChecker(NewArr.signed_file), {
                    filename: path.basename(NewArr.signed_file)
                });
            const config = {
                method: 'post',
                timeout: 7000,
                url: `${this.BaseUrl}/api/sign/verify`,
                headers: {
                    'Authorization': `Basic ${this.Auth}`,
                    ...data.getHeaders()
                },
                data: data
            };
            const response = await axios(config)
            const DocValidator = response.data.jumlah_signature == 0
                ? 'Dokumen belum ditandatangani secara elektronik'
                : response.data.summary
            return resolve(ResponseHandler(response.status, response.data, DocValidator))
        } catch (err) {
            if (err.response) {
                return resolve(ResponseHandler(err.response.status, "", err.message))
            }
        }
    })
}

EsignBsre.prototype.Status = function (Arr) {
    return new Promise(async (resolve) => {
        try {
            const NewArr = {
                nik: parseInt(Arr.nik)
            }
            const axios = require('axios');
            const config = {
                method: 'get',
                timeout: 7000,
                url: `${this.BaseUrl}/api/user/status/${NewArr.nik}`,
                headers: {
                    'Authorization': `Basic ${this.Auth}`
                }
            };
            const response = await axios(config)
            return resolve(
                ResponseHandler(response.status, response.data, response.data.message)
            )
        } catch (err) {
            if (err.response) {
                return resolve(ResponseHandler(err.response.status, "", err.message))
            }
        }
    })
}

EsignBsre.prototype.DownloadDoc = function (Arr) {
    return new Promise(async (resolve) => {
        try {
            const NewArr = {
                id_doc: Arr
                    .id_doc
                    .toString()
            }
            const axios = require('axios');
            const {PassThrough} = require("stream");
            const config = {
                method: 'get',
                timeout: 7000,
                responseType: 'stream',
                url: `${this.BaseUrl}/api/sign/download/${NewArr.id_doc}`,
                headers: {
                    'Authorization': `Basic ${this.Auth}`
                }
            };
            const response = await axios(config)

            const chunks = response
                .data
                .pipe(new PassThrough({encoding: 'base64'}));
            let str = '';
            for await(let chunk of chunks) {
                str += chunk;
            }

            return resolve(ResponseHandler(response.status, {
                file: str,
                id_dokumen: response.headers.id_dokumen
            }, "success generate data"));

        } catch (err) {
            if (err.response) {
                return resolve(
                    ResponseHandler(err.response.status, '', "Dokumen telah didownload sebelumnya")
                )
            }
        }
    })
}

module.exports = EsignBsre;