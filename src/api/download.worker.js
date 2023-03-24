import Axios from 'axios';

Axios.defaults.withCredentials = true;
Axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
Axios.defaults.xsrfCookieName = 'csrftoken';

class DownloadServer {
    postMessage = async function(e) {
        console.log(e, 'eeeeeeeeeeee');
        await Axios.get(e?.url || '', e?.config || {})
            .then((response) => {
                postMessage({
                    responseData: response.data,
                    id: e?.id,
                    isSuccess: true,
                });
                console.log(response);
                return response
            })
            .catch((error) => {
                postMessage({
                    id: e?.id,
                    status: error.response.status,
                    responseData: error.response.data,
                    isSuccess: false,
                });
            });
    };

    onmessage = function(e) {
        Axios.get(e?.data.url || '', e?.data.config || {})
            .then((response) => {
                postMessage({
                    responseData: response.data,
                    id: e.data.id,
                    isSuccess: true,
                });
            })
            .catch((error) => {
                postMessage({
                    id: e.data.id,
                    status: error.response.status,
                    responseData: error.response.data,
                    isSuccess: false,
                });
            });
    };
}

export default DownloadServer

// onmessage = function (e) {
//     Axios.get(e?.url || '', e?.config || {})
//         .then((response) => {
//             postMessage({
//                 responseData: response.data,
//                 id: e?.id,
//                 isSuccess: true,
//             });
//         })
//         .catch((error) => {
//             postMessage({
//                 id: e?.id,
//                 status: error.response.status,
//                 responseData: error.response.data,
//                 isSuccess: false,
//             });
//         });
// };

// export default onmessage