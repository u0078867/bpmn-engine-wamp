##### Overview:

This example uses Node [bpmn-engine](https://github.com/paed01/bpmn-engine) and [WAMP](http://crossbar.io/) connection to communicate with this data insertion [mern app](https://github.com/u0078867/mern-app) app. The data insertion app will automatically show the correct form to fill, according to current task of the BPMN engine.

##### Usage:

- Create a BPMN diagram with [Camunda modeler](https://camunda.org/download/modeler/) or [bpmn.io](http://demo.bpmn.io/s/start). Make sure that for the User Task activities, the Form Key **corresponds to** the title of a form in the daa insertion app.
- A WAMP router has to be started (included), ot which both the mern app and this one has to connect.
- Run the data insertion app, and enable both the WAMP connection and the work-flow client.
- Run this app with the proper parameters; the first form of the workflow should show up, and  every time the user submits it, the next one should show up accordingly to the the BPMN engine.

Minimal CLI use of the app:
```
node index <workflow_file.bpmn>
```

Options:
- ``--forms-api``: API GET request to get all available forms; default: *http://localhost:8000/api/forms*
- ``--wamp-url``: the WAMP router url; default: *ws://127.0.0.1:8002/ws*
- ``--wamp-realm``: the WAMP router realm; default: *realm1*

Example:
```
node index --forms-api http://localhost:8000/api/forms --wamp-url ws://127.0.0.1:8002/ws --wamp-realm realm1 ./sample_diagrams/diagram_1.bpmn
```
