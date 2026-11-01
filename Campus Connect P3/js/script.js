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
});
