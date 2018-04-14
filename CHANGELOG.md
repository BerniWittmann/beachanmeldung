# CHANGELOG

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and [Keep a Changelog](http://keepachangelog.com/).



## Unreleased
---

### New

### Changes

### Fixes

### Breaks


## 1.10.10 - (2018-04-14)
---

### Fixes
* fixed failing tests


## 1.10.9 - (2018-04-14)
---

### Fixes
* fixed linting issue


## 1.10.8 - (2018-04-14)
---

### Fixes
* fixed linting issue


## 1.10.7 - (2018-04-14)
---

### Fixes
* fix bug which resulted in too much 401 when token expired


## 1.10.6 - (2018-02-27)
---

### Fixes
* fix bug in embed list template


## 1.10.5 - (2018-02-27)
---

### Changes
* Adapt Text for no places left message
* Display Payment Status for everyone


## 1.10.4 - (2018-02-23)
---

### Fixes
* fixed a bug with multiple signup codes


## 1.10.3 - (2018-02-22)
---

### Fixes
* revert ddtrace port config


## 1.10.2 - (2018-02-22)
---

### Fixes
* ddtrace port configuration


## 1.10.1 - (2018-02-22)
---

### Fixes
* ddtrace initialization


## 1.10.0 - (2018-02-21)
---

### New
* Added Datadog Tracing


## 1.9.6 - (2018-02-21)
---

### Fixes
* Improved Config Loading


## 1.9.5 - (2018-02-06)
---

### Fixes
* Fixed cursor display in team/tournament cards


## 1.9.4 - (2018-02-05)
---

### Changes
* Improved Player Saving UI Behavior


## 1.9.3 - (2018-02-03)
---

### Fixes
* Fix layout bug in nav


## 1.9.2 - (2018-02-03)
---

### Changes
* Hide Waitlist for not staff users


## 1.9.1 - (2018-01-30)
---

### Fixes
* Fixed small logical issue with email verification notification


## 1.9.0 - (2018-01-30)
---

### New
* Added new Embed Views for waitlist and complete tournament

### Changes
* Add Tournament Name to needs approval notification email


## 1.8.1 - (2018-01-29)
---

### Fixes
* Fixed unit test error due to bad configuration


## 1.8.0 - (2018-01-29)
---

### New
* Show a message to unverified users as a reminder to verify their email address

### Changes
* Marked Beachname as optional
* Updated Github Link on contact page
* Fixed User String Representation to include name
* Added No-Script tag with javascript activation warning

### Fixes
* Fixed Padding on Home for mobile
* Fixed Navigation issue to team when not logged in


## 1.7.3 - (2018-01-28)
---

### Fixes
* Fixed Open Graph Tags


## 1.7.2 - (2018-01-27)
---

### Changes
* Added Open Graph Meta Tags


## 1.7.1 - (2018-01-26)
---

### Fixes
* Fixed Config Tests


## 1.7.0 - (2018-01-25)
---

### New
* Added Site Config


## 1.6.0 - (2018-01-23)
---

### New
* Send Documents with signup confirmation email
* Added Document to Tournaments


## 1.5.2 - (2018-01-21)
---

### Fixes
* Only enable caching and sentry when in production


## 1.5.1 - (2018-01-21)
---

### Fixes
* Fixed several Tests


## 1.5.0 - (2018-01-21)
---

### New
* Added Caching for production


## 1.4.7 - (2018-01-21)
---

### Fixes
* Display correct error when trying to signup with an already existing email
* Fix https error in Email Redirects for Code Emails


## 1.4.6 - (2018-01-16)
---

### Fixes
* Not set X-Frame-Option header on embeds


## 1.4.5 - (2018-01-16)
---

### Fixes
* Added HandballIsmaning to CORS Whitelist


## 1.4.4 - (2018-01-09)
---

### Changes
* Added Gender Filter to Team Overview in Django Admin

### Fixes
* Fixed several Translation issues in Django Admin


## 1.4.3 - (2018-01-08)
---

### Changes
* Added a CC Email to payment emails
* Added Receiver Name to Banking Information

### Fixes
* Added Sendgrid Category Debug from not Production envs
* Fix https error in Email Redirects


## 1.4.2 - (2018-01-06)
---

### Changes
* Changed User Admin for non super users


## 1.4.1 - (2018-01-02)
---

### Fixes
* Fix Cookie Notification issues on mobile


## 1.4.0 - (2018-01-02)
---

### New
* Added Cookie Notice Banner
* Added Google Analytics


## 1.3.3 - (2018-01-02)
---

### Changes
* Added Team Inline to Account Admin View


## 1.3.2 - (2017-12-26)
---

### Changes
* Added ADMIN Django Setting for alerts

### Fixes
* Added Sendgrid Email Backend to support sending email with categories
* Added Team and Player Inlines to Django Admin


## 1.3.1 - (2017-12-25)
---

### Changes
* Added Admin Actions to Django Backend for Team

### Fixes
* Fixed a bug when searching for team name in django backend
* Fixed Team State Translation in Django Backend


## 1.3.0 - (2017-12-23)
---

### New
* Added Token Authentication


## 1.2.2 - (2017-12-23)
---

### Fixes
* Fixed Serving of Media Files


## 1.2.1 - (2017-12-22)
---

### New
* Added Embed Endpoint for signup list


## 1.2.0 - (2017-12-22)
---

### New
* Added Send Reminder Function to Frontend
* Added Reminder Emails and Endpoints
* IBAN and BIC are now controllable with ENV Vars
* Added Frontend Admin Page to download Players
* Added Player Get Endpoints
* Added Download Button to Tournament Page to download Team List
* Added Download Button to Team Page to download player list
* Added Terms of Participation Page
* Added Admin link to footer

### Changes
* Added Reply To Header to Emails
* Improved Search and Filtering in Django Admin
* Reworked MailSender to send async
* Changed the footer a little

### Fixes
* Fixed Frontend Tests


## 1.1.0 - (2017-12-17)
---

### New
* Added Field to user model to subscribe to signup notifications
* Added Link to Admin Area
* Added Translations to backend
* Added Emails that notify about important updates

### Changes
* Added Translation to HTML title

### Fixes
* Added Translation to auth emails
* Fixed Resolving issue with navbar images
* Fixed small layout issue with the footer
* Fixed Favicon not loading because of incorrect path


## 1.0.0 - (2017-12-10)
---

### Breaks
* Complete Rewrite of the Beachanmeldung
