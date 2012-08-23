/**
* Create an imageProloader class that will preload an array of images and call a call-back function when all 
* the images have been loaded into the browser.
* The constructor for the ImagePreloader takes an array of image URLs and a call-back function as argumetns.
*/
function ImagePreloader(images, callback) {
    // store the call-back
    this.callback = callback;
    
    // initialize internal state.
    this.nLoaded = 0;
    this.nProcessed = 0;
    this.imgMap = new Object();
    
    // record the number of images.
    this.nImages = images.length;
    
    // for each image, call preload()
    for ( var i = 0; i < images.length; i++ ) 
        this.preload(images[i]);
}

ImagePreloader.prototype.preload = function (image) {
    // create new Image object and add to array
    var img = new Image;
    this.imgMap[image] = img;

    // set up event handlers for the Image object
    img.onload = ImagePreloader.prototype.onload;
    img.onerror = ImagePreloader.prototype.onerror;
    img.onabort = ImagePreloader.prototype.onabort;

    // assign pointer back to this.
    img.imgPreloader = this;
    img.bLoaded = false;

    // assign the .src property of the Image object
    img.src = image;
    this.imgMap[image] = img;
}

ImagePreloader.prototype.onComplete = function() {
    this.nProcessed++;

    if (this.nProcessed == this.nImages) {
        this.callback(this.imgMap, this.nLoaded);
    }
}
 
ImagePreloader.prototype.onload = function() {
    this.bLoaded = true;
    this.imgPreloader.nLoaded++;
    this.imgPreloader.onComplete();
}
 
ImagePreloader.prototype.onerror = function() {
    this.bError = true;
    this.imgPreloader.onComplete();
}
 
ImagePreloader.prototype.onabort = function() {
    this.bAbort = true;
    this.imgPreloader.onComplete();
}
