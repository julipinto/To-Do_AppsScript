/**
 * @OnlyCurrentDoc
 */

function Routes() {
  const routesBuilder = RoutesBuilder();
  routesBuilder.post('insertTask', insertTask);
  routesBuilder.post('getTask', getTasks);
  routesBuilder.post('modifyTask', modifyTask);
  return routesBuilder.routes();
}

function RoutesBuilder() {
  let post = {};
  let get = {};
  return {
    post: function (path, callback) {
      if (validateRoute(path, callback)) {
        post[path] = callback;
      }
    },

    get: function (path, callback) {
      if (validateRoute(path, callback)) {
        get[path] = callback;
      }
    },

    routes: function () {
      return { get, post };
    },
  };
}

function validateRoute(path, callback) {
  if (typeof callback !== 'function') {
    throw new Error('Você deve passar uma função');
    return false;
  }
  if (typeof path !== 'string') {
    throw new Error('O nome do método deve ser uma string');
    return false;
  }

  return true;
}
