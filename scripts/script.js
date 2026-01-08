// Deze code is afkomstig van W3Schools: https://www.w3schools.com/howto/howto_js_draggable.asp
// Ik heb de code ongewijzigd overgenomen om een div element versleepbaar te maken.

// Verder is er ook meerdere delen van deze code geschreven door Copilot. Dit doordat mijn kennis van JavaScript niet groot genoeg was om er zelf uit te komen.
// Ik heb tevens wel alle code geconroleerd bestudeerd en geanalyseerd om er zeker van te zijn dat het doet wat ik wil dat het doet en dat er geen onveilige of ongewenste code in staat.

var highestZIndex = 10;

dragElement(document.getElementById("mydiv"));

function initializeWindows() {
  const windows = ["probleemdiv", "effectdiv", "datadiv", "oplossingdiv"];
  windows.forEach((windowId) => {
    const element = document.getElementById(windowId);
    if (element) {
      dragElement(element);
    }
  });
}

initializeWindows();

function bringToFront(elmnt) {
  highestZIndex++;
  elmnt.style.zIndex = highestZIndex;
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  elmnt.addEventListener("mousedown", function () {
    bringToFront(elmnt);
  });

  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    bringToFront(elmnt);
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var clockElement = document.getElementById("clock");

function clock() {
  clockElement.textContent = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

setInterval(clock, 1000);

const acceptSelectedBtn = document.getElementById("accept-selected");
const acceptAllBtn = document.getElementById("accept-all");
const cookieDialog = document.getElementById("mydiv");

let openPopups = [];

const trackingPopups = [
  { id: "popup1", categories: ["advertising", "tracking"] },
  { id: "popup2", categories: ["tracking", "analytics"] },
  { id: "popup3", categories: ["advertising", "tracking"] },
  { id: "popup4", categories: ["social", "tracking"] },
  { id: "popup5", categories: ["advertising", "analytics"] },
  { id: "popup6", categories: ["tracking", "analytics"] },
  { id: "popup7", categories: ["advertising", "tracking"] },
  { id: "popup8", categories: ["tracking", "analytics", "social"] },
];

function getRandomPosition(index) {
  const positions = [
    { top: 100, left: 50 },
    { top: 100, left: window.innerWidth - 350 },
    { top: window.innerHeight - 350, left: 50 },
    { top: window.innerHeight - 350, left: window.innerWidth - 350 },
    { top: 250, left: 200 },
    { top: 300, left: window.innerWidth - 500 },
    { top: 150, left: window.innerWidth / 2 - 150 },
    { top: window.innerHeight - 400, left: window.innerWidth / 2 - 150 },
  ];

  return positions[index % positions.length];
}

function checkAllClosed() {
  const stillOpen = openPopups.filter(
    (id) => document.getElementById(id).style.display !== "none"
  );

  if (stillOpen.length === 0 && openPopups.length > 0) {
    setTimeout(() => {
      const finalMsg = document.getElementById("final-message");
      finalMsg.style.display = "flex";
      finalMsg.style.top = "50%";
      finalMsg.style.left = "50%";
      finalMsg.style.transform = "translate(-50%, -50%)";
      finalMsg.style.position = "fixed";
      dragElement(finalMsg);
    }, 300);
  }
}

function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  popup.style.display = "none";
  checkAllClosed();
}

function showTrackingPopups(selectedCategories) {
  cookieDialog.style.display = "none";

  let popupsToShow = trackingPopups.filter((popup) =>
    popup.categories.some((cat) => selectedCategories.includes(cat))
  );

  openPopups = popupsToShow.map((p) => p.id);

  popupsToShow.forEach((popup, index) => {
    setTimeout(() => {
      const popupElement = document.getElementById(popup.id);
      if (popupElement) {
        popupElement.style.display = "flex";

        const position = getRandomPosition(index);
        popupElement.style.top = position.top + "px";
        popupElement.style.left = position.left + "px";

        dragElement(popupElement);
        bringToFront(popupElement);

        const redDot = popupElement.querySelector(".punt-red");
        if (redDot) {
          redDot.style.cursor = "pointer";
          redDot.onclick = function () {
            closePopup(popup.id);
          };
        }
      }
    }, index * 400);
  });
}

acceptSelectedBtn.addEventListener("click", function () {
  const selectedCategories = [];

  const switches = {
    "advertising-switch": "advertising",
    "analytics-switch": "analytics",
    "social-switch": "social",
    "tracking-switch": "tracking",
  };

  for (const [switchId, category] of Object.entries(switches)) {
    const switchElement = document.getElementById(switchId);
    if (switchElement && switchElement.checked) {
      selectedCategories.push(category);
    }
  }

  if (selectedCategories.length > 0) {
    showTrackingPopups(selectedCategories);
  } else {
    alert("Selecteer minimaal één cookie type!");
  }
});

acceptAllBtn.addEventListener("click", function () {
  const allCategories = ["advertising", "analytics", "social", "tracking"];
  showTrackingPopups(allCategories);
});
