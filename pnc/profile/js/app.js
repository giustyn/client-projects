(function () {
    var example = {
        pahtname: "./img/photo-1568493021943-4077b55c95a3.jpg",
        id: 11,
        jobTitle: {
            title: "Branch Manager",
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
                    value: "I'm here to help you find the right solution to meet your goals.",
                    order: 1,
                    id: 2
                },
                legal: {
                    key: "legal",
                    value: "The PNC Financial Services Group, Inc. All rights reserved. PNC Bank, National Association. Member FDIC ",
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
            displayName: "Kylo",
            id: 23
        }
    };

    function getStaff(onSuccess, onError) {
        var tag = window.parent.PlayerSDK.getTagByPrefix("Z.MPS.PNC.");
        var templateGroup = "pnc_2021_staff"; // Note: "pnc_2021_staff_mlo" for mlo templates

        return $.ajax({
            method: "GET",
            url: "https://photos-dev.adrenalineamp.com/public-api/mps/" + tag.Name + "/template/" + templateGroup + "?a=e85711db-6395-4811-94c4-93ec1e83f4b3",
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
                loop: false,
                autoplay: false,
                duration: speed,
                easing: 'easeInOutQuart',
            })
            .add({
                targets: '.container',
                opacity: [0, 1],
            })
            .add({
                targets: '.heading',
                translateY: '100%',
                translateX: ['200%', '0%'],
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
                // duration: (speed * 2),
            }, '-=' + (speed * 3) + '')
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
                    $('.card-1').removeClass('hide');
                    $('.card-2').addClass('hide');
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

    function assembleTeam(photo) {

        /**
         * This array check should no longer be needed. API endpoint now sends a single json object
         */
        if (Array.isArray(photo)) {
            if (!photo.length) {
                onTemplateError();
            }
            photo = photo.pop();
        }

        var img = new Image();

        img.onload = function () {
            $('.name').html(photo.user.displayName);
            $('.title').html(photo.jobTitle.title);
            $('.heading').html(photo.jobTitle.templateValues.heading.value);
            $('.message').html(photo.jobTitle.templateValues.message.value);
            $('.legal').html(photo.jobTitle.templateValues.legal.value);
            $('.img').attr('src', photo.pathname).show();
            animate();
        }

        img.onerror = function () {
            onTemplateError();
        }

        img.src = photo.pathname;
    }

    // TODO: Handle Fallback Animation
    function onTemplateError() {
        assembleTeam(example);
    }

    function init() {
        let bgVideo = $('#bgVideo').attr('src','./video/ceCOM_XS.mp4');
        getStaff(assembleTeam, onTemplateError);
    }

    window.addEventListener("sdk-ready", function (e) {
        /**
         * e.detail contains the PlayerSDK object.
         * It is also attached at window.parent.PlayerSDK
         */
        // console.log(e.detail);

        init();
    })

})();