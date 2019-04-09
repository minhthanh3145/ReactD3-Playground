import http from '../utils/http';

const Services = {

    getFiles: () => {
        return http.get("/file");
    },

    uploadFile: (name, content) => {
        return http.post("/file", { fileName: name, content: content} );
    },

    getContent: (id) => {
        return http.get("/file/content/" + id);
    }
};

export default Services;