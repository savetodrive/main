import dotProp from 'dot-prop-immutable';
import * as CONST from '../../consts';

const baseState = {
  tasksIndexes: new Map(),
  tasks: [],
};
export default function tabReducer(state = baseState, action) {
  let newState = {};
  let taskIndex = null;
  if (action.uuid) {
    taskIndex = state.tasks.findIndex((task) => task.uuid === action.uuid);
  }
  switch (action.type) {
    case CONST.ADD_UPLOAD_TASKS:
      newState = dotProp.set(state, 'tasks', [].concat(action.tasks, state.tasks));
      break;
    case CONST.CHANGE_ACTIVE_INDEX:
      newState = dotProp.set(state, `tasks.${action.index}.activeIndex`, action.activeIndex);
      break;
    case CONST.PROCESS_STARTED:
      newState = dotProp.set(state, `tasks.${action.index}.isStarted`, true);
      break;
    case CONST.PROCESS_STOPPED:
      newState = dotProp.set(state, `tasks.${action.index}.isStarted`, false);
      break;
    case CONST.UPDATE_INNER_TASK_META:
      newState = dotProp.merge(state, `tasks.${action.index}.tabs.${action.innerTaskIndex}`, action.data);
      break;
    case CONST.INDEX_TASK:
      state.tasksIndexes.set(action.uuid, {
        mainIndex: action.index,
        innerTask: action.innerTaskIndex,
      });
      break;
    case CONST.UPLOAD_PROGRESS:
      if (taskIndex > -1) {
        newState = dotProp.set(state, `tasks.${taskIndex}.progress`, action.progress);
      }
      break;

    case CONST.UPLOAD_FAILED:
      if (taskIndex > -1) {
        newState = dotProp.set(state, `tasks.${taskIndex}.completed`, false);
      }
      break;

    case CONST.UPLOAD_SUCCESS:
      if (taskIndex > -1) {
        newState = dotProp.set(state, `tasks.${taskIndex}.completed`, true);
      }
      break;
    case CONST.TASK_PROCESSED:
      if (taskIndex > -1) {
        newState = dotProp.set(state, `tasks.${taskIndex}.isProcessed`, true);
      }
      break;

    default:
      newState = {};
      break;
  }

  return Object.assign({}, state, newState);
}
