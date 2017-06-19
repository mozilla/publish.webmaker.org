// General utility functions for tests

function validDateResponse(val) {
  return typeof val === 'string' || val === null;
}

function constructMultipartPayload(fields, data) {
  var payload = '';

  fields.forEach(function(field) {
    payload += '--AaB03x\r\n';
    payload += 'content-disposition: form-data; name="' + field.name + '"\r\n';
    payload += '\r\n' + field.content + '\r\n';
  });

  if (!data) {
    payload += '--AaB03x--\r\n';
    return payload;
  }

  payload += '--AaB03x\r\n';
  payload += 'content-disposition: form-data; name="' + data.name + '"; ';
  payload += 'filename="' + data.filename + '"\r\n';
  payload += 'Content-Type: ' + data.contentType + '\r\n';
  payload += '\r\n' + data.content + '\r\r\n';
  payload += '--AaB03x--\r\n';

  return payload;
}

module.exports = {
  validDateResponse: validDateResponse,
  constructMultipartPayload
};
