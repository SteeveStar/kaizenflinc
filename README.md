# Kaizen FL Luxury SUV Rentals

Premium, bold black-and-gold branding for a luxury SUV rental website in Lauderhill, Florida.

## Pages
- Home: index.html
- Fleet: fleet.html
- Vehicle Details: vehicle-yukon.html, vehicle-escalade.html
- Booking: booking.html
- Service Area: service-area.html
- About: about.html
- Contact: contact.html

## How to View
Open index.html in a browser. No build step is required.

## OCR License Verification (Contact Form)
The contact form posts the driver's license upload to a local OCR server.

Setup:
1) In server/, run: npm install
2) Create a .env file from server/.env.example and set GOOGLE_APPLICATION_CREDENTIALS
3) Start the server: npm start

Notes:
- The OCR endpoint rejects documents that look like permits and accepts only driver's licenses.
- The form currently shows verification status; wire submission to your CRM/backend as needed.

## Notes
- Placeholder vehicle imagery lives in assets/images and should be replaced with high-quality night photography.
- Forms are static and can be wired to your booking backend or CRM.
- Update the contact details, business hours, and policies as needed.
