import { fromJS } from "immutable";

export const appendDisabledAgency = (agencies, agency) =>
  agency?.size && !agencies.includes(agency)
    ? agencies.push(agency.set("isDisabled", true))
    : agencies;

export const appendDisabledUser = (users, userName) =>
  userName && !users.map(user => user.get("user_name")).includes(userName)
    ? users.push(fromJS({ user_name: userName, isDisabled: true }))
    : users;
