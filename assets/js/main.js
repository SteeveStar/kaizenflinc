const reveals = document.querySelectorAll(".reveal");
const contactForm = document.querySelector("#contact-form");
const licenseStatus = document.querySelector("#license-status");
const bookingForm = document.querySelector("#booking-form");
const bookingLicenseStatus = document.querySelector("#booking-license-status");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((item) => observer.observe(item));

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileMenu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      mobileMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function setSubmitState(form, isEnabled) {
  const submitBtn = form.querySelector("button[type='submit']");
  if (submitBtn) {
    submitBtn.disabled = !isEnabled;
  }
}

async function verifyLicense({ form, fileInput, statusEl }) {
  const file = fileInput ? fileInput.files[0] : null;

  if (!file) {
    statusEl.textContent = "Please upload a driver's license image or PDF.";
    setSubmitState(form, false);
    return;
  }

  statusEl.textContent = "Verifying license...";

  try {
    const formData = new FormData();
    formData.append("license", file);

    const response = await fetch("/api/verify-license", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.status === "approved") {
      statusEl.textContent = "License verified. Your request is ready to send.";
      form.dataset.licenseVerified = "true";
      setSubmitState(form, true);
    } else {
      statusEl.textContent = data.message || "License rejected.";
      form.dataset.licenseVerified = "false";
      setSubmitState(form, false);
    }
  } catch (error) {
    statusEl.textContent = "Verification failed. Please try again.";
    setSubmitState(form, false);
  }
}

function attachLicenseVerification({ form, fileSelector, statusEl }) {
  const fileInput = form.querySelector(fileSelector);
  setSubmitState(form, false);

  if (fileInput) {
    fileInput.addEventListener("change", () => {
      verifyLicense({ form, fileInput, statusEl });
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (form.dataset.licenseVerified === "true") {
      statusEl.textContent = "License verified. We'll contact you shortly.";
      return;
    }

    verifyLicense({ form, fileInput, statusEl });
  });
}

if (contactForm && licenseStatus) {
  attachLicenseVerification({
    form: contactForm,
    fileSelector: "#license",
    statusEl: licenseStatus,
  });
}

if (bookingForm && bookingLicenseStatus) {
  attachLicenseVerification({
    form: bookingForm,
    fileSelector: "#booking-license",
    statusEl: bookingLicenseStatus,
  });
}
