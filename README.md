#Pick and Place G-Code Generator
This full-stack application generates gcode that is used by a dual head pick and place machine. It uses a renamed gerber file from commercial EDA packages, a configuration of part feeders and a list of useable packages to populate a path planning algorithm. The path includes commands that picks up and places parts with both pneumatic heads while moving between feeder and placement locations. Lastly, the user can use the output text file with an interpreter like Pronterface to control the machine.

The software uses the react and tailwind framework to create a user interface. The backend is built on node.js, with multer for filehandling, ini for configuration files and express for routing.

It has:
1. Data validation in models to ensure data from file inputs match an expected format.
2. Clean, maintainable code structured that aims to meet SOLID principles.
3. Separation of concerns that divides functions and objects into services, clients, controllers etc.
4. Error handling for missing or incorrect data that sends codes and messages to the front end.
5. Explanatory comments in code.
6. A list of short commit comments on GitHub to explain changes throughout the lifecycle.
7. RESTful API design
8. Asyncronous methods for file operations that prevent the event loop in the backend from being blocked and other requests being handled.


#History
The application was developed in partial fulfillment of a Bachelor's degree in Mechatronic Engineering. The version used in the project had a monolithic C# codebase, with a form and single module. It was updated in May 2026 to the react/node.js version that exists today.
