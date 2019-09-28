import axios from "axios";
import * as serviceHelpers from "./serviceHelpers";

const url = `${serviceHelpers.API_HOST_PREFIX}/api/discounts`;

const add = payload => {
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

const update = payload => {
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

const getByCurrent = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${url}/current?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const getById = id => {
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

const getPaginate = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${url}/current?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

let verify = (productId, query) => {
  const config = {
    method: "GET",
    url: `${url}/verify/${productId}?q=${query}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .catch(serviceHelpers.onGlobalError);
};

const deleteDiscount = id => {
  const config = {
    method: "DELETE",
    url: `${url}/${id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelpers.onGlobalSuccess)
    .then(() => id)
    .catch(serviceHelpers.onGlobalError);
};

export {
  add,
  update,
  getByCurrent,
  getById,
  getPaginate,
  deleteDiscount,
  verify
};
