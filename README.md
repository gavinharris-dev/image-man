# Image Manipulation (Iamge-Man)

Upload your full quality images and have them hosed on Firebase Storage. Then when you need your image on your Web Site link to the image (using the URL provided on upload) and with a few simple parameters (passed in teh query string) get back the appropiate size image (width, height and compression).

## Install and Run Local

### Set-up Firebase

Follow the _BEFORE YOUR BEGIN_ steps on the Quickstart - https://googleapis.dev/nodejs/storage/latest/#before-you-begin

Once this is done, create a `.env` file and put the path to your Service Account Key JSON file in:

```.env
GOOGLE_APPLICATION_CREDENTIALS="/Users/.../keys/image-man.json"
```

```sh
yarn install
yarn dev
```

## Usage

### Step 1: Upload your Image

Upload an image to Image-Man. The tool will take the image and save it into Firebase Storage.

#### Response

On a successful upload, Image-Man will respond with a 201 - Created and a JSON Document:

```JSON
{
  "url": "string"
}
```

#### Example:

```JSON
{
  "url":"http://localhost:3000/f/aec8e013f6a023346794f56567074e98"
}
```

#### JavaScript upload example:

```JavaScript
var formdata = new FormData();
formdata.append("img", fileInput.files[0], "et.jpg");

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("http://localhost:3000", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

### Usage in HTML

Use the returned URL in your HTML Image Tag.

```HTML
  <img src="http://localhost:3000/f/aec8e013f6a023346794f56567074e98?w=300&h=120" alt="ET Phone Home?" />
```

## Thank you to

I have made use of the following libraries to make this application possible:

- https://expressjs.com/
- https://www.npmjs.com/package/express-fileupload
- https://www.npmjs.com/package/sharp
- https://www.npmjs.com/package/helmet
- https://www.npmjs.com/package/morgan
- https://googleapis.dev/nodejs/storage/latest/

While you are here, also check out: https://squoosh.app
