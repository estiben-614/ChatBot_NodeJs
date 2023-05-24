//Referencias HTML
const mensaje=document.querySelector('#mensaje')
const btnEnviar=document.querySelector('#btnEnviar')
const mensajes=document.querySelector('#mensajes')
const escribiendo=document.querySelector('#escribiendo')

const token="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"

//Mensaje de bienvenida
mensajes.innerHTML+='<li><strong>CHAT BOT: </strong>¡Hola! Mi nombre es CHAT BOT, tu asistente virtual. Estoy aquí para ayudarte en todo lo que necesites. Si tienes alguna pregunta o necesitas alguna asistencia, no dudes en escribirme. ¡Estoy aquí para ayudarte!</li>'

btnEnviar.addEventListener('click',()=>{
    //recuperamos el mensaje del input
    let mensajeUsuario=mensaje.value
    
    if(mensajeUsuario!==''){
        //Mostremos en el chat el mensaje
        mensajes.innerHTML+=`<li><strong>USUARIO: </strong> ${mensajeUsuario}</li>`
        

        //Mostramos que el chat box está escribiendo mientras esperamos la respuesta
        escribiendo.style.display='block';

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
                        "content": mensajeUsuario} //Pregunta del usuario : "Dame una serie de 5 pasos para aprender el idioma"
                        ]
            })
        })
        .then(response =>response.json())
        .then(data=>{
            // console.log(data)
            const respuestaChat=data.choices[0].message.content
            //Mostremos en el HTML la respuesta
            mensajes.innerHTML+=`<li><strong>CHAT BOT: </strong> ${respuestaChat}</li>`
        })
        .catch(error=>{
            console.error(error)
        })
        .finally(()=>{
            //Ocultamos que está escribiendo porque ya recibimos la respuesta del CHAT
            escribiendo.style.display='none'
        })
        
        //Reiniciaos el input
        mensaje.value=""
    }

    //
})


