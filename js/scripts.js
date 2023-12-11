var APODList = {};

async function fetchAPODs() {
  document.getElementById("astroList").innerHTML = "";
  try {
    const apiKey = "yiq0pc98Vqw0pdAFHXdC9XFeBrKAOd8LLmdiS14n";
    let startDate = new Date(document.getElementById("start-date-input").value);
    let endDate = new Date(document.getElementById("end-date-input").value);

    if (startDate > endDate) {
      alert("End date should be equal to or after the start date.");
      return;
    }

    let dayInMillis = 24 * 60 * 60 * 1000; // Number of milliseconds in a day

    for (
      let currentDate = startDate;
      currentDate <= endDate;
      currentDate.setTime(currentDate.getTime() + dayInMillis)
    ) {
      let dateFormatted = currentDate.toISOString().split("T")[0];
      let apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${dateFormatted}`;

      let response = await fetch(apiUrl);
      let data = await response.json();

      // console.log(data)
      if(data.code == 400){
        continue
      }
      displayAPOD(data);
    }
  } catch (error) {
    console.error("Error fetching APODs:", error);
  }
}

function getYouTubeVideoId(link) {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
  const match = link.match(regex);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

function clearAPODs(){
  document.getElementById("astroList").innerHTML = "";
}

function displayAPOD(data) {
  // display date, title, explanation, hdurl
  APODList[new Date(data.date).getTime()] = data;

  // console.log(data);
  // Create the HTML elements
  let astroList = document.getElementById("astroList");
  let apodContainer = document.createElement("li");
  apodContainer.className =
    "astroItem d-flex flex-column justify-content-center align-items-center";
  // apodContainer.id = `${new Date(data.date).getTime()}`;
  let figure = document.createElement("figure");
  figure.className =
    "imageContainer d-flex flex-column justify-content-center align-items-center";

  let img;

  if(data.media_type == "video"){
    img = document.createElement("img");
    let videoID = getYouTubeVideoId(data.url)
    if(videoID==null){
      img.src = './images/placeholder.jpg';
    }
    else {
      img.src = `https://img.youtube.com/vi/${videoID}/sddefault.jpg`;
    }
    img.alt = "Astronomy Picture of the Day";  
  }
  else{
    img = document.createElement("img");
    img.src = data.url;
    img.alt = "Astronomy Picture of the Day";  
  }
  let itemName = document.createElement("p");
  itemName.className = "itemName text-center";
  itemName.innerHTML = data.title;
  let moreInfoContainer = document.createElement("div");
  moreInfoContainer.className =
    "moreInfo d-flex flex-column justify-content-center align-items-center";
  let learnMoreBtn = document.createElement("button");
  learnMoreBtn.className = "learnMoreBTN text-white";
  learnMoreBtn.innerHTML = "Learn more";
  learnMoreBtn.setAttribute("onclick",`openDetailedView(${new Date(data.date).getTime()})`);
  moreInfoContainer.appendChild(itemName);
  moreInfoContainer.appendChild(learnMoreBtn);
  figure.appendChild(img);
  figure.appendChild(moreInfoContainer);
  apodContainer.appendChild(figure);
  astroList.appendChild(apodContainer);
}

function openDetailedView(id) {
  document.getElementById("whiteBlur").classList.toggle('visible')
  let img;
  let figure = document.createElement("figure");
  figure.classList = "w-100";
  if(APODList[id].media_type == 'video'){
    img = document.createElement("iframe");
    img.src = APODList[id].url;
    img.height = "100%";
    img.width = "100%";
    figure.id = "detailedVideo";
    figure.appendChild(img)  
  }
  else {
    img = document.createElement("img");
    img.src = APODList[id].url;
    img.alt = "Astronomy Picture of the Day";
    figure.id = "detailedImage";
    figure.appendChild(img)  
  }

  document.getElementById("detailedTitle").innerHTML = APODList[id].title;
  document.getElementById("detailedExplanation").innerHTML = APODList[id].explanation;
  document.getElementById("visualDetails").innerHTML = "";
  document.getElementById("visualDetails").appendChild(figure);
  document.getElementById("detailedDate").innerHTML = `<p>Date: ${APODList[id].date}</p>`;

  if(APODList[id].copyright){
    document.getElementById("detailedCopyright").innerHTML = `<p>Copyright: ${APODList[id].copyright}</p>`;
  }
  else {
    document.getElementById("detailedCopyright").innerHTML = `<p>Copyright: NASA</p>`;
  }
}

function closeDetailedView(){
  document.getElementById("whiteBlur").classList.toggle('visible')
}

function initialize() {
  
const today = new Date();
const todayFormatted = today.toISOString().split('T')[0];
document.getElementById('start-date-input').value = todayFormatted;
document.getElementById('end-date-input').value = todayFormatted;

}