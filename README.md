# ReactD3-Playground

My playground for fiddling with React and D3.js. I occcasionally fiddle around with charts and data visualization.

## Frontend with React + D3.js

React is used to create components.

Most of the components wrap around D3.js logic to generate charts, animations, and effects:

- [X] On-click animation
- [X] Area chart
- [X] Heat map

## Backend with NodeJS 

It's just a simple NodeJS server + ExpressJS for routing:

- **./src/index.js** contains the main endpoints that re-direct the requests into appropriate services and send responses.

- **./src/uploaded_files** contains JSON files.

- **./src/apis/FileServices.js** contains the logic pertaining to database CRUD: get files, file saving and existence check.

- **./src/utils/FileUtils.js** contains utility method to convert files into other formats or extensions.

- **./src/config.js** stores the global variables such as the path to uploaded_files folder. etc.



