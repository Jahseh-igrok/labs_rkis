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

//#region Авторизация


_get({url: '/modules/authorization.html'}, function(responseText){
    CONTENT.innerHTML = responseText;
    onLoadAuth
   })



   function onLoadAuth(){
  
    _elem('.go-register').addEventListener('click', function(){
        _load('/modules/registration.html', function(responseText){
            CONTENT.innerHTML = responseText;
            onReg()
        })
        }) 

    _elem('.authorize').addEventListener('click', function(){
        _load('/modules/profile.html')
    })    

    }




function onReg(){                
    _elem('.register').addEventListener('click', function(){
    let rdata = new FormData()
    let first_name = _elem('input[name="first_name"]').value
    let last_name = _elem('input[name="last_name"]').value
    let email = _elem('input[name="email"]').value
    let password = _elem('input[name="password"]').value 

    rdata.append('first_name', first_name)
    rdata.append('last_name', last_name)
    rdata.append('email', email)
    rdata.append('password', password)

    _post({url: `${HOST}/registration`,data: rdata}, function(responseText){
        responseText=JSON.parse(responseText)
        console.log(responseText);
        if(responseText.success){
            token=responseText.token
            console.log(token)
            _load('/modules/profile.html', function(responseText){
                CONTENT.innerHTML = responseText
            })
        }

    }) 
    })
}




    
        
        



           
         
//#endregion
