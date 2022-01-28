$(function () {
    const userName = "FNBO",
    userIcon = "./img/fnbo-logo.svg",

    animeDuration = 750,
    timerDuration = 10000,
    revealerSpeed = parseInt($(':root').css('--revealer-speed'));

    const dataURI = {
        "local": "c:\\data\\social\\social.json",
        "server": "https://kitchen.screenfeed.com/social/data/3jzp1h5xsxw684a2r5sk94b7fk.json"
    };

    let feeds = [],
        current = 0;

    function revealer() {
        const $transition = $('.revealer'),
            mode = [
                'revealer--left',
                'revealer--right',
                'revealer--top',
                'revealer--bottom'
            ],
            shuffle = mode[(Math.random() * mode.length) | 0];
        $transition.addClass('revealer--animate').addClass(shuffle).delay(revealerSpeed * 1.5).queue(function () {
            $(this).removeClass('revealer--animate').removeClass(shuffle).dequeue();
        });
    }

    function animateItem($template) {
        var item = $template[0];
        var animateIn = anime.timeline({
                // easing: 'easeInOutQuad',
                easing: 'easeInOutExpo',
                easing: 'cubicBezier(0.645, 0.045, 0.355, 1.000)',
                duration: animeDuration,
                autoplay: true,
                loop: false
            })
            .add({
                begin: function () {
                    revealer();

                    resizeText({
                        elements: document.querySelectorAll('.message')
                    })

                    isolateTag({
                        element: document.querySelectorAll('.message')
                    });
                },
            })
            .add({
                targets: item,
                opacity: [0, 1],
                // translateX: [100, 0],
                endDelay: (timerDuration - (animeDuration * 2)),
            })
            .add({
                targets: item,
                opacity: [1, 0],
                // translateX: [0. - 100],
            })
    }

    function animateTemplate($container, $template, data, current) {
        const $clone = $template.clone();

        let ProfileImageUrl = data.User.ProfileImageUrl,
            ProfileUserName = data.User.Name,
            MediaUrl = {
                "Url": "./img/default-icon.svg"
            };

        if (data.Images === undefined || data.Images.length == 0) {
            // image array empty or does not exist
            data.Images.push(MediaUrl);
            $clone.find('.media video, .media img').attr('src', MediaUrl);
        } else {
            MediaUrl = data.Images[0].Url;
            $clone.find('.media video, .media img').attr('src', MediaUrl);
        }

        if (data.User.ProfileImageUrl === undefined || !data.User.ProfileImageUrl === true) {
            // use default instagram image & username
            ProfileImageUrl = userIcon;
            ProfileUserName = userName;
        }

        $clone.attr("id", current).css('z-index', current).removeClass('hidden');
        $clone.find('.socialicon img').attr('src', data.ProviderIcon);
        $clone.find('.username').text(ProfileUserName);
        $clone.find('.useraccount').text(data.User.Username);
        $clone.find('.usericon img').attr('src', ProfileImageUrl);
        $clone.find('.message').text(data.Content);
        $clone.find('.published').text(data.DisplayTime);
        $container.append($clone);

        animateItem($clone);

        setTimeout(function () {
            $clone.remove();
        }, timerDuration + (revealerSpeed * 2));
    }

    function iterateAnimations() {
        const $template = $("article");
        const $container = $("main");

        // console.log(current, feeds[current])
        animateTemplate($container, $template, feeds[current], current);
        current++;

        setInterval(function () {
            // console.log(current, feeds[current])
            animateTemplate($container, $template, feeds[current], current);
            current = (current + 1) % feeds.length;
        }, timerDuration);

        $template.remove();
    }

    function onTemplateError(result) {
        console.warn("could not get data")
    }

    function onTemplateSuccess(result) {
        $.each(result.Items, function (i) {
            feeds.push(result.Items[i]);
        })
        iterateAnimations();
    }

    function getJsonData(onSuccess, onError, data) {
        return $.ajax({
            method: "GET",
            url: data,
            dataType: "json",
            success: function (result) {
                // console.log(result)
                onSuccess(result)
            },
            error: function (result) {
                // console.error(result);
                onError(result)
            }
        });
    }

    function init() {
        // getJsonData(onTemplateSuccess, onTemplateError, dataURI.local); // get local data, located at c:\data
        getJsonData(onTemplateSuccess, onTemplateError, dataURI.server); // get server data, via screenfeed.com
    }

    init();

});