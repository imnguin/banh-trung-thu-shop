import { callApi } from "./axiosClient";
import { HOSTNAME } from "../lib/systemvars";

export const getAllCategories = () =>
    callApi(HOSTNAME, "/api/mooncake-category/all", {});

export const saveCategory = (payload) =>
    callApi(HOSTNAME, "/api/mooncake-category/save", payload);

export const deleteCategory = (_id) =>
    callApi(HOSTNAME, "/api/mooncake-category/delete", { _id });
