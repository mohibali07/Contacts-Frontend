iFinance Project Documentation

1. Project Overview
   iFinance is a multi-module Django application designed to handle:
1. Project Management (Jira App): Task tracking, team management, and departmental hierarchy.
1. Contact Management (Contacts App): A robust address book/CRM with support for Hijri/Solar dates, location data, and detailed contact info.Target Audience
   This documentation is intended for Frontend Developers who will be building a modern user interface to interact with this backend. Currently, the project relies heavily on the Django Admin interface (/jira/ and /contacts/). The goal is to decouple the UI or enhance it using the provided data structures and APIs.

---

2. Technology Stack
   • Backend Framework: Django 4.1 (Python)
   • Database: SQLite (Default)
   • Configuration:
   • Timezone: Asia/Karachi
   • Auth Model: Custom User model (jira.User)
   • Key Libraries:
   • django-cities-light: For Country/State/City data.
   • hijri-converter: For calculating Lunar dates in Contacts.
   • phonenumber_field: For validating phone numbers.
   Note for Frontend Dev: The project currently does not use Django Rest Framework (DRF). Existing APIs return standard JsonResponse. You may need to request the backend team to install DRF and create Serializers if complex CRUD operations are required via API.

---

3. Application Modules & Data Models
   3.1 Core Utilities (configs App)
   Base abstract models used across the system.
   • ModelBase: Adds created_at, updated_at, created_by, updated_by to all models inheriting from it. Automatically tracks audit logs.
   • Currency: Supports multi-currency operations (Name, Code, Active status).
   3.2 Project Management (jira App)
   Handles internal team workflows.
   • User (jira.User): Custom user model.
   • Links to a Role (permissions), Department, and Contact profile.
   • Department: Hierarchical structure (e.g., Development > Frontend).
   • Team: Groups users under a Team Lead.
   • Role: Granular permissions (e.g., can_view_all_tasks, is_team_lead_role).
   • Task:
   • Fields: Title, Description, Priority (Low-Critical), Status (Pending-Completed), Deadline.
   • Assignments: Assigned To (User), Assigned By (User), Team.
   • TaskSubmission: Records file uploads/notes when a user completes a task.
   3.3 Contact Management (contacts App)
   A wealthy CRM-like module.
   • Contact: The central entity.
   • Personal: Title, Gender, First/Last Name, CNIC (validated connection to Pakistani format).
   • Dates: date_of_birth_solar (Input) -> Automatically calculates solar_age, lunar_date_of_birth, and lunar_age using specialized logic.
   • Reference: Self-referential link to another Contact (e.g., "Referenced by X").
   • Address: Linked to cities_light (Country -> Region -> City). Supports cascading dropdowns.
   • PhoneNumber: Validated numbers, supports "Is Whatsapp" and "Is Primary" flags.
   • ContactEmail: Multiple emails per contact.
   3.4 Webapp (webapp App)
   Status: Currently Inactive / Commented Out in Code
   • Intended for managing Obligation, Mujtahid, WakalaType (Financial/Religious dues).
   • Frontend Dev Action: Ignore this module for now unless instructed to activate it.

---

4. API Reference
   The backend currently exposes three read-only endpoints in contacts/urls.py intended for dynamic frontend forms.
   Base URL: /
1. Get States (Regions)
   Fetches states/regions for a selected country.
   • Endpoint: /api/get-states/
   • Method: GET
   • Parameters:
   • country_id (Integer): ID of the selected country (from cities_light_country table).
   • Response:
   {
   "states": [
   {"id": 1, "name": "Punjab"},
   {"id": 2, "name": "Sindh"}
   ]
   }
1. Get Cities
   Fetches cities for a selected state/region.
   • Endpoint: /api/get-cities/
   • Method: GET
   • Parameters:
   • state_id (Integer): ID of the selected state.
   • Response:
   {
   "cities": [
   {"id": 101, "name": "Lahore"},
   {"id": 102, "name": "Karachi"}
   ]
   }
1. Get Contact Details
   Search for a contact and retrieve their basic info.
   • Endpoint: /api/get-contact-details/
   • Method: GET
   • Parameters (Send one of the following):
   • id: Internal Database ID.
   • email: Email address (Exact match).
   • cnic: CNIC Number.
   • Response (Success):
   {
   "id": 123,
   "first_name": "Ali",
   "last_name": "Khan",
   "email": "ali@example.com",
   "cnic": "35202-...",
   "gender": "Male",
   "title": "Mr.",
   "date_of_birth_gregorian": "1990-01-01",
   "found": true
   }
   • Response (Not Found):
   {
   "found": false,
   "error": "Contact not found"
   }

---

5. Frontend Development Guidelines
   Current State
   • The "Frontend" currently consists of standard Django Admin templates customized for contacts and jira.
   • Static Files: Located in webapp/static/.
   • Fonts: Custom fonts stored in webapp/static/fonts.
   Workflow for New Frontend
1. Authentication: The backend uses standard Django Session Authentication (django.contrib.auth). If building a separate SPA (React/Vue), you will need to implement Session-based auth or request the backend team to implement Token/JWT auth.
1. Dropdowns: Use the /api/get-states/ and /api/get-cities/ endpoints to implement cascading address selectors (Country -> State -> City).
1. Data Submission: Currently, there are no public Write/POST APIs. Data submissions (e.g., Creating a Task, Adding a Contact) must presently be done via Django Forms or Admin. You will likely need to request new POST endpoints for these actions.
   Key Business Logic to Replicate/Respect
   • Age Calculation: The backend automatically calculates specific Lunar ages based on Solar input. If you build a form, send the Solar Date. Display the calculated Lunar Age from the backend response; do not try to replicate the complex hijri_converter logic in simple JS unless necessary.
   • Validation:
   • CNIC: XXXXX-XXXXXXX-X format.
   • Phone: Must be valid international format.

---

6. How to Run Locally
1. Install Dependencies:
   pip install -r requirements.txt
1. Run Migrations:
   python manage.py migrate
1. Start Server:
   python manage.py runserver
1. Access Admin:
   • Jira/Main Admin: http://localhost:8000/jira/
   • Contacts Admin: http://localhost:8000/contacts/
