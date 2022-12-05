import { sync } from "./sync";
import { Task } from "./tasks";

test('test adds new tasks', () => {

  let remoteState = {
    version: 1,
    serial: 1,
    tasks: []
  }
  
  let localTasks = [
    {
      id: "abc123",
      description: "foobar",
      status: "todo"
    },
    {
      id: "def123",
      description: "bar",
      status: "in-progress"
    },
    {
      id: "ghi123",
      description: "baz",
      status: "complete"
    }
  ]


  expect(sync(remoteState, remoteState, localTasks)).toEqual({
    version: 1,
    tasks: [    {
        id: "abc123",
        description: "foobar",
        status: "todo"
      },
      {
        id: "def123",
        description: "bar",
        status: "in-progress"
      },
      {
        id: "ghi123",
        description: "baz",
        status: "complete"
      }],
    serial: 2
  });


});

test('test updates locally changed tasks', () => {

    let remoteState = {
      version: 1,
      serial: 2,
      tasks: [{
        id: "abc123",
        description: "Remote changes should not be updated",
        status: "todo"
      },
      {
        id: "def123",
        description: "bar",
        status: "in-progress"
      }]
    }

    let cachedState = {
        version: 1,
        serial: 1,
        tasks: [
        {
          id: "abc123",
          description: "Original",
          status: "todo"
        },
        {
          id: "def123",
          description: "bar",
          status: "in-progress"
        }
        ]
    }
        
    let localTasks = [
      {
          id: "abc123",
          description: "Original",
          status: "todo"
        },
      {
        id: "def123",
        description: "bar",
        status: "complete"
      }
    ];
  
    expect(sync(remoteState, cachedState, localTasks)).toEqual({
      version: 1,
      serial: 3,
      tasks: [ 
        {
            id: "abc123",
            description: "Remote changes should not be updated",
            status: "todo"
          },
          {
            id: "def123",
            description: "bar",
            status: "complete"
          }
      ]
    });
});

test('deletes locally deleted task', () => {

    let remoteState = {
      version: 1,
      serial: 2,
      tasks: [{
        id: "abc123",
        description: "This will be deleted",
        status: "in-progress"
      },
      {
        id: "def123",
        description: "bar",
        status: "complete"
      }]
    }

    let cachedState = {
        version: 1,
        serial: 1,
        tasks: [
        {
          id: "abc123",
          description: "This will be deleted",
          status: "todo"
        },
        {
          id: "def123",
          description: "bar",
          status: "in-progress"
        }
        ]
    }
        
    let localTasks = [
      {
        id: "def123",
        description: "bar",
        status: "in-progress"
      }
    ];
  
    expect(sync(remoteState, cachedState, localTasks)).toEqual({
      version: 1,
      serial: 3,
      tasks: [ 
        {
            id: "def123",
            description: "bar",
            status: "complete"
        }
      ]
    });
});


test('handles new state', () => {

    let remoteState = {
      version: 1,
      serial: 2,
      tasks: []
    }

    let cachedState = {
        version: 1,
        serial: 1,
        tasks: []
    }
        
    let localTasks: Task[] = [];
  
    expect(sync(remoteState, cachedState, localTasks)).toEqual({
      version: 1,
      serial: 2,
      tasks: []
    });
});

test('handles initial setup', () => {

    let remoteState = {}

    let cachedState = undefined;
        
    let localTasks: Task[] = [];
  
    expect(sync(remoteState, cachedState, localTasks)).toEqual({
      version: 1,
      serial: 1,
      tasks: []
    });
});

test('test no local changes tasks', () => {

    let remoteState = {
      version: 1,
      serial: 2,
      tasks: [{
        id: "abc123",
        description: "Remote changes should not be updated",
        status: "todo"
      },
      {
        id: "def123",
        description: "bar",
        status: "in-progress"
      }]
    }

    let cachedState = {
        version: 1,
        serial: 1,
        tasks: [
        {
          id: "abc123",
          description: "Original",
          status: "todo"
        },
        {
          id: "def123",
          description: "bar",
          status: "in-progress"
        }
        ]
    }
        
    let localTasks = [
        {
          id: "abc123",
          description: "Original",
          status: "todo"
        },
        {
          id: "def123",
          description: "bar",
          status: "in-progress"
        }
    ];
  
    expect(sync(remoteState, cachedState, localTasks)).toEqual(remoteState);
});


test('test no local cache', () => {

  let remoteState = {
    version: 1,
    serial: 2,
    tasks: [{
      id: "abc123",
      description: "Remote changes should not be updated",
      status: "todo"
    },
    {
      id: "def123",
      description: "bar",
      status: "in-progress"
    }]
  }

  let cachedState = {}
      
  let localTasks: Task[] = [
    {
      id: "def123",
      description: "bar",
      date: "2022-12-04T14:07:00Z",
      category: "home",
      status: "in-progress"
    }
  ];

  expect(sync(remoteState, cachedState, localTasks)).toEqual({
    version: 1,
    serial: 3,
    tasks: [{
      id: "abc123",
      description: "Remote changes should not be updated",
      status: "todo"
    },
    {
      id: "def123",
      description: "bar",
      status: "in-progress"
    },
    {
      id: "def123",
      description: "bar",
      date: "2022-12-04T14:07:00Z",
      category: "home",
      status: "in-progress"
    }]
  });
});