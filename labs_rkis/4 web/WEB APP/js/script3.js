//#region глобальные переменные

const HOST = `http://web-app.api-web-tech.local`
const CONTENT = _elem('.content')

//#endregion

//#region AJAX Методы

function _get (params, callback){
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET',params.url)
    HTTP_REQUEST.send()
    HTTP_REQUEST.onreadystatechange = function (){
        if (HTTP_REQUEST.readyState == 4){
            callback(HTTP_REQUEST.responseText) 
        }
    };
}

function _elem(selector){
    return document.querySelector(selector)
}

function _post(params, callback){
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('POST', params.url)
    HTTP_REQUEST.send(params.data)

    HTTP_REQUEST.onreadystatechange = function(){
        if (HTTP_REQUEST.readyState==4){
            callback(HTTP_REQUEST.responseText)
        }
    }
}

function _load (url, callback){
    let HTTP_REQUEST = new XMLHttpRequest();
    HTTP_REQUEST.open('GET', url);
    HTTP_REQUEST.send();
    
    HTTP_REQUEST.onreadystatechange = function(){
        if (HTTP_REQUEST.readyState==4){
            if (callback) {
                callback(HTTP_REQUEST.responseText)
            }
        }
    }
}

//#endregion

    //#region Функции

    //#region регистрация
    function register(){    
        _elem('.register').addEventListener('click', function(){
        
        let rdata = new FormData()

        rdata.append('first_name', _elem('input[name="first_name"]').value)
        rdata.append('last_name', _elem('input[name="last_name"]').value)
        rdata.append('email',_elem('input[name="email"]').value)
        rdata.append('password', _elem('input[name="password"]').value)

        _post({url: `${HOST}/registration`,data: rdata}, function(responseText){
            responseText=JSON.parse(responseText)
            console.log(responseText);
                if(responseText.success){
                    token=responseText.token
                    console.log(token)
                    _load('/modules/profile.html', function(responseText){
                        CONTENT.innerHTML = responseText
                        onLoadProf()
                        loadTable()
            
                    })
                }
                else{
                alert('Поля не должны быть пустыми')
                }

            }) 
        })

        _elem('.Backbtn').addEventListener('click', function(){
            _get({url: '/modules/authorization.html'}, function(responseText){
                CONTENT.innerHTML = responseText;
                _elem('.go-register').addEventListener('click', function () {
                    _load('/modules/registration.html', function(responseText){
                        CONTENT.innerHTML = responseText; 
                        register()               
                    })
                    })
                    authorize()

                    
            })
                
        })


    }
    //#endregion


    //#region Авторизация
    function authorize(){   
        
        _elem('.authorize').addEventListener('click', function () {
            console.log("authorize");
            let edata = new FormData()
            let email = _elem('input[name="email"]').value
            let password = _elem('input[name="password"]').value
            edata.append('email', email)
            edata.append('password', password)
            _post({url: `${HOST}/authorization`, data: edata}, function(responseText){
            responseText=JSON.parse(responseText)
            console.log(responseText);
                if (responseText.success){
                    token = responseText.token
                    console.log(token)
                    _load('/modules/profile.html', function (responseText){
                        CONTENT.innerHTML = responseText 
                        onLoadProf()
                        // uploadFile()
                        loadTable()
                        
                    })
                }
                else{
                    _elem('.messagefailed').innerHTML = ''
                    _elem('.messagefailed').append(responseText.message)
                    }
                    
                })

            })
        } 
    //#endregion


    //#region Загрузка профиля
        function onLoadProf(){
            console.log('onLoadProf()');
            _elem('.btn-upload-file').addEventListener('click', function(){
            _get({url:`/modules/upload.html`}, function(responseText){
                CONTENT.innerHTML=responseText
                onLoadUpload()  
                uploadFile()
                loadTable()
                loadFiles()
                })
            })
        }

        function onLoadUpload(){
            console.log('onLoadUpload()');
            _elem('.upload-files').addEventListener('click', function(){
                _get({url:`/modules/profile.html`}, function(responseText){
                    CONTENT.innerHTML=responseText
                    onLoadProf()
                    
                })
            })

            _elem('.btn-to-disk').addEventListener('click', function(){
            _get({url:`/modules/profile.html`}, function(responseText){
                CONTENT.innerHTML=responseText
                onLoadProf()
                loadTable()
                })
            })
        }

        function uploadFile(){
            console.log('uploadFile()')
            _elem('.upload-files').addEventListener('click', function(){
                
            loadTable()
        

            })

        }
    //#endregion


    //#region Просмотр файлов пользователя
        function loadTable(){
            console.log('loadTable()')
            let adata = new FormData();
            adata.append('token',token)

            _post({url:`${HOST}/disk`, data: adata}, function (responseText){
                filesTable = JSON.parse(responseText)

                let table = _elem('tbody');
                for (i=0; i<filesTable.length; i++){
                    const element = filesTable[i]
                    
                    let row = document.createElement('tr')


                    let id = document.createElement('td')
                    id.textContent = element.file_id
                    row.append(id)
                    
                    let name = document.createElement('td')
                    name.textContent = element.name
                    row.append(name)

                    let download = document.createElement('td');
                    let link = document.createElement('a');
                    link.setAttribute('href', `${HOST}${element.url}`)
                    link.setAttribute('download', `${HOST}${element.url}`)
                    link.textContent = 'Скачать'
                    download.append(link)
                    row.append(download)

                    let deletefile = document.createElement('td');
                    let delLink = document.createElement('a')
                    delLink.setAttribute('href', `${HOST}${element.url}`)
                    delLink.setAttribute('treant', 'meepo')
                    delLink.textContent = 'Удалить'
                    deletefile.append(delLink)
                    row.append(deletefile)

                    table.append(row)
                }

            })
        }

    //#endregion


    //#region Загрузка файлов
        function loadFiles(){

        _elem('.upload-files').addEventListener('click', function(){

            console.log('loadFiles()');
            console.log(document.querySelector('input[name="files"]').files);
            
           
            let tdata = new FormData();
            tdata.append('token', token);
            tdata.append('files', document.querySelector('input[name = "files"]').files[1]);


 

            
            
            _post({url:`${HOST}/upload`, data: tdata}, function (responseText){
                files = JSON.parse(responseText)
                
                element()

            })   
        })

        }


        function element(){ 
                

            //     for(step = 0; step < fileTable.length; step++){
            //     const element = fileTable[step]

            //     let row = document.createElement('tr')

            //     let id = document.createElement('td')
            //     id.textContent = element.file_id
            //     row.append(id)

            //     let name = document.createElement('td')
            //     name.textContent = element.name
            //     row.append(name)

            //     loadTable.append(row)

            //     console.log('element()');
                
            // }

    }


    //#endregion


    //#endregion

    //#region Авторизация 1
        
        _get({url: '/modules/authorization.html'}, function(responseText){
            CONTENT.innerHTML = responseText;
            _elem('.go-register').addEventListener('click', function () {
                _load('/modules/registration.html', function(responseText){
                    CONTENT.innerHTML = responseText; 
                    register()               
                })
            })
                    authorize()  
        })

    //#endregion
