
  

# node-esign-bsre

  Package nodejs untuk memudahkan penggunaan E-Sign BSrE (Balai Sertifikasi Elektronik) API dari BSSN (Badan Sandi dan Siber Negara)

# Table of contents

  

<!--ts-->

* [Table of contents](#table-of-contents)
	* [Instalisasi](#Installing)
	* [Penggunaan](#USAGE)
	* [Parameter](#PARAMETER)
	* [Kode](#kode)
	* [Changelog](#changelog)
	* [Contributing](#contributing)
	* [Credits](#credits) 
	* [License](#license)
<!--te-->

### Installing
Using npm:

    npm i @rahadiana/node-esign-bsre

  

## USAGE

    const EsignBrSe = require("@rahadiana/node-esign-bsre");
    
    var Esign = new EsignBrSe({
	    BaseUrl : 'TLD_DOMAIN / IP',
	    username: 'USER_eSign_Client',
	    password: 'PASSWORD_eSign_Client'
	    });

  

### Kode:

**Sign Invisible** :
    
    const inidata = {
	    'file':'./file.pdf', // path file atau url file
	    'nik': 123456789,
	    'passphrase': "myP4ssphrase",
	    }
    Esign.SignInvisible(inidata).then(console.log)

  
**Sign SignQr** :
    
    const inidata = {
	    'file':'./file.pdf', // path file atau url file
	    'nik': 123456789,
	    'passphrase': "myP4ssphrase",
	    'tampilan': 'visible', // visible,invisible
	    'image' : false, // true , false
	    'linkQR' : 'https://contoh.com/',
	    'page': 1,
	    'xAxis': 0,
	    'yAxis':0,
	    'width':0,
	    'height': 0,
	    'reason': "reason", //optional
	    'location' : "kotaku", //optional
	    'text' : "text" //optional
	    }
    Esign.SignQr(inidata).then(console.log)

  
**Sign SignImageTTD** :
    
    const inidata = {
	    'file':'./file.pdf', // path file atau url file
	    'nik': 123456789,
	    'passphrase': "myP4ssphrase",
	    'tampilan': 'visible', // visible,invisible
	    'image' : false, // true , false
	    'imageTTD': "./image.png" // path file atau url file
	    'linkQR' : 'https://contoh.com/',
	    'page': 1,
	    'xAxis': 0,
	    'yAxis':0,
	    'width':0,
	    'height': 0,
	    'tag_koordinat': "~",
	    'reason': "reason", //optional
	    'location' : "kotaku", //optional
	    'text' : "text" //optional
	    }
    Esign.SignImageTTD(inidata).then(console.log)

**SAMPLE RESPONSE Sign :**

    {"success":true,"code":200,"message":"success generate data","data":{"file":"JVBERi0xL..","id_dokumen":"123"}}

  
**Verify PDF** :
    
    const inidata = {
	   'signed_file':'./file.pdf', // path file atau url file
	    }
    Esign.Verify(inidata).then(console.log)

**SAMPLE RESPONSE  200 Verify :**

    {"success":true,"code":200,"message":"DOCUMENT VALID !!!","data":{"nama_dokumen":"signed.pdf","jumlah_signature":1,"notes":"Tanda tangan elektronik valid dan dokumen merupakan dokumen asli sejak ditandatangani","details":[{"info_tsa":{"name":"Timestamp Authority Badan Siber dan Sandi Negara","tsa_cert_validity":"Y-m-d i:s:a to Y-m-d i:s:a"},"signature_field":"sig_1","info_signer":{"issuer_dn":"CN=OSD LU Kelas 2,O=Lembaga Sandi Negara,C=ID","signer_name":"this name","signer_cert_validity":"Y-m-d hh:mm:ss to Y-m-d hh:mm:ss","signer_dn":"0.0.4.1=123 Tangan Digital,E=name@email.me,CN=my name,O=Personal,C=ID","cert_user_certified":true},"signature_document":{"signed_using_tsa":true,"reason":"Dokumen ini ditandatangani secara elektronik","document_integrity":true,"signature_value":"123","signed_in":"Y-m-d hh:mm:ss","location":"kotaku","hash_value":"123"}}],"summary":"DOCUMENT VALID !!!"}}
  
  **SAMPLE RESPONSE  200 (broken pdf) Verify :**

    {"success":true,"code":200,"message":"DOCUMENT NOT VALID !!!","data":{"nama_dokumen":"broken_signed.pdf","jumlah_signature":1,"notes":"Konten Dokumen mengalami perubahan oleh pihak yang tidak berhak","details":[{"info_tsa":{"name":"Timestamp Authority Badan Siber dan Sandi Negara","tsa_cert_validity":"Y-m-d hh:mm:ss to Y-m-d hh:mm:ss"},"signature_field":"sig_123","info_signer":{"issuer_dn":"CN=OSD LU Kelas 2,O=Lembaga Sandi Negara,C=ID","signer_name":"my name","signer_cert_validity":"Y-m-d hh:mm:ss to Y-m-d hh:mm:ss","signer_dn":"1.1.1.1=123_Tanda Tangan Digital,E=myname@email.com,CN=my name,O=Personal,C=ID","cert_user_certified":true},"signature_document":{"signed_using_tsa":true,"reason":"Dokumen ini ditandatangani secara elektronik","document_integrity":false,"signature_value":"123","signed_in":"Y-m-d hh:mm:ss","location":"my location","hash_value":"123"}}],"summary":"DOCUMENT NOT VALID !!!"}}

  **SAMPLE RESPONSE  200 (not signed pdf) Verify :**

    {"success":true,"code":200,"message":"Dokumen belum ditandatangani secara elektronik","data":{"nama_dokumen":"remote.pdf","jumlah_signature":0,"notes":null,"details":[],"summary":null}}

**Download Pdf** :
    
    const inidata = {
	    'id_doc':'abc123'
	    }
    Esign.DownloadDoc(inidata).then(console.log)

  **SAMPLE RESPONSE  200  Download Pdf:**

      {"success":true,"code":200,"message":"success generate data","data":{"file":"JVBERi0xL..","id_dokumen":"123"}}

  **SAMPLE RESPONSE (pdf has been downloaded) Download Pdf:**

    {"success":false,"code":404,"message":"Dokumen telah didownload sebelumnya","data":""}

**User Status** :
    
    const inidata = {
	    'nik': 123456789
	    }
    Esign.Status(inidata).then(console.log)

  **SAMPLE RESPONSE (registered user) User Status:**

    {"success":true,"code":200,"message":"User sudah terdaftar dan memiliki sertifikat dengan status ISSUE","data":{"status_code":1111,"status":"ISSUE","message":"User sudah terdaftar dan memiliki sertifikat dengan status ISSUE"}}

  **SAMPLE RESPONSE (unregistered user) User Status:**

    {"success":true,"code":200,"message":"User belum terdaftar","data":{"status_code":1110,"status":"NOT_REGISTERED","message":"User belum terdaftar"}}


### PARAMETER

| key | value|Description|
|--|--|--|
| file | file pdf| file pdf yang akan ditandatangani|
| nik| integer | REQUIRED *wajib|
| tampilan |visible / invisible| REQUIRED * [invisible / visible] - inisible: maka seluruh parameter dibawah, tidak perlu diisi - visible: maka seluruh parameter dibawah wajib diisi |
| image | (true/false)| * jika "false", maka linkQR wajib diisi -> Visualisasi berupa QRCode|
| imageTTD | file png / jpg | file gambar tandatangan |
| linkQR| URL | *jika image == false, maka wajib diisi|
| page| int |* [int] nomor halaman, untuk letak halaman visualisasi, gunakan salah satu diantara "halaman" atau "page"|
| xAxis| int |*jika tampilan = visible, maka wajib diisi|
| yAxis| int |*jika tampilan = visible, maka wajib diisi|
| width| int |*jika tampilan = visible, maka wajib diisi|
| height| int |*jika tampilan = visible, maka wajib diisi|
| tag_koordinat | string |*opsional|
| location| string |*opsional|
|text|string|*opsional|
|id_doc|string|digunakan pada Download Dokumen|
|signed_file|file pdf|digunakan pada Verify dokumen (path pdf atau url pdf)|
  

### Changelog

  

Lihat [CHANGELOG](CHANGELOG.md) untuk informasi lebih lanjut terkait perubahan terbaru.

  

## Contributing

  

Lihat [CONTRIBUTING](CONTRIBUTING.md) untuk lebih detailnya.

  


## Credits

  

- [Rahadiana Nugraha](https://github.com/rahadiana)

  

## License

  

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
