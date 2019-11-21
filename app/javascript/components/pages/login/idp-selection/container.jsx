import React from "react";

import { NAME } from "./config";
import idps from "./idp";

const showIdps = () => {
  return idps.map(idp => <a key={idp.name} href={idp.url}><p>{idp.name}</p></a>);
}

const Container = () => {
  return (
    <>
      <div>test</div>
      {showIdps()}
    </>
  );
};

Container.displayName = NAME;

export default Container;
