import { Injectable, Request } from '@nestjs/common';

export let cookieExtractor = function (req: Request) {
  var token = null;

  let { cookie }: any = req.headers;
  if (req && cookie) {
    token = String(cookie.split('=')[1]);
  }
  return token;
};
