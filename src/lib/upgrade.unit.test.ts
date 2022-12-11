import { State } from "./state";
import { sync } from "./sync";
import { sortTasks, Task } from "./tasks";
import { upgradeState } from "./upgrade";

describe('upgrading state', () => {

  test('test upgrade version 1 state', () => {

    const version1state = {
      version: 1,
      serial: 1,
      tasks: [    {
          id: "abc123",
          description: "foobar",
          status: "todo",
          date: "2022-12-04T14:07:00Z",
          category: "home"
        }
      ]
    };

    expect(upgradeState(version1state)).toEqual({
      version: 2,
      serial: 1,
      tasks: [    {
          id: "abc123",
          description: "foobar",
          status: "todo",
          date: "2022-12-04T14:07:00Z",
          tags: ["home"]
        }
      ]
    });

  })
});