# CHANGELOG

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and [Keep a Changelog](http://keepachangelog.com/).



## Unreleased
---

### New
* Added Caching for production

### Changes

### Fixes

### Breaks


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
