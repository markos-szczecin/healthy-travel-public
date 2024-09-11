'use client'

import Image from "next/image";
import React from "react";

export default function Home() {

  React.useEffect(() => {
    location.pathname = '/user';
  }, []);


  return (<></>);
}
