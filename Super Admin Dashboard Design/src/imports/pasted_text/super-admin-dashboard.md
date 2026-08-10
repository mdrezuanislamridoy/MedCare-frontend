Design a **production-grade Super Admin Dashboard** for a Doctor Appointment Platform. The Super Admin has complete platform-level control over users, doctors, clinics, appointments, payments, permissions, security, analytics, and system configuration.

### Visual Style

Modern healthcare SaaS UI with a premium, professional look. Desktop-first responsive design, clean white/light-gray background, dark readable typography, subtle borders and shadows, rounded cards, compact data tables, clear status badges, consistent spacing, and minimal animations. Avoid excessive gradients or decorative elements.

### Main Layout

Use:

* Fixed left sidebar
* Top navigation/header
* Main dashboard content
* Responsive mobile sidebar
* Breadcrumbs
* Global search
* Notifications
* Super Admin profile menu

### Sidebar Navigation

**Dashboard**

* Overview
* Analytics

**Users**

* Administrators
* Doctors
* Patients
* Clinic Managers
* Receptionists
* Support Staff
* Roles & Permissions

**Healthcare**

* Doctor Verification
* Doctors
* Clinics
* Specialties
* Doctor Documents

**Appointments**

* All Appointments
* Today
* Upcoming
* Completed
* Cancelled
* No Shows

**Finance**

* Transactions
* Revenue
* Refunds
* Doctor Payouts
* Platform Commission

**Moderation**

* Reviews
* Complaints
* Reports
* Suspended Accounts

**Security**

* Audit Logs
* Admin Activity
* Login History
* Security Events

**System**

* Notifications
* Platform Settings
* Payment Settings
* Email/SMS Settings
* Feature Flags

### Dashboard Overview

Create an executive-level dashboard with KPI cards:

* Total Users
* Total Doctors
* Total Patients
* Total Clinics
* Today's Appointments
* Monthly Revenue
* Platform Commission
* Pending Doctor Verifications

Each KPI should show the current value, percentage change, comparison period, and small trend indicator.

Add analytics sections:

**Revenue Analytics**
Show revenue, commission, refunds, and doctor payouts with daily, weekly, monthly, and yearly filters.

**Appointment Analytics**
Show total, confirmed, completed, cancelled, pending, and no-show appointments.

**User Growth**
Show new patients, doctors, clinics, active users, and suspended users over time.

### Doctor Verification

Create a verification queue for newly registered doctors.

Display:

* Doctor photo
* Name
* Specialty
* License number
* Experience
* Submitted date
* Verification status
* Documents

Statuses:
Pending, Under Review, Verified, Rejected, Suspended.

Actions:
View Profile, View Documents, Approve, Reject, Request Documents, Suspend.

### Appointment Management

Create a powerful appointment table with:

Appointment ID, Patient, Doctor, Clinic, Date, Time, Appointment Type, Payment Status, Appointment Status.

Support:
Search, filtering, sorting, pagination, date-range filtering, and export.

Appointment statuses:
Pending, Payment Pending, Confirmed, Checked In, In Progress, Completed, Cancelled, No Show.

### User Management

Create separate management pages for each user type.

Display:
Name, email, phone, role, status, registration date, last activity.

Actions:
View, Edit, Suspend, Reactivate, Reset Password, View Activity.

### Roles & Permissions

Create a dedicated RBAC interface.

Super Admin can:

* Create roles
* Edit roles
* Delete roles
* Assign permissions
* Assign users to roles
* Review permission changes

Permission groups:
Users, Doctors, Patients, Clinics, Appointments, Payments, Reports, Notifications, Security, Settings.

Use a clear permission matrix for View, Create, Update, Delete, Approve.

### Financial Dashboard

Show:

* Gross Revenue
* Platform Commission
* Doctor Payouts
* Refunds
* Net Revenue

Transaction table:
Transaction ID, Patient, Doctor, Appointment, Amount, Commission, Provider, Status, Date.

Payment statuses:
Pending, Successful, Failed, Refunded, Partially Refunded.

### Security Center

Create a security overview showing:

* Failed login attempts
* Suspicious activities
* Blocked accounts
* Active admin sessions
* Permission changes
* Sensitive-data access

Audit log table:
Actor, Action, Resource, Timestamp, IP Address, Severity.

### System Health

Show real-time status cards for:
API, PostgreSQL, Redis, Queue, Payment Gateway, Email, SMS, Object Storage.

Statuses:
Healthy, Warning, Down.

### Global Search

Allow Super Admin to search across:
Users, Doctors, Patients, Clinics, Appointments, Transactions, and Reports.

Clearly identify the resource type in results.

### Quick Actions

Include:
Add Admin, Verify Doctors, Add Clinic, Manage Roles, View Payments, View Audit Logs, System Settings.

### UX & Security

Use strict RBAC and object-level authorization. Destructive or sensitive actions must require confirmation dialogs.

Include loading states, skeleton screens, empty states, error states, toast notifications, pagination, filtering, sorting, and responsive layouts.

The final design should feel like a **high-security healthcare operations control center**, prioritizing platform analytics, doctor verification, appointments, finance, security, and system health.
