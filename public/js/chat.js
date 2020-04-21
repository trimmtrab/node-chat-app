const socket = io();

// Elements
const geoLocationButton = document.getElementById("send-location");
const messageForm = document.getElementById("message-form");
const messageFormInput = messageForm.elements.messageText;
const messageFormButton = messageForm.querySelector("button");
const messages = document.getElementById("messages");
const sidebar = document.getElementById("sidebar");

// Templates
const locationMessageTemplate = document.getElementById(
  "location-message-template"
).innerHTML;
const messageTemplate = document.getElementById("message-template").innerHTML;
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML;

// Options
const { room, username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New message element
  const newMessage = messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom, 10);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = messages.offsetHeight;

  // Height of messages container
  const containerHeight = messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = messages.scrollTop + visibleHeight;

  // Do I need to use >= instead of === here ?
  if (scrollOffset >= containerHeight - newMessageHeight) {
    messages.scrollTop = containerHeight;
  }

  console.log(newMessageMargin);
};

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  sidebar.innerHTML = html;
});

socket.on("locationMessage", ({ createdAt, url, username }) => {
  const html = Mustache.render(locationMessageTemplate, {
    createdAt: moment(createdAt).format("hh:mm a"),
    message: url,
    username,
  });

  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("message", ({ createdAt, text, username }) => {
  const html = Mustache.render(messageTemplate, {
    createdAt: moment(createdAt).format("hh:mm a"),
    message: text,
    username,
  });

  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  messageFormButton.disabled = true;

  const message = messageFormInput.value;

  socket.emit("sendMessage", message, (error) => {
    messageFormInput.value = "";
    messageFormInput.focus();
    messageFormButton.disabled = false;

    if (error) {
      console.log(error);
      return;
    }
  });
});

geoLocationButton.addEventListener("click", () => {
  geoLocationButton.disabled = true;

  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        geoLocationButton.disabled = false;
      }
    );
  });
});

socket.emit("join", { room, username }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
