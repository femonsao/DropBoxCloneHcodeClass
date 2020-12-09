class DropBoxController {

    constructor() {

        this.btnSendFilesEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.modalFileEL = document.querySelector('#react-snackbar-root');


        this.initEvents();





    }

    initEvents() {

        this.btnSendFilesEl.addEventListener('click', event => {

            this.inputFilesEl.click();

        });

        this.inputFilesEl.addEventListener('change', event => {

            console.log('calling uploadFiles function');
            this.uploadTask(event.target.files);

            this.modalFileEL.style.display = 'block'


        });




    }

    uploadTask(files) {
        //console.log(typeof(files), files, 'files in function');

        let promises = [];

        [...files].forEach(file => {
            //console.log(typeof(file), file, 'file in loop');
            promises.push(new Promise((resolve, reject) => {



                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {
                    try {
                        resolve(JSON.parse(ajax.responseText));


                    } catch (e) {
                        reject(e);
                    }
                }

                ajax.onerror = event => {

                    reject(event);


                }

                let formData = new FormData();

                console.log(file, "file to form");

                formData.append('input-file', file);

                console.log(formData, 'form ')

                ajax.send(formData);

            }));

            //console.log(typeof(promises), promises, 'promise in loop');
        })

        return Promise.all(promises);



    }

}