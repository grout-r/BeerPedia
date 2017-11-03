**Beerpedia**
================


This project is developed by two Epitech students within the context of a Hybrid Mobile Developpement course.

The project is a beer manager mobile application. It has been tested with an Android environnement. Apple tech stack is compatible but not officially supported.

The group is composed of two students, Cédric Voinnet and Roman Grout, group #7

----------

Supported features are :
---------------------------------
* Create an account and logging in/out into the application
* Display the beer list registered in the service
* Add a beer
* Rate a beer
* Add a comment on a beer
* Add/Remove beer from favorite
* Scan a beer barcode redirect to the details page
 

----------

Prerequisite
------------------

Install python 3.x - MongoDB server - Ionic2 - Cordova

Setting things up
-------------

Clone the remote repository
> git clone https://github.com/grout-r/BeerPedia.git

**Launch database**

> mongod.exe --dbpath PATH_TO_DB_FOLDER

**Launch server**

> cd Server

> python3 BeerPedia.py

You will be able to see the server's log your terminal at this point.

**Run the app on web browser**

> ionic serve
This will compile the project and present it on your browser.

**Run the app on anroid smartphone**

> ionic cordova run android
This will launch the project on your android phone connected with adb.
