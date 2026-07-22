

document.addEventListener('DOMContentLoaded', () => {


    const devices = {
        desktop: 1400,
        laptop: 1400,
        tablet: 991,
        mobile: 767
    };


    function resizePreview(frame, width) {


        const container = frame.parentElement;


        const scale = container.clientWidth / width;


        frame.style.width = width + "px";
        frame.style.height = (1200) + "px";

        frame.style.transform = `scale(${scale})`;

        frame.style.transformOrigin = "top left";


        // ruimte reserveren zodat de volgende kolom niet overlapt
        container.style.height = (1200 * scale) + "px";

    }



    document.querySelectorAll('.madeit-device-switcher button')
    .forEach(button => {


        button.addEventListener('click', ()=>{


            const device = button.dataset.device;

            const width = devices[device];


            document.querySelectorAll('.madeit-preview-frame')
            .forEach(frame => {

                resizePreview(frame,width);

            });


        });


    });



    // standaard desktop laden
    document.querySelectorAll('.madeit-preview-frame')
    .forEach(frame => {

        resizePreview(frame,1400);

    });


});

