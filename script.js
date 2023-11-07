let images = document.querySelectorAll('img');
images.forEach(image => {
  image.addEventListener('click', event => {
    // get img uuid
    const uuid = event.target.id;

    // change the input value
    img_uuid = document.querySelector("#image_id");
    // update attribute to the current uuid
    img_uuid.setAttribute("value", uuid);
    
  })
});

// create an event listener to send the created JSON and the csrf in the correct
// place (HEADER)
document.querySelector("#submit-captcha").addEventListener(
  "submit", function(form_instance){
    // prevent default submission
    form_instance.preventDefault();

    // get csrf token
    const csrfToken = getCookie("csrftoken");

    // get captcha id and image uuid from HTML
    let captcha_id = document.querySelector("#captcha_id");
    let img_uuid = document.querySelector("#image_id");

    // create data object
    var data = {
      captcha_id: parseInt(captcha_id.getAttribute("value")),
      image_uuid: img_uuid.getAttribute("value"),
    }


    try {
        fetch("/app/captcha/check-captcha/", {
            method: "POST",
            // change header
            headers: {
              'Content-Type': 'application/json',
              'X-Csrftoken': csrfToken
            },
            // jsonfy body data
            body: JSON.stringify(data)
          }).then(response => {
            if (response.status === 200) {
                console.log(response)
                console.log(response.url)
                // redirect to the url
                window.location.href = response.url;
                console.log("Sucesso!");
            } else {
                console.log(response.url)
                // redirect to the url
                window.location.href = response.url;
                console.error("Erro: " + response.status);
            }
        })
        .catch(error => {
            console.log(response.url)
            // redirect to the url
            window.location.href = response.url;
            console.error("Erro de rede: " + error);
        });
        
    } catch (error) {
        alert("Erro de sla oq");
    }
});

// function to get cookie values (this will be used just to get the csrf token)
function getCookie(name) {
  // create var to return
  let cookieValue = null;
  // check if the request/document have any cookie
  if (document.cookie && document.cookie !== '') {
      // create a list with all cookies
      let cookies = document.cookie.split(';');
      // iter through cookies and find the desired cookie
      for (let i = 0; i < cookies.length; i++) {
          let cookie = cookies[i].trim();
          // check if cookie string begins with the wanted name
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  // return the value
  return cookieValue;
}
