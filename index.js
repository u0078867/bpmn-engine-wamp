

const Bpmn = require('bpmn-engine');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs');
const fetch = require('isomorphic-fetch');
const autobahn = require('autobahn');
const argv = require('minimist')(process.argv.slice(2));

// Get parameters
const formsAPI = 'http://localhost:8000/api/forms';
const wampUrl = 'ws://127.0.0.1:8002/ws';
const wampRealm = 'realm1';
const bpmnFilePath = './diagram_1.bpmn';

// Create WAMP connection
var connection = new autobahn.Connection({
  url: wampUrl,
  realm: wampRealm}
);

connection.onopen = function (session) {

  console.log('WAMP connection open');

  // Create process engine
  const engine = new Bpmn.Engine({
    name: 'listen example',
    source: fs.readFileSync(bpmnFilePath),
    moddleOptions: {
      camunda: require('camunda-bpmn-moddle/resources/camunda')
    }
  });

  // Init waiting task
  var waitingTask = null;

  // Create engine events listener
  const listener = new EventEmitter();

  // Define event handlers
  listener.on('wait', (task, instance) => {
    console.log(`${task.type} <${task.id}> of ${instance.id} is waiting`);
    // Save waiting task
    waitingTask = task;
    // Get form title
    let formTitle = task.form.key;
    // Select matching from from list
    let form = forms.filter(f => f.title === formTitle)[0];
    // Create URL to redirect browser
    let pckg = {
      data: `${form.slug}-${form.cuid}`,
    };
    // Redirect browser
    session.publish('wf-task-enter', [pckg]);
  });

  listener.on('enter', (task, instance) => {
    console.log(`${task.type} <${task.id}> of ${instance.id} is entered`);
  });

  listener.on('start', (task, instance) => {
    console.log(`${task.type} <${task.id}> of ${instance.id} is started`);
  });

  listener.on('end', (task, instance) => {
    console.log(`${task.type} <${task.id}> of ${instance.id} is ended`);
  });

  listener.on('taken', (flow) => {
    console.log(`flow <${flow.id}> was taken`);
  });

  engine.once('end', (definition) => {
    console.log('Process ended');
    connection.close();
  });

  // Run engine
  engine.execute({
    listener: listener
  }, (err, instance) => {
    if (err) throw err;
    console.log('BPMN process running')
  });

  // Subscribe to form completed event
  session.subscribe('wf-task-exit', (args) => {
    let msg = args[0];
    if (msg == 'exited') {
      // Proceed with next task in process
      engine.signal(waitingTask.id);
    }
  })

};

connection.onclose = function() {

  console.log('WAMP connection closed');

}

// Init forms
let forms = [];

// Fetch forms data
fetch(formsAPI, {
    headers: { 'content-type': 'application/json' },
    method: 'get',
  })
.then(response => response.json())
.then(res => {
  forms = res.forms;
  console.log('forms fetched')
})
.then(() => connection.open());
