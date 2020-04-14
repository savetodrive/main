import { SELECT_MOVER_CONNECTION, FETCH_DIRECTORY_SUCCESS } from '../../consts';
import { fetchDirectory as fetchDirectoryCall } from '../../api/app';
import TreeIndex from '../stores/TreeIndex';

const indexes = TreeIndex.get();

export function selectMoverConnection({ moverId, connection }) {
  return {
    type: SELECT_MOVER_CONNECTION,
    moverId,
    connection,
  };
}

export function fetchDirectorySuccess({
  connectionId, moverId, directory, params, item,
}) {
  return {
    type: FETCH_DIRECTORY_SUCCESS,
    connectionId,
    moverId,
    params,
    item,
    directory,
  };
}
export function fetchDirectory({ connectionId, moverId, item }, params = {}) {
  return (dispatch) => {
    const con = indexes.get(connectionId);
    if (!con || !con.get(params.folderId)) {
      params.folderId = params.folderId === 'root' ? undefined : params.folderId; // eslint-disable-line
      return fetchDirectoryCall(connectionId, params)
        .then(({ data }) => {
          dispatch(
            fetchDirectorySuccess({
              connectionId,
              item,
              moverId,
              directory: data,
              params,
            }),
          );
          return data;
        })
        .catch((err) => {
          dispatch(
            fetchDirectorySuccess({
              connectionId,
              item,
              moverId,
              directory: [],
              params,
            }),
          );
          return err;
        });
    }

    return Promise.resolve(
      dispatch(
        fetchDirectorySuccess({
          connectionId,
          item,
          moverId,
          directory: con.get(params.folderId).items,
          params,
        }),
      ),
    );
  };
}
export function dummy1() {}
