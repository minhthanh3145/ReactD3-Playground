# ReactD3-Playground

My playground for fiddling with React and D3.js. 

The project did not start out as a playground, so I put somewhat a little bit more effort than what should go into a playground in structuring this project. 

## Frontend with React + D3.js


## Backend with NodeJS 

It's just a simple NodeJS server + ExpressJS for routing:

- **./src/index.js** contains the main endpoints that re-direct the requests into appropriate services and send responses.

- **./src/uploaded_files** contains JSON files.

- **./src/apis/FileServices.js** contains the logic pertaining to database CRUD: get files, file saving and existence check.

- **./src/utils/FileUtils.js** contains utility method to convert files into other formats or extensions.

- **./src/config.js** stores the global variables such as the path to uploaded_files folder. etc.



