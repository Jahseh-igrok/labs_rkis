//#region глобальные переменные

const HOST = `http://web-app.api-web-tech.local`
const CONTENT = _elem('.content')
//#endregion

//#region AJAX Методы

function _get(params, callback) {
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', params.url)
    HTTP_REQUEST.send()
    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            callback(HTTP_REQUEST.responseText)
        }
    };
}

function _elem(selector) {
    return document.querySelector(selector)
}

function _post(params, callback) {
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('POST', params.url)
    HTTP_REQUEST.send(params.data)

    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            callback(HTTP_REQUEST.responseText)
        }
    }
}

function _load(url, callback) {
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', url);
    HTTP_REQUEST.send();

    HTTP_REQUEST.onreadystatechange = function () {
        if (HTTP_REQUEST.readyState == 4) {
            if (callback) {
                callback(HTTP_REQUEST.responseText)
            }
        }
    }
}


//#endregion

//#region Авторизация
_get({ url: '/modules/authorization.html' }, function (responseText) {
    CONTENT.innerHTML = responseText;
    _elem('.go-register').addEventListener('click', function () {
        _load('/modules/registration.html', function (responseText) {
            CONTENT.innerHTML = responseText;

            _elem('.register').addEventListener('click', function () {


                let rdata = new FormData()


                rdata.append('first_name', _elem('input[name="first_name"]').value)
                rdata.append('last_name', _elem('input[name="last_name"]').value)
                rdata.append('email', _elem('input[name="email"]').value)
                rdata.append('password', _elem('input[name="password"]').value)

                _post({ url: `${HOST}/registration`, data: rdata }, function (responseText) {
                    responseText = JSON.parse(responseText)
                    console.log(responseText);
                    if (responseText.success) {
                        token = responseText.token
                        console.log(token)
                        _load('/modules/profile.html', function (responseText) {
                            CONTENT.innerHTML = responseText
                        })
                    }

                })
            })
        })

    })



    _elem('.authorize').addEventListener('click', function () {
        let edata = new FormData()
        let email = _elem('input[name="email"]').value
        let password = _elem('input[name="password"]').value
        edata.append('email', email)
        edata.append('password', password)
        _post({ url: `${HOST}/authorization`, data: edata }, function (responseText) {
            responseText = JSON.parse(responseText)
            console.log(responseText);
            if (responseText.success) {
                token = responseText.token
                console.log(token)
                _load('/modules/profile.html', function (responseText) {
                    CONTENT.innerHTML = responseText

                    _elem('.btn-upload-file').addEventListener('click', function () {
                        _get({ url: `/modules/upload.html` }, function (responseText) {
                            CONTENT.innerHTML = responseText

                            _elem('.upload-files').addEventListener('click', function () {

                            })

                            _elem('.btn-to-disk').addEventListener('click', function () {
                                _get({ url: `/modules/profile.html` }, function (responseText) {
                                    CONTENT.innerHTML = responseText
                                })
                            })
                        })
                    })

                })
            }
            else {
                alert("login failed")
            }

        })

    })
})

function onLoadProf() {
    _elem('.btn-upload-file').addEventListener('click', function () {
        _get({ url: `/modules/upload.html` }, function (responseText) {
            CONTENT.innerHTML = responseText

            _elem('.upload-files').addEventListener('click', function () {

            })

            _elem('.btn-to-disk').addEventListener('click', function () {
                _get({ url: `/modules/profile.html` }, function (responseText) {
                    CONTENT.innerHTML = responseText
                })
            })
        })
    })
}


//#endregion
