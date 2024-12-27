# Online Hotel Booking System (OHBS)


<div style="text-align: center;">
  <img src="https://github.com/GOKUL29-06/Online-Hotel-Booking-System/raw/6e7e72f2b765a497e381bb4a625e11d96536a3fd/Booking-GIF/Booking.gif" alt="Booking GIF" width="100%" />
</div>



**OHBS** is a web-based hotel booking platform built using **Agile methodologies**. This system allows users to search for hotels, book rooms, and manage their bookings, while admins and managers can manage hotel details, bookings, and customer information. The platform also includes email notifications and payment gateway integration for seamless bookings.



## Key Features

- **User Dashboard**: Users can search for hotels, view room details, book rooms, and view their booking history.
- **Admin Dashboard**: Admins can manage all hotel details, bookings, and customer records across the system.
- **Manager Dashboard**: Hotel managers can manage their own hotel's bookings and customer information.
- **Role-Based Access**: Different levels of access for users, admins, and managers, ensuring secure and customized views.
- **Booking Management**: Efficient handling of customer bookings, cancellations, and status updates for both users and managers.
- **Email Notifications**: Automated email confirmations and reminders for bookings using **JavaMail**.
- **Secure Payment Integration**: Payment gateway integration for secure and seamless transaction processing.

## Tech Stack

**Frontend:**

* React.js
* JavaScript (ES6+)
* HTML5
* CSS3
* Bootstrap (for responsive design)
* Redux (for state management) - Optional, depending on your project's complexity
* Axios/Fetch API (for making API requests)

**Backend:**

* Spring Boot
* Java (with Spring Framework)
* Spring Security (for authentication and authorization)
* Spring Data JPA (for database interactions)
* MySQL (or other relational database)
* RESTful APIs (for communication between frontend and backend)
* JWT (for token-based authentication)
* JavaMail API (for email notifications)
* Lombok (for reducing boilerplate code) - Optional, depending on your preference

**Other Technologies**

* Agile methodologies for development
* Git for version control


## Lombok

This project utilizes **Lombok** to simplify code. To use Lombok, add the following dependency to your `pom.xml`:

```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.24</version> <!-- Use the latest version -->
    <scope>provided</scope>
</dependency>
```
## Using Lombok

To enable Lombok in your IDE:
    IntelliJ IDEA: Install the Lombok plugin and restart your IDE.
    Eclipse: Download the Lombok jar from the Lombok website and run it to set up.
  
## Installation
## Clone Repository:

      git clone [https://github.com/GOKUL29-06/Online-Hotel-Booking-System.git]
    

## Backend Setup:

1. Configure email and app password in the `application.properties` file:
  
        spring.mail.username=your-email@example.com
        spring.mail.password=your-app-password

2. Start the backend:
                
       mvn spring-boot:run


## Usage

**Admin Login**: Admins can manage hotel information, bookings, and customer records across all hotels in the system.  
**Manager Login**: Managers can only manage bookings and customer records for their specific hotel(s).  
**User Login**: Users can search for hotels, book rooms, and view their booking history.


## Development Process

- **The development of OHBS follows Agile methodologies, allowing iterative improvements based on feedback and testing. This ensures the application is both flexible and scalable.**

## Screenshots
![Login](https://github.com/GOKUL29-06/Online-Hotel-Booking-System/raw/65ec9bc2034d825b1f02bbcd8dcb50c9852290fe/Screenshots/1.png)

![Login](https://github.com/GOKUL29-06/Online-Hotel-Booking-System/raw/65ec9bc2034d825b1f02bbcd8dcb50c9852290fe/Screenshots/2.png)

![Login](https://github.com/GOKUL29-06/Online-Hotel-Booking-System/raw/65ec9bc2034d825b1f02bbcd8dcb50c9852290fe/Screenshots/3.png)

![Login](https://github.com/GOKUL29-06/Online-Hotel-Booking-System/raw/65ec9bc2034d825b1f02bbcd8dcb50c9852290fe/Screenshots/4.png)







