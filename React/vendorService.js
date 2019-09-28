import axios from "axios";
import * as serviceHelpers from "./serviceHelpers";

const url = `${serviceHelpers.API_HOST_PREFIX}/api/vendors`;

let add = payload => {
  const config = {
    method: "POST",
    url: url,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let update = payload => {
  const config = {
    method: "PUT",
    url: `${url}/${payload.id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let getById = id => {
  const config = {
    method: "GET",
    url: `${url}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let getPaginate = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${url}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let deactivateVendor = (id, status) => {
  const config = {
    method: "PUT",
    url: `${url}/${id}/${status}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .then(() => id)
    .catch(serviceHelpers.onGlobalError);
};

export { add, update, getById, getPaginate, deactivateVendor };
