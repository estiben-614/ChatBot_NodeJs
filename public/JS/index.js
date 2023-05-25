
//Referencias HTML
const mensaje=document.querySelector('#mensaje')
const btnEnviar=document.querySelector('#btnEnviar')
const mensajes=document.querySelector('#mensajes')
const escribiendo=document.querySelector('#escribiendo')
const voz=document.querySelector("#voz")

const token="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"
let texto=''

//Mensaje de bienvenida
mensajes.innerHTML+='<li><strong>CHAT BOT: </strong> Hi! My name is CHAT BOT, your virtual assistant. I´m here to help you with anything you need. If you have any questions or need any assistance, don´t hesitate to write to me. I´m here to help you!</li>'

//API Web Speech- Nos permite activar el microfono, escuchar y transcribir
if('webkitSpeechRecognition' in window){
    
    //Creamos la instancia de reconocimiento de voz
    const recognition= new webkitSpeechRecognition()

    //indica si el reconocimiento de voz debe continuar escuchando después de una pausa. Se establece en true para que el reconocimiento sea continuo.
    recognition.continous=true 

    //indica si se deben devolver resultados provisionales mientras se está realizando el reconocimiento. Se establece en true para obtener resultados en tiempo real mientras se habla.
    recognition.interimResults = false 
    recognition.lang = 'es-ES';
    
    voz.addEventListener('click',()=>{
        //Enciende el microfono al dar click en el boton de voz
        recognition.start()
    })

    //Manejo del resultado del reconocimiento
    recognition.onresult=(evento)=>{

        //Transcribe la voz en texto
        texto=evento.results[0][0].transcript
        
        //Devuelve el texto
        // console.log(texto)
    
        //Traduzcamos el texto obtenido a ingles y cambiemos el valor del input con la solución de la promesa
         promptChat(`Translate only ${texto} to english`,'traducir')
         .then(traduccion=>{
            //Reemplacemos esa traducción en el valor del input
            mensaje.value=traduccion


            //Mostremos en consola el texto y la traduccion
            console.log(`El audio transcrito es :${texto}`)
            console.log(`Su traducción es  :${traduccion}`)
         })
        
         
        
    }    
}
else{
    console.log('The browser is not compatible with Web Speech API') 
}


//Evento cuando dan click en enviar
btnEnviar.addEventListener('click',()=>{
    //recuperamos el mensaje del input
    let mensajeUsuario=mensaje.value
    
    if(mensajeUsuario!==''){
        //Mostremos en el chat el mensaje
        mensajes.innerHTML+=`<li><strong>USER: </strong> ${mensajeUsuario}</li>`
        

        //Mostramos que el chat box está escribiendo mientras esperamos la respuesta
        escribiendo.style.display='block';

        //Llamamos a la función promptChat pasando el parametro mensaje usuario
        promptChat(mensajeUsuario,'enviar')
    
        
        //Reiniciaos el input
        mensaje.value=""
    }

    //
})

//TODO: Funciones

//Nos permite hacer la consulta a la API con el mensaje del usuario 
const promptChat=(mensaje,accion='')=>{

    return new Promise((resolve, reject) => {
            //Hacemos solicitud POST
            fetch("https://api.openai.com/v1/chat/completions",{
                method:'POST',
                headers:{
                    'Content-Type':'application/json', // Tipo de contenido de la solicitud
                    'Authorization': "Bearer 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" // Encabezados adicionales, como el token de autorización
                },
                body:JSON.stringify({
                    "model":"gpt-3.5-turbo",
                    "messages":[
                            {"role":"system",
                            "content":"You are wise person and with a lot of knowledge " //Rol que quiere que adopete el chat bot : "You are a  professor teaching english to childrends that speak spanish "
                            },

                            {"role":"user",
                            "content": mensaje} //Pregunta del usuario : "Dame una serie de 5 pasos para aprender el idioma"
                            ]
                })
            })
            .then(response =>response.json())
            .then((data)=>{

                if(accion=='enviar'){
                    // console.log(data)
                    const respuestaChat=data.choices[0].message.content
                    //Mostremos en el HTML la respuesta
                    mensajes.innerHTML+=`<li><strong>CHAT BOT: </strong> ${respuestaChat}</li>`
                }
                else if(accion=='traducir'){
                    const traduccion= data.choices[0].message.content
                    resolve(traduccion)
                    
                    // //Reemplacemos esa traducción en el valor del input
                    // mensaje.value=await traduccion
                }
                
            })
            .catch(error=>{
                reject(error)
            })
            .finally(()=>{
                //Ocultamos que está escribiendo porque ya recibimos la respuesta del CHAT
                escribiendo.style.display='none'
            })
    });
    
}





    
    

