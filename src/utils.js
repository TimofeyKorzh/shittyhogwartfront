import React from 'react';
import axios from 'axios';


const domains = ['https://api.hogwarts.monetka.name']


const ENDPOINT_VARS_URL = "/potter_variants";
const ENDPOINT_URL = "/potter_plain";
//const ENDPOINT_URL = "http://127.0.0.1:5000/generate";

const useAsyncEndpoint = fn => {
    const [res, setRes] = React.useState({ data: null, complete: false, pending: false, error: false });
    const [req, setReq] = React.useState();

    React.useEffect(() => {
        if (!req) return;
        setRes({ data: null, pending: true, error: false, complete: false });
        axios(req)
            .then(res =>
                setRes({ data: res.data, pending: false, error: false, complete: true })
            )
            .catch(() =>
                setRes({ data: null, pending: false, error: true, complete: true })
            );
    }, [req]);

    return [res, (...args) => setReq(fn(...args))];
}

export const postGenerateTextEndpoint = () => {
    /* eslint-disable react-hooks/rules-of-hooks */
    var url_ = domains[Math.floor(Math.random()*domains.length)] + ENDPOINT_URL;
    return useAsyncEndpoint(data => ({ url: url_, method: "POST", data }));
}

export const postGenerateVarsEndpoint = () => {
    /* eslint-disable react-hooks/rules-of-hooks */
    var url_ = domains[Math.floor(Math.random()*domains.length)] + ENDPOINT_VARS_URL;
    return useAsyncEndpoint(data => ({ url: url_, method: "POST", data }));
}
