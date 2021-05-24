// Import the library to talk to ImageMagick
import * as Magick from 'https://knicknic.github.io/wasm-imagemagick/magickApi.js';

$('#image-convert-url-btn').prop('disabled', false);
$('#image-convert-file-btn').prop('disabled', false);
// various html elements
//let rotatedImage = document.getElementById('rotatedImage');

var processedImage, outputName;

function resetButtons() {
    $('#image-convert-url-btn').prop('disabled', false);
    $('#image-convert-file-btn').prop('disabled', false);
    $('#image-convert-url-btn').html('Convert');
    $('#image-convert-file-btn').html('Convert');
    $('#image-convert-url').val('');
}

function handleError() {
    resetButtons();
    halfmoon.initStickyAlert({
        content: "We couldn't process your image! Double check the URL and try resfreshing.",
        title: "Uh, oh!",
        alertType: "alert-danger",
        hasDismissButton: true,
        timeShown: 10000
    });
}

function preview() {
    halfmoon.toggleModal('image-convert-preview');
    $('#image-convert-preview-image').html('<div class="d-flex justify-content-center"><img style="max-width: 300px;" src="' + URL.createObjectURL(processedImage['blob']) + '"></div>');
}

$(document).on('click', '#image-convert-url-btn', function () {
    $('#image-convert-url-btn').prop('disabled', true);
    $('#image-convert-file-btn').prop('disabled', true);
    $('#image-convert-url-btn').html('Please wait...');
    async function convertImageURL() {
        if ($('#image-convert-url').val() == '') {
            handleError();
            return;
        }
        let image = await fetch($('#image-convert-url').val()).catch(handleError);
        if (image.ok) {
            let arrayBuffer = await image.arrayBuffer();
            let sourceBytes = new Uint8Array(arrayBuffer);

            const files = [{ 'name': 'image', 'content': sourceBytes }];
            outputName = 'image.' + $('#image-convert-select').val();
            const command = ["convert", "image", outputName];
            let processedFiles = await Magick.Call(files, command);
            console.log('Image processed!');

            processedImage = processedFiles[0];
            preview();
            resetButtons()
        } else {
            handleError();
        }
    }
    convertImageURL();
});

$(document).on('click', '#image-convert-file-btn', function () {
    $('#image-convert-file-btn').prop('disabled', true);
    $('#image-convert-url-btn').prop('disabled', true);
    $('#image-convert-file-btn').html('Please wait...');
    var selectedFile = document.getElementById('image-convert-file').files[0]
    async function convertImageURL() {
        if (!selectedFile) {
            handleError();
            return;
        }
        let image = selectedFile;
        let arrayBuffer = await image.arrayBuffer();
        let sourceBytes = new Uint8Array(arrayBuffer);

        const files = [{ 'name': 'image', 'content': sourceBytes }];
        outputName = 'image.' + $('#image-convert-select').val();
        const command = ["convert", "image", outputName];
        let processedFiles = await Magick.Call(files, command);
        console.log('Image processed!');

        processedImage = processedFiles[0];
        preview();
        resetButtons()
    }
    convertImageURL();
});

$(document).on('click', '#image-convert-download', function () {
    saveAs(processedImage['blob'], outputName);
});