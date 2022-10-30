/**
 * @OnlyCurrentDoc
 */

// No need to instantiate the routes on every API call
const routes = Routes(); //Routes is defined in Routers.gs

function doGet(request) {
  const result = router('get', request.parameter['q'], request);
  return sendJSON(result);
}

function doPost(request) {
  let resolvedRequest = { ...request };

  if (request.postData?.contents) {
    resolvedRequest.body = JSON.parse(request.postData.contents);
  }

  const result = router('post', request.parameter['q'], resolvedRequest);
  console.log(result);
  return sendJSON(result);
}

function router(method, path, request) {
  if (!path) {
    return { error: 'Você deve definir a rota com o parâmetro q' };
  }

  if (!routes[method][path]) {
    return { error: 'Essa rota não existe' };
  }

  const controller = routes[method][path];
  return controller(request);
}

function sendJSON(response) {
  return ContentService.createTextOutput(JSON.stringify(response)).setMimeType(
    ContentService.MimeType.JSON
  );
}
