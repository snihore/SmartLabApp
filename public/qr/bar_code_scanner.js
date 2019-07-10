// var _scannerIsRunning = false;

function progressBar(value){
    if(value){
      document.getElementById('loader').style.display = 'block';
      
    }else{
      document.getElementById('loader').style.display = 'none';
      
    }
  }
function mainOperation(itemNum){
    //BorrowedItems Database Instance ...
    var ref = firebase.database().ref('BorrowedItems');
    //SmartLabItems database Instance ...
    var ref2 = firebase.database().ref('SmartLabItems');

    ref.orderByChild("itemNum").equalTo(itemNum).once('value', function(snapshot){
        if(snapshot.val()){
            
            snapshot.forEach(function(snap){
                // console.log(snap.val());
                // console.log(snap.key);
                var key =snap.key;
                var borrowedObj = snap.val();
                console.log(borrowedObj);
                ref2.orderByChild('itemNumber').equalTo(itemNum).once('child_added', function(snapshot){
                    if(snapshot.val()){
                        snapshot.ref.update({isBorrowed:false}).then(function(){
                            ref.child(key).remove().then(function(){
                                console.log('RETURN SUCCESSFULLY :)');
                                progressBar(false);
                                window.alert('Return Successfully :)');
                                window.location.href = './admin_console.html';
                            }).catch(function(){
                                progressBar(false);
                                window.alert('Delete Borrowed Item Entry Manually !');
                                window.location.href = './admin_console.html';
                                
                            });
                        }).catch(function(e){
                            progressBar(false);
                            window.alert('Item returned operation failed !');
                            window.location.href = './admin_console.html';
                        });
                        
                        
                    }else{
                        progressBar(false);
                        window.alert("Given Item's Number is not available in DB !");
                    }
                });

            });
        }else{
            progressBar(false);
            window.alert("Item's Number Not Find, please try again !");
        }
    });
    
}
function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'),
            constraints: {
                width: 480,
                height: 320,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader",
                "i2of5_reader"
            ],
            debug: {
                // showCanvas: true,
                // showPatches: true,
                // showFoundPatches: true,
                // showSkeleton: true,
                showLabels: true
                // showPatchLabels: true,
                // showRemainingPatchLabels: true,
                // boxFromPatches: {
                //     showTransformed: true,
                //     showTransformedBox: true,
                //     showBB: true
                // }
            }
        },

    }, function (err) {
        if (err) {
            console.log(err);
            return
        }

        console.log("Initialization finished. Ready to start");
        Quagga.start();

        // // Set flag to is running
        // _scannerIsRunning = true;
    });

    Quagga.onProcessed(function (result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
            }
        }
    });


    Quagga.onDetected(function (result) {
        // console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
        console.log("RESULT: " + result.codeResult.code);
        Quagga.stop();
        var itemNum = result.codeResult.code;

        ///Main Operation ....
        progressBar(true);
        mainOperation(itemNum.toLowerCase());
    });
}


// Start scanner
startScanner();

// document.getElementById("btn").addEventListener("click", function () {
//     if (_scannerIsRunning) {
//         Quagga.stop();
//     } else {
//         startScanner();
//     }
// }, false);