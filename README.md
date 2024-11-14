# Medication Reviews & Side-Effects Application

This project is a web application designed to help users browse, review, and report side effects of medications. It provides a platform where guests and authenticated users can share and explore information on various medications.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- **Medication Browsing:** Guests can browse medications alphabetically and read existing reviews.
- **User Authentication:** Secure user authentication using JSON Web Tokens (JWT), allowing users to sign up, log in, and access personalized features.
- **Medication Management:** Authenticated users can add, edit, and delete medications. Only the medication owner can modify their entries.
- **Review Management:** Users can add reviews to medications, with permissions to edit or delete their own reviews.
- **Lazy Loading & Angular Signals:** Efficient loading of user-protected components and optimized state management using Angular signals.

## Technologies Used

- **Frontend:** Angular, Angular Material for UI components, and ReactiveFormsModule for form handling
- **Backend:** Node.js with Express (provided backend code)
- **Authentication:** JWT-based authentication for secure access control
- **Additional Requirements:** Complies with web standards and leverages the latest Angular features

## Getting Started

### Prerequisites

- Node.js (latest version recommended)
- Angular CLI

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/medication-reviews-app.git
   cd medication-reviews-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the backend server (refer to the project’s backend documentation if available):

   ```bash
   npm run start:server
   ```

4. Run the Angular application:

   ```bash
   ng serve
   ```

### Deployment

To serve the application as an Angular Single Page Application (SPA) via Express:
1. Use `Express.static()` to serve Angular assets.
2. Set up a backend fallback route to serve the Angular SPA for undefined backend routes.

## Usage

- **Browsing Medications:** Guests can browse by the first letter of medications and read all existing reviews without needing to log in.
- **Managing Medications and Reviews:** Authenticated users can add, update, and delete their own medications and reviews.

  ![Screenshot of Medication Browsing](screenshot-url) <!-- Replace with an actual screenshot URL -->

## Contributing

This project was developed for academic purposes in line with guidelines provided by Maharishi University. Contributions are welcome following the standard fork-and-pull model:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a Pull Request
