###README

####MongoDB
First, install MongoDB using Homebrew (http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/).

Then, create a data directory. Typically, the directory goes in the root folder so run `$ mkdir -p data/db`.

Give permission to MongoDB to read and write to our data directory. I just gave it all permissions: `$ sudo chmod 777 /data/db`.

Run a mongod instance: `$ mongod` and then a mongoDB server: `$ mongo`. Now, you should be running a MongoDB server at localhost:27017.

MongoDB has some great documentation so read into that too.