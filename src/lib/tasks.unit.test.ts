import { sync } from "./sync";
import { sortTasks, Task } from "./tasks";

describe('sorting tasks', () => {

  test('test sort by status and then by due date', () => {

    const unsorted = [
      {
        id: "1",
        description: "foo",
        date: "2022-12-04T14:07:00Z",
        tags: ["home"],
        status: "todo"
      },
      {
        id: "2",
        description: "foo",
        date: "2022-12-04T14:07:00Z",
        tags: ["home"],
        status: "in-progress"
      },
      {
        id: "3",
        description: "foo",
        date: "2022-12-04T14:07:00Z",
        tags: ["home"],
        status: "complete"
      },
      {
        id: "4",
        description: "foo",
        date: "2021-10-01T14:07:00Z",
        tags: ["home"],
        status: "todo"
      },
      {
        id: "5",
        description: "foo",
        date: "2024-12-14T14:07:00Z",
        tags: ["home"],
        status: "in-progress"
      },
      {
        id: "6",
        description: "foo",
        date: "2021-10-01T14:07:00Z",
        tags: ["home"],
        status: "complete"
      },

    ]

    const ordered = ["2", "5", "4", "1", "6", "3"]

    expect(unsorted.sort(sortTasks).map((task) => task.id)).toEqual(ordered);

  })


  test('handles null date', () => {

    const unsorted = [
      {
        id: "1",
        description: "todo task with no date",
        date: null,
        tags: ["home"],
        status: "todo"
      },
      {
        id: "2",
        description: "overdue inprogress task",
        date: "2022-12-04T14:07:00Z",
        tags: ["home"],
        status: "in-progress"
      },
      {
        id: "3",
        description: "in-progress task with no date",
        date: null,
        tags: ["home"],
        status: "in-progress"
      },
      {
        id: "4",
        description: "in-progress task with future date",
        date: "2999-01-01T00:00:00Z",
        tags: ["home"],
        status: "in-progress"
      },
      {
        id: "5",
        description: "todo task with future date",
        date: "2999-01-01T00:00:00Z",
        tags: ["home"],
        status: "todo"
      },
      {
        id: "6",
        description: "another todo task with no date",
        date: null,
        tags: ["home"],
        status: "todo"
      },

    ]

    const ordered = ["2", "4", "3", "5", "1", "6"]

    expect(unsorted.sort(sortTasks).map((task) => task.id)).toEqual(ordered);

  })
});