(function () {
    var example = [{
        // filename: "https://photos-dev.adrenalineamp.com/data/73025ae3-a51e-400c-8608-020bf70cc182.jpg",
        filename: "img/photo-1573497490790-9053816a01d4.jpg",
        id: 11,
        jobTitle: {
            title: "Mortgage Loan Officer",
            id: 1,
            templateValues: {
                heading: {
                    key: "heading",
                    value: "Let's talk",
                    order: 0,
                    id: 1
                },
                message: {
                    key: "message",
                    value: "I'm here to help you understand home loan options.",
                    order: 1,
                    id: 2
                },
                legal: {
                    key: "legal",
                    value: "<p>PNC is a registered service mark of The PNC Financial Services Group, Inc. (“PNC”). All loans are provided by PNC Bank, National Association, a subsidiary of PNC, and are subject to credit approval and property appraisal.</p><br/><p>© 2021 The PNC Financial Services Group, Inc. All rights reserved. PNC Bank, National Association.</p>",
                    order: 2,
                    id: 3
                },
                mloLicense: {
                    key: "mloLicense",
                    value: "123456",
                    order: 0,
                    id: 6
                }
            }
        },
        user: {
            displayName: "Annie Deposit Counts",
            id: 23
        }
    }];

    function getStaff(onSuccess, onError) {
        return $.ajax({
            method: "GET",
            url: "https://photos-dev.adrenalineamp.com/public-api/mps/_MPS.PNC.TEST-PLAYER/staff?a=e85711db-6395-4811-94c4-93ec1e83f4b3",
            dataType: 'json',
            success: function (result) {
                console.log(result)
                onSuccess(result);
            },
            error: function (result) {
                console.error(result);
                onError(result);
            }
        });
    }

    function animate() {
        let speed = 750,
            delay = 50,
            pause = 5000,
            animation = anime.timeline({
                loop: true,
                autoplay: false,
                duration: speed,
                easing: 'easeInOutExpo',
            })
            .add({
                targets: '.container',
                easing: 'easeInOutSine',
                delay: speed,
                opacity: [0, 1],
            })
            .add({
                targets: '.heading',
                translateY: '100%',
                translateX: ['100%', '0%'],
                opacity: [0, 1],
            })
            .add({
                targets: '.heading',
                delay: speed,
                translateY: ['100%', '0%'],
            })
            .add({
                targets: '.photo',
                translateX: ['100%', '0%'],
                opacity: [0, 1],
                scale: [0, 1],
                duration: (speed * 2),
            }, '-=' + (speed * 3.5) + '')
            /** animate card #1 */
            .add({
                targets: '.card-1, .card-1 *',
                translateX: ['50%', '0%'],
                opacity: [0, 1],
                delay: anime.stagger(delay / 2),
                endDelay: pause,
            }, '-=' + (speed) + '')
            .add({
                targets: '.card-1, .card-1 *',
                translateX: ['0%', '50%'],
                opacity: [1, 0],
                delay: anime.stagger(delay, {
                    direction: 'reverse'
                }),
                changeComplete: function () {
                    $('.card-1').addClass('hide');
                    $('.card-2').removeClass('hide');
                }
            }, '-=' + (speed) + '')
            /** animate card #2 */
            .add({
                targets: '.card-2, .card-2 *',
                translateX: ['50%', '0%'],
                opacity: [0, 1],
                delay: anime.stagger(delay),
                endDelay: pause,
            }, '-=' + (speed / 2) + '')
            .add({
                targets: '.card-2, .card-2 *',
                translateX: ['0%', '50%'],
                delay: anime.stagger(delay, {
                    direction: 'reverse'
                }),
                opacity: [1, 0],
                changeComplete: function () {
                    $('.card-2').addClass('hide');
                    $('.card-3').removeClass('hide');
                }
            }, '-=' + (speed) + '')
            /** animate card #3 */
            .add({
                targets: '.card-3, .card-3 *',
                translateX: ['50%', '0%'],
                opacity: [0, 1],
                delay: anime.stagger(delay),
                endDelay: pause,
            }, '-=' + (speed / 2) + '')
            .add({
                targets: '.card-3, .card-3 *',
                translateX: ['0%', '50%'],
                delay: anime.stagger(delay, {
                    direction: 'reverse'
                }),
                opacity: [1, 0],
                changeComplete: function () {
                    $('.card-3').addClass('hide');
                    $('.card-1').removeClass('hide');
                }
            }, '-=' + (speed) + '')
            /** fade-out */
            .add({
                targets: '.heading, .photo',
                translateX: ['0%', '-100%'],
                opacity: [1, 0],
                delay: anime.stagger(delay),
            }, '-=' + (speed / 2) + '')
            .add({
                targets: '#template',
                easing: 'easeInOutSine',
                opacity: [1, 0],
            })

        animation.play();
    }

    function assembleTeam(response) {
        $(response).each((i => {
            var photo = response[i];

            var img = new Image();

            img.onerror = function () {
                $('.heading').html("no img!");
            }

            img.src = photo.filename;

            $('.name').html(photo.user.displayName);
            $('.license').html(photo.jobTitle.templateValues.mloLicense.value);
            $('.title').html(photo.jobTitle.title);
            $('.heading').html(photo.jobTitle.templateValues.heading.value);
            $('.message').html(photo.jobTitle.templateValues.message.value);
            $('.legal').html(photo.jobTitle.templateValues.legal.value);
            $('.img').attr('src', photo.filename);
            animate();
        }));
    }

    function init() {
        // getStaff(assembleTeam, console.log);

        /* test example data  */
        getTestData();
    }

    init();

    function contingency() {
        var source = "./video/PNC5027_Mortgage_HLC_BED.mp4",
            video = $('.background video'),
            container = $('.container');

        video.attr('src', source);
        container.remove();
    }

    function getTestData(response) {

        if (example.length === 0) return contingency();

        $(example).each((i => {
            var data = example[i];
            console.log(data);
            $('.name').html(data.user.displayName);
            $('.license').html(data.jobTitle.templateValues.mloLicense.value);
            $('.title').html(data.jobTitle.title);
            $('.heading').html(data.jobTitle.templateValues.heading.value);
            $('.message').html(data.jobTitle.templateValues.message.value);
            $('.legal').html(data.jobTitle.templateValues.legal.value);
            $('.img').attr('src', data.filename);
            animate();
        }));
    }

})();