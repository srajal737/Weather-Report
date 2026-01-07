//grant_body p ko change when user not allows to access the location

let user = document.querySelector(".user");
let search = document.querySelector(".search");
let grant_body = document.querySelector(".grant_body");
let form = document.querySelector(".search_form");
let loader = document.querySelector(".loader");
let data_body = document.querySelector(".data_body");
let search_btn = document.querySelector(".search_btn");
let grant_btn  = document.querySelector("[grant_btn");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
let e = document.querySelector(".error_box");
//initially.
let curr_option = user;
user.classList.add("option_active");//dont' write user.style.classlist.add("") as here style is not applied we added only class.
grant_body.classList.add("active");

function handleOption(new_option){
    if(curr_option!=new_option){
        curr_option.classList.remove("option_active");
        new_option.classList.add("option_active");
        curr_option = new_option;

        if(new_option==search){
            data_body.classList.remove("active");
            grant_body.classList.remove("active");
            form.classList.add("active");
        }
        else if(new_option==user){
            if(e.classList.contains("active")){
                e.classList.remove("active");
            }
            form.classList.remove("active");
            data_body.classList.remove("active");
            getfromsession();
        }
    }
    
}
 
user.addEventListener("click",()=>{
    handleOption(user);
});
search.addEventListener("click",()=>{
   handleOption(search);
});

function getfromsession(){
    let storedCoord = sessionStorage.getItem("user-coordinate");//taking user-coordinate property from sessionStorage.
    if(!storedCoord){
        grant_body.classList.add("active");
    }
    else{
        let info = JSON.parse(storedCoord);//see the sessionStorage is in string now to make that string in json object we need to convert is into json.
       fetch_data(info);//here info contains latitude and longitude and is in object.
    }
}

async function fetch_data(info){
    grant_body.classList.remove("active");//when grant_btn click then also fetch and remove .
    loader.classList.add("active");
    let {lat , lon} = info;
    try{
         let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

    let data = await response.json();
    loader.classList.remove("active");
    data_body.classList.add("active");
    displayData(data);
    }
    catch(e){
        console.log(e);
        alert("something went wrong");
    }
}


function displayData(info){
    //display variables fetching :-
let windspeed = document.querySelector("[wind_data]");
let humidity = document.querySelector("[humidity_data]");
let clouds = document.querySelector("[cloud_data]");
let city = document.querySelector("[city]");
let flag = document.querySelector("[flag]");
let description = document.querySelector("[description]");
let icon_show = document.querySelector("[icon_show]");
let temperature = document.querySelector("[temperature]");

//fetching
    windspeed.innerText = `${info?.wind?.speed} m/s`;
    city.innerText = info?.name;
    flag.src = `https://flagcdn.com/144x108/${info?.sys?.country.toLowerCase()}.png`;
    description.innerText = info?.weather?.[0]?.description;
    icon_show.src = `http://openweathermap.org/img/w/${info?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${info?.main?.temp} °C`;
    humidity.innerText = `${info?.main?.humidity}%`;
    clouds.innerText =`${info?.clouds?.all}%`;
}

//grant body
grant_btn.addEventListener("click" ,()=>{
    
    if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(showposition,error);
            //here navigator.geolocation.getcurrentposition have two callback functions :- 1st callback function showposition gives parameter through which we can access the latitude and longitude and 2nd callback function error tell what to do if user denies the access to location [vvvv important] 
    }
    else{
        let t = document.querySelector("[grant_text]");
        t.innerText = "Location not supported";
    }
});
 
function showposition(pos){//pos is parameter that is provided by geolocation
    let currpos = {
        "lat" : pos.coords.latitude,
        "lon" : pos.coords.longitude
    };
    //storing in session memory
   sessionStorage.setItem("user-coordinate", JSON.stringify(currpos));
   fetch_data(currpos);//now need to remove grant_body
}
function error(e){
    let t = document.querySelector("[grant_text]");
    t.innerText = "Location Access denied By User!!!";
}

async function fetch_city_info(){
    let input = document.querySelector("[search_input]");
    let c = input.value;
    if(c===""){
        return;
    }
    loader.classList.add("active");
    try{
         const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${c}&appid=${API_KEY}&units=metric`);
         if(!response.ok){
            throw new Error("error");
         }
         let data = await response.json();
         loader.classList.remove("active");
        data_body.classList.add("active");
        displayData(data);
    }
    catch(err){
        e.classList.add("active");
        loader.classList.remove("active");
        if(data_body.classList.contains("active")){
            data_body.classList.remove("active");
        }
    }
}


form.addEventListener("submit" , (event)=>{
    event.preventDefault();
    if(e.classList.contains("active")){
          e.classList.remove("active");
    }
    fetch_city_info();
})
