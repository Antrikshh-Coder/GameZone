import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp, onSnapshot } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";

const form = document.querySelector(".event-form form");
const storage = getStorage();

function renderDashboard(events) {
  const dashboardContainer = document.getElementById("dashboard-cards");
  dashboardContainer.innerHTML = "";

  let totalEvents = events.length;
  let totalParticipants = events.reduce((sum, event) => sum + Number(event.participantCount || 0), 0);

  const summaryCards = `
    <div class="card"><h3>Total Events</h3><p>${totalEvents} upcoming tournaments</p></div>
    <div class="card"><h3>Players Registered</h3><p>${totalParticipants} players</p></div>
  `;
  dashboardContainer.insertAdjacentHTML("beforeend", summaryCards);

  events.forEach(event => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <h3>${event.eventName}</h3>
      <p>${event.eventDescription}</p>
      <p><strong>${event.participantCount}</strong> Participants</p>
      <p>${new Date(event.eventDateTime).toLocaleString()}</p>
      <img src="${event.bannerURL}" alt="Banner" style="width:100%;border-radius:8px;margin-top:10px;">
    `;
    dashboardContainer.appendChild(card);
  });
}

function listenForEvents() {
  const eventsCol = collection(db, "events");
  onSnapshot(eventsCol, (snapshot) => {
    const events = [];
    snapshot.forEach(doc => {
      events.push(doc.data());
    });
    renderDashboard(events);
  }, error => {
    console.error("Error fetching events:", error);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const eventName = form.querySelector("input[type='text']").value.trim();
  const eventDescription = form.querySelector("textarea").value.trim();
  const eventDateTime = form.querySelector("input[type='datetime-local']").value;
  const gameCategory = form.querySelector("select").value;
  const participantCount = form.querySelector("input[type='number']").value;
  const bannerFile = form.querySelector("input[type='file']").files[0];

  if (!bannerFile) {
    alert("Please upload an event banner.");
    return;
  }

  try {
    console.log("Uploading banner to Firebase Storage...");

    const storageRef = ref(storage, `event-banners/${bannerFile.name}_${Date.now()}`);
    const uploadResult = await uploadBytes(storageRef, bannerFile);

    console.log("Banner uploaded:", uploadResult);

    const bannerURL = await getDownloadURL(storageRef);

    console.log("Banner URL:", bannerURL);

    await addDoc(collection(db, "events"), {
      eventName,
      eventDescription,
      eventDateTime,
      gameCategory,
      participantCount,
      bannerURL,
      createdAt: serverTimestamp()
    });

    alert("Event created successfully!");
    form.reset();

  } catch (error) {
    console.error("Error creating event:", error);

    let errorMsg = "An unknown error occurred.";
    if (error.code) {
      errorMsg = `Error Code: ${error.code}\nMessage: ${error.message}`;
    } else if (error.message) {
      errorMsg = error.message;
    }
    alert(`Failed to create event:\n${errorMsg}`);
  }
});

// Start listening immediately
listenForEvents();
