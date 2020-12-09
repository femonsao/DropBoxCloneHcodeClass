class DropBoxController {

    constructor() {

        this.btnSendFilesEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.modalFileEL = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.modalFileEL.querySelector('.mc-progress-bar-fg');
        this.fileNameEl = this.modalFileEL.querySelector('.filename');
        this.timeLeftEl = this.modalFileEL.querySelector('.timeleft');


        this.initEvents();





    }

    initEvents() {

        this.btnSendFilesEl.addEventListener('click', event => {

            this.inputFilesEl.click();

        });

        this.inputFilesEl.addEventListener('change', event => {

            console.log('calling uploadFiles function');
            this.uploadTask(event.target.files);

            this.modalShow();

            this.inputFilesEl.value = '';

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

                    this.modalShow(false);
                    try {
                        resolve(JSON.parse(ajax.responseText));


                    } catch (e) {
                        reject(e);
                    }
                }

                ajax.onerror = event => {

                    this.modalShow(false);

                    reject(event);


                }

                ajax.upload.onprogress = event => {

                    this.uploadProgress(event, file);

                }

                let formData = new FormData();

                console.log(file, "file to form");

                formData.append('input-file', file);

                console.log(formData, 'form ');

                this.startUploadTime = Date.now();

                ajax.send(formData);

            }));

            //console.log(typeof(promises), promises, 'promise in loop');
        })

        return Promise.all(promises);



    }

    uploadProgress(event, file) {


        let timeSpend = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let porcent = parseInt((loaded / total) * 100);
        let timeLeft = ((100 - porcent) * timeSpend) / porcent;


        this.progressBarEl.style.width = `${porcent}%`;
        this.fileNameEl.innerHTML = file.name;
        this.timeLeftEl.innerHTML = this.formatTimeToHuman(timeLeft);



    };


    formatTimeToHuman(duration) {
        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 / 60) % 60));
        let hours = parseInt((duration / (1000 / 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours}:${minutes}:${seconds}`
        }

        if (minutes > 0) {
            return `${hours}:${minutes}:${seconds}`
        }

        if (seconds > 0) {
            return `${seconds}seg.`
        }
        return ''




    }

    modalShow(show = true) {


        this.modalFileEL.style.display = (show) ? 'block' : 'none';

    };
}