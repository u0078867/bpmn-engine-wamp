##### Overview:

This example uses Node [bpmn-engine](https://github.com/paed01/bpmn-engine) and [WAMP](http://crossbar.io/) connection to communicate with this data insertion [mern app](https://github.com/u0078867/mern-app). The data insertion app will automatically show the correct form to fill, according to current task of the BPMN engine.

##### Usage:

- Create a BPMN diagram with [Camunda modeler](https://camunda.org/download/modeler/) or [bpmn.io](http://demo.bpmn.io/s/start). Make sure that for the User Task activities, the Form Key (visible when clicking on the User Task rectangle and on the panel on the right of the screen) **corresponds to** the title of a form in the data insertion app (bpmn.io example does not include the panel for Task editing though).
- A WAMP router has to be started (included), to which both the data insertion app and this one has to connect.
- Run the data insertion app, and enable both the WAMP connection and the work-flow client.
- Run this app with the proper parameters; the first form of the workflow should show up, and every time the user submits it, the next one should show up accordingly to the the BPMN engine.

Minimal use of the app:
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

##### Limitations / to test:

- the engine matches, with the forms fetched from the API, each task's form title even for non-User tasks, where the form makes no sense to exist. Only user tasks will have to be used;
- only BPMN files modelled with Camunda modeller were tested; behaviour of files from [jBPM](https://www.jbpm.org/) is unknown;
