import { Provider } from "ims-lti";
import { NextResponse } from "next/server";
import { parse } from "url";
import HMAC_SHA1 from "ims-lti/lib/hmac-sha1";

const consumerKey = "nexus-jdn";
const consumerSecret = "nexus-jdn2";

function jsonToSearchParams(json) {
  const params = new URLSearchParams();
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      params.append(key, json[key]);
    }
  }
  return params;
}

export async function POST(request) {
  let response = NextResponse.json(
    { message: "Internal error" },
    { status: 500 }
  );
  const enc = new HMAC_SHA1();
  console.log(parse(request.url, true));
  request.protocol = request.url.startsWith("https") ? "https" : "http";
  const provider = new Provider(consumerKey, consumerSecret);

  const formData = await request.formData();
  const body = {};
  formData.forEach((value, key) => {
    body[key] = value;
  });
  
  console.log("GENERADO: "+enc.build_signature(request, body, consumerSecret));
  console.log("RECIBIDO: "+body.oauth_signature);
  provider.valid_request(request, body, (err, isValid) => {
    response = NextResponse.redirect(`http://localhost:3000?${jsonToSearchParams(provider.body)}`, {
      status: 307,
    });
    const user = {
      id: provider.body.user_id,
      name: provider.body.lis_person_name_full,
      email: provider.body.lis_person_contact_email_primary,
    };
    console.log(err);
    // if (err || !isValid) {
    //   response = NextResponse.json(
    //     { message: "El id de usuario es "+user['id'] },
    //     { status: 401 }
    //   );
    //   return;
    // }

    // console.log(provider.body);
  });

  return response;
}
