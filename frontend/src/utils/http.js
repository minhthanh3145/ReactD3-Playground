import jquery from 'jquery';

const http = {

  get(url, data, headers, dataType) {
    return this.send('get', url, data, headers, dataType);
  },

  put(url, data) {
    return this.send('put', url, data);
  },

  post(url, data, headers, useUrlEncoded) {
    return this.send('post', url, data, headers, null, useUrlEncoded);
  },

  delete(url, data) {
    return this.send('delete', url, data);
  },

  send(method, url, data, headers, dataType, useUrlEncoded) {
    dataType = dataType || 'json';
    const contentType = useUrlEncoded ?
      'application/x-www-form-urlencoded; charset=UTF-8' :
      'application/json; charset=UTF-8';
    const promise = new Promise((resolve, reject) => {
      const configs = {
        contentType,
        dataType,
        url,
        headers,
        method,
        cache: false,
        success: (response) => {
          resolve(response);
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log("Failed to make a request");
        },
      };
      if (data) {
        if (method === 'get' || useUrlEncoded) {
          configs.data = data;
          configs.traditional = true;
        } else {
          configs.data = JSON.stringify(data);
          configs.processData = false;
        }
      }
      jquery.ajax(configs);
    });
    return promise;
  },
};

export default http;
