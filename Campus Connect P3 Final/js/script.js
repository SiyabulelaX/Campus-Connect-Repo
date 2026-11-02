document.addEventListener("DOMContentLoaded", function () {
    // A. CLUB SEARCH
    const clubSearch = document.getElementById("clubSearch");
    const clubCards = document.querySelectorAll(".club-card");
    const clubNoResults = document.getElementById("clubNoResults");

    if (clubSearch) {
        function filterClubs() {
            const term = clubSearch.value.toLowerCase().trim();
            let visibleCount = 0;

            clubCards.forEach(function (club) {
                const searchableText =
                    (club.textContent + " " + (club.dataset.keywords || "")).toLowerCase();
                const matches = searchableText.includes(term);
                club.hidden = !matches;
                if (matches) visibleCount++;
            });

            if (clubNoResults) clubNoResults.hidden = visibleCount > 0;
        }

        clubSearch.addEventListener("input", filterClubs);
    }

    // B. ANNOUNCEMENT CATEGORY FILTERS
    const filterButtons = document.querySelectorAll("[data-filter]");
    const announcementCards = document.querySelectorAll(".announcement-card");
    const announcementNoResults = document.getElementById("announcementNoResults");

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCategory = button.dataset.filter;
            let visibleCount = 0;

            announcementCards.forEach(function (card) {
                const matches = selectedCategory === "all" ||
                    card.dataset.category === selectedCategory;
                card.hidden = !matches;
                if (matches) visibleCount++;
            });

            filterButtons.forEach(function (otherButton) {
                otherButton.setAttribute(
                    "aria-pressed",
                    String(otherButton === button)
                );
            });

            if (announcementNoResults) {
                announcementNoResults.hidden = visibleCount > 0;
            }
        });
    });

    // C. ANNOUNCEMENT READ MORE
    document.querySelectorAll(".read-more").forEach(function (button) {
        button.addEventListener("click", function () {
            const card = button.closest(".announcement-card");
            const fullText = card ? card.querySelector(".full-text") : null;
            if (!fullText) return;

            const expanded = button.getAttribute("aria-expanded") === "true";
            fullText.hidden = expanded;
            button.setAttribute("aria-expanded", String(!expanded));
            button.textContent = expanded ? "Read more" : "Read less";
        });
    });

    // ONLINE CONTACT AND ENQUIRY FORMS
    document.querySelectorAll("form[data-online-form]").forEach(function (form) {
        const feedback = form.querySelector('[role="status"]');
        const submitButton = form.querySelector('button[type="submit"]');
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
         
        const emailinput=form.querySelector('input[type="email"]');

        if(emailField){
            emailfield.addEventListener("input", function () {
                emailfield.setCustomValidity("");
            });
        }


        if(emailinput){
            const email=emailinput.value.trim();
            const emailPattern=/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
            

         if(!emailPattern.test(email)){ emailinput.setCustomValidity("Please enter a valid email address,e.g student@gamil.com");
         emailinput.reportValidity();
         return;
         } 
         emailinput.setCustomValidity(""); 
         }




            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            const endpoint = (form.dataset.endpoint || "").trim();
            if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
                feedback.textContent = "Online submissions are not configured yet. Please try again once the form is connected.";
                feedback.hidden = false;
                return;
            }
            submitButton.disabled = true;
            feedback.textContent = "Sending your message...";
            feedback.hidden = false;
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    body: new FormData(form),
                    headers: { "Accept": "application/json" }
                });
                if (!response.ok) throw new Error("Submission rejected");
                feedback.textContent = form.id === "enquiryForm"
                    ? "Your enquiry was submitted successfully. We will review your request; availability is not yet confirmed."
                    : "Your message was submitted successfully.";
                form.reset();
            } catch (error) {
                feedback.textContent = "Your message could not be sent. Please try again later.";
            } finally {
                submitButton.disabled = false;
            }
        });
    });


  // TRANSPORT FINDER
  const regionSelect = document.getElementById("transportRegion");
  const typeSelect = document.getElementById("transportType");
  const transportResults = document.getElementById("transportResults");

  const transportData = {
    west: {
      name: "West / Southwest Rand",
      areas: "Soweto, Kagiso, Randfontein",
      bus: "Rea Vaya BRT, Putco",
      rail: "Metrorail",
      taxi: "Bree Street Rank, Noord Street Rank, Wanderers Rank"
    },
    east: {
      name: "East Johannesburg",
      areas: "Katlehong, Vosloorus, Germiston",
      bus: "Putco, Ekurhuleni Bus Service",
      rail: "Metrorail",
      taxi: "Germiston Rank, Vosloorus Rank"
    },
    south: {
      name: "South Johannesburg",
      areas: "Orange Farm, Eldorado Park",
      bus: "Metrobus, Putco",
      rail: "Metrorail",
      taxi: "Baragwanath Interchange"
    },
    north: {
      name: "North Johannesburg",
      areas: "Midrand, Alexandra, Ivory Park",
      bus: "Gautrain buses, Rea Vaya, Metrobus",
      rail: "Gautrain",
      taxi: "Midrand Rank, Pan African Rank"
    }
  };

  if (regionSelect && typeSelect && transportResults) {

    function updateTransport() {
      const region = regionSelect.value;
      const type = typeSelect.value;

      if (!region) {
        transportResults.textContent =
          "Please select a region to see transport options.";
        return;
      }

      const info = transportData[region];
      const types = {
        bus: "Bus options",
        rail: "Rail options",
        taxi: "Taxi hubs"
      };

      const heading = document.createElement("h3");
      heading.textContent = info.name;

      const areas = document.createElement("p");
      areas.textContent = "Key areas: " + info.areas;

      transportResults.replaceChildren(heading, areas);

      const selectedTypes = type === "all"
        ? ["bus", "rail", "taxi"]
        : [type];

      selectedTypes.forEach(function (selectedType) {
        const paragraph = document.createElement("p");
        const label = document.createElement("strong");

        label.textContent = types[selectedType] + ": ";
        paragraph.append(label, info[selectedType]);
        transportResults.appendChild(paragraph);
      });
    }

    regionSelect.addEventListener("change", updateTransport);
    typeSelect.addEventListener("change", updateTransport);
  }




  // STUDENT TRAVEL GUIDE ACCORDION

  const accordionButtons =
    document.querySelectorAll(".accordion-btn");

  accordionButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const content = button.nextElementSibling;
      const isOpen =
        button.getAttribute("aria-expanded") === "true";

      // Close all accordion sections
      accordionButtons.forEach(function (otherButton) {

        otherButton.setAttribute(
          "aria-expanded", "false"
        );

        otherButton.querySelector("span").textContent = "+";

        otherButton.nextElementSibling.hidden = true;
      });

      // Open the selected section if previously closed
      if (!isOpen) {

        button.setAttribute(
          "aria-expanded", "true"
        );

        button.querySelector("span").textContent = "−";

        content.hidden = false;
      }

    });

  });







  // INTERACTIVE JOHANNESBURG TRANSPORT MAP

  const mapContainer =
    document.getElementById("transportMap");

  if (mapContainer && typeof L !== "undefined") {

    // Centre the map on Johannesburg
    const transportMap = L.map("transportMap")
      .setView([-26.2041, 28.0473], 11);

    // Add OpenStreetMap tiles
    L.tileLayer(
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }
    ).addTo(transportMap);

    // Starting marker: approximate Johannesburg CBD

    const cbdMarker = L.marker([-26.2041, 28.0473])
      .addTo(transportMap)
      .bindPopup(
        "<strong>Johannesburg CBD</strong><br>" +
        "Central Johannesburg transport area."
      );


    // WANDERERS TAXI RANK MARKER 


    const wanderersMarker = L.marker(
      [-26.197900, 28.044298]
    )
      .addTo(transportMap)
      .bindPopup(
        "<strong>Wanderers Taxi Rank</strong><br>" +
        "Wanderers Street, Johannesburg CBD.<br>" +
        "Confirm taxi destinations and fares at the rank."
      );



      
    // JOHANNESBURG PARK STATION

   
    const parkMarker = L.marker([-26.1960, 28.0416])
      .addTo(transportMap)
      .bindPopup(
        "<strong>Johannesburg Park Station</strong><br>" +
        "Major railway and transport interchange."
      );




    // ADDITIONAL TRANSPORT HUBS
    // Coordinates are approximate orientation points, not verified entrances.
    const extraHubs = [
      { id: "bree", name: "Bree Street Taxi Rank", coords: [-26.2015, 28.0347], info: "Minibus taxi area. Confirm the exact boarding point and destination locally." },
      { id: "mtn", name: "MTN Taxi Rank", coords: [-26.2065, 28.0418], info: "Johannesburg CBD taxi interchange. Confirm routes and fares before travelling." },
      { id: "gandhi", name: "Gandhi Square", coords: [-26.2074, 28.0447], info: "Central bus and public transport interchange." },
      { id: "rosebank", name: "Rosebank Gautrain Station", coords: [-26.1456, 28.0448], info: "Gautrain station in Rosebank. Check current timetables and fares." },
      { id: "sandton", name: "Sandton Gautrain Station", coords: [-26.1075, 28.0568], info: "Gautrain station in Sandton. Check current timetables and fares." },
      { id: "reavaya", name: "Rea Vaya – Park Station area", coords: [-26.1965, 28.0410], info: "Approximate Park Station area. Confirm the actual Rea Vaya platform or stop." }
    ];

    const extraMarkers = {};
    extraHubs.forEach(function (hub) {
      extraMarkers[hub.id] = L.marker(hub.coords)
        .addTo(transportMap)
        .bindPopup("<strong>" + hub.name + "</strong><br>" + hub.info);
    });

    // FIND A TRANSPORT HUB DROPDOWN

    const hubSelect =
      document.getElementById("transportHub");

      //Test 

      
console.log("Dropdown found:", hubSelect);

if (hubSelect) {
  hubSelect.addEventListener("change", function () {
    console.log("Dropdown changed to:", hubSelect.value);
  });
}


    const transportHubs = {
      cbd: cbdMarker,
      wanderers: wanderersMarker,
      park: parkMarker,
      ...extraMarkers
    };

    if (hubSelect) {
      hubSelect.addEventListener("change", function () {

        const selectedHub = hubSelect.value;

        if (selectedHub === "") {
          transportMap.closePopup();
          transportMap.setView([-26.2041, 28.0473], 11);
          return;
        }

        const selectedMarker = transportHubs[selectedHub];

        if (selectedMarker) {
          const coordinates = selectedMarker.getLatLng();

          // Move directly to the selected marker
          transportMap.setView(coordinates, 16);

          // Display its information
          selectedMarker.openPopup();

          console.log(
            "Selected hub:",
            selectedHub,
            coordinates.lat,
            coordinates.lng
          );
        }
      });
    }

  }
});
